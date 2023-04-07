---
title: TypeScript 3.6 번역
description: TypeScript 3.6 Release를 번역하면서 전에 어떤 기능들이 나왔는지 학습합니다.
date: 2022-12-06
slug: /translate-ts-3-6
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-6.html

## 엄격한 제너레이터

TS 3.6은 이터레이터와 제너레이터 함수에 대해 더 엄격하게 검사를 한다. 이전 버전에서 제너레이터의 사용자들은 값이 제너레이터의 `yield`로 부터 나왔는지, `return`에 의해 반환되었는지를 구별할 방법이 없었다.

```ts
function* foo() {
  if (Math.random() < 0.5) yield 100;
  return 'Finished!';
}
let iter = foo();
let curr = iter.next();
if (curr.done) {
  // TypeScript 3.5 and prior thought this was a 'string | number'.
  // It should know it's 'string' since 'done' was 'true'!
  curr.value;
}
```

게다가 제너레이터의 `yield`의 타입이 항상 `any`라고 가정했다.

```ts
function* bar() {
  let x: { hello(): void } = yield;
  x.hello();
}
let iter = bar();
iter.next();
iter.next(123); // oops! runtime error!
```

TS 3.6에서 Checker는 이제 첫 번째 예에서 `curr.value`에 대한 올바른 타입이 문자열이어야 한다는 것을 알고 있고, 마지막 예에서 `next()`로 호출할 때 올바르게 오류를 발생시킨다. 이것은 몇 가지 새로운 타입 매개변수를 포함하도록 `Iterator` 및 `IteratorResult` 타입 선언의 일부 변경과 `Generator` 타입이라고 불리는 제너레이터를 나타내기 위해 타입스크립트가 사용하는 새로운 형식 덕분에 가능해졌다.

```ts
interface Iterator<T, TReturn = any, TNext = undefined> {
  // Takes either 0 or 1 arguments - doesn't accept 'undefined'
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}
```

이 작업을 기반으로 한 새로운 제너레이터 타입은 `return` 및 `throw` 메서드가 항상 존재하는 `Iterator`이며, 또한 반복이 가능하다.

```ts
interface Generator<T = unknown, TReturn = any, TNext = unknown> extends Iterator<T, TReturn, TNext> {
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return(value: TReturn): IteratorResult<T, TReturn>;
  throw(e: any): IteratorResult<T, TReturn>;
  [Symbol.iterator](): Generator<T, TReturn, TNext>;
}
```

`return`된 값과 `yield`된 값을 구별할 수 있도록 TS 3.6은 `IteratorResult` 유형을 식별된 유니언 타입으로 변환한다.

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

간단히 말해, 이것이 의미하는 바는 이터레이터를 직접 다룰 때 값을 적절하게 좁힐 수 있다는 것이다.

제너레이터의 `next()` 호출로 전달되는 타입을 올바르게 표현하기 위해 TS 3.6은 또한 제너레이터 함수의 본문 내에서 특정한 `yield` 사용을 추론한다.

```ts
function* foo() {
  let x: string = yield;
  console.log(x.toUpperCase());
}
let x = foo();
x.next(); // first call to 'next' is always ignored
x.next(42); // error! 'number' is not assignable to 'string'
```

명시적으로 사용하기를 원하는 경우 명시적으로 반환 타입을 사용하여 `yield` 표현식에서 return, yield 및 평가할 수 있는 값 유형을 적용할 수 있다. 아래에서 `next()`는 `boolean`만 사용하여 호출할 수 있고, `done` 값에 따라 값은 `string` 또는 `number`이다.

```ts
/**
 * - yields numbers
 * - returns strings
 * - can be passed in booleans
 */
function* counter(): Generator<number, string, boolean> {
  let i = 0;
  while (true) {
    if (yield i++) {
      break;
    }
  }
  return 'done!';
}
var iter = counter();
var curr = iter.next();
while (!curr.done) {
  console.log(curr.value);
  curr = iter.next(curr.value === 5);
}
console.log(curr.value.toUpperCase());
// prints:
//
// 0
// 1
// 2
// 3
// 4
// 5
// DONE!
```

자세한 사항을 확인하고 싶다면 [이 PR 참조](https://github.com/Microsoft/TypeScript/issues/2983)

## 더 정확한 배열 스프레드

ES2015 이전 타겟에서 `for/of` 반복문 및 배열 스프레드와 같은 문법에 대한 가장 신뢰있는 방출은 다소 무거울 수 있다. 이러한 이유로 TS는 기본적으로 배열 타입만 지원하는 더 단순한 방출을 사용하며 `downlevelIteration` 플래그를 사용하는 다른 유형에 대한 반복을 지원한다.

> 다운 레벨링이란?
> 자바스크립트의 이전 버전으로 전환하는 것을 가리키는 TS 용어이다. 이 플래그는 이전 JS 런타임에서 새로운 개념을 통해 현재 JS가 반복되는 방식을 보다 정확하게 구현할 수 있도록 지원하기 위한 것이다.
> ECMAScript 6는 `for/of`나 `for (el of arr)`, 배열 스프레드, 인수 스프레드, `Symbol.iterator`와 같은 새로운 반복 기본 요소를 추가했다. `downlevelIteration`을 사용하면 `Symbol.iterator` 구현이 존재하는 경우 ES5 환경에서 이러한 반복 기본 요소를 보다 정확하게 사용할 수 있다.
> 자세한 사항은 아래 링크참조: https://www.typescriptlang.org/tsconfig#downlevelIteration

`downlevelIteration`이 없는 더 느슨한 기본값 반복은 상당히 잘 동작하지만 배열 스프레드의 변환이 관찰 가능한 차이를 갖는 몇 가지 일반적인 경우가 있었다. 예를들어 아래와 같이 스프레드 배열을 포함하는 배열이다.

```ts
[...Array(5)];
```

이는 다음 배열 리터럴로 다시 작성할 수 있다.

```ts
[undefined, undefined, undefined, undefined, undefined];
```

그러나 TS는 대신 원본 코드를 다음과 같이 변환한다.

```ts
Array(5).slice();
```

약간 다른데, `Array(5)`는 길이가 5이지만, 위는 정의된 프로퍼티가 없는 배열을 생성한다.

![](https://velog.velcdn.com/images/hustle-dev/post/15ed2d54-2dbc-45bf-8885-3a15f473ef79/image.png)

TS 3.6은 새로운 `__spreadArrays` 헬퍼를 도입하여 `downlevelIteration`이 아닌 이전 대상에서 ECMAScript 2015에서 발생하는 일을 정확하게 모델링한다. `__spreadArrays`는 [tslib](https://github.com/Microsoft/tslib/)에서도 사용할 수 있다.

자세한 사항을 [이 PR을 참조](https://github.com/microsoft/TypeScript/pull/31166)

## 프로미스를 둘러싼 UX 개선

TS 3.6은 `Promise`가 잘못 처리될 때 몇 가지 개선 사항을 소개한다.

예를들어`Promise`의 내용을 다른 함수로 전달하기 전에 `.then()` 하거나 `await`하는 것을 까먹는 경우가 매우 일반적이다. TS의 오류 메시지는 이제 전문화되어 사용자에게 `await` 키워드를 고려해야 할 것임을 알려준다.

```ts
interface User {
  name: string;
  age: number;
  location: string;
}
declare function getUserData(): Promise<User>;
declare function displayUser(user: User): void;
async function f() {
  displayUser(getUserData());
  //              ~~~~~~~~~~~~~
  // Argument of type 'Promise<User>' is not assignable to parameter of type 'User'.
  //   ...
  // Did you forget to use 'await'?
}
```

또한 `Promise`를 `await` 하거나 `.then()` 전에 메서드에 액세스 하려고 시도하는 것이 일반적이다. 아래가 그러한 예이다.

```ts
async function getCuteAnimals() {
  fetch('https://reddit.com/r/aww.json').json();
  //   ~~~~
  // Property 'json' does not exist on type 'Promise<Response>'.
  //
  // Did you forget to use 'await'?
}
```

자세한 사항은 [이 이슈 참고](https://github.com/microsoft/TypeScript/issues/30646)

## 식별자에 대한 향상된 유니코드 지원

TS 3.6은 ES2015 이상의 대상에 방출할 때, 식별자의 유니코드 문자를 더 잘 지원한다.

```ts
const 𝓱𝓮𝓵𝓵𝓸 = 'world'; // previously disallowed, now allowed in '--target es2015'
```

## SystemJS에서 import.meta 지원

TS는 `module`의 타겟이 `system`으로 설정된 경우 `import.meta`를 `context.meta`로 변환하는 기능을 지원한다.

```ts
// This module:
console.log(import.meta.url);
// gets turned into the following:
System.register([], function (exports, context) {
  return {
    setters: [],
    execute: function () {
      console.log(context.meta.url);
    },
  };
});
```

## 주변 컨텍스트에서 get, set 접근자 허용

이전 버전의 TS에서 언어는 주변 컨텍스트(`declare` -d 클래스 또는 일반적으로 `.d.ts` 파일)에서 `get` 및 `set`의 접근자를 하용하지 않았다. 그러나 [ECMAScript의 클래스 필드 제안이 기존 버전의 TS와 다른 동작을 할 수 있기](https://github.com/tc39/proposal-class-fields/issues/248) 때문에 하위 클래스에서 적절할 오류를 제공하기 위해 서로 다른 동작을 전달하는 방법이 필요하다는 것을 알았다.

결과적으로 사용자는 TS 3.6에서 주변 컨텍스트에 게터와 세터를 작성할 수 있다.

```ts
declare class Foo {
  // Allowed in 3.6+.
  get x(): number;
  set x(val: number);
}
```

TS 3.7에서 컴파일러 자체는 이 기능을 이용하여 생성된 `.d.ts` 파일도 `get/set` 접근자를 내보낸다.

## 주변 클래스와 함수가 병합될 수 있음

이전 버전의 TS에서는 어떤 상황에서도 클래스와 함수를 병합하는 것이 오류였다. 이제 주변 클래스와 함수(`declare` 수식자가 있는 클래스/함수 또는 `.d.ts` 파일)가 병합될 수 있다. 이것은 이제 아래와 같이 쓸 수 있다는 것을 의미한다.

```ts
// 이렇게 사용하는 대신에
export interface Point2D {
  x: number;
  y: number;
}
export declare var Point2D: {
  (x: number, y: number): Point2D;
  new (x: number, y: number): Point2D;
};

// 이렇게 사용할 수 있다
export declare function Point2D(x: number, y: number): Point2D;
export declare class Point2D {
  x: number;
  y: number;
  constructor(x: number, y: number);
}
```

이것의 한 가지 장점은 호출 가능한 생성자 패턴을 쉽게 표현할 수 있는 동시에 네임스페이스가 네임스페이스와 병합될 수 있다는 것이다.(`var` 선언은 네임스페이스와 병합 X)

TS 3.7에서 컴파일러는 `.js` 파일에서 생성된 `.d.ts` 파일이 클래스 유사 함수의 호출 가능성과 생성 가능성을 모두 적절하게 캡처할 수 있도록 이 기능을 활용한다.

자세한 내용은 [이 PR 참고](https://github.com/microsoft/TypeScript/pull/32584)

## --build와 --incremental를 지원하는 API들

TS 3.0은 `--build` 플래그를 사용하여 다른 것을 참조하고 점진적으로 빌드하는 지원을 도입했다. 또한 TS 3.4는 특정 파일을 재구축하기 위해 이전 컴파일에 대한 정보를 저장하기 위한 증분 플래그를 도입했다. 이러한 플래그는 프로젝트를 보다 유연하게 구성하고 구축 속도를 높이는 데 매우 유용했다. 불행히도 이러한 도구를 사용하는 것은 Gulp 및 Webpack과 같은 제 3자 빌드 도구에서는 작동하지 않았다. TS 3.6은 이제 프로젝트 참조 및 증분 프로그램 빌드에서 작동하는 두 개의 API 집합을 제공한다.

증분 빌드를 만들기 위해 사용자는 `createIncrementalProgram`와 `createIncrementalCompilerHost` API를 활용할 수 있다. 사용자는 또한 노출된 `readBuilderProgram` 함수를 사용하여 이 API에 의해 생성된 `.tsbuildinfo` 파일에서 오래된 프로그램 인스턴스를 re-hydrate를 할 수 있고, 이는 새 프로그램을 만드는 데만 사용한다.(즉 반환된 인스턴스를 수정할 수 없다. 다른 `create*Program` 함수에서 `oldProgram` 매개 변수에만 사용된다.)

프로젝트 참조를 활용하기 위해 새 타입 `SolutionBuilder`의 인스턴스를 반환하는 새 `createSolutionBuilder` 함수가 노출되었다.

이러한 API에 대한 자세한 설명은 [이 PR 참조](https://github.com/microsoft/TypeScript/pull/31432)

## 세미콜론 인식 코드 편집

Visual Studio 및 VSCode와 같은 편집기는 빠른 수정, 리팩터링 및 다른 모듈에서 값을 자동으로 가져오는 등의 변환을 자동으로 적용할 수 있다. 이러한 변환은 TS에 의해 구동되며, 이전 버전의 TS는 모든 문 끝에 무조건 세미콜론을 추가했다.

이제 TS는 이러한 종류의 편집을 적용할 때 파일이 세미콜론을 사용하는지 여부를 감지할 수 있을 정도로 충분히 똑똑하다. 파일에 일반적으로 세미콜론이 없는 경우 TS는 세미콜론을 추가하지 않는다.

자세한 내용은 [이 PR 참조](https://github.com/microsoft/TypeScript/pull/31801)

## 더 스마트한 Auto-Import 문법

JS는 ECMAScript 표준의 것, 이미 지원하는 하나의 노드 (CommonJS), AMD, System.js 등 다양한 모듈 구문 또는 규약을 가지고 있다. 대부분의 경우 TS는 ECMAScript 모듈 구문을 사용하여 Auto-Import를 수행하는데, 이는 컴파일러 설정이 서로 다른 특정 TS 프로젝트나 일반 JS가 있는 노드 프로젝트에서 부적절한 경우가 많았다.

TS 3.6은 이제 다른 모듈을 Auto-Import 방법을 결정하기 전에 기존 import 문을 검토하는 것이 조금 더 현명하다.

자세한 내용은 [이 PR 참조](https://github.com/microsoft/TypeScript/pull/32684)

## 새 TS Playground

TS Playground는 편리한 새로운 기능으로 많은 환호를 받았다. 새로운 playground는 커뮤니티 구성원들이 점점 더 많이 사용하고 있는 [Artem Tyurin](https://github.com/agentcooper)의 [TS Playground](https://github.com/agentcooper/typescript-play)이다. 우리는 Artem에게 큰 감사를 표한다.

새로운 playground는 아래와 같은 많은 옵션을 지원한다.

- [타겟](https://www.typescriptlang.org/tsconfig#target) 옵션(사용자가 es5에서 es3, es2015, esnext 등으로 전환 가능)
- 모든 엄격성 플래그([strict](https://www.typescriptlang.org/tsconfig#strict)만 포함)
- 일반 JS 파일 지원(`allowJS`를 사용하고 선택적으로 [checkJs](https://www.typescriptlang.org/tsconfig#checkJs))

이러한 옵션은 playground 샘플에 대한 링크를 공유할 때에도 유지되므로 사용자가 수신자에게 따로 옵셜 설정을 말해줄 필요없이 신뢰도높은 공유를 가능하게 한다.

가까운 미래에, playground 샘플을 고치고, JSX 지원을 추가하고, 자동 타입 획득을 연마할 것이다. 이것은 여러분이 개인 편집기에서 얻을 수 있는 것과 동일한 경험을 playground에서 볼 수 있다는 것을 의미한다.
