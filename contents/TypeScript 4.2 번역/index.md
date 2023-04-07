---
title: TypeScript 4.2 번역
description: TypeScript 4.2 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2023-03-04
slug: /translate-ts-4-2
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-2.html

## 더 스마트한 타입 별칭 보존

타입스크립트에는 타입 별칭이라고 하는 타입의 새 이름을 선언하는 방법이 있다. `string | number | boolean`에서 모두 작동하는 함수 집합을 작성하는 경우 타입 별칭을 작성하여 반복되는 작업을 피할 수 있다.

```ts
type BasicPrimitive = number | string | boolean;
```

TS는 타입을 출력할 때, 타입 별칭을 재사용할 시점에 대해 항상 일련의 규칙과 추측을 사용했다. 예를 들어 다음 코드 스니펫을 보자.

```ts
export type BasicPrimitive = number | string | boolean;
export function doStuff(value: BasicPrimitive) {
  let x = value;
  return x;
}
```

Visual Studio, Visual Studio Code 또는 TypeScript Playground와 같은 편집기에서 마우스 커서를 `x`로 가져가면 `BasicPrimitive` 타입이 표시된 빠른 정보 패널이 나타난다. 마찬가지로 이 파일에 대한 선언 파일 출력(`.d.ts` 출력)을 가져오는 경우 TypeScript는 `doStuff`가 `BasicPrimitive`를 반환한다고 말한다.

하지만 `BasicPrimitive` 혹은 `undefined`를 반환하는 경우 어떻게 될까?

```ts
export type BasicPrimitive = number | string | boolean;
export function doStuff(value: BasicPrimitive) {
  if (Math.random() < 0.5) {
    return undefined;
  }
  return value;
}
```

TypeScript 4.1 플레이그라운드에서 어떤 일이 일어나는지 확인할 수 있다.
TypeScript가 `doStuff`의 반환 타입을 `BasicPrimitive | undefined`으로 표시하기를 원하지만, 대신 `string | number | boolean | undefined`으로 표시된다! 왜 그럴까?

이는 타입스크립트가 내부적으로 타입을 표현하는 방식과 관련이 있다. 하나 이상의 유니온 타입에서 유니온 타입을 생성할 때 항상 해당 타입을 새로운 flattened된 유니온 유형으로 정규화하지만 그렇게 하면 정보가 손실된다. 타입체커는 `tring | number | boolean | undefined`에서 모든 타입 조합을 찾아서 어떤 타입 별칭이 사용되었는지 확인해야 하며, 그 경우에도 `tring | number | boolean`에 대한 여러 타입 별칭이 있을 수 있다.

TypeScript 4.2에서는 내부가 좀 더 스마트해졌다. 시간이 지남에 따라 타입이 원래 어떻게 작성되고 구성되었는지에 대한 부분을 유지함으로써 타입이 어떻게 구성되었는지 추적할 수 있다. 또한 타입 별칭을 추적하고 다른 별칭의 인스턴스와 구별한다!

코드에서 사용한 방식에 따라 유형을 다시 출력할 수 있다는 것은 TypeScript 사용자로서 안타깝게도 많은 타입이 표시되는 것을 피할 수 있다는 의미이며, 이는 종종 빠른 정보 및 서명 도움말에서 `.d.ts` 파일 출력, 오류 메시지 및 편집기 내 타입 표시가 개선되는 것으로 해석된다. 이를 통해 TypeScript를 처음 접하는 분들에게 조금 더 친근하게 다가갈 수 있다.

## 튜플 타입의 첫/중간 나머지 요소

TS에서 튜플 타입은 특정 길이와 요소 타입을 가진 배열을 모델링하기 위한 것이다.

```ts
// A tuple that stores a pair of numbers
let a: [number, number] = [1, 2];
// A tuple that stores a string, a number, and a boolean
let b: [string, number, boolean] = ['hello', 42, true];
```

시간이 지남에 따라 TypeScript의 튜플 타입은 JavaScript의 매개변수 목록과 같은 것을 모델링하는 데에도 사용되기 때문에 점점 더 정교해졌다. 그 결과 선택적 요소와 나머지 요소를 가질 수 있고, 도구와 가독성을 위한 레이블을 가질 수도 있다.

```ts
// A tuple that has either one or two strings.
let c: [string, string?] = ['hello'];
c = ['hello', 'world'];

// A labeled tuple that has either one or two strings.
let d: [first: string, second?: string] = ['hello'];
d = ['hello', 'world'];

// A tuple with a *rest element* - holds at least 2 strings at the front,
// and any number of booleans at the back.
let e: [string, string, ...boolean[]];

e = ['hello', 'world'];
e = ['hello', 'world', false];
e = ['hello', 'world', true, false, true];
```

TypeScript 4.2에서는 rest 요소의 사용 방법이 특히 확장되었다. 이전 버전에서 TypeScript는 튜플 타입의 맨 마지막 위치에만 `...rest` 요소를 허용했다.

그러나 이제 몇 가지 제한 사항만 적용하면 튜플 내 어느 위치에서나 rest 요소를 사용할 수 있다.

```ts
let foo: [...string[], number];

foo = [123];
foo = ['hello', 123];
foo = ['hello!', 'hello!', 'hello!', 123];

let bar: [boolean, ...string[], boolean];

bar = [true, false];
bar = [true, 'some text', false];
bar = [true, 'some', 'separated', 'text', false];
```

유일한 제한 사항은 다른 선택적 요소나 나머지 요소가 뒤에 오지 않는 한 나머지 요소는 튜플의 어느 곳에나 배치할 수 있다는 것이다. 즉, 튜플당 rest 요소는 하나만 있고 rest 요소 뒤에는 선택 요소가 없어야 한다.

```ts
interface Clown {
  /*...*/
}
interface Joker {
  /*...*/
}

let StealersWheel: [...Clown[], 'me', ...Joker[]];
// A rest element cannot follow another rest element.

let StringsAndMaybeBoolean: [...string[], boolean?];
// An optional element cannot follow a rest element.
```

이러한 후행이 아닌 rest 요소는 몇 개의 선행 인수와 몇 개의 고정 인수가 뒤따르는 함수를 모델링하는 데 사용할 수 있다.

```ts
declare function doStuff(...args: [...names: string[], shouldCapitalize: boolean]): void;

doStuff(/*shouldCapitalize:*/ false);
doStuff('fee', 'fi', 'fo', 'fum', /*shouldCapitalize:*/ true);
```

JavaScript에는 선행 rest 매개변수를 모델링하는 구문이 없지만, 선행 rest 요소를 사용하는 튜플 타입으로 `...args` rest 매개변수를 선언하여 선행 인수를 취하는 함수로 `doStuff`를 선언할 수 있었다. 이렇게 하면 기존의 많은 자바스크립트를 모델링하는 데 도움이 될 수 있다!

## `in` 연산자에 대한 더 엄격한 검사

JS에서 `in` 연산자의 오른쪽에 객체가 아닌 타입을 사용하는 것은 런타임 에러이다. TypeScript 4.2에서는 이를 디자인 타임(코드를 작성하는 순간)에 포착할 수 있다.

```ts
'foo' in 42;
// The right-hand side of an 'in' expression must not be a primitive.
```

이 검사는 대부분 상당히 보수적이므로 이와 관련된 오류가 발생하면 코드에 문제가 있는 것일 수 있다.

## `--noPropertyAccessFromIndexSignature`

TypeScript가 처음 인덱스 시그니처를 도입했을 때만 해도 `person["name"]`과 같이 '괄호로 묶인' 엘리먼트 액세스 구문을 사용하여 선언된 프로퍼티만 가져올 수 있었다.

```ts
interface SomeType {
  /** This is an index signature. */
  [propName: string]: any;
}

function doStuff(value: SomeType) {
  let x = value['someProperty'];
}
```

이는 임의의 속성을 가진 객체로 작업해야 하는 상황에서 번거로웠다. 예를 들어, 프로퍼티 이름 끝에 `s`를 추가하여 철자를 잘못 입력하는 것이 일반적인 API를 상상해 보자.

```ts
interface Options {
  /** File patterns to be excluded. */
  exclude?: string[];

  /**
   * It handles any extra properties that we haven't declared as type 'any'.
   */
  [x: string]: any;
}

function processOptions(opts: Options) {
  // Notice we're *intentionally* accessing `excludes`, not `exclude`
  if (opts.excludes) {
    console.error('The option `excludes` is not valid. Did you mean `exclude`?');
  }
}
```

이러한 상황을 더 쉽게 처리하기 위해 얼마 전 TypeScript는 타입에 문자열 인덱스 시그니처가 있는 경우 `person.name`과 같은 "점선" 속성 액세스 구문을 사용할 수 있도록 했다. 이를 통해 기존 JavaScript 코드를 TypeScript로 쉽게 전환할 수 있게 되었다.

그러나 제한이 완화되면서 명시적으로 선언된 프로퍼티의 철자를 잘못 입력하는 것이 훨씬 쉬워졌다.

```ts
function processOptions(opts: Options) {
  // ...

  // Notice we're *accidentally* accessing `excludes` this time.
  // Oops! Totally valid.
  for (const excludePattern of opts.excludes) {
    // ...
  }
}
```

어떤 경우에는 사용자가 인덱스 시그니처를 명시적으로 선택하기를 원할 수도 있다. 점으로 표시된 속성 액세스가 특정 속성 선언과 일치하지 않을 때 오류 메시지가 표시되기를 원하기 때문이다.

이것이 바로 TypeScript가 `noPropertyAccessFromIndexSignature`라는 새로운 플래그를 도입한 이유이다. 이 모드에서는 오류를 발생시키는 TypeScript의 이전 동작을 선택하게 됩니다. 이 새로운 설정은 사용자가 특정 코드베이스에서 다른 코드베이스보다 더 유용하다고 생각하기 때문에 엄격한 플래그 계열에 속하지 않았다.

## `abstract` 생성자 시그니처

타입스크립트에서는 클래스를 `abstract`으로 표시할 수 있다. 이는 TypeScript가 클래스를 확장하기 위한 용도로만 사용되며, 실제로 인스턴스를 생성하려면 특정 멤버를 서브클래스에서 채워야 한다는 것을 알려준다.

```ts
abstract class Shape {
  abstract getArea(): number;
}

new Shape();
// Cannot create an instance of an abstract class.

class Square extends Shape {
  #sideLength: number;

  constructor(sideLength: number) {
    super();
    this.#sideLength = sideLength;
  }

  getArea() {
    return this.#sideLength ** 2;
  }
}

// Works fine.
new Square(42);
```

`abstract` 클래스를 새로 생성할 때 이러한 제한이 일관되게 적용되도록 하려면 생성자 시그니처가 필요한 모든 항목에 추상 클래스를 할당할 수 없다.

```ts
interface HasArea {
  getArea(): number;
}

let Ctor: new () => HasArea = Shape;
// Type 'typeof Shape' is not assignable to type 'new () => HasArea'.
//  Cannot assign an abstract constructor type to a non-abstract constructor type.
```

이는 `new Ctor`와 같은 코드를 실행하려는 경우에는 올바르게 작동하지만, `Ctor`의 서브클래스를 작성하려는 경우에는 지나치게 제한적이다.

```ts
abstract class Shape {
  abstract getArea(): number;
}

interface HasArea {
  getArea(): number;
}

function makeSubclassWithArea(Ctor: new () => HasArea) {
  return class extends Ctor {
    getArea() {
      return 42;
    }
  };
}

let MyShape = makeSubclassWithArea(Shape);
// Argument of type 'typeof Shape' is not assignable to parameter of type 'new () => HasArea'.
//  Cannot assign an abstract constructor type to a non-abstract constructor type.
```

또한 `InstanceType`과 같은 기본 제공 헬퍼 유형에서는 잘 작동하지 않는다.

```ts
type MyInstance = InstanceType<typeof Shape>;
```

이것이 바로 타입스크립트 4.2에서 생성자 시그니처에 `abstract` 수정자를 지정할 수 있는 이유이다.

```ts
interface HasArea {
  getArea(): number;
}

// Works!
let Ctor: abstract new () => HasArea = Shape;
```

생성자 시그니처에 `abstract` 수정자를 추가하면 `abstract` 생성자에서 전달할 수 있다는 신호가 된다. "구체적인" 다른 클래스/생성자 함수를 전달하는 것을 막는 것이 아니라, 생성자를 직접 실행할 의도가 없다는 신호일 뿐이므로 어느 클래스 유형으로 전달해도 안전하다.

이 기능을 사용하면 추상 클래스를 지원하는 방식으로 믹스인 팩토리를 작성할 수 있다. 예를 들어, 다음 코드 스니펫에서는 믹스인 함수 `withStyles`를 `abstract` 클래스 `SuperClass`와 함께 사용할 수 있다.

```ts
abstract class SuperClass {
  abstract someMethod(): void;
  badda() {}
}

type AbstractConstructor<T> = abstract new (...args: any[]) => T;

function withStyles<T extends AbstractConstructor<object>>(Ctor: T) {
  abstract class StyledClass extends Ctor {
    getStyles() {
      // ...
    }
  }
  return StyledClass;
}

class SubClass extends withStyles(SuperClass) {
  someMethod() {
    this.someMethod();
  }
}
```

`withStyles`은 일반적이고 추상 생성자(예: `Ctor`)에 의해 경계가 지정된 값을 확장하는 클래스(예: `StyledClass`)도 추상적으로 선언해야 한다는 특정 규칙을 보여드리고 있다는 점에 유의하자. 추상 멤버가 더 많은 클래스가 전달되었는지 알 수 있는 방법이 없기 때문에 하위 클래스가 모든 추상 멤버를 구현하는지 여부를 알 수 없기 때문이다.

## `--explainFiles`를 사용하여 프로젝ㅌ 구조 이해하기

타입스크립트 사용자들이 의외로 흔히 하는 질문은 "왜 타입스크립트에 이 파일이 포함되나요?"이다. 프로그램의 파일을 추론하는 것은 복잡한 과정이기 때문에 특정 조합의 `lib.d.ts`가 사용된 이유, `node_modules`의 특정 파일이 포함된 이유, `exclude`를 지정하면 제외될 줄 알았는데 특정 파일이 포함된 이유 등 여러 가지 이유가 있을 수 있다.

이것이 바로 TypeScript가 이제 `explainFiles` 플래그를 제공하는 이유이다.

```bash
tsc --explainFiles
```

이 옵션을 사용하면 TypeScript 컴파일러에서 파일이 프로그램에 포함된 이유에 대한 매우 자세한 출력을 제공한다. 이 출력을 더 쉽게 읽으려면 출력을 파일로 전달하거나 쉽게 볼 수 있는 프로그램으로 파이프할 수 있다.

```bash
# Forward output to a text file
tsc --explainFiles > explanation.txt

# Pipe output to a utility program like `less`, or an editor like VS Code
tsc --explainFiles | less

tsc --explainFiles | code -
```

일반적으로 출력은 `lib.d.ts` 파일을 포함해야 하는 이유를 나열하는 것으로 시작하여 로컬 파일, `node_modules` 파일 순으로 나열한다.

```
TS_Compiler_Directory/4.2.2/lib/lib.es5.d.ts
  Library referenced via 'es5' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2015.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2015.d.ts
  Library referenced via 'es2015' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2016.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2016.d.ts
  Library referenced via 'es2016' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2017.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2017.d.ts
  Library referenced via 'es2017' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2018.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2018.d.ts
  Library referenced via 'es2018' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2019.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2019.d.ts
  Library referenced via 'es2019' from file 'TS_Compiler_Directory/4.2.2/lib/lib.es2020.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.es2020.d.ts
  Library referenced via 'es2020' from file 'TS_Compiler_Directory/4.2.2/lib/lib.esnext.d.ts'
TS_Compiler_Directory/4.2.2/lib/lib.esnext.d.ts
  Library 'lib.esnext.d.ts' specified in compilerOptions

... More Library References...

foo.ts
  Matched by include pattern '**/*' in 'tsconfig.json'
```

현재로서는 출력 형식에 대해 보장할 수 없으며 시간이 지남에 따라 변경될 수 있다.

## 논리 표현식에서 호출되지 않은 함수 검사 기능 개선

TS의 호출되지 않은 함수 검사가 `&&` 및 `||` 표현식 내에 적용된다.

`strictNullChecks`에서는 이제 다음 코드에서 오류가 발생한다.

```ts
function shouldDisplayElement(element: Element) {
  // ...
  return true;
}
function getVisibleItems(elements: Element[]) {
  return elements.filter((e) => shouldDisplayElement && e.children.length);
  //                          ~~~~~~~~~~~~~~~~~~~~
  // This condition will always return true since the function is always defined.
  // Did you mean to call it instead.
}
```

## 디스트럭처링된 변수를 명시적으로 미사용으로 표시할 수 있다

이제 디스트럭처링된 변수 앞에 밑줄(`_` 문자)을 붙여 사용하지 않는 것으로 표시할 수 있다.

```ts
let [_first, second] = getValues();
```

이전에는 `_first`가 나중에 한 번도 사용되지 않으면 TypeScript가 `noUnusedLocals`에서 오류를 발생시켰다. 이제 TypeScript는 `_first`를 사용할 의도가 없었기 때문에 의도적으로 밑줄을 넣어 명명했음을 인식한다.

## 선택적 속성과 문자열 인덱스 시그니처 간의 완화된 규칙

문자열 인덱스 시그니처는 임의의 키로 액세스를 허용하려는 사전과 같은 객체를 입력하는 방식이다

```ts
const movieWatchCount: { [key: string]: number } = {};

function watchMovie(title: string) {
  movieWatchCount[title] = (movieWatchCount[title] ?? 0) + 1;
}
```

물론 아직 사전에 없는 영화 제목의 경우 `movieWatchCount[title]`은 `undefined`이다(TypeScript 4.1에서는 이와 같은 인덱스 시그니처에서 읽을 때 `undefined`을 포함하도록 `noUncheckedIndexedAccess` 옵션이 추가되었다). `movieWatchCount`에 존재하지 않는 문자열이 있어야 한다는 것이 분명하지만, 이전 버전의 TypeScript에서는 `undefined`이기 때문에 선택적 객체 속성을 다른 호환 가능한 인덱스 시그니처에 할당할 수 없는 것으로 처리했다.

```ts
type WesAndersonWatchCount = {
  'Fantastic Mr. Fox'?: number;
  'The Royal Tenenbaums'?: number;
  'Moonrise Kingdom'?: number;
  'The Grand Budapest Hotel'?: number;
};

declare const wesAndersonWatchCount: WesAndersonWatchCount;
const movieWatchCount: { [key: string]: number } = wesAndersonWatchCount;
//    ~~~~~~~~~~~~~~~ error!
// Type 'WesAndersonWatchCount' is not assignable to type '{ [key: string]: number; }'.
//    Property '"Fantastic Mr. Fox"' is incompatible with index signature.
//      Type 'number | undefined' is not assignable to type 'number'.
//        Type 'undefined' is not assignable to type 'number'. (2322)
```

타입스크립트 4.2에서는 이 할당이 허용된다. 그러나 타입이 `undefined`와 함께 비선택적 속성의 할당은 허용되지 않으며, 특정 키에 `undefined` 쓰기도 허용되지 않는다.

```ts
type BatmanWatchCount = {
  "Batman Begins": number | undefined;
  "The Dark Knight": number | undefined;
  "The Dark Knight Rises": number | undefined;
};

declare const batmanWatchCount: BatmanWatchCount;

// Still an error in TypeScript 4.2.
const movieWatchCount: { [key: string]: number } = batmanWatchCount;
Type 'BatmanWatchCount' is not assignable to type '{ [key: string]: number; }'.
  Property '"Batman Begins"' is incompatible with index signature.
    Type 'number | undefined' is not assignable to type 'number'.
      Type 'undefined' is not assignable to type 'number'.

// Still an error in TypeScript 4.2.
// Index signatures don't implicitly allow explicit `undefined`.
movieWatchCount["It's the Great Pumpkin, Charlie Brown"] = undefined;
Type 'undefined' is not assignable to type 'number'.
```

숫자 인덱스 시그니처는 배열과 유사하고 밀도가 높다고 가정하므로 새 규칙은 숫자 인덱스 시그니처에는 적용되지 않는다

```ts
declare let sortOfArrayish: { [key: number]: string };
declare let numberKeys: { 42?: string };

sortOfArrayish = numberKeys;
//  Type '{ 42?: string | undefined; }' is not assignable to type '{ [key: number]: string; }'.
//  Property '42' is incompatible with index signature.
//    Type 'string | undefined' is not assignable to type 'string'.
//      Type 'undefined' is not assignable to type 'string'.
```

## 누락된 헬퍼 함수 선언

이제 호출한 코드를 기반으로 새로운 함수와 메서드를 선언할 수 있는 빠른 수정 기능이 추가되었다!

## 주요 변경 사항

TS 4.2에는 몇 가지 중요한 변경 사항이 포함되어 있지만 업그레이드에서 관리할 수 있는 수준이라고 생각한다.

### `lib.d.ts` Updates

모든 타입스크립트 버전과 마찬가지로 `lib.d.ts`의 선언(특히 웹 컨텍스트에 대해 생성된 선언)이 변경되었다. 여러 가지 변경 사항이 있지만 `Intl`과 `ResizeObserver`의 변경 사항이 가장 큰 영향을 미칠 수 있다.

### `noImplicitAny` 에러가 느슨한 `yield` 표현식에 적용

`yield` 표현식의 값이 캡처되었지만 TypeScript가 수신하려는 타입을 즉시 파악할 수 없는 경우(즉, `yield` 표현식이 컨텍스트에 맞게 타입화되지 않은 경우) 이제 TypeScript에서 암시적 오류를 발생시킨다.

```ts
function* g1() {
  const value = yield 1;
'yield' expression implicitly results in an 'any' type because its containing generator lacks a return-type annotation.
}

function* g2() {
  // No error.
  // The result of `yield 1` is unused.
  yield 1;
}

function* g3() {
  // No error.
  // `yield 1` is contextually typed by 'string'.
  const value: string = yield 1;
}

function* g4(): Generator<number, void, string> {
  // No error.
  // TypeScript can figure out the type of `yield 1`
  // from the explicit return type of `g4`.
  const value = yield 1;
```

### 확장된 호출되지 않은 함수 검사

위에서 설명한 대로, 이제 `strictNullChecks`를 사용할 때 호출되지 않은 함수 검사가 `&&` 및 `||` 표현식 내에서 일관되게 작동한다. 이는 새로운 중단의 원인이 될 수 있지만 일반적으로 기존 코드의 논리 오류를 나타냅니다.

### JavaScript의 타입 인수가 타입 인수로 파싱되지 않음

자바스크립트에서는 이미 타입 인수가 허용되지 않았지만, 타입스크립트 4.2에서는 파서가 보다 사양을 준수하는 방식으로 타입 인수를 구문 분석한다. 따라서 JavaScript 파일에 다음 코드를 작성할 때

```js
f < T > 100;
```

TypeScript는 이를 다음과 같은 자바스크립트로 구문 분석한다.

```ts
f < T > 100;
```

이 문제는 자바스크립트 파일의 타입 구문을 구문 분석하기 위해 타입스크립트 API를 사용하는 경우 영향을 미칠 수 있으며, 이는 Flow 파일을 구문 분석하려고 할 때 발생할 수 있다.

### 스프레드에 대한 튜플 크기 제한

타입스크립트에서 스프레드 구문 (`...`)을 사용하여 튜플 유형을 만들 수 있다.

```ts
// Tuple types with spread elements
type NumStr = [number, string];
type NumStrNumStr = [...NumStr, ...NumStr];

// Array spread expressions
const numStr = [123, 'hello'] as const;
const numStrNumStr = [...numStr, ...numStr] as const;
```

때때로 이러한 튜플 타입은 실수로 커질 수 있으며, 이로 인해 타입 검사에 오랜 시간이 걸릴 수 있다. 타입 검사 프로세스가 중단되는 대신(편집기 시나리오에서 특히 나쁘다), 타입스크립트에는 이 모든 작업을 수행하지 않도록 하는 리미터가 있다.

### 가져오기 경로에 `.d.ts` 확장자를 사용할 수 없음

TypeScript 4.2에서는 이제 가져오기 경로의 확장자에 .d.ts가 포함되는 것이 오류이다.

```ts
// must be changed something like
//   - "./foo"
//   - "./foo.js"
import { Foo } from './foo.d.ts';
```

대신, 임포트 경로는 런타임에 로더가 수행하는 모든 작업을 반영해야 한다. 다음 임포트를 대신 사용할 수 있다.

```ts
import { Foo } from './foo';
import { Foo } from './foo.js';
import { Foo } from './foo/index.js';
```

### 템플릿 리터럴 추론 되돌리기

이 변경으로 인해 TypeScript 4.2 베타 버전에서 기능이 제거되었다. 마지막 안정 릴리스 이후 아직 업그레이드하지 않았다면 영향을 받지 않지만 변경 사항에 관심이 있을 수 있다.

TypeScript 4.2 베타 버전에는 템플릿 문자열에 대한 추론 기능이 변경되었다. 이 변경 사항에서는 템플릿 문자열 리터럴에 템플릿 문자열 유형이 주어지거나 여러 문자열 리터럴 유형으로 단순화된다. 그런 다음 이러한 타입은 가변 변수에 할당할 때 `string`으로 확장된다.

```ts
declare const yourName: string;
// 'bar' is constant.
// It has type '`hello ${string}`'.
const bar = `hello ${yourName}`;
// 'baz' is mutable.
// It has type 'string'.
let baz = `hello ${yourName}`;
```

이는 문자열 리터럴 추론이 작동하는 방식과 유사하다.

```ts
// 'bar' has type '"hello"'.
const bar = 'hello';
// 'baz' has type 'string'.
let baz = 'hello';
```

이러한 이유로 템플릿 문자열 표현식에 템플릿 문자열 타입이 있으면 '일관성'이 유지될 것이라고 생각했지만, 보고 들은 바에 따르면 이것이 항상 바람직한 것은 아니다.

이에 따라 이 기능(그리고 잠재적인 변경 사항)을 되돌렸다. 템플릿 문자열 표현식에 리터럴과 유사한 타입을 부여하고 싶다면 언제든지 표현식 끝에 const를 추가하면 된다.

```ts
declare const yourName: string;
// 'bar' has type '`hello ${string}`'.
const bar = `hello ${yourName}` as const;
//                              ^^^^^^^^
// 'baz' has type 'string'.
const baz = `hello ${yourName}`;
```

### `visitNode`안의 타입스크립트의 `lift` 콜백은 다른 타입을 사용

타입스크립트에는 `lift` 함수를 받는 `visitNode` 함수가 있다. 이제 `lift`는 `NodeArray<Node>` 대신 `readonly Node[]`를 기대한다. 이는 기술적으로 API를 깨는 변경 사항으로, 자세한 내용은 [여기](https://github.com/microsoft/TypeScript/pull/42000)에서 확인할 수 있다.
