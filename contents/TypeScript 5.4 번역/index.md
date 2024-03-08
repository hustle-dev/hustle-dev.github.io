---
title: TypeScript 5.4 번역
description: TypeScript 5.4 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2024-03-08
slug: /translate-ts-5-4
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->



<!-- 본문 -->

> 원글링크: https://devblogs.microsoft.com/typescript/announcing-typescript-5-4/

## 마지막 할당 이후의 클로저에서 좁혀진 타입 유지

TypeScript는 일반적으로 수행하는 검사를 기반으로 변수에 대해 좀 더 구체적인 타입을 추론할 수 있다. 이를 narrowing(좁히기)라고 한다.

```ts
function uppercaseStrings(x: string | number) {
    if (typeof x === "string") {
        // 타입스크립트는 여기서 'x'를 'string'으로 인식한다.
        return x.toUpperCase();
    }
}
```

한 가지 일반적인 문제점은 이렇게 좁혀진 타입들이 함수 클로저 내에서 항상 유지되지 않는다.

```ts
function getUrls(url: string | URL, names: string[]) {
    if (typeof url === "string") {
        url = new URL(url);
    }

    return names.map(name => {
        url.searchParams.set("name", name)
        //  ~~~~~~~~~~~~
        // error!
        // Property 'searchParams' does not exist on type 'string | URL'.

        return url.toString();
    });
}
```

여기서 TypeScript는 URL이 다른 곳에서 변경되었기 때문에 콜백 함수에서 URL 객체라고 가정하는 것이 "안전하지 않다"고 판단했다. 하지만, 이 경우 화살표 함수는 항상 URL에 대한 할당 이후에 생성되며 URL에 대한 마지막 할당이다.

TypeScript 5.4에서는 이를 활용해 좀 더 스마트하게 타입을 좁힐 수 있다. 파라미터와 `let` 변수가 호이스트되지 않은 함수에서 사용되는 경우 타입 체커는 마지막 할당 지점을 찾는다. 마지막 할당 지점이 발견되면 TypeScript는 포함 함수 외부에서 안전하게 타입을 좁힐 수 있다. 즉, 위의 예제가 이제 작동한다.

변수가 중첩 함수 내에서 어딘가에 할당된 경우에는 좁히기 분석이 작동하지 않는다. 나중에 함수가 호출될지 여부를 확실히 알 수 없기 때문이다.


```ts
function printValueLater(value: string | undefined) {
    if (value === undefined) {
        value = "missing!";
    }

    setTimeout(() => {
        // 그 타입에 영향을 미치지 않는 방식으로도 '값'을 수정하면,
        // 클로저의 유형 세분화가 무효화된다.
        value = value;
    }, 500);

    setTimeout(() => {
        console.log(value.toUpperCase());
        //          ~~~~~
        // error! 'value' is possibly 'undefined'.
    }, 1000);
}
```

이 변경 사항으로 일반적인 JavaScript 코드를 더 쉽게 작성할 수 있게 되었다.

## `NoInfer` 유틸리티 타입

제네릭 함수를 호출할 때 TypeScript는 전달한 인수로부터 타입 인수를 추론할 수 있다.

```ts
function doSomething<T>(arg: T) {
    // ...
}


// 'T'는 'string'이어야 한다고 명시적으로 말할 수 있다.
doSomething<string>("hello!");

// 'T'의 타입을 유추할 수도 있다.
doSomething("hello!");
```

하지만 한 가지 문제는 "최선의" 타입을 추론하는 것이 항상 명확하지 않다는 점이다. 이로 인해 TypeScript가 유효한 호출을 거부하거나, 의심스러운 호출을 허용하거나, 버그를 잡을 때 더 심각한 오류 메시지를 보고하게 될 수 있다.

예를 들어, 색상 이름 목록과 선택적 기본 색상을 받는 `createStreetLight` 함수를 가정해 보자.

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: C) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "red");
```

`colors` 배열에 없던 `defaultColor`를 전달하면 어떻게 될까? 이 함수에서 colors는 "진실의 원천"으로 간주되어야 하며, defaultColor에 전달할 수 있는 값을 설명해야 한다.

```ts
// Oops! This undesirable, but is allowed!
createStreetLight(["red", "yellow", "green"], "blue");
```

이 호출에서 타입 추론은 `"blue"`가 `"red"`, `"yellow"`, `"green"`만큼 유효한 타입이라고 결정했다. 그래서 TypeScript는 호출을 거부하는 대신 C의 타입을 `"red" | "yellow" | "green" | "blue"`로 추론했다.

현재 이 문제를 해결하는 한 가지 방법은 기존 타입 매개변수로 제한된 별도의 타입 매개변수를 추가하는 것이다.

```ts
function createStreetLight<C extends string, D extends C>(colors: C[], defaultColor?: D) {
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

이 방법은 작동하지만 `D`가 `createStreetLight`의 시그니처 다른 곳에서는 사용되지 않을 것이기 때문에 약간 어색하다. 이 경우엔 그렇게 나쁘지 않지만, 시그니처에서 타입 매개변수를 한 번만 사용하는 것은 종종 코드에서 냄새를 풍긴다.

그래서 TypeScript 5.4에서는 새로운 `NoInfer<T>` 유틸리티 타입을 도입했다. 타입을 `NoInfer<...>` 로 감싸면 TypeScript에게 내부 타입을 파고들어 타입 추론 후보를 찾지 말라는 신호를 보낸다.

`NoInfer`를 사용하여 `createStreetLight`를 다음과 같이 재작성할 수 있다.

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: NoInfer<C>) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

추론을 위해 탐색되는 `defaultColor` 타입을 제외하면 `"blue"`가 추론 후보가 되지 않으며 타입 체커가 이를 거부할 수 있다.

## `Object.groupBy`와 `Map.groupBy`

TypeScript 5.4는 JavaScript의 새로운 `Object.groupBy` 및 `Map.groupBy` 정적 메서드에 대한 선언을 추가한다.

`Object.groupBy`는 이터러블과 각 요소를 어느 "그룹"에 배치할지 결정하는 함수를 받는다. 이 함수는 각각의 고유한 그룹에 대해 "키"를 만들어야 하며, `Object.groupBy`는 해당 키를 사용하여 모든 키가 원래 요소가 있는 배열에 매핑되는 객체를 만든다.

따라서 다음 자바스크립트는

```ts
const array = [0, 1, 2, 3, 4, 5];

const myObj = Object.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even": "odd";
});
```

이렇게 작성하는 것과 동일하다.

```ts
const myObj = {
    even: [0, 2, 4],
    odd: [1, 3, 5],
};
```

`Map.groupBy`도 비슷하지만 일반 객체 대신 맵을 생성한다. `Map`의 보증이 필요하거나 `Map`을 기대하는 API를 다루거나 자바스크립트에서 프로퍼티 이름으로 사용할 수 있는 키뿐만 아니라 그룹화를 위해 모든 종류의 키를 사용해야 하는 경우 이 방법이 더 바람직할 수 있다.

```ts
const myObj = Map.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even" : "odd";
});
```

이전과 마찬가지로 동일한 방법으로 `myObj`를 만들 수 있다

```ts
const myObj = new Map();

myObj.set("even", [0, 2, 4]);
myObj.set("odd", [1, 3, 5]);
```

위의 `Object.groupBy` 예제에서 생성된 객체는 모든 선택적 프로퍼티를 사용한다는 점에 유유의하자.

```ts
interface EvenOdds {
    even?: number[];
    odd?: number[];
}

const myObj: EvenOdds = Object.groupBy(...);

myObj.even;
//    ~~~~
// Error to access this under 'strictNullChecks'.
```

모든 키가 그룹별로 생성되었다는 것을 일반적인 방법으로 보장할 수 있는 방법이 없기 때문이다.

또한 이러한 메서드는 `target`을 `esnext`로 구성하거나 `lib` 설정을 조정해야만 액세스할 수 있다. 결국 안정적인 `es2024` 타겟에서 사용할 수 있을 것으로 예상된다.

## `--moduleResolution bundler` 및 `--module preserve`에서 `require()` 호출 지원

TypeScript에는 최신 번들러가 가져오기 경로가 참조하는 파일을 파악하는 방식을 모델링하기 위한 `bundler`라는 `moduleResolution` 옵션이 있다. 이 옵션의 한계 중 하나는 `--module esnext`와 쌍을 이루어야 하므로 `import ... = require(...)` 구문을 사용할 수 없다.

```ts
// previously errored
import myModule = require("module/path");
```

표준 ECMAScript `import` 만 사용할 계획이라면 큰 문제가 되지 않을 수 있지만, 조건부 내보내기가 포함된 패키지를 사용할 때는 차이가 있다..

TypeScript 5.4에서는 이제 `module` 설정을 `preserve`라는 새로운 옵션으로 설정할 때 `require()`를 사용할 수 있다.

`--module preserve`과 `--moduleResolution` 번들러는 Bun과 같은 번들러와 런타임이 허용하는 것과 모듈 조회를 수행하는 방법을 보다 정확하게 모델링한다. 실제로 `--module preserve`를 사용할 때 `bundler` 옵션은 암시적으로 `--moduleResolution`에 대해 설정됩니다(`--esModuleInterop` 및 `--resolveJsonModule`과 함께).

```json
{
    "compilerOptions": {
        "module": "preserve",
        // ^ also implies:
        // "moduleResolution": "bundler",
        // "esModuleInterop": true,
        // "resolveJsonModule": true,

        // ...
    }
}
```

`--module preserve`에서는 ECMAScript `import`가 항상 그대로 전송되며, `import ... = require(...)`는 `require()` 호출로 전송된다(실제로는 코드에 번들러를 사용할 가능성이 높으므로 `emit`시에 TypeScript를 사용하지 않을 수도 있지만). 이는 포함 파일의 파일 확장자에 관계없이 적용된다. 따라서 이 코드의 출력은 아래와 같다.

```ts
// 이렇게 작성하면
import * as foo from "some-package/foo";
import bar = require("some-package/bar");

// 이렇게 된다.
import * as foo from "some-package/foo";
var bar = require("some-package/bar");
```

이것은 또한 선택한 구문에 따라 조건부 내보내기가 일치하는 방식이 결정된다는 것을 의미한다. 따라서 위의 예에서 `some-package`의 `package.json`은 다음과 같다.

```json
{
  "name": "some-package",
  "version": "0.0.1",
  "exports": {
    "./foo": {
        "import": "./esm/foo-from-import.mjs",
        "require": "./cjs/foo-from-require.cjs"
    },
    "./bar": {
        "import": "./esm/bar-from-import.mjs",
        "require": "./cjs/bar-from-require.cjs"
    }
  }
}
```

TypeScript는 이러한 경로를 `[...]/some-package/esm/foo-from-import.mjs` 및 `[...]/some-package/cjs/bar-from-require.cjs`로 확인한다.

## Import Attribues 및 Assertions 확인

이제 Import Attribues와 Assertions이 글로벌 `ImportAttributes` 타입에 대해 검사된다. 즉, 이제 런타임이 Import Attribues를 더 정확하게 설명할 수 있다.


```ts
// In some global file.
interface ImportAttributes {
    type: "json";
}

// In some other module
import * as ns from "foo" with { type: "not-json" };
//                                     ~~~~~~~~~~
// error!
//
// Type '{ type: "not-json"; }' is not assignable to type 'ImportAttributes'.
//  Types of property 'type' are incompatible.
//    Type '"not-json"' is not assignable to type '"json"'.
```

## 누락된 매개변수 추가를 위한 빠른 수정

이제 TypeScript에 인수가 너무 많아 호출되는 함수에 새 매개변수를 추가하는 빠른 수정 기능이 추가되었다.

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/0b40cc19-55c7-4506-a812-acd590c8c9e5)

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/33d3ba25-db3a-4d1c-a07c-80cd2d5512f5)

이는 현재 번거로울 수 있는 여러 기존 함수를 통해 새 인수를 스레딩할 때 유용할 수 있다.

## 하위 경로 가져오기에 대한 자동 가져오기 지원

Node.js에서 `package.json`은 imports라는 필드를 통해 "하위 경로 가져오기"라는 기능을 지원한다. 이는 패키지 내부의 경로를 다른 모듈 경로로 다시 매핑하는 방법이다. 개념적으로는 특정 모듈 번들러와 로더가 지원하는 기능인 경로 매핑과 매우 유사하며, 타입스크립트는 `paths`라는 기능을 통해 이를 지원한다. 유일한 차이점은 하위 경로 가져오기는 항상 `#`로 시작해야 한다는 것이다.

TypeScript의 자동 가져오기 기능은 이전에는 `imports` 시 경로를 고려하지 않았기 때문에 불편할 수 있었다. 대신 사용자가 `tsconfig.json`에서 경로를 수동으로 정의해야 했다. 이제 TypeScript의 자동 가져오기 기능이 하위 경로 가져오기를 지원한다!

## TypeScript 5.0 사용 중단으로 인한 향후 변경 사항
TypeScript 5.0에서는 다음 옵션 및 동작이 더 이상 사용되지 않는다

- `charset`
- `target: ES3`
- `importsNotUsedAsValues`
- `noImplicitUseStrict`
- `noStrictGenericChecks`
- `keyofStringsOnly`
- `suppressExcessPropertyErrors`
- `suppressImplicitAnyIndexErrors`
- `out`
- `preserveValueImports`
- 프로젝트 참조의 `prepend`
- 암시적으로 OS에 특화된 `newLine`

이를 계속 사용하려면 TypeScript 5.0 및 기타 최신 버전을 사용하는 개발자는 `"5.0"`이라는 값으로 `ignoreDeprecations`라는 새 옵션을 지정해야 했다.

그러나 TypeScript 5.4는 이러한 기능이 정상적으로 계속 작동하는 마지막 버전이 될 것이다. TypeScript 5.5(2024년 6월 예정)에서는 이러한 옵션이 하드 에러가 되어 이를 사용하는 코드를 마이그레이션해야 한다.

## 주목할 만한 변화

이 섹션에서는 업그레이드의 일부로 인지하고 이해해야 하는 일련의 주목할 만한 변경 사항을 강조한다. 사용 중단, 제거 및 새로운 제한 사항이 강조 표시되는 경우도 있다. 또한 기능적으로 개선되었지만 새로운 오류를 발생시켜 기존 빌드에 영향을 줄 수 있는 버그 수정도 포함될 수 있다.

### `lib.d.ts` 변경 사항

DOM용으로 생성된 타입은 코드베이스의 타입 검사에 영향을 미칠 수 있다. 자세한 내용은 TypeScript 5.4의 DOM 업데이트를 참조하세요.

### 보다 정확한 조건부 타입 제약 조건

다음 코드는 더 이상 함수 `foo`에서 두 번째 변수 선언을 허용하지 않는다.

```ts
type IsArray<T> = T extends any[] ? true : false;

function foo<U extends object>(x: IsArray<U>) {
    let first: true = x;    // Error
    let second: false = x;  // Error, but previously wasn't
}
```

이전에는 TypeScript가 `second`를 이니셜라이저로 검사할 때 `IsArray<U>`가 단위 타입에 할당 가능한지 `false`인지 확인해야 했다. `IsArray<U>`는 명백한 방식으로 호환되지 않지만 TypeScript는 해당 타입의 제약 조건도 살펴본다. 다음과 같은 `T extends Foo ? TrueBranch : FalseBranch` 조건부 타입에서, 여기서 `T`가 제네릭인 경우 타입 시스템은 `T`의 제약 조건을 살펴보고 `T` 자체에 대입한 후 참 또는 거짓 분기를 결정한다.

하지만 이 동작은 지나치게 열성적이어서 부정확했다. `T`의 제약조건을 `Foo`에 할당할 수 없다고 해서 할당할 수 있는 것으로 인스턴스화되지 않는다는 의미는 아니다. 따라서 더 올바른 동작은 `T`가 절대 또는 항상 `Foo`를 확장하지 않는다는 것을 증명할 수 없는 경우 조건형의 제약 조건에 대한 공용체 타입을 생성하는 것이다.

타입스크립트 5.4는 이보다 정확한 동작을 채택했다. 이것이 실제로 의미하는 바는 일부 조건부 타입 인스턴스가 더 이상 해당 분기와 호환되지 않는다는 것을 발견할 수 있다는 것이다.

### 타입 변수와 Primitive 타입 간의 교집합을 보다 공격적으로 줄이기

이제 타입 변수의 제약 조건이 해당 Primitive와 겹치는 방식에 따라 타입 변수와 프리미티브와의 교집합을 보다 적극적으로 줄인다.

```ts
declare function intersect<T, U>(x: T, y: U): T & U;

function foo<T extends "abc" | "def">(x: T, str: string, num: number) {

    // Was 'T & string', now is just 'T'
    let a = intersect(x, str);

    // Was 'T & number', now is just 'never'
    let b = intersect(x, num)

    // Was '(T & "abc") | (T & "def")', now is just 'T'
    let c = Math.random() < 0.5 ?
        intersect(x, "abc") :
        intersect(x, "def");
}
```

### 보간을 사용한 템플릿 문자열 검사 개선

이제 TypeScript가 템플릿 문자열 타입의 placeholder 슬롯에 문자열을 할당할 수 있는지 여부를 더 정확하게 확인한다.

```ts
function a<T extends {id: string}>() {
    let x: `-${keyof T & string}`;
    
    // Used to error, now doesn't.
    x = "-id";
}
```

이 동작이 더 바람직하지만 이러한 규칙 변경을 쉽게 목격할 수 있는 조건부 타입과 같은 구문을 사용하는 코드에서 코드가 손상될 수 있다.

### 타입 전용 임포트가 로컬 값과 충돌할 때 발생하는 오류

이전에는 TypeScript에서 `Something`에 대한 임포트가 타입만 참조하는 경우 `isolatedModules`에서 다음 코드가 허용되었다.

```ts
import { Something } from "./some/path";

let Something = 123;
```

그러나 단일 파일 컴파일러는 런타임에 코드가 실패하도록 보장되어 있더라도 가져오기를 삭제하는 것이 "안전한지" 여부를 판단하는 것은 안전하지 않다. TypeScript 5.4에서 이 코드는 다음과 같은 오류를 트리거한다.

```ts
Import 'Something' conflicts with local value, so must be declared with a type-only import when 'isolatedModules' is enabled.
```

수정 방법은 로컬에서 이름을 바꾸거나 오류에 명시된 대로 가져오기에 `type` 수정자를 추가하는 것이다.

```ts
import type { Something } from "./some/path";

// or

import { type Something } from "./some/path";
```

### 새로운 열거형 할당 가능성 제한

두 열거형에 선언된 이름과 열거형 멤버 이름이 동일한 경우 이전에는 항상 호환되는 것으로 간주되었지만, 값을 알 수 있는 경우 TypeScript에서 자동으로 다른 값을 가질 수 있도록 허용했다.

TypeScript 5.4에서는 값이 알려진 경우 값이 동일해야 함으로써 이 제한이 강화되었다.

```ts
namespace First {
    export enum SomeEnum {
        A = 0,
        B = 1,
    }
}

namespace Second {
    export enum SomeEnum {
        A = 0,
        B = 2,
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // Both used to be compatible - no longer the case,
    // TypeScript errors with something like:
    //
    //  Each declaration of 'SomeEnum.B' differs in its value, where '1' was expected but '2' was given.
    x = y;
    y = x;
}
```

또한 열거형 멤버 중 하나에 정적으로 알려진 값이 없는 경우에 대한 새로운 제한 사항이 있다. 이러한 경우 다른 열거형은 적어도 암시적으로 숫자이거나(예: 정적으로 확인된 이니셜라이저가 없음), 명시적으로 숫자이거나(즉, 타입스크립트가 값을 숫자로 확인할 수 있음) 둘 중 하나여야 한다. 실질적으로 이것이 의미하는 바는 문자열 열거형 멤버는 같은 값의 다른 문자열 열거형과만 호환된다는 것이다.

```ts
namespace First {
    export declare enum SomeEnum {
        A,
        B,
    }
}

namespace Second {
    export declare enum SomeEnum {
        A,
        B = "some known string",
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // 둘 다 예전에는 호환되었지만 더 이상 호환되지 않는다.
    // 다음과 같은 타입스크립트 오류가 발생한다.
    //
    //  'SomeEnum.B'의 한 값은 '"일부 알려진 문자열"'이고 다른 값은 알 수 없는 숫자 값으로 가정한다.
    x = y;
    y = x;
}
```

### 열거형 멤버의 이름 제한

TypeScript는 더 이상 열거형 멤버에 `Infinity`, `-Infinity` 또는 `NaN`이라는 이름을 사용할 수 없다.

```ts
// Errors on all of these:
//
//  An enum member cannot have a numeric name.
enum E {
    Infinity = 0,
    "-Infinity" = 1,
    NaN = 2,
}
```


