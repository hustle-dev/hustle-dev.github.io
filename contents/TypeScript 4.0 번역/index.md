---
title: TypeScript 4.0 번역
description: TypeScript 4.0 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2023-01-24
slug: /translate-ts-4-0
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-0.html

## 가변 인자 튜플 타입

두 개의 배열 또는 튜플 타입을 결합하여 새로운 배열을 만드는 JS의 `concat` 함수에 대해서 생각해보자.

```ts
function concat(arr1, arr2) {
  return [...arr1, ...arr2];
}
```

또한 배열 또는 튜플을 인수로 가져와 첫 번째 원소를 제외한 나머지를 반환하는 `tail` 함수에 대해서도 생각해보자.

```ts
function tail(arg) {
  const [_, ...result] = arg;
  return result;
}
```

TS에서 이 두함수의 타입을 어떻게 정의할 수 있을까?

`concat`의 경우, 이전 버전에서는 여러 개의 오버로드를 작성하는 방법이 유일했다.

```ts
function concat(arr1: [], arr2: []): [];
function concat<A>(arr1: [A], arr2: []): [A];
function concat<A, B>(arr1: [A, B], arr2: []): [A, B];
function concat<A, B, C>(arr1: [A, B, C], arr2: []): [A, B, C];
function concat<A, B, C, D>(arr1: [A, B, C, D], arr2: []): [A, B, C, D];
function concat<A, B, C, D, E>(arr1: [A, B, C, D, E], arr2: []): [A, B, C, D, E];
function concat<A, B, C, D, E, F>(arr1: [A, B, C, D, E, F], arr2: []): [A, B, C, D, E, F];
```

이 오버로드들의 두 번째 배열은 전부 비어있다. 이때, `arr2`가 하나의 인자를 가지고 있는 경우를 추가해보자.

```ts
function concat<A2>(arr1: [], arr2: [A2]): [A2];
function concat<A1, A2>(arr1: [A1], arr2: [A2]): [A1, A2];
function concat<A1, B1, A2>(arr1: [A1, B1], arr2: [A2]): [A1, B1, A2];
function concat<A1, B1, C1, A2>(arr1: [A1, B1, C1], arr2: [A2]): [A1, B1, C1, A2];
function concat<A1, B1, C1, D1, A2>(arr1: [A1, B1, C1, D1], arr2: [A2]): [A1, B1, C1, D1, A2];
function concat<A1, B1, C1, D1, E1, A2>(arr1: [A1, B1, C1, D1, E1], arr2: [A2]): [A1, B1, C1, D1, E1, A2];
function concat<A1, B1, C1, D1, E1, F1, A2>(arr1: [A1, B1, C1, D1, E1, F1], arr2: [A2]): [A1, B1, C1, D1, E1, F1, A2];
```

이런 오버로딩 함수들은 분명 비합리적이다. 불행히도, `tail` 함수를 타이핑할 때도 이와 비슷한 문제에 직면하게 된다.

이것은 '천 개의 오버로드로 인한 죽음'이라고 불리는 하나의 경우이며, 심지어 대부분의 문제를 해결하지 못한다. 우리가 작성하고자 하는 만큼의 오버로드에 한해서만 올바른 타입을 제공한다. 포괄적인 케이스를 만들고 싶다면, 다음과 같은 오버로드가 필요하다.

```ts
function concat<T, U>(arr1: T[], arr2: U[]): Array<T | U>;
```

그러나 위 시그니처는 튜플을 사용할 때 입력 길이나 요소 순서에 대한 어떤 것도 처리하지 않는다.

TS 4.0은 타입 추론 개선을 포함한 두 가지 핵심적인 변화를 도입해 이러한 타이핑을 가능하도록 만들었다.

첫 번째 변화는 튜플 타입 구문의 스프레드 연산자에 제네릭 타입을 사용할 수 있다는 점이다. 우리가 작동하는 실제 타입을 모르더라도 튜플과 배열에 대한 고차함수를 표현할 수 있다는 뜻이다. 이러한 튜플 타입에서 제네릭 스프레드 연산자가 인스턴스화(혹은, 실제 타입으로 대체)되면 또 다른 배열이나 튜플 타입 세트를 생산할 수 있다.

예를 들어, `tail` 같은 함수를 '천 개의 오버로드로 인한 죽음'이슈 없이 타이핑 할 수 있게 된다.

```ts
function tail<T extends any[]>(arr: readonly [any, ...T]) {
  const [_ignored, ...rest] = arr;
  return rest;
}

const myTuple = [1, 2, 3, 4] as const;
const myArray = ['hello', 'world'];

const r1 = tail(myTuple);

const r1: [2, 3, 4];

const r2 = tail([...myTuple, ...myArray] as const);

const r2: [2, 3, 4, ...string[]];
```

두 번째 변화는 요소의 끝뿐만 아니라, rest element는 튜플의 어느 곳에서나 발생할 수 있다는 것이다.

```ts
type Strings = [string, string];
type Numbers = [number, number];
type StrStrNumNumBool = [...Strings, ...Numbers, boolean];
```

이전의 TS는 다음과 같은 오류를 생성했다.

```ts
A rest element must be last in a tuple type.
```

그러나 TS 4.0에선 이런 제한이 완화되었다.

길이가 정해지지 않은 타입을 확장하려고 할 때, 결과의 타입은 제한되지 않으며, 다음 모든 요소가 결과의 나머지 요소에 포함되는 점에 유의하라.

```ts
type Strings = [string, string];
type Numbers = number[];
type Unbounded = [...Strings, ...Numbers, boolean];
//   ^ = type Unbounded = [string, string, ...(number | boolean)[]]
```

이 두 가지 동작을 함께 결합하여, `concat`에 대해 타입이 제대로 정의된 시그니처를 작성할 수 있다.

```ts
type Arr = readonly any[];

function concat<T extends Arr, U extends Arr>(arr1: T, arr2: U): [...T, ...U] {
  return [...arr1, ...arr2];
}
```

하나의 시그니처가 조금 길더라도, 반복할 필요가 없는 하나의 시그니처일 뿐이며, 모든 배열과 튜플에서 예측 가능한 행동을 제공한다.

이 기능은 그 자체만으로 매우 훌륭하지만, 조금 더 정교한 시나리오에서 빛을 발한다. 예를들어, [함수의 매개변수를 부분적으로 적용하여 새로운 함수를 반환하는](https://en.wikipedia.org/wiki/Partial_application) `partialCall` 함수가 있다고 생각해보자. `partialCall`은 다음과 같은 함수이다. - `f`가 예상하는 몇 가지 인수와 함께 `f`라고 부르자. 그 후, `f`가 필요로하는 다른 인수를 가지고, 그것을 받을 때 `f`를 호출하는 새로운 함수를 반환한다.

```ts
function partialCall(f, ...headArgs) {
  return (...tailArgs) => f(...headArgs, ...tailArgs);
}
```

TS 4.0은 나머지 파라미터들과 튜플 원소들에 대한 추론 프로세스를 개선하여 타입을 지정할 수 있고 '그냥 동작'하도록 할 수 있다.

```ts
type Arr = readonly unknown[];

function partialCall<T extends Arr, U extends Arr, R>(f: (...args: [...T, ...U]) => R, ...headArgs: T) {
  return (...tailArgs: U) => f(...headArgs, ...tailArgs);
}
```

이 경우, `partialCall`은 처음에 취할 수 있는 파라미터와 할 수 없는 파라미터를 파악하고, 남은 것들을 적절히 수용하고 거부하는 함수들을 반환한다.

```ts
type Arr = readonly unknown[];

function partialCall<T extends Arr, U extends Arr, R>(f: (...args: [...T, ...U]) => R, ...headArgs: T) {
  return (...tailArgs: U) => f(...headArgs, ...tailArgs);
}
// ---cut---
const foo = (x: string, y: number, z: boolean) => {};

const f1 = partialCall(foo, 100);

const f2 = partialCall(foo, 'hello', 100, true, 'oops');

// 작동합니다!
const f3 = partialCall(foo, 'hello');
//    ^ = const f3: (y: number, z: boolean) => void

// f3으로 뭘 할 수 있을까요?

// 작동합니다!
f3(123, true);
f3();
f3(123, 'hello');
```

가변 인자 튜플 타입은 특히 기능 구성과 관련하여 많은 새로운 흥미로운 패턴을 가능하게 한다. 우리는 JS에 내장된 `bind` 메서드의 타입 체킹을 더 잘하기 위해 이를 활용할 수 있을 것이라고 기대한다. 몇 가지 다른 추론 개선 및 패턴들도 여기에 포함되어 있고, 가변 인자 튜플에 대해 더 알아보고 싶다면, [PR](https://github.com/microsoft/TypeScript/pull/39094)을 참고하라.

## 라벨링된 튜플 요소

튜플 타입과 매개 변수 목록에 대해 개선하는 것은 일반적인 JS 관용구에 대한 타입 유효성 검사를 강화시켜주기 때문에 중요하다. - 실제로 인수 목록을 자르고 다른 함수로 전달만 해주면 된다. 나머지 매개 변수에 튜플 타입을 사용할 수 있다는 생각은 아주 중요하다.

예를 들어, 튜플 타입을 나머지 매개 변수로 사용하는 다음 함수는..

```ts
function foo(...args: [string, number]): void {
  // ...
}
```

다음 함수와 다르지 않아야 한다.

```ts
function foo(arg0: string, arg1: number): void {
  // ...
}
```

`foo`의 모든 호출자에 대해서도

```ts
foo("hello", 42);

foo("hello", 42, true);
Expected 2 arguments, but got 3.
foo("hello");
Expected 2 arguments, but got 1.
```

그러나 차이점이 보이기 시작한 부분은 가독성이다. 첫 번째 예시에선, 첫 번째와 두 번째 요소에 대한 매개 변수 이름이 없다. 타입검사에는 전혀 영향이 없지만, 튜플 위치에 라벨이 없는 것은 의도를 전달하기 어려워 사용하기 어렵다.

TS 4.0에서는 튜플 타입에 라벨을 제공한다.

```ts
type Range = [start: number, end: number];
```

매개 변수 목록과 튜플 타입 사이의 연결을 강화하기 위해, 나머지 요소와 선택적 요소에 대한 구문이 매개 변수 목록의 구문을 반영한다.

```ts
type Foo = [first: number, second?: string, ...rest: any[]];
```

라벨링 된 튜플을 사용할 때는 몇 가지 규칙이 있다. 하나는 튜플 요소를 라벨링 할 때, 튜플에 있는 다른 모든 요소들 역시 라벨링 되어야 한다.

```ts
type Bar = [first: string, number];
Tuple members must all have names or all not have names.
```

당연하게, 라벨은 구조 분해할 때 변수 이름을 다르게 지정할 필요가 없다. 이것은 순전히 문서화와 도구를 위해 존재한다.

```ts
function foo(x: [first: string, second: number]) {
  // ...

  // note: we didn't need to name these 'first' and 'second'
  const [a, b] = x;
  a;

  const a: string;
  b;

  const b: number;
}
```

전반적으로 라벨링된 튜플은 안전한 타입 방식으로 오버로드를 구현하는 것과 튜플과 인수 목록의 패턴을 활용할 때 편리하다. 사실, TS 에디터 지원은 가능한 경우 오버로드로 표시하려 한다.

![](https://velog.velcdn.com/images/hustle-dev/post/0893e7d1-5145-485e-b043-7257d3eed017/image.png)

더 알고 싶다면, 라벨링된 튜플 요소에 대한 [PR](https://github.com/microsoft/TypeScript/pull/38234)을 확인하라.

## 생성자로부터 클래스 프로퍼티 타입 추론하기

TS 4.0에서는 `noImplicitAny`가 활성화되었을 때 클래스 내의 프로퍼티 타입을 결정하기 위해 제어 흐름 분석을 사용할 수 있다.

```ts
class Square {
  // Previously both of these were any
  area;

  // (property) Square.area: number
  sideLength;

  // (property) Square.sideLength: number
  constructor(sideLength: number) {
    this.sideLength = sideLength;
    this.area = sideLength ** 2;
  }
}
```

생성자의 모든 경로가 인스턴스 멤버에 할당한 것이 아닐경우, 프로퍼티는 잠재적으로 `undefined`가 된다.

```ts
class Square {
  sideLength;

  // (property) Square.sideLength: number | undefined

  constructor(sideLength: number) {
    if (Math.random()) {
      this.sideLength = sideLength;
    }
  }

  get area() {
    return this.sideLength ** 2;
    // Object is possibly 'undefined'.
  }
}
```

> 위 경우는 random 함수에 의해 `sideLength`에 값이 할당되지 않을 수 있음.

더 많은 내용이 있는 경우(e.g `initialize` 메서드 등이 있는 경우), `strictPropertyInitialization` 모드에서는 확정적 할당 단언(`!`)에 따라 명시적으로 타입을 선언해야 한다.

```ts
class Square {
  // definite assignment assertion
  //        v
  sideLength!: number;
  // type annotation

  constructor(sideLength: number) {
    this.initialize(sideLength);
  }

  initialize(sideLength: number) {
    this.sideLength = sideLength;
  }

  get area() {
    return this.sideLength ** 2;
  }
}
```

더 자세한 것은 [PR](https://github.com/microsoft/TypeScript/pull/37920)을 확인하라.

## 단축 평가 할당 연산자

JS와 많은 언어는 복합 할당(compound assignment) 연산자라고 불리는 연산자 집합을 지원한다. 복합 할당 연산자는 두 개의 인수에 연산자를 적용한 다음 결과를 왼쪽에 할당한다. 이전에 아래와 같은 것을 본 적이 있을 것이다.

```ts
// Addition
// a = a + b
a += b;
// Subtraction
// a = a - b
a -= b;
// Multiplication
// a = a * b
a *= b;
// Division
// a = a / b
a /= b;
// Exponentiation
// a = a ** b
a **= b;
// Left Bit Shift
// a = a << b
a <<= b;
```

JS의 많은 연산자에 위와 같은 할당 연산자가 있다! 그러나 최근까지도 논리 and 연산자 (`&&`), 논리 or 연산자 (`||`) 및 null과 같은 것을 병합하는 연산자 (nullish coalescing) (`??`)의 세 가지 주목할만한 예외가 있었다.

이것이 TS 4.0이 새로운 할당 연산자 `&&=`, `||=`, `??=`를 추가하는 새로운 ECMAScript 기능을 지원하는 이유이다.

이러한 연산자는 사용자가 다음과 같은 코드를 작성할 수 있는 모든 예를 대체하는 데 유용하다.

```ts
a = a && b;
a = a || b;
a = a ?? b;
```

혹은 아래와 비슷한 `if` 블록

```ts
// could be 'a ||= b'
if (!a) {
  a = b;
}
```

우리가 본(혹은 직접 작성한) 코드 패턴 중 필요한 경우에만 값을 지연 초기화 시키기 위한 패턴도 있다.

```ts
let values: string[];
(values ?? (values = [])).push('hello');
// After
(values ??= []).push('hello');
```

드물지만 부수 효과가 있는 getter 또는 setter를 사용하는 경우 이러한 연산자가 필요한 경우에만 할당을 수행한다는 점에 유의할 필요가 있다. 그런 의미에서 연산자의 오른쪽이 '단축'될 뿐만 아니라 할당 자체도 마찬가지이다.

```ts
obj.prop ||= foo();
// roughly equivalent to either of the following
obj.prop || (obj.prop = foo());
if (!obj.prop) {
  obj.prop = foo();
}
```

[다음 예시를 실행해보아라.](https://www.typescriptlang.org/play?ts=Nightly#code/MYewdgzgLgBCBGArGBeGBvAsAKBnmA5gKawAOATiKQBQCUGO+TMokIANkQHTsgHUAiYlChFyMABYBDCDHIBXMANoBuHI2Z4A9FpgAlIqXZTgRGAFsiAQg2byJeeTAwAslKgSu5KWAAmIczoYAB4YAAYuAFY1XHwAXwAaWxgIEhgKKmoAfQA3KXYALhh4EA4iH3osWM1WCDKePkFUkTFJGTlFZRimOJw4mJwAM0VgKABLcBhB0qCqplr63n4BcjGCCVgIMd8zIjz2eXciXy7k+yhHZygFIhje7BwFzgblgBUJMdlwM3yAdykAJ6yBSQGAeMzNUTkU7YBCILgZUioOBIBGUJEAHwxUxmqnU2Ce3CWgnenzgYDMACo6pZxpYIJSOqDwSkSFCYXC0VQYFi0NMQHQVEA) 예시를 통해 항상 할당을 수행하는 것과 어떻게 다른지 확인해보아라.

```ts
const obj = {
  get prop() {
    console.log('getter has run');

    // Replace me!
    return Math.random() < 0.5;
  },
  set prop(_val: boolean) {
    console.log('setter has run');
  },
};

function foo() {
  console.log('right side evaluated');
  return true;
}

console.log('This one always runs the setter');
obj.prop = obj.prop || foo();

console.log('This one *sometimes* runs the setter');
obj.prop ||= foo();
```

> 위는 항상 할당을 하여 setter가 계속 실행되는데, 아래의 것은 `obj.prop`의 값이 `false`인 경우에만 `foo` 함수가 실행되고, 세터가 실행된다.

기여해주신 커뮤니티 멤버 [Wenlu Wang](https://github.com/Kingwl)님에게 큰 감사를 표한다.

더 자세한 내용을 보고 싶다면 [이 PR을 확인하라.](https://github.com/microsoft/TypeScript/pull/37727) [TC39 제안 레포지토리에서도 이 기능을 확인할 수 있다.](https://github.com/tc39/proposal-logical-assignment/)

## catch 구문에서 unknown Clause 바인딩

`catch` 구문 바인딩에 대해서는 이미 TS의 시작부터 언제나 `any` 타입 이었다. 이는 TS가 그 안에서 모든 것을 허용한다는 것을 의미한다.

```ts
try {
  // Do some work
} catch (x) {
  // x has type 'any' - have fun!
  console.log(x.message);
  console.log(x.toUpperCase());
  x++;
  x.yadda.yadda.yadda();
}
```

catch 구문의 변수 타입을 `any`로 지정하는 것은 우리의 오류 처리 코드에서 더 많은 오류를 핸들링하는 경우 원하지 않는 행동을 보일 수 있다. 이러한 변수는 기본적으로 `any` 타입을 가지기 때문에 유효하지 않은 연산에서 오류를 출력하지 않는다.

그래서 TS 4.0에서는 catch 구문 변수의 타입의 `unknown`으로 지정할 수 있다. `unknown`은 `any`보다 안전하며, 값을 조작하기 전에 타입 검사를 수행해야 한다는 것을 알려준다.

```ts
try {
  // ...
} catch (e: unknown) {
  // Can't access values on unknowns
  console.log(e.toUpperCase());
Object is of type 'unknown'.

  if (typeof e === "string") {
    // We've narrowed 'e' down to the type 'string'.
    console.log(e.toUpperCase());
  }
}
```

`catch` 구문 안의 변수 타입은 기본적으로 변경되지 않지만, 사용자가 이 동작을 선택할 수 있도록 새로운 `strict`모드 플래그를 생각해볼 수 있다. 그러나, `catch` 구문 안 변수에 명시적으로 `:any` 또는 `:unknown` 주석을 부여하도록 `lint` 규칙을 작성할 수 있다.

더 자세한 것은 [이 기능의 변경사항을 참조하라.](https://github.com/microsoft/TypeScript/pull/39015)

## 커스텀 JSX Factories

JSX를 사용할 때, Fragment는 JSX 요소의 한 유형으로, 여러 개의 자식 요소를 반환할 수 있는 유형의 JSX 요소이다. TS에서 Fragment를 처음 구현 했을 때, 다른 라이브러리가 어떻게 사용할지에 대해서는 잘 몰랐다. 지금은 JSX를 사용하는 것을 권장하며 Fragment를 지원하는 대부분의 다른 라이브러리들도 비슷한 API 형태를 가지고 있다.

TS 4.0에서 사용자는 새로운 jsxFragmentFactory 옵션을 통해 Fragment 팩토리를 사용자 정의 할 수 있다.

예를들어, 다음 `tsconfig.json` 파일은 TS를 React와 호환되도록 JSX를 변환하도록 알려준다. 그리고 각 팩토리 호출을 `React.createElement` 대신 `h`로, `React.Fragment` 대신 `Fragment`로 전환한다.

> 이건 잘 사용하면 좋을 것 같다.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "jsx": "react",
    "jsxFactory": "h",
    "jsxFragmentFactory": "Fragment"
  }
}
```

파일 단위로 다른 JSX 팩토리가 필요한 경우, `/** @jsxFrag */` pragma comment를 사용할 수 있다. 예를 들어, 다음 예제는 파일 단위로 JSX 팩토리를 지정하는 방법이다.

```ts
// Note: these pragma comments need to be written
// with a JSDoc-style multiline syntax to take effect.

/** @jsx h */
/** @jsxFrag Fragment */

import { h, Fragment } from 'preact';

export const Header = (
  <>
    <h1>Welcome</h1>
  </>
);
```

위 예제는 아래와 같은 JS 결과물로 변환된다.

```ts
import React from 'react';
export const Header = React.createElement(React.Fragment, null, React.createElement('h1', null, 'Welcome'));
```

우리는 이 PR을 보내고 우리 팀과 인내심을 가지고 함께 일해준 커뮤니티 멤버 [Noj Vek](https://github.com/nojvek)에게 큰 감사를 드린다.

자세한 내용은 [PR](https://github.com/microsoft/TypeScript/pull/38720)을 참조하라.

## 빌드 모드에서 --noEmitOnError와 함께 속도 개선

이전에는 `noEmitOnError` 플래그를 사용할 때 `incremental` 오류가 있는 이전 컴파일 후 프로그램을 컴파일 하면 매우 느리게 되낟. 이는 이전 컴파일 정보가 `noEmitOnError` 플래그 기반으로, `.tsbuildinfo` 파일에 캐시되지 않기 때문이다.

TS 4.0은 이를 변경하여 이러한 상황에서 성능 향상을 기대할 수 있고, `--build` 모드 사례(`incremental`과 `noEmitOnError`를 포함)를 개선한다.

더 자세한 것은 [이 PR을 참조하라.](https://github.com/microsoft/TypeScript/pull/38853)

## --noEmit 과 함게 --incremental 사용

TS 4.0은 증분 컴파일을 사용하면서도 noEmit 플래그를 사용할 수 있도록 허용한다. 이를 통해 `.tsbuildinfo` 파일을 생성하지 않아도 증분 컴파일을 사용할 수 있어 개발 프로세스를 더욱 편리하게 할 수 있다.

## 에디터 개선

TS 컴파일러는 대부분의 주요 편집기에서 TS 자체 편집 경험을 제공하는 것뿐만 아니라 VS 편집기와 기타 편집기에서 JS 경험을 제공한다. 그래서 대부분의 우리의 작업은 개발자가 가장 많은 시간을 보내는 편집기 시나리오를 개선하는 것에 초점을 맞춘다.

편집기에서 새로운 TS/JS 기능을 사용하는 방법은 편집기마다 다르다.

- VSCode는 [TS의 다른 버전을 선택](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)할 수 있다. 또는 [JS/TS Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)을 사용하면 최신기능을 사용할 수 있다.(일반적으로 매우 안정적이다.)
- VS 2017/2019는 SDK 설치 프로그램과 [MSBuild 설치](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild)를 지원한다.
- Sublime Text 3은 [TS의 다른 버전을 선택할 수 있다.](https://github.com/microsoft/TypeScript-Sublime-Plugin#note-using-different-versions-of-typescript)

TS를 지원하는 [편집기의 부분적인 목록을 확인](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support)하여 가장 좋아하는 편집기가 새 버전을 사용할 수 있는지 여부를 자세히 확인할 수 있다.

### 옵셔널 체이닝 변환

옵셔널 체이닝은 최근에 출시된 기능중 하나로 사랑을 많이 받았다. 그래서 TS 4.0에서는 `optional chaning`과 `nullish coalescing`을 이용하는 흔한 패턴을 변환하는 새로운 refactoring을 제공한다.

![](https://velog.velcdn.com/images/hustle-dev/post/b3c3ad9c-feff-46d8-9bc6-fe74b2cd4f71/image.png)

코드의 의도를 완벽히 잡지 못할 수 있다는 점을 염두해 두길 바란다. 이는 JS에서 참/거짓에 대한 세밀한 차이 때문이다. 그러나 에디터가 TS가 사용되는 유형에 대한 정확한 지식을 가지고 있을 때, 대부분의 사용 사례에서 원래 코드의 의도를 잡는다고 생각한다.

더 자세한 내용은 [이 기능에 대한 PR을 확인하라.](https://github.com/microsoft/TypeScript/pull/39135)

> 위 형태의 코드를 옵셔널 체이닝, 널 병합 연산을 사용하는 코드로 리팩터링 하는 기능을 제공함.

### `/** @deprecated */ ` Support

TS의 편집 지원은 선언이 `/** @deprecated */` JSDoc 주석으로 표시되었을 때 인식한다. 그 정보는 완료 목록에서 표시되며 편집기가 특별히 처리할 수 있는 제안 진단으로 표시된다. VS Code와 같은 편집기에서는 사용되지 않는 값은 일반적으로 이렇게 취소선 스타일로 표시된다.

![](https://velog.velcdn.com/images/hustle-dev/post/da6e7a91-10fa-45d7-a26e-28cde8a1cda7/image.png)

## 시작 시 부분 Semantic 모드

대규모 프로젝트에서 특히 긴 시작 시간을 겪는 사용자들의 의견을 많이 들었다. 이는 _program construction_ 이라는 프로세스를 원인으로 한다. 이는 초기 root 파일 세트로 시작하여 이를 분석하고 의존성을 찾는 과정이다. 그리고 의존성을 분석하여 의존성의 의존성을 찾는 과정이다. 프로젝트가 커질수록 go-to-definition 또는 quick info와 같은 기본 편집 작업을 시작하기 전에 기다려야 할 시간이 길어진다.

이러한 문제를 해결하기 위해 편집기에서 전체 언어 서비스가 로드될 때까지 일부 경험을 제공하는 새로운 모드를 개발하고 있다. 핵심 아이디어는 편집기에서 현재 편집기에 열려있는 파일만 보는 가벼운 일부의 서버를 실행하는 것이다.

정확히 어떤 성능 향상을 볼 수 있을지는 말하기 어렵지만, 사실상으로는 VSCode 베이스에서 TS가 완전히 반응하기전에 20초에서 1분 사이의 시간이 걸렸다. 반면, 새로운 일부 SemanticMode는 그 지연시간을 몇초로 줄일 수 있는 것으로 보인다. 예를들어 아래의 영상에서 왼쪽의 TS 3.9가 실행되고 오른쪽에 TS 4.0이 실행되는 것을 확인할 수 있다.

https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2020/08/partialModeFast.mp4

특히 큰 코드베이스에서 두 편집기를 다시 시작할 때, TS 3.9의 편집기는 완료 목록 또는 빠른 정보를 제공하지 않는다. 반면, TS 4.0의 편집기는 현재 편집 중인 파일에서 다양한 경험을 즉시 제공할 수 있으며, 백그라운드에서 전체 프로젝트를 로드하는 동안에도 이를 제공한다.

현재 이 모드를 지원하는 편집기는 VSCode만 있으며 VSCode Insider에는 UX 개선 사항이 추가될 예정이다. 이 경험에는 UX와 기능적인 면에서 아직 개선이 필요할 수 있다는 것을 인식하고 있으며, 개선 사항을 생각해보고 있다.

### 더 똑똑한 자동 import

자동 가져오기는 코딩을 매우 쉽게 만드는 훌륭한 기능이다. 그러나 자동 가져오기가 작동하지 않을 때마다 사용자들이 당황할 수 있다. 우리가 사용자들로부터 들은 특정 문제 중 하나는 자동 가져오기가 TS로 작성된 의존성에서 작동하지 않는 것이다. 이는 다른곳에서 명시적으로 가져오기를 작성하기 전까지는 그렇다.

자동 가져오기가 `@types` 패키지에서는 작동하는 것은 왜일까? 자체타입을 제공하는 패키지에선 작동하지 않는 것은 왜일까? 결국 자동 가져오기는 프로젝트에 이미 포함된 패키지에만 작동한다. TS에는 자동으로 `node_moduels/@types` 폴더의 패키지를 프로젝트에 추가하는 특이한 기본설정을 가지고 있기 때문에 그러한 패키지는 자동으로 가져올 수 있다. 반면에 모든 `node_moduels` 패키지를 탐색하는 것은 매우 비용이 크기 때문에 다른 패키지는 제외되었다.

이렇게 하면 새로 설치한 것을 아직 사용하지 않은 경우 자동 가져오기를 시도할 때 처음부터 불쾌한 경험을 겪게 된다.

TS 4.0은 편집기 시나리오에서 `package.json`의 `dependencies`(과 `peerDependencies`) 필드에 목록화 된 패키지를 포함하는 약간의 추가 작업을 수행한다. 이러한 패키지로부터의 정보는 자동 가져오기를 개선하는 데만 사용되며, 타입 검사와 같은 다른 것들은 변경되지 않는다. 이렇게 하면 `node_modules` 탐색의 비용을 지불하지 않고도 모든 의존성에 대한 자동 가져오기를 제공 할 수 있다. 극히 드문 경우, `package.json`에 아직 가져오지 않은 타입이 있는 의존성이 10개 이상 있는 경우, 이 기능은 자동으로 프로젝트 로딩을 늦추지 않도록 자체를 비활성화한다. 이 기능을 강제로 작동시키거나 온전히 비활성화하려면 편집기에서 설정을 할 수 있어야 한다. Visual Studio Code에서는 "Include Package JSON Auto Imports" (또는 `typescript.preferences.includePackageJsonAutoImports`) 설정을 사용할 수 있다.

![](https://velog.velcdn.com/images/hustle-dev/post/45656332-89cc-401e-a2e8-a1ebcd315382/image.png)

## 새로운 웹사이트!

TypeScript 웹사이트는 최근에 처음부터 다시 작성되어 출시되었다!

![](https://velog.velcdn.com/images/hustle-dev/post/d7ddf10b-538d-4512-9a37-6b8d68b321c8/image.png)

우리는 이미 우리의 새로운 사이트에 대해 조금 썼기 때문에, 그곳에서 더 많은 정보를 얻을 수 있다. 하지만 우리는 여전히 의견을 듣고 있고, 질문, 의견 또는 제안이 있는 경우 [웹사이트의 이슈트래커](https://github.com/microsoft/TypeScript-Website)에 그것들을 제보할 수 있다.

## 변경

### `lib.d.ts` 변경

`lib.d.ts` 선언이 변경되었다. 특히 DOM에 대한 유형이 변경되었다. 가장 큰 변화는 document.origin 제거일 수 있다. 이것은 오래된 버전의 IE와 Safari에서만 작동했고, MDN은 [self.origin](https://developer.mozilla.org/en-US/docs/Web/API/origin)을 사용하는 것을 권장한다.

### 접근자를 재정의하는 속성(및 vice versa)은 에러

이전에는 `useDefineForClassFields`를 사용할 때 속성이 접근자를 재정의하거나 접근자가 속성을 재정의하는 것이 오류에 불과했지만, 이제 TS는 기본 클래스의 getter 또는 setter를 재정의 하는 파생 클래스의 속성을 선언할 때 항상 오류를 발생시킨다.

```ts
class Base {
  get foo() {
    return 100;
  }
  set foo(value) {
    // ...
  }
}

class Derived extends Base {
  foo = 10;
  // 'foo' is defined as an accessor in class 'Base', but is overridden here in 'Derived' as an instance property.
}
```

```ts
class Base {
  prop = 10;
}

class Derived extends Base {
  get prop() {
    // 'prop' is defined as a property in class 'Base', but is overridden here in 'Derived' as an accessor.
    return 100;
  }
}
```

### `delete` 피연산자는 선택 사항이어야 한다.

`strictNullChecks`에서 삭제 연산자를 사용할 때는 피연산자는 이제 `any, unknown, never` 이거나 선택적이어야 한다.(타입에 `undefined`가 포함되어 있음) 그렇지 않고, 삭제 연산자를 사용하면 오류가 발생한다.

```ts
interface Thing {
  prop: string;
}

function f(x: Thing) {
  delete x.prop;
  // The operand of a 'delete' operator must be optional.
}
```

## TS의 Node Factory 사용은 권장하지 않는다.

TypeScript는 AST Node를 생성하는데 사용되는 "factory" 함수들을 제공하지만, TypeScript 4.0은 새로운 노드 팩토리 API를 제공한다. 그래서 TypeScript 4.0에서는 이러한 이전 함수들을 새로운 함수들로 대체하는 것을 결정했다.
