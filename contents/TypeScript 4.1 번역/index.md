---
title: TypeScript 4.1 번역
description: TypeScript 4.1 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2023-02-14
slug: /translate-ts-4-1
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html

## 템플릿 리터럴 타입

TS의 문자열 리터럴 타입은 특정한 문자열 집합을 요구하는 함수와 API를 모델링하는데 사용된다.

```ts
function setVerticalAlignment(location: 'top' | 'middle' | 'bottom') {
  // ...
}

setVerticalAlignment('middel');
// Argument of type '"middel"' is not assignable to parameter of type '"top" | "middle" | "bottom"'.
```

이는 문자열 리터럴 타입이 문자열 값의 철자 오류를 검사할 수 있기 때문에 꽤 유용하다.

또한 문자열 리터럴은 매핑된 타입에서 속성 이름으로 사용될 수 있다는 것도 좋은 점이다. 이런 면에서 문자열 리터럴은 구성 요소로서 사용될 수도 있다.

```ts
type Options = {
  [K in 'noImplicitAny' | 'strictNullChecks' | 'strictFunctionTypes']?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```

더하여 문자열 리터럴 타입은 다른 문자열 리터럴 타입을 구성하는 데에 사용될 수 있다.

```ts
type World = 'world';

type Greeting = `hello ${World}`;

// type Greeting = "hello world"
```

치환 위치에서 유니온 타입이 있는 경우 유니온 멤버가 나타낼 수 있는 모든 가능한 문자열 리터럴 집합을 생성한다.

```ts
type Color = 'red' | 'blue';
type Quantity = 'one' | 'two';

type SeussFish = `${Quantity | Color} fish`;
// type SeussFish = "one fish" | "two fish" | "red fish" | "blue fish"
```

이러한 기능은 다음과 같은 상황에서 사용될 수 있다.
UI 컴포넌트를 위한 여러 라이브러리는 수직 및 수평 정렬을 모두 지정하는 방법을 제공한다. 종종 단일 문자열인 `"bottom-right"`와 같이 둘 다를 한 번에 사용하는데, `"top", "middle", "bottom"`으로 수직 정렬하고 `"left", "center", "right"`으로 수평 정렬할 때, 총 9가지의 경우의 수가 나온다.

```ts
type VerticalAlignment = 'top' | 'middle' | 'bottom';
type HorizontalAlignment = 'left' | 'center' | 'right';

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"

declare function setAlignment(value: `${VerticalAlignment}-${HorizontalAlignment}`): void;

setAlignment('top-left'); // works!
setAlignment('top-middel'); // error!
// Argument of type '"top-middel"' is not assignable to parameter of type '"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"'.
setAlignment('top-pot'); // error! but good doughnuts if you're ever in Seattle
// Argument of type '"top-pot"' is not assignable to parameter of type '"top-left" | "top-center" | "top-right" | "middle-left" | "middle-center" | "middle-right" | "bottom-left" | "bottom-center" | "bottom-right"'.
```

사실, 9개의 문자열에 대해서는 수동으로 작성하는 것이 더 나을 것이다. 그러나 많은 양의 문자열이 필요한 경우, 모든 타입 검사에 작업을 절약하기 위해 미리 자동으로 생성하는 것이 좋다.

실제 가치 중 일부는 동적으로 새로운 문자열 리터럴을 만드는 데서 온다. 예를 들어, 객체를 가져와 대부분 동일한 객체를 생성하지만 속성 변경을 감지하기 위한 새로운 on 메서드를 생성하는 makeWatchedObject API를 상상해보자.

```ts
let person = makeWatchedObject({
  firstName: 'Homer',
  age: 42, // give-or-take
  location: 'Springfield',
});
person.on('firstNameChanged', () => {
  console.log(`firstName was changed!`);
});
```

"firstNameChanged"와 같은 이벤트를 수신하는 on 메서드의 타입을 어떻게 지정해야 할까?

```ts
type PropEventSource<T> = {
  on(eventName: `${string & keyof T}Changed`, callback: () => void): void;
};
/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
```

이를 통해 잘못된 속성을 제공할 때 오류가 발생하는 것을 만들 수 있다.

```ts
// error!
person.on("firstName", () => {});
Argument of type '"firstName"' is not assignable to parameter of type '"firstNameChanged" | "ageChanged" | "locationChanged"'.

// error!
person.on("frstNameChanged", () => {});
Argument of type '"frstNameChanged"' is not assignable to parameter of type '"firstNameChanged" | "ageChanged" | "locationChanged"'.
```

템플릿 리터럴 타입에서도 치환 위치에서 추론하는 등의 특별한 것을 할 수 있다. 마지막 예제를 일반화하여 `eventName` 문자열의 일부분에서 연관된 속성을 찾아내도록 유추할 수 있다.

```ts
type PropEventSource<T> = {
  on<K extends string & keyof T>(eventName: `${K}Changed`, callback: (newValue: T[K]) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

let person = makeWatchedObject({
  firstName: 'Homer',
  age: 42,
  location: 'Springfield',
});

// works! 'newName' is typed as 'string'
person.on('firstNameChanged', (newName) => {
  // 'newName' has the type of 'firstName'
  console.log(`new name is ${newName.toUpperCase()}`);
});

// works! 'newAge' is typed as 'number'
person.on('ageChanged', (newAge) => {
  if (newAge < 0) {
    console.log('warning! negative age');
  }
});
```

여기서 on을 일반 메서드로 만들었다. 사용자가 `"firstNameChanged"` 문자열로 호출하면 TypeScript는 K에 대한 적절한 타입을 추론하려고 한다. 이를 위해 "Changed" 이전의 내용과 K를 대조하여 `"firstName"` 문자열을 추론한다. TypeScript가 이를 파악하면 on 메서드는 원래 객체에서 `firstName`의 타입을 가져올 수 있고, 이 경우에는 string이다. 비슷하게 `"ageChanged"`로 호출할 때는 숫자인 `age` 속성의 타입을 찾는다).

추론은 종종 문자열을 분해하고 다른 방식으로 재구성하는 데 다양한 방식으로 결합될 수 있다. 사실, 이러한 문자열 리터럴 타입 수정을 돕기 위해 문자 케이싱을 수정하기 위한 새로운 유틸리티 타입 별칭 몇 개가 추가되었다(예 : 소문자 및 대문자 문자로 변환).

```ts
type EnthusiasticGreeting<T extends string> = `${Uppercase<T>}`;

type HELLO = EnthusiasticGreeting<'hello'>;

// type HELLO = "HELLO"
```

새로운 타입 별칭은 `Uppercase`, `Lowercase`, `Capitalize` 및 `Uncapitalize`이다. 처음 두 개는 문자열의 모든 문자를 변환하고, 나머지 두 개는 문자열의 첫 번째 문자만 변환한다.

## 매핑된 타입의 키 재매핑

매핑된 타입은 임의의 키 기반으로 새로운 객체 타입을 생성할 수 있다.

```ts
type Options = {
  [K in 'noImplicitAny' | 'strictNullChecks' | 'strictFunctionTypes']?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```

또는 다른 객체 타입을 기반으로 새로운 객체 타입을 만들 수도 있다.

```ts
/// 'Partial<T>' is the same as 'T', but with each property marked optional.
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

지금까지 매핑된 타입은 제공된 키를 기반으로만 새로운 객체 타입을 생성할 수 있었다. 그러나 대부분의 경우 입력에 기반하여 새로운 키를 만들거나 기존 키를 필터링하려는 경우가 많다.

이것이 TypeScript 4.1에서 새로운 `as` 절을 사용하여 매핑된 타입에서 키를 다시 매핑할 수 있도록 허용하는 이유이다.

```ts
type MappedTypeWithNewKeys<T> = {
  [K in keyof T as NewKeyType]: T[K];
  //            ^^^^^^^^^^^^^
  //            This is the new syntax!
};
```

이 새로운 `as` 절을 사용하면 템플릿 리터럴 타입과 같은 기능을 활용하여 기존 속성을 기반으로 속성 이름을 쉽게 만들 수 있다.

```ts
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;

type LazyPerson = {
  getName: () => string;
  getAge: () => number;
  getLocation: () => string;
};
```

또한, `never`를 생성함으로써 키를 필터링할 수도 있다. 이는 경우에 따라 추가적인 `Omit` 헬퍼 타입을 사용하지 않아도 된다는 것을 의미한다.

```ts
// Remove the 'kind' property
type RemoveKindField<T> = {
  [K in keyof T as Exclude<K, 'kind'>]: T[K];
};

interface Circle {
  kind: 'circle';
  radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;

// type KindlessCircle = {
//     radius: number;
// }
```

## 재귀 조건부 타입

JS에선 임의의 레벨에서 컨테이너 타입을 펼치고 빌드하는 함수를 자주 볼 수 있다. 예를 들어 `Promise` 인스턴스의 `.then()` 메서드를 생각해보자. `.then(...)`은 'promise-like'이 아닌 값이 나올 때까지 각 프로미스를 풀고, 그 값을 콜백으로 전달한다. 또한 상대적으로 새로운 `flat` 메서드가 있고, 이는 배열을 얼마나 깊이 펼칠지를 나타내는 depth를 사용할 수 있다.

TS의 타입 시스템에서 이를 표현하는 것은 사실상 불가능하다. 이를 구현하기 위한 해키한 기법이 있지만, 타입은 매우 불합리해 보인다.

그래서 TS 4.1은 조건부 타입에 대한 제한을 완하하여 이러한 패턴을 모델링할 수 있도록 했다. TS 4.1에서 조건부 타입은 이제 분기 안에서 즉시 자신을 참조할 수 있으므로, 재귀적인 타입 별칭을 작성하기가 더 쉬워졌다.

예를들어, 중첩된 배열의 요소 타입을 가져오는 타입을 작성하려면 다음 `deepFlatten` 타입을 작성할 수 있다.

```ts
type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;
function deepFlatten<T extends readonly unknown[]>(x: T): ElementType<T>[] {
  throw 'not implemented';
}
// All of these return the type 'number[]':
deepFlatten([1, 2, 3]);
deepFlatten([[1], [2, 3]]);
deepFlatten([[1], [[2]], [[[3]]]]);
```

마찬가지로, TypeScript 4.1에서는 `Promise`를 깊게 풀어내는 `Awaited` 타입을 작성할 수 있다.

```ts
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
/// Like `promise.then(...)`, but more accurate in types.
declare function customThen<T, U>(p: Promise<T>, onFulfilled: (value: Awaited<T>) => U): Promise<Awaited<U>>;
```

이러한 재귀적인 타입은 강력하지만, 책임 있고 절제되게 사용해야 한다는 것을 염두에 두어야 한다.

첫째로, 이러한 타입은 많은 작업을 수행할 수 있으며, 이는 타입 체크 시간을 증가시킬 수 있다는 것을 의미한다. 콜라츠 추측이나 피보나치 수열의 숫자를 모델링하는 것은 재미있을 수 있지만, 이를 `.d.ts` 파일에서 npm에 배포하는 것은 지양해야 한다.

또한 계산이 복잡할 뿐만 아니라, 이러한 타입은 충분히 복잡한 입력에 대해 내부 재귀 깊이 제한에 도달할 수 있다. 이 재귀 깊이 제한에 도달하면 컴파일 타임 오류가 발생한다. 일반적으로 실제적인 예제에서 실패하는 것보다는 이러한 타입을 사용하지 않는 것이 좋다.

## 확인된 인덱스 액세스(`--noUncheckedIndexedAccess`)

TypeScript에는 인덱스 시그니처라는 기능이 있다. 이러한 시그니처는 사용자가 임의로 이름을 지정한 속성에 액세스할 수 있다는 것을 타입 시스템에 알리는 방법이다.

```ts
interface Options {
  path: string;
  permissions: number;

  // Extra properties are caught by this index signature.
  [propName: string]: string | number;
}

function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number

  // These are all allowed too!
  // They have the type 'string | number'.
  opts.yadda.toString();
  opts['foo bar baz'].toString();
  opts[Math.random()].toString();
}
```

위 예제에서 `Options`은 인덱스 시그니처를 갖고 있으며, 이미 나열된 속성이 아닌 모든 액세스 속성은 `string | number` 타입을 가져야한다고 나타낸다. 이것은 자신이 무엇을하고 있는지 알고 있다고 가정하는 낙관적인 코드에 대해 편리하다. 그러나 대부분의 JavaScript 값은 모든 잠재적 속성 이름을 지원하지 않는다. 예를 들어, 이전 예제와 같이 `Math.random()`에 의해 생성된 속성 키를 갖는 값은 대부분의 타입에서 지원되지 않는다. 많은 사용자들에게 이러한 동작은 원하지 않는 것이었으며, strictNullChecks의 전체 엄격한 검사를 활용하지 않는 것처럼 느껴졌다.

이것이 TypeScript 4.1에서 noUncheckedIndexedAccess라는 새로운 플래그가 제공되는 이유이다. 이 새로운 모드에서 모든 속성 액세스 (`foo.bar`와 같은) 또는 인덱스 액세스 (`foo["bar"]`와 같은)는 잠재적으로 정의되지 않은 것으로 간주된다. 즉, 마지막 예제에서 `opts.yadda`는 `string | number` 대신 `string | number | undefined` 타입을 가지게된다. 그 속성에 액세스해야하는 경우, 먼저 존재 여부를 확인하거나 (후위 `!` 문자) non-null 단언 연산자를 사용해야한다.

```ts
function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number

  // These are not allowed with noUncheckedIndexedAccess
  opts.yadda.toString();
Object is possibly 'undefined'.
  opts["foo bar baz"].toString();
Object is possibly 'undefined'.
  opts[Math.random()].toString();
Object is possibly 'undefined'.

  // Checking if it's really there first.
  if (opts.yadda) {
    console.log(opts.yadda.toString());
  }

  // Basically saying "trust me I know what I'm doing"
  // with the '!' non-null assertion operator.
  opts.yadda!.toString();
}
```

noUncheckedIndexedAccess를 사용하면 경계 검사 반복문에서도 배열에 대한 인덱싱이 더 엄격하게 검사된다는 것이다.

```ts
function screamLines(strs: string[]) {
  // This will have issues
  for (let i = 0; i < strs.length; i++) {
    console.log(strs[i].toUpperCase());
// Object is possibly 'undefined'.
```

인덱스가 필요하지 않은 경우 `for-of` 루프 또는 `forEach` 호출을 사용하여 개별 요소를 반복할 수 있다.

```ts
function screamLines(strs: string[]) {
  // This works fine
  for (const str of strs) {
    console.log(str.toUpperCase());
  }

  // This works fine
  strs.forEach((str) => {
    console.log(str.toUpperCase());
  });
}
```

이 플래그는 범위를 벗어난 오류를 포착하는 데 유용할 수 있지만 많은 코드에서 노이즈가 많을 수 있으므로 strict 플래그에 의해 자동으로 활성화 되지 않는다. 그러나 이 기능이 흥미롭다면 자유롭게 사용해보고 팀의 코드베이스에 적합한지 판단해야 한다.

## `baseUrl`이 없는 `paths`

경로 매핑을 사용하는 것은 매우 일반적이다. 종종 `imports`를 더 좋게 하기 위해, 모노레포 연결 동작을 시뮬레이션 하기 위해 사용한다.

불행하게도 경로 매핑을 사용하도록 경로를 지정하려면 `baseUrl`이라는 옵션도 지정해야 했다. 이 옵션을 사용하면 기본 지정자 경로도 `baseUrl`에 상대적으로 도달할 수 있다. 이로 인해 종종 자동-imports에서 잘못된 경로가 사용되었다.

TS 4.1에선 `paths` 옵션을 `baseUrl` 없이 사용할 수 있다. 이렇게 하면 이러한 문제 중 일부를 방지할 수 있다.

## `checkJs`는 `allowJs`를 함축한다

이전에는 체크된 JS 프로젝트를 시작하는 경우 `allowJs`와 `checkJs`를 모두 설정해야 했다. 이것은 약간 성가신 일이었기 때문에 `checkJs`는 이제 기본적으로 `allowJs`를 의미한다.

## React 17 JSX Factories

TypeScript 4.1에서는 jsx 컴파일러 옵션을 위해 두 개의 새로운 옵션을 지원한다. 이를 통해 React 17에서 새롭게 도입된 `jsx`와 `jsxs` 팩토리 함수를 지원한다.

- `react-jsx`
- `react-jsxdev`

이러한 옵션들은 각각 production 및 development 컴파일용으로 만들어졌다. 종종 하나의 옵션에서 다른 옵션을 확장할 수 있다. 예를 들어, `tsconfig.json`은 다음과 같이 구성될 수 있다.

```json
// ./src/tsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "target": "es2015",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["./**/*"]
}
```

개발용 빌드는 다음과 같다.

```json
// ./src/tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsxdev"
  }
}
```

## 에디터에서 JSDoc의 `@see` 태그 지원

JSDoc 태그 `@see`는 이제 TypeScript와 JavaScript 에디터에서 더 나은 지원을 받는다. 이를 통해 태그 뒤에 점(.)이 있는 이름에서 go-to-definition과 같은 기능을 사용할 수 있다. 예를 들어, 다음 예제의 JSDoc 주석에서 `first` 또는 `C`에서 정의로 이동하는 것이 가능하다.

```ts
// @filename: first.ts
export class C {}
// @filename: main.ts
import * as first from './first';
/**
 * @see first.C
 */
function related() {}
```

## Breaking Changes

### `lib.d.ts` 변경 사항

`lib.d.ts`의 변경된 API 세트에는 DOM 타입이 자동으로 생성되는 방식에 따라 일부 변화가 있을 수 있다. 한 가지 구체적인 변경 사항은 ES2016에서 제거되었기 때문에 `Reflect.enumerate`가 제거되었다.

### `abstract` 멤버는 `async`로 마킹될 수 없다

`abstract` 멤버로 표시된 멤버에는 더 이상 `async`가 표시될 수 없다. 여기서 수정해야 할 부분은 `async` 키워드를 제거하는 것이다. 호출자는 반환되는 타입에만 관심이 있기 때문이다.

### `any` / `unknown` 이 falsy 값 위치에서 전파됨

이전에는 `foo && somethingElse`와 같은 식에서 `foo`의 타입이 `any` 또는 `unknown`인 경우 전체 식의 타입은 `somethingElse`의 타입이 되었다.

예를 들어, 이전에는 `x`의 타입이 `{ someProp: string }`이었다.

```ts
declare let foo: unknown;
declare let somethingElse: { someProp: string };
let x = foo && somethingElse;
```

그러나 TS 4.1에선 이 타입을 어떻게 결정할지 더 주의하기로 했다. `&&`의 왼쪽에 있는 타입에 대해 알려진 것이 없으므로 오른쪽 타입 대신 `any` 및 `unknown`을 외부로 전파한다.

가장 일반적인 패턴은 특히 조건 함수에서 `boolean`과의 호환성을 확인할 때이다.

```ts
function isThing(x: any): boolean {
  return x && typeof x === 'object' && x.blah === 'foo';
}
```

종종 적절한 수정은 `foo && someExpression`에서 `!!foo && someExpression`으로 전환하는 것이다.

### `Promise`에서 `resolve` 의 매개변수는 더 이상 선택사항이 아니다.

다음과 같은 코드를 작성할 때

```ts
new Promise((resolve) => {
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

다음과 같은 오류가 발생할 수 있다.

```ts
  resolve()
  ~~~~~~~~~
// error TS2554: Expected 1 arguments, but got 0.
//  An argument for 'value' was not provided.
```

이는 `resolve`에 더 이상 선택적 매개변수가 없기 때문에 기본적으로 값을 전달해야 한다. 이것은 `Promise`를 사용하여 적합한 버그를 포착하는 경우가 많다. 일반적인 수정은 올바른 인수를 전달하고 때로는 명시적인 타입 인수를 추가하는 것이다.

```ts
new Promise<number>((resolve) => {
  //     ^^^^^^^^
  doSomethingAsync((value) => {
    doSomething();
    resolve(value);
    //      ^^^^^
  });
});
```

그러나 때때로 `resolve()`는 실제로 인수 없이 호출되어야 한다. 이러한 경우 `Promise`에 명시적 `void` 제네릭 형식 인수를 지정할 수 있다.(즉, `Promise<void>`로 작성). 이는 잠재적으로 `void`인 후행 매개변수가 선택 사항이 될 수 있는 TS 4.1의 새로운 기능을 활용한다.

```ts
new Promise<void>((resolve) => {
  //     ^^^^^^
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

TS 4.1은 이 break를 수정하는 데 도움이 되는 빠른 수정과 함께 제공된다.

### 조건부 스프레드는 선택적 속성을 생성한다

JS에서 `{...foo}`와 같은 객체 스프레드는 잘못된 값에 대해 작동하지 않는다. 따라서 `{...foo}`와 같은 코드에서 `foo`는 `null`이거나 `undefined` 인 경우 건너뛴다.

많은 사용자가 이를 이용하여 '조건부' 속성을 spread 한다.

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}
interface Animal {
  name: string;
  owner: Person;
}
function copyOwner(pet?: Animal) {
  return {
    ...(pet && pet.owner),
    otherStuff: 123,
  };
}
// We could also use optional chaining here:
function copyOwner(pet?: Animal) {
  return {
    ...pet?.owner,
    otherStuff: 123,
  };
}
```

여기에서 만약 `pet`이 정의되면 `pet.owner`의 속성이 spread된다. 그렇지 않으면 속성이 반환된 객체로 spread되지 않는다.

`copyOwner`의 반환 타입은 이전에 각 스프레드를 기반으로 하는 통합 타입이었다.

```
{ x: number } | { x: number, name: string, age: number, location: string }
```

이는 연산이 발생하는 방식을 정확하게 모델링 했다. `pet`이 정의된 경우 `Person`의 모든 속성이 표시된다. 그렇지 않으면 결과에 정의되지 않는다. all or nothing한 방법이었다.

그러나 단일 객체에 수백 개의 스프레드가 있고 각각의 스프레드가 잠재적으로 수백 또는 수천 개의 속성을 추가하는 극단적인 패턴을 보았다. 여러가지 이유로 이것은 매우 비싸고 일반적으로 많은 이점이 없는 것으로 밝혀졌다.

TS 4.1에서 반환된 타입은 때때로 모든 선택적 속성을 사용한다.

```ts
{
    x: number;
    name?: string;
    age?: number;
    location?: string;
}
```

결과적으로 성능이 더 좋아지고 일반적으로 더 잘 표시된다.

현재 이 동작이 완전히 일관되지는 않지만 향후 릴리스에서는 보다 깨끗하고 예측 가능한 결과를 생성할 것으로 기대한다.

### 일치하지 않는 매개변수는 더 이상 관련이 없다

TS는 이전에 서로 일치하지 않는 매개변수를 `any` 타입에 대응하였다. TS 4.1의 변경 사항으로 언어는 이제 이 프로세스를 건너뛴다. 이는 일부 할당 가능성 사례가 이제 실패하지만 일부 과부하 해결 사례도 실패할 수 있음을 의미한다. 예를 들어, Node.js의 `util.promisify`에 대한 오버로드 해결은 TS 4.1에서 다른 오버로드를 선택할 수 있으며, 때때로 새롭거나 다른 오류 다운스트림을 유발할 수 있다.

이에 대한 해결방안으로 타입 단언을 사용하여 오류를 억제하는 것이 가장 좋다.
