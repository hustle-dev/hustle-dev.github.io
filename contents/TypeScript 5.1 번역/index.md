---
title: TypeScript 5.1 번역
description: TypeScript 5.1 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2023-06-12
slug: /translate-ts-5-1
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html

## 더 쉬운 `undefined` - 반환 함수 리턴

JS에서 함수가 반환을 하지 않고 실행을 완료하면 `undefined` 값을 반환 한다.

```js
function foo() {
  // no return
}
// x = undefined
let x = foo()
```

하지만 이전 버전의 TS에서는 반환문이 전혀 없는 함수는 `void`함수와 `any` 함수 뿐이었다. 즉, '이 함수는 `undefined` 값을 반환한다'라고 명시적으로 말하더라도 적어도 하나의 반환문이 있어야 했다.

```ts
// ✅ fine - we inferred that 'f1' returns 'void'
function f1() {
  // no returns
}
// ✅ fine - 'void' doesn't need a return statement
function f2(): void {
  // no returns
}
// ✅ fine - 'any' doesn't need a return statement
function f3(): any {
  // no returns
}
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
function f4(): undefined {
  // no returns
}
```

일부 API에서 `undefined` 함수를 반환할 것으로 예상되는 경우, `undefined` 반환을 명시적으로 하나 이상 반환하거나 `return`문과 명시적 어노테이션이 있어야 하므로 문제가 될 수 있다.

```ts
declare function takesFunction(f: () => undefined): undefined
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
  // no returns
})
// ❌ error!
// A function whose declared type is neither 'void' nor 'any' must return a value.
takesFunction((): undefined => {
  // no returns
})
// ❌ error!
// Argument of type '() => void' is not assignable to parameter of type '() => undefined'.
takesFunction(() => {
  return
})
// ✅ works
takesFunction(() => {
  return undefined
})
// ✅ works
takesFunction((): undefined => {
  return
})
```

이러한 동작은 특히 사용자가 제어할 수 없는 함수를 호출할 때 답답하고 혼란스러웠다.`undefined` 함수에 대한 무효 추론, `undefined` 반환 함수에 `return`문이 필요한지 여부 등의 상호 작용을 이해하는 것은 산만해 보였다.

첫째, TS 5.1에서는 이제 `undefined` 반환 함수에 반환문을 포함하지 않아도 된다.

```ts
// ✅ Works in TypeScript 5.1!
function f4(): undefined {
  // no returns
}
// ✅ Works in TypeScript 5.1!
takesFunction((): undefined => {
  // no returns
})
```

둘째, 함수에 반환 표현식이 없고 `undefined` 함수를 반환할 것으로 예상되는 함수로 전달되는 경우 TS는 해당 함수의 반환 타입을 `undefined`로 추론한다.

```ts
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
  //                 ^ return type is undefined
  // no returns
})
// ✅ Works in TypeScript 5.1!
takesFunction(function f() {
  //                 ^ return type is undefined
  return
})
```

또 다른 유사한 문제점을 해결하기 위해 TS의 `--noImplicitReturns` 옵션에 따라 `undefined` 값만 반환하는 함수는 이제 모든 코드 경로가 명시적 반환으로 끝나지 않아도 된다는 점에서 `void`와 유사한 예외를 적용한다.

```ts
// ✅ Works in TypeScript 5.1 under '--noImplicitReturns'!
function f(): undefined {
  if (Math.random()) {
    // do some stuff...
    return
  }
}
```

## Getters 및 Setters와 관련 없는 타입

TypeScript 4.3에서는 `get` 및 `set` 접근자 쌍이 서로 다른 두 가지 타입을 지정할 수 있게 되었다.

```ts
interface Serializer {
  set value(v: string | number | boolean)
  get value(): string
}
declare let box: Serializer
// Allows writing a 'boolean'
box.value = true
// Comes out as a 'string'
console.log(box.value.toUpperCase())
```

처음에는 `get` 타입이 `set` 타입의 하위 타입이어야 했다.

이는 이 아래 코드를 의미했다.

```ts
// 항상 유효함
box.value = box.value
```

그러나 기존 API와 제안된 API에는 Getter와 Setter 사이에 전혀 관련이 없는 유형이 많이 있다. 예를 들어 가장 일반적인 예 중 하나인 DOM 및 CSSStyleRule API의 스타일 속성을 생각해 보자. 모든 스타일 규칙에는 스타일 프로퍼티가 있는데, 이 프로퍼티에 쓰려고 하면 문자열로만 제대로 작동한다.

이제 TypeScript 5.1에서는 명시적인 타입 어노테이션이 있는 경우 접근자 속성 `get` 및 `set`에 전혀 관련이 없는 유형을 허용한다. 이 버전의 TypeScript에서는 아직 이러한 내장 인터페이스의 유형이 변경되지는 않았지만, 이제 다음과 같은 방식으로 `CSSStyleRule`을 정의할 수 있다.

```ts
interface CSSStyleRule {
  // ...
  /** Always reads as a `CSSStyleDeclaration` */
  get style(): CSSStyleDeclaration
  /** Can only write a `string` here. */
  set style(newValue: string)
  // ...
}
```

또한 `set` 액세서가 "유효한" 데이터만 허용하도록 요구하지만, 일부 기본 상태가 아직 초기화되지 않은 경우 `get` 액세서가 `undefined` 상태로 반환될 수 있도록 지정하는 등의 다른 패턴도 허용한다.

```ts
class SafeBox {
  #value: string | undefined
  // Only accepts strings!
  set value(newValue: string) {}
  // Must check for 'undefined'!
  get value(): string | undefined {
    return this.#value
  }
}
```

사실 이것은 `--exactOptionalProperties`에서 선택적 속성을 검사하는 방식과 유사하다.

## JSX 요소와 JSX 태그 타입 간의 분리된 타입 검사

TypeScript가 JSX를 사용하면서 겪었던 한 가지 문제점은 모든 JSX 요소의 태그 타입에 대한 요구 사항이었다.

문맥상 JSX 요소는 다음 중 하나이다.

```tsx
// A self-closing JSX tag
<Foo />
// A regular element with an opening/closing tag
<Bar></Bar>
```

`<Foo />` 또는` <Bar></Bar>`를 타입 검사할 때 TypeScript는 항상 `JSX`라는 네임스페이스를 조회하고 거기에서 `Element`라는 타입을 가져오거나 더 직접적으로는 `JSX.Element`를 조회한다.

하지만 `Foo` 또는 `Bar` 자체가 태그 이름으로 사용하기에 유효한지 확인하기 위해 TypeScript는 대략적으로 `Foo` 또는 `Bar`가 반환하거나 생성한 타입을 가져와 `JSX.Element`(또는 해당 타입이 생성 가능한 경우 `JSX.ElementClass`라는 다른 타입)와의 호환성을 확인한다.

여기서 제한은 컴포넌트가 `JSX.Element`보다 더 광범위한 타입을 반환하거나 "렌더링"하는 경우 사용할 수 없다는 것을 의미한다. 예를 들어 JSX 라이브러리에서 문자열이나 프로미스를 반환하는 컴포넌트는 괜찮을 수 있다.

좀 더 구체적인 예로, React는 Promises를 반환하는 컴포넌트에 대한 제한적인 지원을 추가하는 것을 고려하고 있지만, 기존 버전의 TypeScript에서는 `JSX.Element`의 타입을 대폭 완화하지 않고는 이를 표현할 수 없다.

```tsx
import * as React from 'react'
async function Foo() {
  return <div></div>
}
let element = <Foo />
//             ~~~
// 'Foo' cannot be used as a JSX component.
//   Its return type 'Promise<Element>' is not a valid JSX element.
```

이를 표현할 수 있는 방법을 라이브러리에 제공하기 위해 TypeScript 5.1은 이제 `JSX.ElementType`이라는 타입을 조회한다. `ElementType`은 JSX 엘리먼트에서 태그로 사용할 수 있는 것을 정확하게 지정한다. 따라서 오늘날에는 다음과 같이 입력될 수 있다.

```tsx
namespace JSX {
    export type ElementType =
        // All the valid lowercase tags
        keyof IntrinsicAttributes
        // Function components
        (props: any) => Element
        // Class components
        new (props: any) => ElementClass;
    export interface IntrinsictAttributes extends /*...*/ {}
    export type Element = /*...*/;
    export type ClassElement = /*...*/;
}
```

## 네임스페이스 JSX 속성

TypeScript는 이제 JSX를 사용할 때 네임스페이스 속성 이름을 지원한다.

```tsx
import * as React from "react";
// Both of these are equivalent:
const x = <Foo a:b="hello" />;
const y = <Foo a : b="hello" />;
interface FooProps {
    "a:b": string;
}
function Foo(props: FooProps) {
    return <div>{props["a:b"]}</div>;
}
```

네임스페이스 태그 이름은 이름의 첫 번째 세그먼트가 소문자 이름일 때 `JSX.IntrinsicAttributes`에서 비슷한 방식으로 조회된다.

```tsx
// In some library's code or in an augmentation of that library:
namespace JSX {
  interface IntrinsicElements {
    ['a:b']: { prop: string }
  }
}
// In our code:
let x = <a:b prop="hello!" />
```

## `typeRoots` 모듈 해상도에서 참조된다.

TypeScript의 지정된 모듈 조회 전략이 경로를 확인할 수 없는 경우, 이제 지정된 `typeRoot`를 기준으로 패키지를 확인한다.

## 선언을 기존 파일로 이동

선언을 새 파일로 이동하는 것 외에도 TypeScript는 이제 기존 파일로 선언을 이동할 수 있는 미리보기 기능도 제공한다. 이 기능은 최신 버전의 Visual Studio Code에서 사용해 볼 수 있다.

gif 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html#move-declarations-to-existing-files

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/9366537f-8e0a-466c-88dd-fd510839a731)

이 기능은 현재 프리뷰 버전이며, 이에 대한 추가 피드백을 받고 있다.

## JSX 태그용 링크 커서

TypeScript는 이제 JSX 태그 이름에 대한 링크 편집을 지원한다. 연결된 편집(때때로 "미러 커서"라고도 함)을 사용하면 편집기에서 여러 위치를 동시에 자동으로 편집할 수 있다.

gif 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-1.html#linked-cursors-for-jsx-tags

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/18900ff3-bb40-4b6f-8e11-45ebc3a43219)

이 새로운 기능은 TypeScript 및 JavaScript 파일 모두에서 작동하며, Visual Studio 코드 인사이더에서 활성화할 수 있다. Visual Studio Code에서 `Editor: Linked Editing`를 편집하거나 설정 UI에서 편집할 수 있다. 또는 `editor.linkedEditing`을 JSON 설정 파일에서 설정할 수 있다.

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/642b0122-269b-4b55-b2d3-48a5f3e67dfa)

```json
{
  // ...
  "editor.linkedEditing": true
}
```

## JSDoc 태그인 `@param`에 대한 스니펫 완성

이제 TypeScript와 JavaScript 파일 모두에서 `@param` 태그를 입력할 때 스니펫 완성 기능을 제공한다. 이 기능을 사용하면 코드를 문서화하거나 JavaScript에서 JSDoc 타입을 추가할 때 텍스트를 입력하거나 이동하는 횟수를 줄일 수 있다.

## 최적화

### 불필요한 타입 인스턴스화 방지

TypeScript 5.1은 이제 외부 타입 매개변수에 대한 참조를 포함하지 않는 것으로 알려진 객체 타입 내에서 타입 인스턴스화를 수행하지 않는다. 이를 통해 불필요한 계산을 많이 줄일 수 있으며, material-ui의 문서 디렉터리에서 유형 검사 시간을 50% 이상 단축할 수 있다.

### 유니온 리터럴에 대한 네거티브 대소문자 검사

소스 타입이 유니온 타입의 일부인지 확인할 때 TypeScript는 먼저 해당 소스에 대한 내부 타입 식별자를 사용하여 빠른 조회를 수행한다. 조회에 실패하면 TypeScript는 유니온 내의 모든 타입에 대해 호환성을 확인한다.

리터럴 타입을 순수 리터럴 타입의 유니온에 연관시킬 때, 이제 TypeScript는 공용체의 다른 모든 타입에 대한 전체 검사를 피할 수 있다. TypeScript는 항상 리터럴 유형을 인턴/캐시하기 때문에 이 가정은 안전하지만, "새로운" 리터럴 유형과 관련하여 처리해야 할 몇 가지 에지 케이스가 있다.

이 최적화를 통해 이번 이슈에서 코드의 타입 검사 시간을 약 45초에서 약 0.4초로 단축할 수 있었다.

### JSDoc 구문 분석을 위한 스캐너 호출 감소

이전 버전의 TypeScript는 JSDoc 주석을 구문 분석할 때 스캐너/토큰화기를 사용하여 주석을 세분화된 토큰으로 나누고 그 내용을 다시 조합했다. 이 방법은 주석 텍스트를 정규화하여 여러 개의 공백이 하나로 합쳐지도록 하는 데 유용할 수 있지만, 매우 '수다스럽기' 때문에 구문 분석기와 스캐너가 매우 자주 왔다 갔다 하면서 JSDoc 구문 분석에 오버헤드를 가중시켰다.

TypeScript 5.1은 스캐너/토큰라이저로 JSDoc 주석을 분해하는 로직을 더 많이 이동시켰다. 이제 스캐너는 더 큰 콘텐츠 청크를 구문 분석기에 직접 반환하여 필요에 따라 처리한다.

이러한 변경 사항으로 인해 대부분 산문 주석이 포함된 10MB짜리 JavaScript 파일 몇 개의 구문 분석 시간이 절반가량 단축되었다. 보다 현실적인 예로, 성능 제품군의 xstate 스냅샷은 구문 분석 시간이 약 300밀리초 단축되어 로드 및 분석 속도가 빨라졌다.

## 주요 변경사항

### 최소 런타임 요구 사항인 ES2020 및 Node.js 14.17

TypeScript 5.1은 이제 ECMAScript 2020에 도입된 JavaScript 기능을 제공한다. 따라서 최소한의 최신 런타임에서 TypeScript를 실행해야 한다. 대부분의 사용자에게 이는 이제 TypeScript가 Node.js 14.17 이상에서만 실행된다는 것을 의미한다.

Node 10 또는 12와 같은 이전 버전의 Node.js에서 TypeScript 5.1을 실행하려고 하면 `tsc.js` 또는 `tsserver.js` 에서 다음과 같은 오류가 표시될 수 있다.

```
node_modules/typescript/lib/tsserver.js:2406
  for (let i = startIndex ?? 0; i < array.length; i++) {
                           ^

SyntaxError: Unexpected token '?'
    at wrapSafe (internal/modules/cjs/loader.js:915:16)
    at Module._compile (internal/modules/cjs/loader.js:963:27)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
    at Module.load (internal/modules/cjs/loader.js:863:32)
    at Function.Module._load (internal/modules/cjs/loader.js:708:14)
    at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:60:12)
    at internal/main/run_main_module.js:17:47
```

또한 TypeScript를 설치하려고 하면 npm에서 다음과 같은 오류 메시지가 표시된다.

```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'typescript@5.1.1-rc',
npm WARN EBADENGINE   required: { node: '>=14.17' },
npm WARN EBADENGINE   current: { node: 'v12.22.12', npm: '8.19.2' }
npm WARN EBADENGINE }
```

yarn 에서

```
error typescript@5.1.1-rc: The engine "node" is incompatible with this module. Expected version ">=14.17". Got "12.22.12"
error Found incompatible module.
```

### `node_modules/@types`를 위해 명시적 `typeRoots` 에 대한 상향 이동을 비활성화 환다.

이전에는 `tsconfig.json`에 `typeRoots` 옵션이 지정되었지만 `typeRoots` 디렉터리 확인에 실패한 경우 TypeScript가 계속해서 상위 디렉터리로 이동하여 각 상위의 `node_modules/@types` 폴더 내의 패키지를 확인하려고 시도했다.

이 동작은 과도한 조회를 유발할 수 있으며 TypeScript 5.1에서는 비활성화되었다. 그 결과 `tsconfig.json`의 `types` 옵션 또는 `/// <reference >` 지시어의 항목에 따라 다음과 같은 오류가 표시될 수 있다.

```
error TS2688: Cannot find type definition file for 'node'.
error TS2688: Cannot find type definition file for 'mocha'.
error TS2688: Cannot find type definition file for 'jasmine'.
error TS2688: Cannot find type definition file for 'chai-http'.
error TS2688: Cannot find type definition file for 'webpack-env"'.
```

해결책은 일반적으로 `node_modules/@types`에 대한 특정 항목을 `typeRoots`에 추가하는 것이다.

```json
{
  "compilerOptions": {
    "types": ["node", "mocha"],
    "typeRoots": [
      // Keep whatever you had around before.
      "./some-custom-types/",
      // You might need your local 'node_modules/@types'.
      "./node_modules/@types",
      // You might also need to specify a shared 'node_modules/@types'
      // if you're using a "monorepo" layout.
      "../../node_modules/@types"
    ]
  }
}
```
