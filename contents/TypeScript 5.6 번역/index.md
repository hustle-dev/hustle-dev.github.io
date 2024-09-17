---
title: TypeScript 5.6 번역
description: TypeScript 5.6 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2024-09-17
slug: /translate-ts-5-6
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->




<!-- 본문 -->

> TypeScript 5.6에서 중요하다고 생각되는 부분을 번역했습니다. 더 자세한 글은 아래 원글 링크를 참고해주세요.
> https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/

## 허용되지 않는 Nullish 및 Truthy 검사

아래 코드들은 모두 유효한 JS 코드여서 이전에는 TS가 허용했지만 5.6부터는 오류를 발생시킨다.

```ts
if (/0x[0-9a-f]/) {
//  ~~~~~~~~~~~~
// error: This kind of expression is always truthy.
}

if (x => 0) {
//  ~~~~~~
// error: This kind of expression is always truthy.
}

function isValid(value: string | number, options: any, strictness: "strict" | "loose") {
    if (strictness === "loose") {
        value = +value
    }
    return value < options.max ?? 100;
    //     ~~~~~~~~~~~~~~~~~~~
    // error: Right operand of ?? is unreachable because the left operand is never nullish.
}

if (
    isValid(primaryValue, "strict") || isValid(secondaryValue, "strict") ||
    isValid(primaryValue, "loose" || isValid(secondaryValue, "loose"))
) {
    //                    ~~~~~~~
    // error: This kind of expression is always truthy.
}
```

이와 비슷한 결과는 ESLint의 `no-constant-binary-expression` 규칙을 활성화해 얻을 수 있지만 TS에서 수행하는 검사 규칙과 완전히 일치하지는 않는다.

코드를 반복 및 디버깅시에 유용한 표현식들은 항상 `truthy`한 값이나 `nullish`로 평가되더라도 여전히 허용된다. 

코드 예시

```ts
while (true) {
    doStuff();

    if (something()) {
        break;
    }

    doOtherStuff();
}

if (true || inDebuggingOrDevelopmentEnvironment()) {
    // ...
}
```

## Iterator 헬퍼 메서드

많은 사람들이 배열에서 자주 사용하는 `map`, `filter`, `reduce` 메서드를 `Iterable` 및 `IterableIterator` 에서 사용할 수 없다는 점을 아쉬워했다. 이를 해결하기 위해 [ECMAScript에서는 JavaScript에서 생성된 대부분의 `IterableIterator`에 배열 메서드들을 추가하는 제안](https://github.com/tc39/proposal-iterator-helpers)이 최근에 제출되었다.

이제 모든 제너레이터는 `map` 메서드와 `take` 메서드를 가진 객체를 생성한다.

```ts
function* positiveIntegers() {
    let i = 1;
    while (true) {
        yield i;
        i++;
    }
}

const evenNumbers = positiveIntegers().map(x => x * 2);

// Output:
//    2
//    4
//    6
//    8
//   10
for (const value of evenNumbers.take(5)) {
    console.log(value);
}
```

`Map`과 `Set`의 `key()`, `values()`, `entries()`와 같은 메서드들 모두 마찬가지이다.

> `key()`, `values()`, `entries()` 메서드들 모두 `Iterator` 객체를 반환함.

```ts
function invertKeysAndValues<K, V>(map: Map<K, V>): Map<V, K> {
    return new Map(
        map.entries().map(([k, v]) => [v, k])
    );
}
```

`Iterator` 객체를 `extend`할 수도 있다.


```ts
/**
 * Provides an endless stream of `0`s.
 */
class Zeroes extends Iterator<number> {
    next() {
        return { value: 0, done: false } as const;
    }
}

const zeroes = new Zeroes();

// Transform into an endless stream of `1`s.
const ones = zeroes.map(x => x + 1);

```

그리고 기존 이터러블이나 이터레이터를 `Iterator.from`을 사용해 이 새로운 타입에 적용할 수 있다.

```ts
Iterator.from(...).filter(someFunction);
```

이 새로운 메서드들은 최신 JavaScript 런타임에서 실행하거나 새로운 `Iterator` 객체에 대한 폴리필을 사용할 경우 모두 정상적으로 동작한다.

`Iterable`과 `Iterator`에 대한 TypeScript 타입이 있지만 이 타입이 모든 메서드를 구현하는 것은 아니다.

문제가 되는 부분은 JS 런타임에서 `Iterator`라는 실제 값이 존재한다는 것이다. 이 부분과 TS의 타입 검사 용도의 `Iterator`의 이름이 충돌한다.

이러한 충돌을 해결하기 위해 TypeScript는 별도의 타입인 `IteratorObject`를 도입했다.

```ts
interface IteratorObject<T, TReturn = unknown, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
}
```

많은 내장 컬레션과 메서드들은 `IteratorObject`의 하위 타입들을 생성한다. 예를들어 `ArrayIterator`, `SetIterator`, `MapIterator`등이 있으며 `lib.d.ts`의 핵심 JS 및 DOM 타입들과 함께 `@types/node`도 이 새로운 타입을 사용하도록 업데이트 되었다.

마찬가지로, `AsyncIteratorObject` 타입도 추가되었다. 이는 `AsyncIterator`를 위한 런타임 값으로 아직 존재하지 않지만, `AsyncIterable`s 에 동일한 메서드를 제공하기 위한 제안이 활발히 진행 중이며, 이 새로운 타입은 이를 대비한 것이다.

## 엄격한 내장 Iterator 검사(`--strictBuiltinIteratorReturn`)

`Iterator<T, TReturn>`에서 `next()` 메서드를 호출하면 메서드는 `value`와 `done` 속성을 가진 객체를 반환한다. 

```ts
type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}

interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}
```

새로운 `IteratorObject` 타입을 도입하면서 안전하게 이를 구현하는데 몇 가지 어려움을 발견했다. `IteratorResult`의 `TReturn`이 `any`인 경우 이 타입의 `value`는 단순히 `any`가 되어버린다.

결국 타입 시스템에서 `value`가 구체적으로 어떤 값인지 알 수 없기에 예기치 않은 문제를 발생시킨다.

```ts
function* uppercase(iter: Iterator<string, any>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase(); // oops! forgot to check for `done` first and misspelled `toUpperCase`

        if (done) {
            return;
        }
    }
}
```

TypeScript 5.6은 `BuiltinIteratorReturn`이라는 새로운 내장 타입과 `--strictBuiltinIteratorReturn`이라는 새로운 `--strict` 모드 플래그를 도입했다. `lib.d.ts`와 같은 곳에서 `IteratorObject`가 사용될 때는 항상 `TReturn`을 위한 타입으로 `BuiltinIteratorReturn`이 사용된다(하지만 더 구체적인 `MapIterator`, `ArrayIterator`, `SetIterator`와 같은 타입을 더 자주 보게 될 것이다).

```ts
interface MapIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): MapIterator<T>;
}

// ...

interface Map<K, V> {
    // ...

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<[K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}
```

기본적으로, `BuiltinIteratorReturn` `any`로 설정되지만, `--strictBuiltinIteratorReturn` 플래그가 활성화되면(또는 `--strict` 플래그를 통해 가능), 이 값은 `undefined`로 설정된다. 이 새로운 모드에서 `BuiltinIteratorReturn`을 사용할 경우, 이전에 언급한 예시는 이제 올바르게 오류를 발생시킨다.

```ts
function* uppercase(iter: Iterator<string, BuiltinIteratorReturn>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase();
        //    ~~~~~ ~~~~~~~~~~~
        // error! ┃      ┃
        //        ┃      ┗━ Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
        //        ┃
        //        ┗━ 'value' is possibly 'undefined'.

        if (done) {
            return;
        }
    }
}
```

`lib.d.ts` 전반에서 `BuiltinIteratorReturn`이 `IteratorObject`와 함께 사용되는 것을 자주 볼 수 있다. 가능하다면 자신의 코드에서 `TReturn`에 대해 더 명시적으로 정의하는 것을 권장한다.

## 임의의 모듈 식별자 지원

JS는 모듈이 문자열 리터럴로 유효하지 않은 식별자 이름을 내보내는 것을 허용한다.

```ts
const banana = "🍌";

export { banana as "🍌" };
```

또한 이런 모듈에서 `import` 하여 유효한 식별자에 바인딩 하는것도 허용한다.

```ts
import { "🍌" as banana } from "./foo"

/**
 * om nom nom
 */
function eat(food: string) {
    console.log("Eating", food);
};

eat(banana);
```

이러한 기능은 다른 언어와의 상호 운용성을 위해 유용하다.(특히 JavaScript ↔ WebAssembly 경계에서) 왜냐하면 다른 언어들은 유효한 식별자에 대한 규칙이 다를 수 있기 때문이다.

TypeScript 5.6에서는 이러한 임의의 모듈 식별자를 코드에서 사용할 수 있다.

## `--noUncheckedSideEffectImports` 옵션

JS에선 실제로 값을 가져오지 않고도 모듈을 import 할 수 있다.

```ts
import "some-module";
```

이런 import를 *side effect import*라고 부른다.

TS에선 이런 모듈을 import 시에 소스 파일이 없는 경우에도 해당 import를 무시했다. 이는 JS 생태계에서 사용되는 패턴을 모델링하는 데서 일부 기인한다. 

아래와 같은 구문은 번들러에서 CSS나 다른 에셋을 로드하기 위한 특수 로더와 함께 사용되기도 했다.

```ts
import "./button-component.css";

export function Button() {
    // ...
}
```

하지만 이는 이런 *side effect import*에서 발생할 수 있는 오타를 감추게 된다. 이런 이유로 TS 5.6은 새로운 컴파일러 옵션인 `--noUncheckedSideEffectImports`를 도입하여 이러한 경우를 잡아낸다.

이 옵션이 활성화되면 TS는 *side effect import*에 대한 소스 파일을 찾지 못할 경우 오류를 발생시킨다.

```ts
import "oops-this-module-does-not-exist";
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// error: Cannot find module 'oops-this-module-does-not-exist' or its corresponding type declarations.
```

이 옵션을 활성화화면 위 CSS 예시처럼 정상적으로 동작하던 코드에서 오류가 날 수 있다. 이런 경우 아래와 같이 와일드카드 지정자를 사용한 *ambient 모듈 선언*을 작성하면 된다.

```ts
// ./src/globals.d.ts

// Recognize all CSS files as module imports.
declare module "*.css" {}
```

실제로 프로젝트에 이미 이러한 파일이 존재할 수 있다. `vite init`과 같은 명령을 실행해 비슷한 파일인 `vite-env.d.ts`가 생성될 수 있다.

## `--noCheck` 옵션

TypeScript 5.6은 새로운 컴파일러 옵션으로 `--noCheck`를 도입했다. 이는 모든 입력 파일에 대한 타입 검사를 건너뛸 수 있고, 이를 통해 출력 파일을 생성할 때 불필요한 타입검사를 피할 수 있다.

사용 사례

- JS 파일 생성을 타입 검사와 별도로 실행
    - 개발 중엔 `tsc --noCheck`를 사용해 빠르게 빌드
    - 나중에 `tsc --noEmit`을 실행해 철저한 타입검사 수행
    - 이 둘을 병렬로도 실행할 수 있고 `--watch` 모드에서도 가능하며 동시에 실행 시 `--tsBuildInfoFile` 경로를 지정하는 것이 좋음
- 선언 파일 생성 시 활용
    - `isolatedDeclarations`를 사용하는 프로젝트에서 `--noCheck` 사용 시 타입 검사를 건너뛰고 빠르게 파일 선언 파일 생성(생성된 선언 파일은 빠른 구문 변환에 의존)
    - `isolatedDeclarations`를 사용하지 않는 경우 `.d.ts` 파일을 생성하기 위해 필요한 최소한의 타입 검사를 수행할 수 있음
    - 이 옵션은 TS API에서도 사용할 수 있고 내부적으로 `transpileModule`과 `transpileDeclaration`은 이미 이를 사용해 속도를 향상시키고 있음


## `--build`에서 중간 오류 허용

TypeScript 5.6에서는 중간 의존성에 오류가 있더라도 프로젝트 빌드를 계속 진행할 수 있다. 

빌드를 오류 발생 시 중단하려면 `--stopOnBuildErrors` 플래그를 사용할 수 있다. 이는 CI 환경에서나 다른 프로젝트가 많이 의존하는 프로젝트를 작업할때 유용하다.

## 에디터에서 지역 우선 진단

TypeScript 5.6에서는 **지역 우선 진단** 기능을 도입해 사용자가 보고 있는 특정 부분에 대한 진단을 요청할 수 있도록 한다. 이를 통해 큰 파일에서 딜레이가 발생하는 것을 방지할 수 있다.

따라서 TypeScript 언어 서버는 지역 진단, 파일 전체에 대한 두 가지 진단 세트를 제공한다.

## Granular Commit Characters

TS 언어 서비스는 각 자동 완성 항목에 대해 고유의 커밋 문자를 제공한다. 커밋 문자는 특정 문자를 입력 시 현재 제안된 자동 완성 항목을 확정하는데 사용한다. 

```ts
declare let food: {
    eat(): any;
}

let f = (foo/**/
```

우리가 작성 중인 코드가 `let f = (food.eat())` 또는 `let f = (foo, bar) => foo + bar`와 같은 것일 수 있다. 입력하는 문자에 따라 자동 완성 동작이 달라질 수 있다. 만약 `.`을 입력하면 `food`가 자동 완성되고, `,`를 입력하면 화살표 함수의 매개변수를 작성 중일 가능성이 높다.

이제 TypeScript는 각 자동 완성 항목에 대해 안전한 커밋 문자를 명시적으로 제공한다.

이를 통해 에디터가 자동 완성 항목을 더 자주 확정할 수 있고, VSCode Insiders에서 TS nightly 버전을 사용할 경우 이러한 개선 사항을 즉시 경험할 수 있다.

## Auto-Import에서 제외 패턴 지원

TS 언어 서비스는 특정 규칙에 맞는 import 제안을 필터링할 수 있는 정규 표현식 패턴을 지원한다.

```json
// `lodash`와 같은 패키지에서 "deepl" import 제외하기 위한 설정
{
  "typescript.preferences.autoImportSpecifierExcludeRegexes": ["/lodash/"]
}

// 엔트리 포인트에서 가져오기를 허용하지 않는 설정
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^lodash$"
    ]
}

// `node:` import를 피하는 설정
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^node:"
    ]
}
```



`i`나 `u` 같은 정규픽 플래그를 지정하려면 정규식을 슬래시로 둘러싸야한다. 주변 슬래시를 제공할 때는 다른 내부 슬래시를 이스케이프 처리해야한다.

```json
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^./lib/internal",        // no escaping needed
        "/^.\\/lib\\/internal/",  // escaping needed - note the leading and trailing slashes
        "/^.\\/lib\\/internal/i"  // escaping needed - we needed slashes to provide the 'i' regex flag
    ]
}
```

VSCode의 `javascript.preferences.autoImportSpecifierExcludeRegexes` 통해 JS에도 동일한 설정을 적용할 수 있다.

## 주목할 만한 동작 변경


### `.tsbuildinfo` 는 항상 생성

종속성에서 중간 오류가 발생하더라도 `--build`가 프로젝트를 계속 빌드할 수 있도록 하고 명령줄에서 `--noCheck`를 지원하기 위해 TS는 `--build` 호출에서 모든 프로젝트에 대해 항상 `.tsbuildinfo` 파일을 생성한다.

### `node_modules` 내부의 파일 확장자와 `package.json`의 처리

Node.js 12버전에서 ECMAScript 모듈에 대한 지원을 구현하기 전엔 TS가 `node_mdules`에서 찾은 `.d.ts` 파일이 CommonJS로 작성된 JS 파일인지 ECMASCRipt 모듈인지 TS가 알 수 있는 방법이 없었다. npm의 대부분이 CommonJS만을 사용하던 시절에는 큰 문제가 없었는데, 그럴 경우 TypeScript는 모든 것이 CommonJS처럼 동작한다고 가정할 수 있었다. 그러나 이 가정이 잘못된 경우, 안전하지 않은 import를 허용할 수 있었다.

```ts
// node_modules/dep/index.d.ts
export declare function doSomething(): void;

// index.ts
// Okay if "dep" is a CommonJS module, but fails if
// it's an ECMAScript module - even in bundlers!
import dep from "dep";
dep.doSomething();
```

실제로 이러한 문제가 자주 발생하지는 않았지만, Node.js가 ECMAScript 모듈을 지원하기 시작한 이후로 npm에서 ESM의 비중이 증가했다. 다행히도, Node.js는 TypeScript가 파일이 ECMAScript 모듈인지 CommonJS 모듈인지를 판단하는 데 도움이 되는 메커니즘을 도입했다. 이는 `.mjs` 및 `.cjs` 파일 확장자와 `package.json`의 `"type"` 필드를 사용하는 것이다. TypeScript 4.7에서는 이러한 지표를 이해하고 `.mts` 및 `.cts` 파일을 작성하는 지원이 추가되었지만, 이는 `--module node16` 및 `--module nodenext` 옵션에서만 적용되었다. 따라서 `--module esnext` 및 `--moduleResolution bundler`를 사용하는 경우에는 여전히 안전하지 않은 import 문제가 남아 있었다.

이를 해결하기 위해 TypeScript 5.6은 모든 모듈 모드에서(amd, umd, system을 제외하고) 모듈 형식 정보를 수집하고 이를 사용하여 위의 예와 같은 모호성을 해결한다. `.mts` 및 `.cts`와 같은 형식별 파일 확장자는 발견된 모든 곳에서 고려되며, `node_modules` 내부의 종속성에 있는 `package.json`의 `"type"` 필드도 모듈 설정과 관계없이 참조된다.

이전에는 CommonJS 출력을 `.mjs` 파일로 생성하거나 그 반대로 생성하는 것이 기술적으로 가능했다.

```ts
// main.mts
export default "oops";

// $ tsc --module commonjs main.mts
// main.mjs
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "oops";
```


하지만 이제 `.mts` 파일은 절대 CommonJS 출력을 생성하지 않으며, `.cts` 파일은 절대 ESM 출력을 생성하지 않는다.

이러한 동작의 대부분은 TypeScript 5.5의 사전 릴리스 버전에서 이미 제공되었지만, TypeScript 5.6에서는 이 동작이 `node_modules` 내부의 파일로 확장되었다

## Computed Properties의 올바른 override 검사

이전에는 `override`로 표시된 계산된 속성(computed properties)이 상위 클래스 멤버의 존재 여부를 올바르게 확인하지 않았다. 또한, `noImplicitOverride` 옵션을 사용한 경우에도 계산된 속성에 `override` 수식자를 추가하지 않아도 오류가 발생하지 않았다.

TypeScript 5.6에서는 이 두 가지 경우 모두에 대해 계산된 속성을 올바르게 검사한다.

```ts
const foo = Symbol("foo");
const bar = Symbol("bar");

class Base {
    [bar]() {}
}

class Derived extends Base {
    override [foo]() {}
//           ~~~~~
// 오류: 이 멤버는 기본 클래스 'Base'에 선언되어 있지 않으므로 'override' 수식자를 가질 수 없습니다.

    [bar]() {}
//  ~~~~~
// noImplicitOverride 옵션이 활성화된 경우의 오류: 이 멤버는 기본 클래스 'Base'의 멤버를 재정의하므로 'override' 수식자를 가져야 합니다.
}
```

이제 TypeScript는 `override` 수식자가 잘못된 곳에 사용되거나 필요한 곳에 누락된 경우를 정확하게 잡아낸다. 이러한 개선은 상속 구조에서 메서드 오버라이딩과 관련된 잠재적인 버그를 사전에 방지하는 데 도움이 된다.

