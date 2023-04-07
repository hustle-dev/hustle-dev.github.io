---
title: TypeScript 3.7 번역
description: TypeScript 3.7 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2022-12-25
slug: /translate-ts-3-7
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html

## 옵셔널 체이닝

옵셔널 체이닝은 이슈 트래커에 [issue #16](https://github.com/microsoft/TypeScript/issues/16)으로 있다.

핵심적으로 옵셔널 체이닝은 `null`이나 `undefined`인 경우 TS가 일부 표현식의 실행을 즉시 중지할 수 있는 코드를 작성할 수 있게 해준다. 옵셔널 체이닝은 옵션 속성 접근에 대한 새로운 연산자인 `?.`를 이용한다. 다음과 같이 코드를 사용한다.

```ts
let x = foo?.bar.baz();
```

이것은 `foo`가 정의될 때 `foo.bar.baz()`가 실행될 것이라고 이야기하는 방법이다. 그러나 `foo`가 `null` 이거나 `undefined`인 경우, 하고 있는 것을 중지하고 `undefined`를 반환한다.

좀 더 명확하게, 옵셔널 체이닝은 아래와 같은 의미의 코드로 볼 수 있다.

```ts
let x = foo === null || foo === undefined ? undefined : foo.bar.baz();
```

만약 `bar`가 `null`이나 `undefined`인 경우 코드는 `baz`로 접근할 때 에러를 발생시킨다. 마찬가지로 `baz`가 `null`이나 `undefined`인 경우 호출하는 쪽에서 에러를 발생시킨다. `?.`는 왼쪽의 값이 `null`인지 `undefined`인지만 확인한다. 뒤에 오는 속성은 확인하지 않는다.

`?.`(옵셔널 체이닝 연산자)는 `&&` 연산자를 사용하여 반복적인 널리쉬 검사를 수행하는 코드를 대체한다.

```ts
// Before
if (foo && foo.bar && foo.bar.baz) {
  // ...
}
// After-ish
if (foo?.bar?.baz) {
  // ...
}
```

`?.`는 실제로 `&&` 연산과 다르게 동작하는 것을 명심해야 하는데, `&&`는 falsy 값에 대해 동작하기 동작하기 때문이다. 그러나 이것은 의도적인 구조적 특징으로, 옵셔널 체이닝의 경우 0이나 빈 문자열과 같은 유효한 데이터에서는 단축평가 되지 않는다.

옵셔널 체이닝에선 두 가지 다른 작업도 포함된다. 먼저 선택적 프로퍼티 액세스와 유사하게 동작하지만 식별자가 아닌 속성(임의 문자열, 숫자 및 기호)에 액세스할 수 있는 선택적 요소 액세스가 있다. 코드로 보는게 더 이해가 쉬울 것이다.

```ts
/**
 * Get the first element of the array if we have an array.
 * Otherwise return undefined.
 */
function tryGetFirstElement<T>(arr?: T[]) {
  return arr?.[0];
  // equivalent to
  //   return (arr === null || arr === undefined) ?
  //       undefined :
  //       arr[0];
}
```

또한 선택적 호출이 있으며, 이를 통해 표현식이 `null`이거나 `undefined`인 경우 조건부 호출이 가능하다.

```ts
async function makeRequest(url: string, log?: (msg: string) => void) {
  log?.(`Request started at ${new Date().toISOString()}`);
  // roughly equivalent to
  //   if (log != null) {
  //       log(`Request started at ${new Date().toISOString()}`);
  //   }
  const result = (await fetch(url)).json();
  log?.(`Request finished at ${new Date().toISOString()}`);
  return result;
}
```

옵셔널 체이닝이 갖는 단축 평가 동작은 제한된 프로퍼티 접근, 호출, 요소 접근이다. 이는 이러한 표현에서 더 이상 확장되지 않는다.

아래의 코드를 살펴보자.

```ts
// 나누기 또는 someComputation() 호출이 발생하는 것을 중지하지 않는다.
let result = foo?.bar / someComputation();

// 위는 다음의 코드와 동일하다.
let temp = foo === null || foo === undefined ? undefined : foo.bar;
let result = temp / someComputation();
```

이 경우 `undefined`를 나누는 결과가 될 수 있으므로 [stictNullChecks](https://www.typescriptlang.org/tsconfig/#strictNullChecks)에서 아래와 같이 오류가 발생한다.

```ts
function barPercentage(foo?: { bar: number }) {
  return foo?.bar / 100;
  //     ~~~~~~~~
  // Error: Object is possibly undefined.
}
```

더 자세한 내용은 [proposal](https://github.com/tc39/proposal-optional-chaining/)과 [원래의 PR](https://github.com/microsoft/TypeScript/pull/33294)을 확인하자.

## 널병합 연산자

널 병합 연산자는 옵셔널 체이닝과 함께 ECMAScript에 제안에 있는 기능이다.

`??` 연산자는 `null`또는 `undefined`를 처리할 때 기본값으로 폴백하는 방법이다.

아래의 예시를 보자.

```ts
let x = foo ?? bar();
```

이것은 값 `foo`가 존재할 때, 사용될 것이라고 말하는 새로운 방법이다. 그러나 `null` 또는 `undefined`인 경우 대신 `bar()`를 계산한다. 위 코드는 아래와 같다.

```ts
let x = foo !== null && foo !== undefined ? foo : bar();
```

`??` 연산자는 기본값을 사용하려고 할 때, `||` 연산자의 사용을 대체할 수 있다. 예를들어, 다음 코드는 `localStorage`에 마지막으로 저장된 볼륨을 가져오려고 시도하지만 `||`를 사용하기 때문에 버그가 있다.

```ts
function initializeAudio() {
  let volume = localStorage.volume || 0.5;
  // ...
}
```

`localStorage.volume`이 0으로 설정되었을 때, 페이지에서 볼륨을 0.5로 설정한. 이는 의도하지 않은 동작이며 `??` 연산자는 값이 `0, NaN, ''`일 때, 의도하지 않은 동작으로 잘못된 값으로 처리되는 것을 방지한다.

## Assertion 함수

예기치 않은 일이 발생하면 오류를 발생시키는 특정 함수 세트가 있다. 그것들은 assertion 함수라고 부른다. 예를 들어, Node.js는 이를 위한 전용 함수인 `assert`를 가지고 있다.

```ts
assert(someValue === 42);
```

이 예에서 `someValue`가 `42`와 같지 않으면 `assert`는 `AssertionError`를 발생시킨다.

JS에서 assertion은 아래 예시처럼 종종 부적절한 유형이 전달되지 않도록 보호하기 위해 사용된다.

```ts
function multiply(x, y) {
  assert(typeof x === 'number');
  assert(typeof y === 'number');
  return x * y;
}
```

불행이도, TS에서는 이러한 검사를 제대로 인코딩할 수 없다. 느슨하게 타이핑된 코드는 TS가 덜 검사한다는 것을 의미하고, 약간 보수적인 코드의 경우 사용자들이 종종 타입 assertion을 사용하도록 강요했다.

```ts
function yell(str) {
  assert(typeof str === 'string');
  return str.toUppercase();
  // Oops! We misspelled 'toUpperCase'.
  // Would be great if TypeScript still caught this!
}
```

대안은 언어가 코드를 분석할 수 있도록 다시 쓰는 것이었지만, 이것은 편리하지 않다.

```ts
function yell(str) {
  if (typeof str !== 'string') {
    throw new TypeError('str should have been a string.');
  }
  // Error caught!
  return str.toUppercase();
}
```

궁극적인 TS의 목표는 기존 JS 구조를 가장 덜 파괴적인 방식으로 타이핑 하는 것이다. 이러한 이유로 TS 3.7은 이러한 assertion 함수를 모델링 하는 'assertion 시그니처'라는 새로운 개념을 도입한다.

첫 번째 유형의 어설션 시그니처는 노드의 `assert` 함수가 작동하는 방식을 모델링한다. 검사 중인 조건이 포함된 스코프의 나머지 부분에 대해 참이어야 한다.

```ts
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}
```

`asserts condition`은 `assert`가 반환되면 `condition` 매개변수로 전달되는 몯느 것이 참이어야 한다고 말한다.(그렇지 않으면 오류가 발생한다.) 그것은 나머지 범위에 대해서는 그 조건이 참이어야 한다는 것을 의미한다. 예를 들어, 이 assertion 함수를 사용하는 것은 우리가 원래의 `yell` 예시를 잡는다는 것을 의미한다.

```ts
function yell(str) {
  assert(typeof str === 'string');
  return str.toUppercase();
  //         ~~~~~~~~~~~
  // error: Property 'toUppercase' does not exist on type 'string'.
  //        Did you mean 'toUpperCase'?
}
function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(msg);
  }
}
```

다른 유형의 어설션 시그니처는 조건을 확인하지 않고, 대신 특정 변수나 속성이 다른 유형을 가지고 있음을 TS에 알려준다.

```ts
function assertIsString(val: any): asserts val is string {
  if (typeof val !== 'string') {
    throw new AssertionError('Not a string!');
  }
}
```

여기서 `asserts val is string`은 `assertIsString` 함수를 호출한 후 전달된 변수가 문자열임을 보장한다.

이러한 어서셜 시그니처는 쓰기 유형 시그니처와 매우 유사하다.

```ts
function isString(val: any): val is string {
  return typeof val === 'string';
}
function yell(str: any) {
  if (isString(str)) {
    return str.toUppercase();
  }
  throw 'Oops!';
}
```

그리고 타입 예측 서명과 마찬가지로, 이 어설션 서명은 믿을 수 없을 정도로 표현력이 뛰어나다.

다음과 같이 정교하게 함수를 작성할 수 있다.

```ts
function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new AssertionError(`Expected 'val' to be defined, but received ${val}`);
  }
}
```

어설션 서명에 대한 자세한 내용을 보려면 [이 PR](https://github.com/microsoft/TypeScript/pull/32695)을 확인하자.

## never를 반환하는 함수에 대한 더 나은 지원

어설션 시그니처를 위한 작업의 일부로서, TS는 어디서 어떤 함수가 호출되는 지에 대한 더 많은 인코딩이 필요했다. 이것은 우리에게 `never`를 리턴하는 함수같은 또 다른 종류의 함수에 대한 지원을 확대할 수 있는 기회를 주었다.

`never`를 반환하는 함수의 의도는 `never`를 반환하는 것이다. 예외가 발생했거나, 중지 오류 조건이 발생했거나, 프로그램이 종료되었음을 나타낸다. 예를들어 [process.exit(...) in @types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5299d372a220584e75a031c13b3d555607af13f8/types/node/globals.d.ts#l874)은 `never`를 반환하도록 인터페이스가 설계되어 있다.

함수가 잠재적으로 `undefined`이거나 모든 코드 경로에서 효과적으로 반환되지 않도록 하기 위해 TS는 함수의 끝에 `return` 또는 `throw`와 같은 구문신호가 필요했다. 그래서 사용자들은 아래 코드처럼 그들의 실패 함수를 `return`하는 스스로를 발견했다.

```ts
function dispatch(x: string | number): SomeType {
  if (typeof x === 'string') {
    return doThingWithString(x);
  } else if (typeof x === 'number') {
    return doThingWithNumber(x);
  }
  return process.exit(1);
}
```

이제 이러한 `never`를 반환하는 함수가 호출되면 TS는 제어 흐름 그래프에 영향을 미친다는 것을 인식한다.

```ts
function dispatch(x: string | number): SomeType {
  if (typeof x === 'string') {
    return doThingWithString(x);
  } else if (typeof x === 'number') {
    return doThingWithNumber(x);
  }
  process.exit(1);
}
```

어설션 함수와 마찬가지로 [동일한 PR에서 더 많은 것을 읽을 수 있다.](https://github.com/microsoft/TypeScript/pull/32695)

## 재귀 타입 별칭

타입 별칭은 항상 재귀적으로 참조되는 방법에 제한이 있었다. 그 이유는 타입 별칭을 사용할 때는 별칭이 무엇이든 스스로 대체할 수 있어야 하기 때문이다. 어떤 경우에는 그럴 수 없기 때문에 컴파일러는 다음과 같은 특정 재귀 별칭을 거부한다.

```ts
type Foo = Foo;
```

이것은 합리적인 제한인데, 왜냐하면 `Foo`의 모든 사용은 `Foo`로 대체되어야 하고, `Foo`는 `Foo`로 대체되어야 하기 때문이다. 결국에, `Foo`를 대신해서 말이되는 타입은 없다.

이는 다른 언어가 [타입 별칭을 다루는 방식과 상당히 일치](https://wikipedia.org/w/index.php?title=Recursive_data_type&oldid=913091335#in_type_synonyms)하지만 사용자가 이 기능을 활용하는 방법에 약간 놀라운 시나리오가 발생한다. 예를 들어, TS 3.6 이전 버전에서는 다음과 같은 오류가 발생한다.

```ts
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;
//   ~~~~~~~~~~~~
// error: Type alias 'ValueOrArray' circularly references itself.
```

이것은 기술적으로 사용자가 인터페이스를 도입함으로써 항상 효과적으로 동일한 코드를 작성할 수 있는 어떤 사용에도 아무런 문제가 없기 때문에 이상하다.

```ts
type ValueOrArray<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray<T>> {}
```

인터페이스는 간접적인 수준을 도입하고, 전체 구조를 열심히 구축할 필요가 없기 때문에 TS는 이 구조로 작동하는 데 문제가 없다.

그러나 인터페이스를 도입하는 해결책은 사용자에게 직관적이지 않았다. 기본적으로 `Array`를 직접 사용한 원래 버전의 `ValueOrArray`에는 아무런 문제가 없었다. 만약 컴파일러가 조금 더 게으르고 필요할 때만 `Array`에 대한 타입 인자를 계산한다면, TS는 이것들을 정확하게 표현할 수 있다.

그것이 바로 TS 3.7이 도입한 것이다. 타입 별칭의 최상위 수준에서 TS는 이러한 패턴을 허용하기 위해 타입 인수의 확인을 연기한다.(늦게 확인한다라는 뜻)

이것은 JSON을 나타내려고 했던 다음과 같은 코드를 의미한다.

```ts
type Json = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [property: string]: Json;
}
interface JsonArray extends Array<Json> {}
```

마지막으로 helper 인터페이스 없이 다시 작성할 수 있다.

```ts
type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json } // 기존에는 JSONObject라는 것을 사용
  | Json[];
```

이 새로운 완화를 통해 튜플에서도 유형 별칭을 재귀적으로 참조할 수 있다. 오류가 발생하던 다음 코드는 이제 유효한 TS 코드이다.

```ts
type VirtualNode = string | [string, { [key: string]: any }, ...VirtualNode[]];
const myNode: VirtualNode = [
  'div',
  { id: 'parent' },
  ['div', { id: 'first-child' }, "I'm the first child"],
  ['div', { id: 'second-child' }, "I'm the second child"],
];
```

더 자세한 정보는 [이 PR](https://github.com/microsoft/TypeScript/pull/33050)을 참조

## --declaration과 --allowJs

TS의 [선언](https://www.typescriptlang.org/tsconfig#declaration) 플래그를 사용하면 TS 소스 파일에서 `.d.ts` 파일을 생성할 수 있다. 이러한 `.d.ts`파일은 몇 가지 중요한 이유로 중요하다.

무엇보다도, 그것들은 TS가 원본 소스 코드를 다시 확인하지 않고 다른 프로젝트의 타입을 확인할 수 있게 해주기 때문에 중요하다. 그것들을 또한 TS를 염두에 두고 구축되지 않은 기존의 JS 라이브러리와 상호 운용할 수 있도록 하기 때문에 중요하다. 마지막으로, TS와 JS 사용자 모두가 더 나은 자동 완성과 같은 것들을 얻기 위해 TS에 의해 구동되는 편집기를 사용할 때 이러한 파일들로부터 이익을 얻을 수 있다.

안타깝게도 선언은 TS와 JS 입력 파일을 혼합할 수 있는 [allowJs](https://www.typescriptlang.org/tsconfig#allowJs)와 함께 작동하지 않았다. 이것은 사용자가 JSDoc 주석을 달았더라도 코드베이스를 마이그레이션 할 때 선언 플래그를 사용할 수 없다는 것을 의미해서 답답한 한계였다. TS 3.7은 이를 변경하고 두 옵션을 함께 사용할 수 있도록 한다.

TS 3.7을 사용하면 JSDoc 주석이 달린 JS 라이브러리를 작성하고 TS 사용자를 지원할 수 있다.

이것이 작동하는 방식은 allowJs를 사용할 때 TS는 일반적으로 JS 패턴을 이해하기 위한 최선의 분기를 가지고 있다. 선언 방출이 켜져 있을 때, TS는 출력 `.d.ts` 파일에서 JSDoc 주석 및 CommonJs 내보내기를 유효한 형식 선언 등으로 변환하는 가장 좋은 방법을 찾는다.

예를 들어, 아래의 코드 스니펫은

```ts
const assert = require('assert');
module.exports.blurImage = blurImage;
/**
 * Produces a blurred image from an input buffer.
 *
 * @param input {Uint8Array}
 * @param width {number}
 * @param height {number}
 */
function blurImage(input, width, height) {
  const numPixels = width * height * 4;
  assert(input.length === numPixels);
  const result = new Uint8Array(numPixels);
  // TODO
  return result;
}
```

다음과 같은 `.d.ts` 파일을 생성한다.

```ts
/**
 * Produces a blurred image from an input buffer.
 *
 * @param input {Uint8Array}
 * @param width {number}
 * @param height {number}
 */
export function blurImage(input: Uint8Array, width: number, height: number): Uint8Array;
```

이는 `@param` 태그를 사용하는 기본 기능을 뛰어넘을 수 있다. 여기서 다음과 같은 예를 들수 있다.

```ts
/**
 * @callback Job
 * @returns {void}
 */
/** Queues work */
export class Worker {
  constructor(maxDepth = 10) {
    this.started = false;
    this.depthLimit = maxDepth;
    /**
     * NOTE: queued jobs may add more items to queue
     * @type {Job[]}
     */
    this.queue = [];
  }
  /**
   * Adds a work item to the queue
   * @param {Job} work
   */
  push(work) {
    if (this.queue.length + 1 > this.depthLimit) throw new Error('Queue full!');
    this.queue.push(work);
  }
  /**
   * Starts the queue if it has not yet started
   */
  start() {
    if (this.started) return false;
    this.started = true;
    while (this.queue.length) {
      /** @type {Job} */ this.queue.shift()();
    }
    return true;
  }
}
```

이는 다음과 같은 `d.ts` 파일로 변환된다.

```ts
/**
 * @callback Job
 * @returns {void}
 */
/** Queues work */
export class Worker {
  constructor(maxDepth?: number);
  started: boolean;
  depthLimit: number;
  /**
   * NOTE: queued jobs may add more items to queue
   * @type {Job[]}
   */
  queue: Job[];
  /**
   * Adds a work item to the queue
   * @param {Job} work
   */
  push(work: Job): void;
  /**
   * Starts the queue if it has not yet started
   */
  start(): boolean;
}
export type Job = () => void;
```

이러한 플래그를 함께 사용할 때 TS는 .`js` 파일을 반드시 다운레벨 할 필요는 없다. TS에서 `.d.ts` 파일을 생성하려는 경우 [emitDeclarationOnly](https://www.typescriptlang.org/tsconfig#emitDeclarationOnly) 컴파일러 옵션을 사용할 수 있다.

자세한 내용은 [원본 PR](https://github.com/microsoft/TypeScript/pull/32372)에서 확인

## useDefineForClassFields 플래그와 declare 속성 수정자

TS가 공개 필드 클래스를 구현했을 때, 능력을 최대한 발휘하여 아래 코드를 가정했다.

```ts
class C {
  foo = 100;
  bar: string;
}
```

이는 생성자 본체 내에서 유사한 할당과 같다.

```ts
class C {
  constructor() {
    this.foo = 100;
  }
}
```

불행히도, 이것이 제안 초기에 나아간 방향처럼 보이지만, public 클래스 필드가 다르게 표준화될 가능성이 매우 크다. 대신 원래 코드 샘플은 다음과 같은 것에 더 가까운 '설탕 제거'가 필요할 수 있다.(더 문법적으로 어려워진다는 의미인것 같음)

```ts
class C {
  constructor() {
    Object.defineProperty(this, 'foo', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 100,
    });
    Object.defineProperty(this, 'bar', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
  }
}
```

TS 3.7은 기본적으로 기존 방출을 변경하지 않지만, 사용자가 향후 발생할 수 있는 손상을 완화할 수 있도록 점진적으로 변경 사항을 롤 아웃하고 있다. [useDefineForClassFields](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)라는 새 플래그를 제공하여 이 방출 모드를 몇 가지 새로운 확인 로직으로 활성화했다.

가장 큰 두가지 변경 사항은 다음과 같다.

- 선언은 `Object.defineProperty`로 초기화된다.
- 선언은 이니셜라이저가 없는 경우에도 항상 `undefined`로 초기화된다.

이는 상속을 사용하는 기존 코드에 상당한 영향을 미칠 수 있다. 우선 기본 클래스의 설정된 `set` 접근자는 트리거되지 않고 완전히 덮어쓰게 된다.

```ts
class Base {
  set data(value: string) {
    console.log('data changed to ' + value);
  }
}
class Derived extends Base {
  // No longer triggers a 'console.log'
  // when using 'useDefineForClassFields'.
  data = 10;
}
```

둘째로, 기본 클래스의 속성을 특성화하기 위해 클래스 필드를 사용하는 것도 효과가 없다.

```ts
interface Animal {
  animalStuff: any;
}
interface Dog extends Animal {
  dogStuff: any;
}
class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}
class DogHouse extends AnimalHouse {
  // Initializes 'resident' to 'undefined'
  // after the call to 'super()' when
  // using 'useDefineForClassFields'!
  resident: Dog;
  constructor(dog: Dog) {
    super(dog);
  }
}
```

이 두 가지의 결론은 속성을 접근자와 혼합하면 문제가 발생하고 이니셜라이저 없이 속성을 다시 선언한다는 것이다.

접근자 주변의 문제를 감지하기 위해 TS 3.7은 이제 `.d.ts` 파일의 `get/set` 접근자를 방출하여 TS에서 오버라이드된 접근자를 확인할 수 있다.

클래스 필드 변경의 영향을 받는 코드는 필드 이니셜라이저를 생성자 본문의 할당으로 변환하여 이 문제를 해결할 수 있다.

```ts
class Base {
  set data(value: string) {
    console.log('data changed to ' + value);
  }
}
class Derived extends Base {
  constructor() {
    this.data = 10;
  }
}
```

두 번째 문제를 완화하기 위해 명시적 이니셜라이저를 추가하거나 속성에 방출이 없어야 함을 나타내는 선언 수정자를 추가할 수 있다.

```ts
interface Animal {
  animalStuff: any;
}
interface Dog extends Animal {
  dogStuff: any;
}
class AnimalHouse {
  resident: Animal;
  constructor(animal: Animal) {
    this.resident = animal;
  }
}
class DogHouse extends AnimalHouse {
  declare resident: Dog;
  //  ^^^^^^^
  // 'resident' now has a 'declare' modifier,
  // and won't produce any output code.
  constructor(dog: Dog) {
    super(dog);
  }
}
```

`Object.defineProperty`가 ES3에 없기 때문에 현재 ES5 이상을 대상으로 한 경우에만 `useDefineForClassFields`를 사용할 수 있다. 유사한 문제 검사를 수행하려면, ES5를 대상으로 하고 전체 빌드를 피하기 위해 [noEmit](https://www.typescriptlang.org/tsconfig#noEmit)을 사용하는 별도의 프로젝트를 생성할 수 있다.

자세한 내용은 [이러한 변경에 대한 원본 PR](https://github.com/microsoft/TypeScript/pull/33509)을 참조

## 프로젝트 참조를 사용한 빌드 프리 편집

TS의 프로젝트 참조는 우리에게 더 빠른 컴파일을 제공하기 위해 코드베이스를 분해하는 쉬운 방법을 제공한다. 안타깝게도 종속성이 구축되지 않은 프로젝트를 편집하면 편집 환경이 제대로 작동하지 않는다.

TS 3.7에서 종속성이 있는 프로젝트를 열 때 TS는 자동으로 `.ts/.tsx` 파일을 대신 사용한다. 이는 프로젝트 참조를 사용하는 프로젝트가 의미론적 작업이 최신 상태로 '그냥 작동'하는 편집 환경을 개선할 수 있음을 의미한다. 컴파일러 옵션 [disableSourceOfProjectReferenceRedirect](https://www.typescriptlang.org/tsconfig#disableSourceOfProjectReferenceRedirect)를 사용하여 이 동작을 비활성화 할 수 있다. 이는 편집 성능에 영향을 줄 수 있는 매우 큰 프로젝트에서 작업할 때 적합하다.

자세한 내용은 [이 PR 참조](https://github.com/microsoft/TypeScript/pull/32028)

## 호출되지 않은 함수 검사

일반적이고 위험한 오류는 함수를 호출하는 것을 잊는 것인데, 특히 함수가 인수가 0개이거나 함수가 아닌 속성일 수 있음을 암시하는 이름이 지정된 경우이다.

```ts
interface User {
  isAdministrator(): boolean;
  notify(): void;
  doNotDisturb?(): boolean;
}
// later...
// Broken code, do not use!
function doAdminThing(user: User) {
  // oops!
  if (user.isAdministrator) {
    sudo();
    editTheConfiguration();
  } else {
    throw new AccessDeniedError('User is not an admin');
  }
}
```

여기서 `isAdministrator` 함수를 호출하는 것을 잊었다. 코드는 관리자가 아닌 사용자가 구성을 편집할 수 있도록 잘못 허용한다.

TS 3.7에서는 다음과 같은 오류가 발생할 수 있다.

```ts
function doAdminThing(user: User) {
    if (user.isAdministrator) {
    //  ~~~~~~~~~~~~~~~~~~~~
    // error! This condition will always return true since the function is always defined.
    //        Did you mean to call it instead?
```

이 검사는 획기적인 변화이지만, 그러한 이유로 검사는 매우 보수적이다. 이 오류는 조건이 있는 경우에만 발생하며, 선택적 속성, strictNullChecks가 해제된 경우 또는 함수가 `if`문의 몸체 안에서 나중에 호출되는 경우 발생하지 않는다.

```ts
interface User {
  isAdministrator(): boolean;
  notify(): void;
  doNotDisturb?(): boolean;
}
function issueNotification(user: User) {
  if (user.doNotDisturb) {
    // OK, property is optional
  }
  if (user.notify) {
    // OK, called the function
    user.notify();
  }
}
```

함수를 호출하지 않고 테스트하려는 경우 `undefined/null`을 포함하도록 함수의 정의를 수정하거나, `!!`를 사용해 `if (!!user.isAdministrator)`와 같은 항목을 작성하여 강제성이 의도적임을 나타낼 수 있다.

## 타입스크립트 파일에서 // @ts-nocheck

TS 3.7을 사용하면 TS 파일의 맨 위에 `// @ts-nocheck` 주석을 추가하여 의미론적 검사를 비활성화 할 수 있다. 역사적으로 이 주석은 [checkJs](https://www.typescriptlang.org/tsconfig#checkJs)가 존재하는 JS 소스 파일에서만 사용되었지만 우리는 모든 사용자가 더 쉽게 마이그레이션할 수 있도록 TS 파일로 지원을 확장했다.

## 세미콜론 형식 지정 옵션

JS의 ASI 규칙 때문에 후속 세미콜론이 선택적인 위치에서 세미콜론 삽입 및 제거를 지원한다. 이 설정은 VSCode Insider에서 사용할 수 있고, Tools Option 메뉴의 Visual Studio 16.4 Preview 2에서 사용할 수 있다.

![](https://velog.velcdn.com/images/hustle-dev/post/2b08805b-f59e-44b9-8018-e57935d49b8a/image.png)

'삽입' 또는 '제거' 값을 선택하는 것은 자동 가져오기, 추출된 유형 및 TS 서비스에서 제공하는 기타 생성된 코드는 TS 서비스에 의해 제공된다. 설정을 기본값인 '무시'로 유지하면 생성된 코드가 현재 파일에서 탐지된 세미콜론 환경설정과 일치한다.

## 3.7 변경 사항

### DOM 변경 사항

[lib.dom.dts의 유형이 업데이트 되었다.](https://github.com/microsoft/TypeScript/pull/33627) 이러한 변경사항은 대부분 무효성(nullability)과 관련된 정확성 변경사항이지만, 영향은 궁극적으로 코드베이스에 따라 달라진다.

### 클래스 필드 완화

위에서 언급한 바와 같이 TS 3.7은 `.d.ts` 파일의 `get/set` 접근자를 방출하여 3.5 이전 버전과 같은 이전 버전의 TS에서 소비자에게 심각한 변화를 일으킬 수 있다. TS 3.6 사용자는 이 기능에 대해 미래에 대비한 버전이므로 영향을 받지 않는다.

`useDefineForClassFields` 플래그를 선택하면 다음과 같은 파손이 발생할 수 있다.

- 속성 선언을 사용하여 파생 클래스의 접근자 재지정
- 이니셜라이저를 사용하지 않고 속성 선언 다시 실행

### 함수 참값 검사

위에서 언급했듯이, TS 는 if문 조건 내에서 함수가 호출되지 않은 것처럼 보일 때 오류가 발생한다. 다음 조건이 적용되지 않는 한 함수 타입이 검사될 때, 오류가 발생한다.

- 선택된 값은 선택적 속성에 가져온다.
- strictNullChecks가 비활성화
- 함수는 나중에 `if`문 안에서 호출된다.

### 로컬과 임포트된 타입 선언이 충돌 한다.

버그로 인해 이전에 TS에서 허용된 구문은 다음과 같다.

```ts
// ./someOtherModule.ts
interface SomeType {
  y: string;
}
// ./myModule.ts
import { SomeType } from './someOtherModule';
export interface SomeType {
  x: number;
}
function fn(arg: SomeType) {
  console.log(arg.x); // Error! 'x' doesn't exist on 'SomeType'
}
```

여기서 `SomeType`은 `import` 선언과 로컬 `interface` 선언에서 모두 발생하는 것으로 보인다. 놀랍게도 모듈 내부에서 `SomeType`은 가져온 정의만을 가리키며, 로컬 선언 `SomeType`은 다른 파일에서 가져올 때만 사용할 수 있다.

TS 3.7에서는 중복 식별자 오류가 수정되어 올바르게 식별된다. 올바른 해결책은 저자의 원래 의도에 따라 다르며, 사례별로 다루어야 한다. 일반적으로 이름 지정 충돌은 의도적이지 않고, 가져온 유형의 이름을 변경하는 것이 가장 좋다. 가져온 유형을 보강(augment)하는 것이 목적이었다면, 대신 적절한 모듈 확대(augmentation)을 작성해야 한다.

## 3.7 API 변경

위에서 설명한 재귀 타입 별칭 패턴을 사용하도록 설정하기 위해 `typeArguments` 속성이 `TypeReference` 인터페이스에서 제거되었다. 사용자는 대신 `TypeChecker` 인스턴스에서 `getTypeArguments` 함수를 사용해야 한다.
