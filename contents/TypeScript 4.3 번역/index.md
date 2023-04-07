---
title: TypeScript 4.3 번역
description: TypeScript 4.3 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2023-03-18
slug: /translate-ts-4-3
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-3.html

## 프로퍼티의 쓰기 타입 분리

JS에서 API는 값을 저장하기 전에 값을 변환하는 것이 일반적이다. 이는 getter와 setter에서도 자주 발생한다. 예를 들어, 항상 값을 숫자로 변환한 후에 비공개 필드에 저장하는 setter를 갖는 클래스가 있다고 상상해보자.

```ts
class Thing {
  #size = 0;

  get size() {
    return this.#size;
  }
  set size(value) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

이 JS 코드를 TS로 어떻게 입력할까? 기술적으로는 여기서 특별한 조치를 취할 필요가 없다. TS는 명시적인 타입이 없어도 이를 살펴보고 `size`가 숫자임을 알아낼 수 있다.

문제는 `size`가 숫자뿐만 아니라 다른 타입의 값을 할당할 수 있다는 점이다. 따라서 우리는 이 스니펫에서와 같이 `size`가 `unknown` 또는 `any`와 같은 타입을 갖는다고 명시하여 이 문제를 해결할 수 있다.

```ts
class Thing {
  // ...
  get size(): unknown {
    return this.#size;
  }
}
```

하지만 이 방법은 좋은 방법은 아니다. `unknown`은 `size`를 읽는 사람들이 타입 단언을 해야 한다는 불편함을 가져오며, `any`는 어떤 오류도 잡아내지 못한다. 값을 변환하는 API를 모델링하려면 이전 버전의 TypeScript에서는 정확성(값 읽기는 더 쉽고 쓰기는 더 어렵게)과 관대함(값 쓰기는 더 쉽고 읽기는 더 어렵게) 중 하나를 선택해야 했다.

그래서 TypeScript 4.3에서는 속성에 대한 읽기 및 쓰기 타입을 지정할 수 있도록 한다.

```ts
class Thing {
  #size = 0;

  get size(): number {
    return this.#size;
  }

  set size(value: string | number | boolean) {
    let num = Number(value);

    // Don't allow NaN and stuff.
    if (!Number.isFinite(num)) {
      this.#size = 0;
      return;
    }

    this.#size = num;
  }
}
```

위의 예제에서, `set` 접근자는 더 넓은 타입 집합 (문자열, 불리언 및 숫자)을 사용하지만 `get` 접근자는 항상 숫자임을 보장한다. 이제 우리는 다른 타입의 값을 오류없이 이러한 속성에 할당할 수 있다.

```ts
let thing = new Thing();

// Assigning other types to `thing.size` works!
thing.size = 'hello';
thing.size = true;
thing.size = 42;

// Reading `thing.size` always produces a number!
let mySize: number = thing.size;
```

동일한 이름을 갖는 두 속성이 어떻게 관련되는지 고려할 때, TypeScript는 "읽기" 타입 (위의 get 접근자의 타입)만 사용한다. "쓰기" 타입은 직접 속성에 쓸 때만 고려된다.

이는 클래스에만 제한된 패턴이 아니다. 객체 리터럴에서도 다른 타입의 getter와 setter를 작성할 수 있다.

```ts
function makeThing(): Thing {
  let size = 0;
  return {
    get size(): number {
      return size;
    },
    set size(value: string | number | boolean) {
      let num = Number(value);
      // Don't allow NaN and stuff.
      if (!Number.isFinite(num)) {
        size = 0;
        return;
      }
      size = num;
    },
  };
}
```

사실, 인터페이스/객체 타입에는 속성에 대한 다양한 읽기/쓰기 타입을 지원하기 위한 문법이 추가되었다.

```ts
// Now valid!
interface Thing {
  get size(): number;
  set size(value: number | string | boolean);
}
```

속성의 읽기와 쓰기에 대해 사로 다른 타입을 사용하는 것의 제한 사항 중 하나는 속성을 읽는 데 사용되는 타입이 쓰는 타입에 할당 가능해야 한다는 것이다. 다시 말해, getter 타입은 setter에 할당 가능해야 한다. 이렇게 함으로써 일관성 수준이 보장되어 속성이 항상 자신에게 할당 가능하도록 유지된다.

## `override` and the `--noImplicitOverride` Flag

JavaScript에서 클래스를 확장할 때, 언어 자체에서 메서드를 오버라이드하기가 매우 쉽지만, 불행하게도 발생할 수 있는 몇 가지 오류가 있다.

가장 큰 문제 중 하나는 이름 변경을 빼먹는 것이다. 예를 들어, 다음 클래스를 살펴보자.

```ts
class SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}
class SpecializedComponent extends SomeComponent {
  show() {
    // ...
  }
  hide() {
    // ...
  }
}
```

`SpecializedComponent`는 `SomeComponent`를 상속하며 `show` 및 `hide` 메서드를 오버라이드한다. 그러나 누군가 `show`와 `hide`를 제거하고 단일 메서드로 대체하면 어떻게 될까?

```ts
 class SomeComponent {
-    show() {
-        // ...
-    }
-    hide() {
-        // ...
-    }
+    setVisible(value: boolean) {
+        // ...
+    }
 }
 class SpecializedComponent extends SomeComponent {
     show() {
         // ...
     }
     hide() {
         // ...
     }
 }
```

이런! `SpecializedComponent`가 업데이트되지 않았다. 이제 이것은 호출되지 않을 불필요한 `show` 및 `hide` 메서드를 추가하고 있다.

이 문제의 일부는 사용자가 새로운 메서드를 추가할 것인지 기존 메서드를 오버라이드할 것인지 명확하게 할 수 없다는 것이다. 이것이 TypeScript 4.3에서 `override` 키워드가 추가된 이유이다.

```ts
class SpecializedComponent extends SomeComponent {
  override show() {
    // ...
  }
  override hide() {
    // ...
  }
}
```

`override`가 지정된 메서드는 TypeScript가 항상 기본 클래스에 동일한 이름의 메서드가 존재하는지 확인한다.

```ts
class SomeComponent {
    setVisible(value: boolean) {
        // ...
    }
}
class SpecializedComponent extends SomeComponent {
    override show() {
This member cannot have an 'override' modifier because it is not declared in the base class 'SomeComponent'.

    }
}
```

이것은 큰 개선이지만, 메서드에 `override`를 작성하는 것을 잊어버리면 도움이 되지 않는다. 이것도 사용자가 발생할 수 있는 큰 실수이다.

예를 들어, 기본 클래스에 있는 메서드가 존재하는데도 불구하고 그것을 모르고 덮어쓸 수도 있다.

```ts
class Base {
  someHelperMethod() {
    // ...
  }
}
class Derived extends Base {
  // Oops! We weren't trying to override here,
  // we just needed to write a local helper method.
  someHelperMethod() {
    // ...
  }
}
```

그래서 TypeScript 4.3에서는 `noImplicitOverride` 플래그도 제공한다. 이 옵션을 켜면 `override` 키워드를 명시적으로 사용하지 않는 한 수퍼클래스의 메서드를 오버라이드하는 것이 오류가 된다. 마지막 예제에서 TypeScript는 `noImplicitOverride` 하에서 오류가 되며, `Derived` 내부의 메서드 이름을 변경해야 할 필요가 있다는 단서를 제공한다.

## 템플릿 문자열 타입 개선사항

TypeScript의 최근 버전에서 새로운 타입 구조인 "템플릿 문자열 타입(template string types)"이 추가되었다. 이 타입은 문자열과 유사한 타입을 연결(concatenate)해서 새로운 타입을 만들 수 있다.

```ts
type Color = 'red' | 'blue';
type Quantity = 'one' | 'two';
type SeussFish = `${Quantity | Color} fish`;
// same as
//   type SeussFish = "one fish" | "two fish"
//                  | "red fish" | "blue fish";
```

그리고 이 타입은 다른 문자열 유사 타입의 패턴(match patterns)을 표현할 수도 있다.

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
// Works!
s1 = s2;
```

첫 번째 변경 사항은 TypeScript가 템플릿 문자열 타입을 추론하는 시기이다. TypeScript가 우리가 리터럴 타입을 사용해야 하는 것을 인식할 때 (즉, 우리가 리터럴 타입을 사용해야 하는 것을 받아들일 때) 템플릿 문자열이 문맥적으로 문자열 리터럴 타입으로 타입화될 때, TypeScript는 그 식에 대해 템플릿 타입을 할당하려고 한다.

```ts
function bar(s: string): `hello ${string}` {
  // Previously an error, now works!
  return `hello ${s}`;
}
```

이는 또한 타입 추론시에도 적용된다. 그리고 타입 파라미터가 string을 확장(extends)하는 경우에도 적용된다.

```ts
declare let s: string;
declare function f<T extends string>(x: T): T;
// Previously: string
// Now       : `hello ${string}`
let x2 = f(`hello ${s}`);
```

두 번째 주요 변경 사항은 TypeScript가 이제 서로 다른 템플릿 문자열 타입 간의 관계를 더 잘 파악하고 추론할 수 있다는 것이다.

이를 확인하기 위해 다음 예제 코드를 살펴보자.

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;
s1 = s2;
s1 = s3;
```

`s2`와 같은 문자열 리터럴 타입을 검사할 때, TypeScript는 문자열 내용을 매치하여 `s2`가 첫 번째 할당에서 `s1`과 호환됨을 알아낼 수 있었지만, 다른 템플릿 문자열을 보자마자 포기해 버렸다. 결과적으로 `s3`를 `s1`에 할당하는 것과 같은 할당은 작동하지 않았다.

이제 TypeScript는 각 템플릿 문자열의 각 부분이 성공적으로 일치하는지 여부를 증명하기 위해 작업을 수행한다. 이제 서로 다른 치환과 함께 템플릿 문자열을 혼합하여 사용할 수 있으며, TypeScript가 실제로 호환되는지 여부를 잘 알아낼 것이다.

```ts
declare let s1: `${number}-${number}-${number}`;
declare let s2: `1-2-3`;
declare let s3: `${number}-2-3`;
declare let s4: `1-${number}-3`;
declare let s5: `1-2-${number}`;
declare let s6: `${number}-2-${number}`;
// Now *all of these* work!
s1 = s2;
s1 = s3;
s1 = s4;
s1 = s5;
s1 = s6;
```

이 작업을 수행함에 따라, 우리는 더 나은 추론 능력도 추가했다. 이러한 기능이 어떻게 작동하는지 예제를 보자.

```ts
declare function foo<V extends string>(arg: `*${V}*`): V;
function test<T extends string>(s: string, n: number, b: boolean, t: T) {
  let x1 = foo('*hello*'); // "hello"
  let x2 = foo('**hello**'); // "*hello*"
  let x3 = foo(`*${s}*` as const); // string
  let x4 = foo(`*${n}*` as const); // `${number}`
  let x5 = foo(`*${b}*` as const); // "true" | "false"
  let x6 = foo(`*${t}*` as const); // `${T}`
  let x7 = foo(`**${s}**` as const); // `*${string}*`
}
```

## ECMAScript `#private` 클래스 멤버

TypeScript 4.3에서는 클래스의 어떤 멤버가 `#private` `#names`으로 지정될 수 있는지가 확장되어 런타임에서 진정한 비공개로 만들 수 있다. 이제 속성(property)뿐만 아니라 메서드(method)와 접근자(accessor)도 비공개 이름을 가질 수 있다.

```ts
class Foo {
  #someMethod() {
    //...
  }
  get #someValue() {
    return 100;
  }
  publicMethod() {
    // These work.
    // We can access private-named members inside this class.
    this.#someMethod();
    return this.#someValue;
  }
}
new Foo().#someMethod();
//        ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.
new Foo().#someValue;
//        ~~~~~~~~~~
// error!
// Property '#someValue' is not accessible
// outside class 'Foo' because it has a private identifier.
```

더 넓게는, 이제 정적 멤버(static members)도 비공개 이름을 가질 수 있다.

```ts
class Foo {
  static #someMethod() {
    // ...
  }
}
Foo.#someMethod();
//  ~~~~~~~~~~~
// error!
// Property '#someMethod' is not accessible
// outside class 'Foo' because it has a private identifier.
```

## `ConstructorParameters`가 추상 클래스에서도 동작

TypeScript 4.3에서 `ConstructorParameters` 타입 헬퍼는 이제 추상 클래스에서도 작동한다.

```ts
abstract class C {
  constructor(a: string, b: number) {
    // ...
  }
}
// Has the type '[a: string, b: number]'.
type CParams = ConstructorParameters<typeof C>;
```

이것은 TypeScript 4.2에서 수행된 작업 덕분이다. 해당 작업에서 구성 시그니처(construct signatures)를 추상으로 표시할 수 있게 되었다.

```ts
type MyConstructorOf<T> = {
  new(...args: any[]): T;
};
// or using the shorthand syntax:
type MyConstructorOf<T> = abstract new (...args: any[]) => T;
```

## 제네릭에 대한 문맥적 좁힘(Contextual Narrowing)

TypeScript 4.3에는 이제 제네릭 값에 대한 약간 더 똑똑한 타입 좁힘 로직이 포함된다. 이를 통해 TypeScript는 더 많은 패턴을 허용하고 때로는 실수를 잡을 수도 있다.

이해를 돕기 위해 `Set` 또는 `Array` 의 원소를 받아서 중복을 제거하는 비교 함수에 따라 해당 `Array`를 정렬하는 함수인 `makeUnique`를 작성하려고 한다고 가정해 보자. 그 후에는 원래의 컬렉션을 반환한다.

```ts
function makeUnique<T>(collection: Set<T> | T[], comparer: (x: T, y: T) => number): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }
  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  for (let i = 0; i < collection.length; i++) {
    let j = i;
    while (j < collection.length && comparer(collection[i], collection[j + 1]) === 0) {
      j++;
    }
    collection.splice(i + 1, j - i);
  }
  return collection;
}
```

이 함수의 구현과 관련된 질문들은 일단 뒤로 두고, 이 함수가 더 넓은 응용프로그램의 요구사항에서 유래되었다고 가정해보자. 여기서 주목할 점 중 하나는 해당 시그니처가 원래 컬렉션의 타입을 포착하지 않는다는 것이다. `Set<T> | T[]`가 쓰인 자리에 `C`라는 타입 파라미터를 추가하여 이를 해결할 수 있다.

```ts
- function makeUnique<T>(collection: Set<T> | T[], comparer: (x: T, y: T) => number): Set<T> | T[]
+ function makeUnique<T, C extends Set<T> | T[]>(collection: C, comparer: (x: T, y: T) => number): C
```

TypeScript 4.2 이전 버전에서는 이렇게 하면 곧바로 오류가 발생한다.

```ts
function makeUnique<T, C extends Set<T> | T[]>(
  collection: C,
  comparer: (x: T, y: T) => number
): C {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
  }
  // Sort the array, then remove consecutive duplicates.
  collection.sort(comparer);
  //         ~~~~
  // error: Property 'sort' does not exist on type 'C'.
  for (let i = 0; i < collection.length; i++) {
    //                             ~~~~~~
    // error: Property 'length' does not exist on type 'C'.
    let j = i;
    while (
      j < collection.length &&
      comparer(collection[i], collection[j + 1]) === 0
    ) {
      //                    ~~~~~~
      // error: Property 'length' does not exist on type 'C'.
      //                                       ~~~~~~~~~~~~~  ~~~~~~~~~~~~~~~~~
      // error: Element implicitly has an 'any' type because expression of type 'number'
      //        can't be used to index type 'Set<T> | T[]'.
      j++;
    }
    collection.splice(i + 1, j - i);
    //         ~~~~~~
    // error: Property 'splice' does not exist on type 'C'.
  }
  return collection;
```

오류가 발생하는 이유는, 우리가 `컬렉션의 instanceof Set`을 체크할 때, 우리는 이를 타입 가드(Type Guard)로 작동하여 `Set<T> | T[]` 타입을 해당 브랜치에 따라 `Set<T>` 또는 `T[]`로 좁히기를 기대하기 때문이다. 그러나 `Set<T> | T[]`가 아니라 `C`라는 제네릭 값을 좁히려고 하는 것이다.

이것은 매우 미묘한 차이이지만, 차이가 있다. TypeScript는 `C`의 제약 조건(`Set<T> | T[]`)을 가져와서 좁히는 것이 아니다. TypeScript가 `Set<T> | T[]`에서 좁히려고 한다면, TypeScript는 해당 정보를 보존할 수 있는 쉬운 방법이 없기 때문에 각 브랜치에서 컬렉션도 C라는 사실을 잊어버릴 것이다. 가상으로 TypeScript가 이러한 접근 방식을 시도한다면 위의 예제는 다른 방식으로 중단될 것이다. 함수가 `C` 타입의 값을 반환하는 위치에서, TypeScript는 각 브랜치에서 `Set<T>`와 `T[]`를 얻을 것이며, TypeScript는 이를 거부할 것이다.

```ts
function makeUnique<T>(collection: Set<T> | T[], comparer: (x: T, y: T) => number): Set<T> | T[] {
  // Early bail-out if we have a Set.
  // We assume the elements are already unique.
  if (collection instanceof Set) {
    return collection;
    //     ~~~~~~~~~~
    // error: Type 'Set<T>' is not assignable to type 'C'.
    //          'Set<T>' is assignable to the constraint of type 'C', but
    //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
  }
  // ...
  return collection;
  //     ~~~~~~~~~~
  // error: Type 'T[]' is not assignable to type 'C'.
  //          'T[]' is assignable to the constraint of type 'C', but
  //          'C' could be instantiated with a different subtype of constraint 'Set<T> | T[]'.
}
```

그렇다면 TypeScript 4.3에서는 어떤 변화가 있을까? 크게 몇 가지 핵심적인 부분에서, 코드 작성 시 타입 시스템이 실제로 관심을 가지는 것은 타입의 제약 조건뿐이다. 예를 들어, `collection.length`를 작성할 때 TypeScript는 `collection`이 `C`라는 사실에 관심이 없으며, 제약 조건 `T[] | Set<T>`에 의해 결정된 속성에만 관심이 있다.

이러한 경우, TypeScript는 제약 조건의 좁힌 타입을 가져온다. 왜냐하면 이것이 실제로 필요한 데이터이기 때문이다. 그러나 다른 경우에는 원래 제네릭 타입을 좁히려고 시도할 것이다(그리고 종종 원래 제네릭 타입으로 끝날 것이다).

즉, 제네릭 값을 사용하는 방식에 따라 TypeScript가 약간 다르게 좁힐 수 있다. 결과적으로 위의 예제 전체가 타입 체크 오류 없이 컴파일된다.

## Always-Truthy Promise 확인

`strictNullChecks` 모드에서, 조건부에서 Promise가 "truthy"한지 확인하면 오류가 발생한다.

```ts
async function foo(): Promise<boolean> {
  return false;
}
async function bar(): Promise<string> {
  if (foo()) {
    //  ~~~~~
    // Error!
    // This condition will always return true since
    // this 'Promise<boolean>' appears to always be defined.
    // Did you forget to use 'await'?
    return 'true';
  }
  return 'false';
}
```

## `static` 인덱스 시그니처

인덱스 시그니처는 타입에서 명시적으로 선언한 속성보다 더 많은 속성을 값에 설정할 수 있게 한다.

```ts
class Foo {
  hello = 'hello';
  world = 1234;
  // This is an index signature:
  [propName: string]: string | number | undefined;
}
let instance = new Foo();
// Valid assigment
instance['whatever'] = 42;
// Has type 'string | number | undefined'.
let x = instance['something'];
```

지금까지 인덱스 시그니처는 클래스의 인스턴스 측면에서만 선언할 수 있었다. 그러나 Wenlu Wang 님의 기여로 인해 인덱스 시그니처를 `static`으로 선언할 수 있게 되었다.

```ts
class Foo {
  static hello = 'hello';
  static world = 1234;
  static [propName: string]: string | number | undefined;
}
// Valid.
Foo['whatever'] = 42;
// Has type 'string | number | undefined'
let x = Foo['something'];
```

인스턴스 측에서와 마찬가지로 클래스의 정적 측에 있는 인덱스 시그니처에도 동일한 종류의 규칙이 적용된다. 즉, 다른 모든 정적 속성이 인덱스 서명과 호환되어야 한다는 것이다.

```ts
class Foo {
  static prop = true;
  //     ~~~~
  // Error! Property 'prop' of type 'boolean'
  // is not assignable to string index type
  // 'string | number | undefined'.
  static [propName: string]: string | number | undefined;
}
```

## `.tsbuildinfo` 사이즈 개선

TypeScript 4.3에서, 증분 빌드의 일부로 생성되는 `.tsbuildinfo` 파일의 크기가 크게 줄어든다. 내부 형식에서 몇 가지 최적화를 수행하여 전체 경로와 유사한 정보를 반복하지 않고 파일 전체에서 사용할 수 있는 숫자 식별자로 테이블을 만들었다.

우리는 다음과 같은 `.tsbuildinfo` 파일 크기의 큰 감소를 보았다.

- 1MB에서 411 KB로
- 14.9MB에서 1MB로
- 1345MB에서 467MB로

말할 필요 없이, 이렇게 크기를 줄이면 빌드 시간도 약간 더 빨라진다.

## `--incremental` 와 `--watch` 편집에서 지연 계산

증분 및 --watch 모드의 문제 중 하나는 나중에 컴파일하는 속도가 빨라지지만 초기 컴파일 속도가 약간 느려질 수 있으며 경우에 따라서는 상당히 느려질 수 있다는 것이다. 이 모드는 현재 프로젝트에 대한 정보를 계산하고, 때로는 나중에 빌드할 수 있도록 해당 데이터를 `.tsbuildinfo` 파일에 저장하는 등 많은 장부 작업을 수행해야 하기 때문이다.

그렇기 때문에 TypeScript 4.3에서는 `.tsbuildinfo` 크기 개선 외에도 이러한 플래그가 있는 프로젝트의 첫 번째 빌드를 일반 빌드만큼 빠르게 만드는 증분 및 `--watch` 모드에 대한 몇 가지 변경 사항이 제공된다! 이를 위해 일반적으로 미리 계산해야 하는 많은 정보를 나중에 빌드할 때 온디맨드 방식으로 계산한다. 이렇게 하면 후속 빌드에 약간의 오버헤드가 추가될 수 있지만 TypeScript의 증분 및 --watch 기능은 일반적으로 훨씬 작은 파일 집합에서 작동하며 필요한 정보는 나중에 저장된다. 어떤 의미에서 증분 및 --watch 빌드는 파일을 몇 번 업데이트하면 "워밍업"을 거쳐 컴파일 속도가 빨라진다.

3000개의 파일이 있는 리포지토리에서 초기 빌드 시간이 거의 1/3로 단축되었다!

## Import 문 완료

자바스크립트에서 import 및 export 문에서 사용자가 가장 많이 겪는 문제 중 하나는 순서이다. 특히 import는 다른 구문보다 먼저 작성되어야 한다는 것이다.

```ts
from "./module.js" import { func };

/* 대신에 아래 처럼 작성해야함 */

import { func } from "./module.js";
```

이로 인해 자동 완성 기능이 제대로 작동하지 않아 전체 가져오기 문을 처음부터 작성할 때 약간의 어려움이 있다. 예를 들어 `import {` 와 같은 문장을 작성하기 시작하면 TypeScript는 어떤 모듈에서 가져올 계획인지 알지 못하기 때문에 범위가 지정된 완성을 제공할 수 없다.

이 문제를 완화하기 위해 자동 가져오기 기능을 활용했다! 자동 가져오기는 특정 모듈에서 완성된 내용을 좁힐 수 없는 문제를 이미 해결한 기능으로, 가능한 모든 내보내기를 제공하고 파일 상단에 가져오기 문을 자동으로 삽입하는 것이 핵심이다.

따라서 이제 경로가 없는 가져오기 문을 작성하기 시작하면 가능한 가져오기 목록이 제공된다. 완료를 커밋하면 작성하려고 했던 경로를 포함하여 전체 가져오기 명령문이 완성된다.

## `@link` 태그를 에디터에서 지원

TypeScript가 이제 `@link` 태그를 이해하고, 해당 태그에서 참조한 선언을 해결할 수 있게 되었다. 즉, `@link` 태그 내에서 이름 위에 마우스를 가져가면 빠른 정보를 얻거나, go-to-definition이나 find-all-references와 같은 명령을 사용할 수 있다.

예를 들어, 아래 예제의 `@link bar`에서 `bar`에 대한 go-to-definition을 할 수 있고, TypeScript가 지원하는 편집기에서는 `bar`의 함수 선언으로 이동한다.

```js
/**
 * To be called 70 to 80 days after {@link plantCarrot}.
 */
function harvestCarrot(carrot: Carrot) {}
/**
 * Call early in spring for best results. Added in v2.1.0.
 * @param seed Make sure it's a carrot seed!
 */
function plantCarrot(seed: Seed) {
  // TODO: some gardening
}
```

## 자바스크립트가 아닌 파일 경로에서 정의 바로가기

이제 많은 로더들은 자바스크립트를 사용하여 애플리케이션에 에셋을 포함시킬 수 있도록 해준다. 일반적으로 `import "./styles.css"`와 같이 작성된다.

지금까지 TypeScript의 편집기 기능은 이 파일을 읽어들이지 못하기 때문에 go-to-definition이 실패했다. 최선의 경우에도 go-to-definition은 `declare module "*.css"`와 같은 선언으로 점프할 수 있었다.

이제 TypeScript의 언어 서비스는 상대 파일 경로에 대한 go-to-definition을 수행할 때 올바른 파일로 점프하려고 시도한다. 자바스크립트 또는 TypeScript 파일이 아닌 경우에도 CSS, SVG, PNG, 폰트 파일, Vue 파일 등의 가져온 파일에 대해서도 시도할 수 있다.

## 주요 변경사항

### `lib.d.ts` 변화

모든 TypeScript 버전과 마찬가지로, `lib.d.ts`에 대한 선언(특히 웹 컨텍스트에 대한 생성된 선언)이 변경되었다. 이번 릴리스에서는 Mozilla의 browser-compat-data를 활용하여 브라우저에서 구현되지 않은 API를 제거했다. 대부분의 경우에는 사용하지 않겠지만, `Account, AssertionOptions, RTCStatsEventInit, MSGestureEvent, DeviceLightEvent, MSPointerEvent, ServiceWorkerMessageEvent 및 WebAuthentication`과 같은 API가 `lib.d.ts`에서 제거되었다.

### `esnext`와 `es2022` 에서 `useDefineForClassFields` 기본 값의 참

2021년에는 클래스 필드 기능이 JavaScript 사양에 추가되었으며 TypeScript에서 구현 방법과 다른 동작을 하였다. 이에 대비하여 TypeScript 3.7에서는 useDefineForClassFields 플래그가 추가되어 JavaScript 표준 동작과 일치하도록 마이그레이션되는 것이 가능해졌다.

이제 이 기능이 JavaScript에 포함되었으므로 ES2022 및 ESNext를 포함한 기본값을 true로 변경한다.

### Always-Truthy Promise 확인에서 에러

`strictNullChecks` 옵션을 사용할 때, 조건 체크 내에서 항상 정의된 것처럼 보이는 `Promise`를 사용하는 것은 이제 오류로 간주된다.

```ts
declare var p: Promise<number>;
if (p) {
  //  ~
  // Error!
  // This condition will always return true since
  // this 'Promise<number>' appears to always be defined.
  //
  // Did you forget to use 'await'?
}
```

### Union Enums은 임의의 숫자와 비교할 수 없음

TypeScript 4.3에서는 멤버가 자동으로 채워지거나 간단하게 작성될 때 일부 열거형은 유니온 열거형으로 간주된다. 이 경우, 열거형은 나타낼 수 있는 각 값에 대해 기억할 수 있다.

유니온 열거형 타입을 가진 값이 그 값과 동일할 수 없는 숫자 리터럴과 비교되면 타입 체커가 오류를 발생시킨다.

```ts
enum E {
  A = 0,
  B = 1,
}
function doSomething(x: E) {
  // Error! This condition will always return 'false' since the types 'E' and '-1' have no overlap.
  if (x === -1) {
    // ...
  }
}
```

해결 방법으로, 적절한 리터럴 타입을 포함하는 주석을 다시 작성할 수 있다

```ts
enum E {
  A = 0,
  B = 1,
}
// Include -1 in the type, if we're really certain that -1 can come through.
function doSomething(x: E | -1) {
  if (x === -1) {
    // ...
  }
}
```

값에 타입 단언을 사용할 수도 있다.

```ts
enum E {
  A = 0,
  B = 1,
}
function doSomething(x: E) {
  // Use a type asertion on 'x' because we know we're not actually just dealing with values from 'E'.
  if ((x as number) === -1) {
    // ...
  }
}
```

또는 열거형에 일반적이지 않은 초기화 값을 사용하도록 열거형을 다시 선언하여 모든 숫자를 할당할 수 있고 해당 열거형과 비교할 수 있도록 할 수 있다. 이 방법은 열거형에 잘 알려진 몇 가지 값을 지정하려는 의도가 있는 경우 유용할 수 있다.

```ts
enum E {
  // the leading + on 0 opts TypeScript out of inferring a union enum.
  A = +0,
  B = 1,
}
```
