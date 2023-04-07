---
title: TypeScript 5.0 번역
description: TypeScript 5.0 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2023-03-19
slug: /translate-ts-5-0
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: [https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)

## 데코레이터

데코레이터는 **재사용 가능한 방식으로 클래스와 그 멤버를 사용자 정의**하는 ECMAScript의 기능이다.

다음 코드를 살펴보자.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const p = new Person('Ron');
p.greet();
```

`greet` 함수가 여기서는 간단하지만, 비동기 로직을 수행하거나 재귀적으로 호출되거나 사이드 이펙트가 있는 등 훨씬 더 복잡하다고 상상해보자. 어떤 복잡한 로직이라도, `greet` 함수를 디버깅하기 위해 `console.log` 호출을 추가한다고 가정해 보자.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  greet() {
    console.log('LOG: Entering method.');

    console.log(`Hello, my name is ${this.name}.`);

    console.log('LOG: Exiting method.');
  }
}
```

이 패턴은 매우 일반적이다. 모든 메서드에 대해 이 작업을 수행할 수 있는 방법이 있다면 정말 좋을 것 같다.

이때 **데코레이터**를 활용할 수 있다. 다음과 같은 `loggedMethod`라는 함수를 작성할 수 있다.

```tsx
function loggedMethod(originalMethod: any, _context: any) {
  function replacementMethod(this: any, ...args: any[]) {
    console.log('LOG: Entering method.');
    const result = originalMethod.call(this, ...args);
    console.log('LOG: Exiting method.');
    return result;
  }

  return replacementMethod;
}
```

이 코드를 보고 아래처럼 생각할 수 있다.

> "any의 사용량이 왜 이리 많아요? TypeScript가 아니라 anyScript인가요?"

`loggedMethod`는 원래 메서드(originalMethod)를 가져와서 다음과 같은 함수를 반환한다.

- "Entering..." 메시지를 기록한다.
- this 및 모든 인수를 원래 메서드에 전달한다.
- "Exiting..." 메시지를 기록하고,
- 원래 메서드가 반환한 값을 반환한다.

이제 `loggedMethod`를 사용하여 `greet` 메소드를 장식 할 수 있다.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @loggedMethod
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const p = new Person('Ron');
p.greet();

// Output:
//
//   LOG: Entering method.
//   Hello, my name is Ron.
//   LOG: Exiting method.
```

우리는 `loggedMethod`를 `greet` 메서드에 대한 데코레이터로 사용하였다. `@loggedMethod`로 작성되었는데 이것은 `loggedMethod`가 대상 메서드에 대해 호출되고 컨텍스트 객체가 전달되었기 때문이다. `loggedMethod`가 새로운 함수를 반환했기 때문에 해당 함수가 원래 정의되어 있던 `greet`를 대체하게 된다.

아직 언급하지 않았지만, `loggedMethod`는 두 번째 매개변수를 갖고 있다. 이것은 "컨텍스트 객체"라고 불리며 데코레이트된 메서드가 선언된 방식에 대한 몇 가지 유용한 정보를 가지고 있다. 예를 들어, 해당 메서드가 `#private` 멤버인지, `static`인지, 또는 메서드의 이름이 무엇인지를 알 수 있다. 이를 활용해 `loggedMethod`를 다시 작성하고 데코레이트된 메서드의 이름을 출력해보자.

```tsx
function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  function replacementMethod(this: any, ...args: any[]) {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = originalMethod.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return replacementMethod;
}
```

이제 우리는 컨텍스트 매개변수를 사용하고 있다. 이것은 `loggedMethod`에서 `any`와 `any[]`보다 엄격한 타입을 가진다. TypeScript는 메서드 데코레이터가 사용하는 컨텍스트 개체를 모델링하는 `ClassMethodDecoratorContext`라는 유형을 제공한다.

메타데이터 이외에도 메서드의 컨텍스트 개체에는 `addInitializer`라는 유용한 함수가 있다. 이것은 생성자의 시작 부분(또는 정적인 경우 클래스 자체의 초기화)에 연결할 수 있는 방법이다.

예를 들어, 자바스크립트에서는 다음과 같은 패턴을 자주 사용한다.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;

    this.greet = this.greet.bind(this);
  }

  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}
```

대안으로 `greet`는 화살표 함수로 초기화된 속성으로 선언될 수도 있다.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  greet = () => {
    console.log(`Hello, my name is ${this.name}.`);
  };
}
```

이 코드는 `greet`가 독립적인 함수로 호출되거나 콜백으로 전달될 경우 this가 다시 바인딩되지 않도록하는 것을 보장하기 위해 작성되었다.

```tsx
const greet = new Person('Ron').greet; // 원래 실행이 안되지만, this 바인딩이 화살표 함수로 인해 상위스코프로 변경되어 실행가능

// We don't want this to fail!
greet();
```

우리는 `addInitializer`를 사용하여 생성자에서 `bind`를 호출하는 데코레이터를 작성할 수 있다.

```tsx
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = context.name;
  if (context.private) {
    throw new Error(`'bound' cannot decorate private properties like ${methodName as string}.`);
  }
  context.addInitializer(function () {
    this[methodName] = this[methodName].bind(this);
  });
}
```

`bound`는 아무것도 반환하지 않으므로, 메서드를 장식할 때 원래 메서드를 그대로 두고 있다. 대신, 다른 필드가 초기화되기 전에 로직을 추가한다.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @bound
  @loggedMethod
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const p = new Person('Ron');
const greet = p.greet;

// Works!
greet();
```

주목해야 할 점은 두 개의 데코레이터(`@bound`와 `@loggedMethod`)를 중첩해서 사용했다는 것이다. 이러한 데코레이터는 "역순"으로 실행된다. 즉, `@loggedMethod`가 원래의 메소드 `greet`를 꾸미고, `@bound`가 `@loggedMethod`의 결과를 꾸미게 된다. 이 예에서는 상관없지만, 데코레이터가 부수 효과를 가지거나 특정한 순서를 기대하는 경우에는 중요할 수 있다.

또한 스타일적으로 원하는 경우, 이러한 데코레이터를 같은 줄에 작성할 수도 있다.

```tsx
@bound @loggedMethod greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
```

알아차리기 어려울 수 있는 점은 함수를 반환하는 데코레이터 함수를 만들 수 있다는 것이다. 이렇게하면 최종 데코레이터를 약간 수정할 수 있다. 만약 원한다면, `loggedMethod`를 데코레이터를 반환하도록 만들어서 메시지를 로그하는 방법을 사용자화할 수 있다.

```tsx
function loggedMethod(headMessage = 'LOG:') {
  return function actualDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
      console.log(`${headMessage} Entering method '${methodName}'.`);
      const result = originalMethod.call(this, ...args);
      console.log(`${headMessage} Exiting method '${methodName}'.`);
      return result;
    }

    return replacementMethod;
  };
}
```

만약 그렇게 했다면, `loggedMethod`를 decorator로 사용하기 전에 호출해야한다. 그러면 로그 메시지에 사용되는 접두사로 모든 문자열을 전달할 수 있다.

```tsx
class Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  @loggedMethod('')
  greet() {
    console.log(`Hello, my name is ${this.name}.`);
  }
}

const p = new Person('Ron');
p.greet();

// Output:
//
//    Entering method 'greet'.
//   Hello, my name is Ron.
//    Exiting method 'greet'.
```

데코레이터는 메서드에만 적용할 수 있는 것이 아니라, 속성/필드, 게터, 세터, 그리고 자동 접근자에도 적용할 수 있다. 심지어는 클래스 자체도 서브클래싱과 등록과 같은 목적으로 데코레이팅할 수 있다.

## 실험적 레거시 데코레이터와 차이점

지금까지 TypeScript를 사용해본 사람이라면, "실험적" 데코레이터를 지원했다는 것을 알고 있을 것이다. 이러한 실험적 데코레이터는 매우 오래된 데코레이터 제안을 모델로 하고 있었으며, `--experimentalDecorators`이라는 옵션을 지정해주지 않으면 사용할 수 없었다. TypeScript에서 이 옵션 없이 데코레이터를 사용하려고 하면 오류 메시지가 표시된다.

`--experimentalDecorators` 옵션은 앞으로도 계속 존재할 것이다. 하지만 이제부터 데코레이터는 모든 새 코드에서 유효한 구문이다. `--experimentalDecorators`를 사용하지 않은 경우, 이들은 다른 방식으로 타입 체크 및 출력된다. 이들은 충분히 다른 타입 체크 규칙 및 출력 방식을 가지고 있기 때문에, 기존의 데코레이터 함수들이 새로운 동작 방식을 지원할 가능성은 낮다.

이러한 새로운 데코레이터 제안은 `--emitDecoratorMetadata`와 호환되지 않으며, 매개변수에 데코레이터를 지정하는 것은 허용되지 않는다. 앞으로의 ECMAScript 제안들이 이러한 간극을 줄일 수 있을 것이다.

마지막으로, 데코레이터를 `export` 키워드 앞에 놓을 수 있게 됨에 따라, 데코레이터를 `export`나 `export default` 키워드 뒤에 놓을 수도 있게 되었다. 두 가지 스타일을 혼합하는 것은 허용되지 않는다.

```tsx
//  allowed
@register export default class Foo {
    // ...
}

//  also allowed
export default @register class Bar {
    // ...
}

//  error - before *and* after is not allowed
@before export @after class Bar {
    // ...
}
```

## 잘 타입화된 데코레이터 작성

위의 `loggedMethod`와 `bound` 데코레이터 예제는 의도적으로 간단하게 작성되었으며 타입에 관한 많은 세부 정보를 생략하고 있다.

데코레이터에 타입을 지정하는 것은 상당히 복잡할 수 있다. 예를 들어, 위의 `loggedMethod`의 타입이 잘 지정된 버전은 다음과 같을 수 있다.

```tsx
function loggedMethod<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name);

  function replacementMethod(this: This, ...args: Args): Return {
    console.log(`LOG: Entering method '${methodName}'.`);
    const result = target.call(this, ...args);
    console.log(`LOG: Exiting method '${methodName}'.`);
    return result;
  }

  return replacementMethod;
}
```

위 예제에서는 `This`, `Args`, 그리고 `Return`의 유형 매개 변수를 사용하여 `this`, 매개 변수 및 원래 메서드의 반환 타입을 별도로 모델링해야 했다.

데코레이터 함수를 정확히 얼마나 복잡하게 정의할지는 보장하려는 내용에 따라 달라진다. 데코레이터는 작성된 것보다 더 많이 사용되므로 일반적으로 잘 타입화된 버전이 바람직하지만 가독성과는 분명한 상충 관계가 있으므로 단순하게 유지하도록 하자.

데코레이터 작성에 대한 더 많은 문서가 앞으로 제공될 예정이지만 [이 글](https://2ality.com/2022/10/javascript-decorators.html)에서 데코레이터의 메커니즘에 대해 충분히 알 수 있을 것이다.

## `const` 타입 파라미터

객체의 타입을 추론할 때 TypeScript는 일반적인 타입을 선택한다. 예를 들어, 이 경우에 `names`의 추론된 타입은 `string[]`이다.

```tsx
type HasNames = { readonly names: string[] };
function getNamesExactly<T extends HasNames>(arg: T): T['names'] {
  return arg.names;
}

// Inferred type: string[]
const names = getNamesExactly({ names: ['Alice', 'Bob', 'Eve'] });
```

일반적으로 이러한 경우에는 나중에 변이를 활성화하도록 의도되어 있다.

그러나 `getNamesExactly` 함수가 정확히 무엇을 수행하고 어떻게 사용되는지에 따라 더 구체적인 타입이 필요할 수 있다.

지금까지, API 작성자는 일부 위치에 `as const` 추가를 권장하여 원하는 유추를 얻을 수 있었다.

```tsx
// The type we wanted:
//    readonly ["Alice", "Bob", "Eve"]
// The type we got:
//    string[]
const names1 = getNamesExactly({ names: ['Alice', 'Bob', 'Eve'] });

// Correctly gets what we wanted:
//    readonly ["Alice", "Bob", "Eve"]
const names2 = getNamesExactly({ names: ['Alice', 'Bob', 'Eve'] } as const);
```

이는 번거롭고 잊어버리기 쉬울 수 있다. TypeScript 5.0에서는 이제 유형 매개변수 선언에 `const` 수정자를 추가하여 `const`와 유사한 추론이 기본값이 되도록 할 수 있다

```tsx
type HasNames = { names: readonly string[] };
function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
//                       ^^^^^
    return arg.names;
}

// Inferred type: readonly ["Alice", "Bob", "Eve"]
// Note: Didn't need to write 'as const' here
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });
```

`const` 수정자는 변경 가능한 값을 거부하지 않으며, 불변 제약 조건이 필요하지 않다. 변경 가능한 타입 제약 조건을 사용하면 의외의 결과가 나올 수 있다. 예를 들어

```tsx
declare function fnBad<const T extends string[]>(args: T): void;

// 'T' is still 'string[]' since 'readonly ["a", "b", "c"]' is not assignable to 'string[]'
fnBad(["a", "b" ,"c"]);
```

여기에서 `T`의 추론된 후보는 `readonly ["a", "b", "c"]` 이며, 읽기 전용 배열은 변경 가능한 곳에서 사용할 수 없다. 이 경우, 추론이 제약 조건으로 빠지고, 배열은 `string[]`으로 처리되며 호출이 성공적으로 수행된다.

이 함수의 더 나은 정의는 `readonly string[]`을 사용해야 한다.

```tsx
declare function fnGood<const T extends readonly string[]>(args: T): void;

// T is readonly ["a", "b", "c"]
fnGood(["a", "b" ,"c"]);
```

마찬가지로, `const` 수정자는 호출 내에서 작성된 객체, 배열 및 프리미티브 표현식의 추론에만 영향을 미치므로, `as const`로 수정할 수 없는 인수는 동작이 변경되지 않는다는 점을 명심하세요:

```tsx
declare function fnGood<const T extends readonly string[]>(args: T): void;
const arr = ["a", "b" ,"c"];

// 'T' is still 'string[]'-- the 'const' modifier has no effect here
fnGood(arr);
```

## `extends`에서 여러 구성 파일 지원

여러 프로젝트를 관리할 때 다른 `tsconfig.json` 파일에서 확장할 수 있는 "기본" 구성 파일을 갖는 것이 유용할 수 있다. 이것이 바로 TypeScript가 `compilerOptions`에서 필드를 복사할 수 있는 `extends` 필드를 지원하는 이유이다.

```tsx
// packages/front-end/src/tsconfig.json
{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

그러나 여러 구성 파일에서 확장하려는 시나리오가 있을 수 있다. 예를 들어 [npm에 제공된 TypeScript 기본 구성 파일](https://github.com/tsconfig/bases)을 사용한다고 가정해보자. 모든 프로젝트에서 npm의 `@tsconfig/strictest` 패키지의 옵션도 사용하도록 하려면 `tsconfig.base.json`을 `@tsconfig/strictest`에서 확장하는 간단한 해결책이 있다.

```tsx
// tsconfig.base.json
{
    "extends": "@tsconfig/strictest/tsconfig.json",
    "compilerOptions": {
        // ...
    }
}
```

이 방법은 어느 정도 효과가 있다. `@tsconfig/strictest`를 사용하지 않으려는 프로젝트가 있는 경우 해당 옵션을 수동으로 비활성화하거나 `@tsconfig/strictest`에서 확장되지 않는 별도의 `tsconfig.base.json` 버전을 만들어야 한다.

여기에 더 많은 유연성을 제공하기 위해 이제 Typescript 5.0에서는 `extends` 필드에 여러 항목을 사용할 수 있다. 예를 들어, 이 구성 파일에서

```tsx
{
    "extends": ["a", "b", "c"],
    "compilerOptions": {
        // ...
    }
}
```

이렇게 작성하는 것은 `c`를 직접 확장하는 것과 비슷하며, 여기서 `c`는 `b`를 확장하고 `b`는 `a`를 확장한다. 필드가 '충돌'하는 경우 후자의 항목이 우선한다.

따라서 다음 예제에서는 최종 `tsconfig.json`에서 `strictNullChecks`와 `noImplicitAny`가 모두 활성화되어 있다.

```tsx
// tsconfig1.json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}

// tsconfig2.json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}

// tsconfig.json
{
    "extends": ["./tsconfig1.json", "./tsconfig2.json"],
    "files": ["./index.ts"]
}
```

다른 예로, 원래 예제를 다음과 같은 방식으로 다시 작성할 수 있다.

```tsx
// packages/front-end/src/tsconfig.json
{
    "extends": ["@tsconfig/strictest/tsconfig.json", "../../../tsconfig.base.json"],
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

## 모든 `enum`은 유니온 `enum`이다

TypeScript가 처음 열거형을 도입했을 때만 해도 열거형은 동일한 타입을 가진 숫자 상수 집합에 불과했다.

```tsx
enum E {
  Foo = 10,
  Bar = 20,
}
```

`E.Foo`와 `E.Bar`의 유일한 특별한 점은 `E`타입을 예상하는 모든 것에 할당할 수 있다는 것이었다. 그 외에는 그냥 `number`에 불과했다.

```tsx
function takeValue(e: E) {}

takeValue(E.Foo); // works
takeValue(123); // error!
```

타입스크립트 2.0에서 열거형 리터럴 타입이 도입되면서 열거형은 좀 더 특별해졌다. 열거형 리터럴 타입은 각 열거형 멤버에 고유한 타입을 부여하고 열거형 자체를 각 멤버 타입의 합집합으로 만들었다. 또한 열거형 유형의 하위 집합만 참조하고 해당 유형의 범위를 좁힐 수 있게 되었다.

```tsx
// Color is like a union of Red | Orange | Yellow | Green | Blue | Violet
enum Color {
    Red, Orange, Yellow, Green, Blue, /* Indigo */, Violet
}

// Each enum member has its own type that we can refer to!
type PrimaryColor = Color.Red | Color.Green | Color.Blue;

function isPrimaryColor(c: Color): c is PrimaryColor {
    // Narrowing literal types can catch bugs.
    // TypeScript will error here because
    // we'll end up comparing 'Color.Red' to 'Color.Green'.
    // We meant to use ||, but accidentally wrote &&.
    return c === Color.Red && c === Color.Green && c === Color.Blue;
}
```

각 열거형 멤버에 고유한 유형을 부여할 때 발생하는 한 가지 문제는 해당 유형이 멤버의 실제 값과 일부 연관되어 있다는 점이다. 예를 들어 열거형 멤버가 함수 호출로 초기화될 수 있는 경우와 같이 해당 값을 계산할 수 없는 경우도 있다.

```tsx
enum E {
  Blah = Math.random(),
}
```

TypeScript는 이러한 문제가 발생할 때마다 조용히 물러나 기존 열거형 전략을 사용했다. 이는 유니온과 리터럴 타입의 모든 장점을 포기하는 것을 의미했다.

TypeScript 5.0은 계산된 각 멤버에 대해 고유한 타입을 생성하여 모든 열거형을 공용체 열거형으로 만들 수 있다. 즉, 이제 모든 열거형을 좁혀서 그 멤버를 타입으로 참조할 수 있다.

버전에 따른 차이를 확인할 수 있다.

![](https://velog.velcdn.com/images/hustle-dev/post/cef1346d-e39c-4176-9d7c-5e1216c63bdd/image.png)

![](https://velog.velcdn.com/images/hustle-dev/post/0640bb6e-ead3-4047-b8cf-3115d8ababf4/image.png)

## **`--moduleResolution bundler`**

TypeScript 4.7에는 `--module` 및 `--moduleResolution`설정에 대한 `node16` 및 `nodenext` 옵션이 도입되었다. 이 옵션의 의도는 Node.js에서 ECMAScript 모듈에 대한 정확한 조회 규칙을 더 잘 모델링하기 위한 것이었지만, 이 모드에는 다른 도구에서는 실제로 적용되지 않는 많은 제한이 있다.

예를 들어, Node.js의 ECMAScript 모듈에서 모든 상대 가져오기에는 파일 확장명이 포함되어야 한다.

```tsx
// entry.mjs
import * as utils from './utils'; //  wrong - we need to include the file extension.

import * as utils from './utils.mjs'; //  works
```

파일 조회 속도가 빨라지고 순수한 파일 서버에서 더 잘 작동하는 등 Node.js와 브라우저에는 특정한 이유가 있다. 하지만 번들러와 같은 도구를 사용하는 많은 개발자에게는 번들러에는 이러한 제한이 대부분 없기 때문에 `node16/nodenext` 설정이 번거로웠다. 어떤 면에서는 `node` resolution 모드가 번들러를 사용하는 모든 사용자에게 더 좋았다.

하지만 어떤 면에서는 원래의 `node` resolution 모드는 이미 시대에 뒤떨어진 모드였다. 대부분의 최신 번들러는 Node.js에서 ECMAScript 모듈과 CommonJS 조회 규칙의 융합을 사용한다. 예를 들어, 확장자 없는 가져오기는 CommonJS에서처럼 잘 작동하지만 패키지의 [export condition](https://nodejs.org/api/packages.html#nested-conditions)을 살펴볼 때는 ECMAScript 파일에서와 같은 `import` 조건을 선호한다.

번들러의 작동 방식을 모델링하기 위해 TypeScript는 이제 새로운 전략인 `--moduleResolution` 번들러를 도입한다.

```tsx
{
    "compilerOptions": {
        "target": "esnext",
        "moduleResolution": "bundler"
    }
}
```

하이브리드 조회 전략을 구현하는 Vite, esbuild, swc, Webpack, Parcel 등의 최신 번들러를 사용 중이라면 새로운 `bundler`옵션이 적합할 것이다.

반면에 npm에 게시할 라이브러리를 작성하는 경우 번들러 옵션을 사용하면 번들러를 사용하지 않는 사용자에게 발생할 수 있는 호환성 문제를 숨길 수 있다. 따라서 이러한 경우에는 `node16` 또는 `nodenext` 해결 옵션을 사용하는 것이 더 나은 방법일 수 있다.

## Resolution 커스터마이징 플래그

자바스크립트 도구는 이제 위에서 설명한 번들러 모드에서와 같이 "하이브리드" resolution 규칙을 모델링할 수 있다. 도구마다 지원되는 기능이 조금씩 다를 수 있으므로 TypeScript 5.0에서는 사용자 구성에 따라 작동하거나 작동하지 않을 수 있는 몇 가지 기능을 활성화 또는 비활성화할 수 있는 방법을 제공한다.

### `allowImportingTsExtensions`

`--allowImportingTsExtensions`를 사용하면 TypeScript 파일이 `.ts`, `.mts` 또는 `.tsx`와 같은 TypeScript 전용 확장자를 사용하여 서로를 임포트할 수 있다.

이 플래그는 `--noEmit` 또는 `--emitDeclarationOnly`가 활성화된 경우에만 허용되는데, 이는 이러한 가져오기 경로가 JavaScript 출력 파일에서 런타임에 확인되지 않기 때문이다. 여기서 기대하는 것은 리졸버(예: 번들러, 런타임 또는 기타 도구)가 `.ts` 파일 간의 이러한 가져오기를 작동시킬 것이라는 점이다.

### `resolvePackageJsonExports`

`--resolvePackageJsonExports`는 TypeScript가 `node_modules`의 패키지에서 읽을 경우 [package.json 파일의 내보내기 필드](https://nodejs.org/api/packages.html#exports)를 참조하도록 한다.

이 옵션은 `--moduleResolution`에 대한 `node16`, `nodenext` 및 번들러 옵션에서 기본값이 `true`로 설정된다.

### `resolvePackageJsonImports`

`--resolvePackageJsonImports`는 조상 디렉터리에 `package.json`이 포함된 파일에서 `#`으로 시작하는 조회를 수행할 때 TypeScript가 [package.json 파일의 import 필드](https://nodejs.org/api/packages.html#imports)를 참조하도록 강제한다.

이 옵션은 `--moduleResolution`에 대한 `node16`, `nodenext` 및 번들러 옵션에서 기본값이 `true`로 설정된다.

### **`allowArbitraryExtensions`**

TypeScript 5.0에서 가져오기 경로가 알려진 JavaScript 또는 TypeScript 파일 확장자가 아닌 확장자로 끝나는 경우 컴파일러는 `{파일 기본 이름}.d.{확장자}.ts` 형식의 해당 경로에 대한 선언 파일을 찾는다. 예를 들어 번들러 프로젝트에서 CSS 로더를 사용하는 경우 해당 스타일시트에 대한 선언 파일을 작성(또는 생성)해야 할 수 있다

```tsx
/* app.css */
.cookie-banner {
  display: none;
}
```

```tsx
// app.d.css.ts
declare const css: {
  cookieBanner: string;
};
export default css;
```

```tsx
// App.tsx
import styles from './app.css';

styles.cookieBanner; // string
```

기본적으로 이 가져오기는 TypeScript가 이 파일 형식을 이해하지 못하며 런타임에서 가져오기를 지원하지 않을 수 있음을 알리는 오류를 발생시킨다. 하지만 런타임이나 번들러가 이 오류를 처리하도록 구성한 경우 새로운 `--allowArbitraryExtensions` 컴파일러 옵션을 사용하여 오류를 억제할 수 있다.

이전에는 `app.d.css.ts` 대신 `app.css.d.ts`라는 선언 파일을 추가하여 비슷한 효과를 얻을 수 있었지만, 이는 CommonJS에 대한 Node의 요구 해결 규칙을 통해 작동했을 뿐이다. 엄밀히 말하면, 전자는 `app.css.js`라는 JavaScript 파일에 대한 선언 파일로 해석된다. 상대 파일 가져오기는 Node의 ESM 지원에서 확장자를 포함해야 하므로, 예제에서 `--moduleResolution` `node16` 또는 `nodenext` 아래의 ESM 파일에서 TypeScript가 오류를 일으킨다.

## **`customConditions`**

`--customConditions`는 `package.json`의 [`exports`] 또는 ([https://nodejs.org/api/packages.html#exports](https://nodejs.org/api/packages.html#exports)) 또는 import 필드에서 TypeScript가 확인할 때 성공해야 하는 추가 조건의 목록을 받는다. 이러한 조건은 리졸버가 기본적으로 사용하는 기존 조건에 추가된다.

예를 들어 이 필드가 `tsconfig.json`에 다음과 같이 설정되어 있는 경우이다

```tsx
{
    "compilerOptions": {
        "target": "es2022",
        "moduleResolution": "bundler",
        "customConditions": ["my-condition"]
    }
}
```

`package.json`에서 내보내기 또는 가져오기 필드가 참조될 때마다 TypeScript는 `my-condition`이라는 조건을 고려한다.

따라서 다음과 같은 `package.json`이 있는 패키지에서 가져올 때

```tsx
{
    // ...
    "exports": {
        ".": {
            "my-condition": "./foo.mjs",
            "node": "./bar.mjs",
            "import": "./baz.mjs",
            "require": "./biz.mjs"
        }
    }
}
```

TypeScript는 `foo.mjs`에 해당하는 파일을 찾으려고 시도한다.

이 필드는 `--moduleResolution`에 대한 `node16`, `nodenext` 및 `bundler` 옵션에서만 유효하다.

## **`--verbatimModuleSyntax`**

기본적으로 TypeScript는 가져오기 엘리전스라는 것을 수행한다. 기본적으로 다음과 같이 작성하면

```tsx
import { Car } from './car';

export function drive(car: Car) {
  // ...
}
```

TypeScript는 타입에 대해서만 가져오기를 사용하고 있음을 감지하고 가져오기를 완전히 삭제한다. 출력 자바스크립트는 다음과 같이 보일 수 있다

```tsx
export function drive(car) {
  // ...
}
```

`Car`가 `./car`에서 내보낸 값이 아닌 경우 런타임 오류가 발생하기 때문에 대부분의 경우 이 방법이 좋다.

하지만 특정 에지 케이스의 경우 복잡성이 추가된다. 예를 들어, `import "./car";` 와 같은 문이 없으므로 가져오기가 완전히 삭제되었다. 이는 실제로 부작용이 있는 모듈과 없는 모듈에 차이를 만든다.

자바스크립트에 대한 타입스크립트의 임포트 전략에는 또 다른 몇 가지 복잡한 계층이 있다. 임포트 생략은 항상 임포트가 어떻게 사용되는지에 따라 결정되는 것이 아니라 값이 선언되는 방식도 참조하는 경우가 많다. 따라서 다음과 같은 코드가 보존하거나 삭제 되어야 하는지는 항상 명확하지는 않다.

```tsx
export { Car } from './car';
```

`Car`가 클래스와 같이 선언된 경우 결과 JavaScript 파일에 보존될 수 있다. 그러나 `Car`가 `type` alias이나 `interface`로만 선언된 경우 JavaScript 파일은 `Car`를 전혀 내보내지 않아야 한다.

TypeScript는 파일 전반의 정보를 기반으로 이러한 내보내기 결정을 내릴 수 있지만 모든 컴파일러에서 가능한 것은 아니다.

가져오기 및 내보내기의 `type` 수정자는 이러한 상황에 약간 도움이 된다. `type` 수정자를 사용하면 가져오기 또는 내보내기가 타입 분석에만 사용되는지 여부를 명시할 수 있으며, JavaScript 파일에서 완전히 삭제할 수 있다.

```tsx
// This statement can be dropped entirely in JS output
import type * as car from './car';

// The named import/export 'Car' can be dropped in JS output
import { type Car } from './car';
export { type Car } from './car';
```

`type` 수정자는 그 자체로는 그다지 유용하지 않다. 기본적으로 모듈 elision은 여전히 가져오기를 삭제하며, 타입과 일반 가져오기 및 내보내기를 구분하도록 강제하는 것은 없다. 따라서 TypeScript에는 `type` 수정자를 사용하도록 하는 `--importsNotUsedAsValues` 플래그, 일부 모듈 엘리션 동작을 방지하는 `--preserveValueImports` 플래그, TypeScript 코드가 여러 컴파일러에서 작동하는지 확인하는 `--isolatedModules` 플래그가 있다. 안타깝게도 이 세 가지 플래그의 세부 사항을 이해하는 것은 어렵고 예기치 않은 동작이 발생하는 에지 케이스가 여전히 존재한다.

TypeScript 5.0에서는 상황을 단순화하기 위해 `--verbatimModuleSyntax`라는 새로운 옵션이 도입되었다. `type` 수정자가 없는 모든 가져오기 또는 내보내기는 그대로 유지되므로 규칙이 훨씬 더 간단해졌다. `type` 수정자를 사용하는 모든 항목은 완전히 삭제된다.

```tsx
// Erased away entirely.
import type { A } from 'a';

// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from 'bcd';

// Rewritten to 'import {} from "xyz";'
import { type xyz } from 'xyz';
```

이 새로운 옵션을 사용하면 보이는 그대로를 얻을 수 있다.

하지만 모듈 상호 운용과 관련하여 몇 가지 시사점이 있다. 이 플래그를 사용하면 설정 또는 파일 확장자가 다른 모듈 시스템을 암시하는 경우 ECMAScript 가져오기 및 내보내기가 호출을 요구하도록 다시 작성되지 않는다. 대신 오류가 발생한다. `require` 및 `module.exports`를 사용하는 코드를 내보내야 하는 경우 ES2015 이전의 TypeScript의 모듈 구문을 사용해야 한다:

![](https://velog.velcdn.com/images/hustle-dev/post/742d9b38-9d30-4cd3-95b6-750dfa9a7559/image.png)

이는 제한 사항이지만 일부 문제를 더 명확하게 파악하는 데 도움이 된다. 예를 들어, `package.json`의 `--module node16`에서 타입 필드를 설정하는 것을 잊어버리는 경우가 매우 흔하다. 그 결과, 개발자는 이를 깨닫지 못한 채 ES 모듈 대신 CommonJS 모듈을 작성하기 시작하여 예상치 못한 조회 규칙과 JavaScript 출력을 제공하게 된다. 이 새로운 플래그는 구문이 의도적으로 다르기 때문에 사용 중인 파일 형식에 대해 의도적으로 확인할 수 있다.

`-verbatimModuleSyntax`은 `--importsNotUsedAsValues` 및 `--preserveValueImports`보다 더 일관된 스토리를 제공하므로, 기존의 두 플래그는 이 구문으로 대체된다.

## **Support for `export type *`**

TypeScript 3.8에서 타입 전용 import가 도입되면서, 이 새로운 문법은 `export * from "module"` 또는 `export * as ns from "module"` 재내보내기에서 사용이 불가능했다. TypeScript 5.0에서는 이 두 형태를 지원한다.

```tsx
// models/vehicles.ts
export class Spaceship {
  // ...
}

// models/index.ts
export type * as vehicles from './vehicles';

// main.ts
import { vehicles } from './models';

function takeASpaceship(s: vehicles.Spaceship) {
  //  ok - `vehicles` only used in a type position
}

function makeASpaceship() {
  return new vehicles.Spaceship();
  //         ^^^^^^^^
  // 'vehicles' cannot be used as a value because it was exported using 'export type'.
}
```

## **`@satisfies` Support in JSDoc**

타입스크립트 4.9에는 `satisfies` 연산자가 도입되었다. 이 연산자는 타입 자체에 영향을 주지 않고 표현식의 타입이 호환되는지 확인한다. 예를 들어 다음 코드를 살펴보자.

```tsx
interface CompilerOptions {
  strict?: boolean;
  outDir?: string;
  // ...
}

interface ConfigSettings {
  compilerOptions?: CompilerOptions;
  extends?: string | string[];
  // ...
}

let myConfigSettings = {
  compilerOptions: {
    strict: true,
    outDir: '../lib',
    // ...
  },

  extends: ['@tsconfig/strictest/tsconfig.json', '../../../tsconfig.base.json'],
} satisfies ConfigSettings;
```

여기서 TypeScript는 `myConfigSettings.extends`가 배열로 선언되었음을 알고 있다. 이는 `satisfies`가 객체의 타입을 확인했지만 `ConfigSettings`로 강제 형변환하여 정보를 잃지 않았기 때문이다. 그래서 `extends`에 map함수를 사용하여도 괜찮다.

```tsx
declare function resolveConfig(configPath: string): CompilerOptions;

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

이 기능은 TypeScript 사용자에게 유용했지만, 많은 사람들이 JSDoc 주석을 사용하여 JavaScript 코드를 타입 검사하는 데 TypeScript를 사용한다. 그렇기 때문에 TypeScript 5.0에서는 똑같은 기능을 하는 `@satisfies`라는 새로운 JSDoc 태그가 지원된다.

`/** @satisfies */`는 타입 불일치를 포착할 수 있다

```tsx
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @satisfies {CompilerOptions}
 */
let myCompilerOptions = {
  outdir: '../lib',
  //  ~~~~~~ oops! we meant outDir
};
```

하지만 표현식의 원래 타입이 유지되므로 나중에 코드에서 값을 더 정확하게 사용할 수 있다.

```tsx
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @typedef ConfigSettings
 * @prop {CompilerOptions} [compilerOptions]
 * @prop {string | string[]} [extends]
 */

/**
 * @satisfies {ConfigSettings}
 */
let myConfigSettings = {
  compilerOptions: {
    strict: true,
    outDir: '../lib',
  },
  extends: ['@tsconfig/strictest/tsconfig.json', '../../../tsconfig.base.json'],
};

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

괄호로 묶인 표현식에서 `/** @satisfies */`를 인라인으로 사용할 수도 있다. `myConfigSettings`를 다음과 같이 작성할 수 있다

```tsx
let myConfigSettings = /** @satisfies {ConfigSettings} */ {
  compilerOptions: {
    strict: true,
    outDir: '../lib',
  },
  extends: ['@tsconfig/strictest/tsconfig.json', '../../../tsconfig.base.json'],
};
```

일반적으로 함수 호출과 같은 다른 코드에서 더 깊숙이 들어가면 더 의미가 있다.

```tsx
compileCode(
  /** @satisfies {ConfigSettings} */ {
    // ...
  }
);
```

## **`@overload` Support in JSDoc**

타입스크립트에서는 함수에 오버로드를 지정할 수 있다. 오버로드를 사용하면 함수를 다른 인수로 호출할 수 있고 다른 결과를 반환할 수도 있다. 오버로드를 사용하면 호출자가 실제로 함수를 사용하는 방법을 제한하고 어떤 결과를 반환할지 구체화할 수 있다.

```tsx
// Our overloads:
function printValue(str: string): void;
function printValue(num: number, maxFractionDigits?: number): void;

// Our implementation:
function printValue(value: string | number, maximumFractionDigits?: number) {
  if (typeof value === 'number') {
    const formatter = Intl.NumberFormat('en-US', {
      maximumFractionDigits,
    });
    value = formatter.format(value);
  }

  console.log(value);
}
```

여기서는 `printValue`가 문자열 또는 숫자를 첫 번째 인자로 받는다고 했다. 숫자를 인자로 받으면 두 번째 인자로 인쇄할 수 있는 소수점 자릿수를 결정할 수 있다.

TypeScript 5.0에서는 이제 JSDoc이 새로운 `@overload` 태그를 사용하여 오버로드를 선언할 수 있다. 오버로드 태그가 있는 각 JSDoc 주석은 다음 함수 선언에 대해 별개의 오버로드로 취급된다.

```tsx
// @ts-check

/**
 * @overload
 * @param {string} value
 * @return {void}
 */

/**
 * @overload
 * @param {number} value
 * @param {number} [maximumFractionDigits]
 * @return {void}
 */

/**
 * @param {string | number} value
 * @param {number} [maximumFractionDigits]
 */
function printValue(value, maximumFractionDigits) {
  if (typeof value === 'number') {
    const formatter = Intl.NumberFormat('en-US', {
      maximumFractionDigits,
    });
    value = formatter.format(value);
  }

  console.log(value);
}
```

이제 TypeScript 파일로 작성하든 JavaScript 파일로 작성하든 상관없이 TypeScript는 함수를 잘못 호출했는지 알려줄 수 있다.

```tsx
// all allowed
printValue('hello!');
printValue(123.45);
printValue(123.45, 2);

printValue('hello!', 123); // error!
```

## **Passing Emit-Specific Flags Under `--build`**

이제 타입스크립트에서 `--build` 모드에서 다음 플래그를 전달할 수 있다.

- `--declaration`
- `—-emitDeclarationOnly`
- `—-declarationMap`
- `—-sourceMap`
- `—-inlineSourceMap`

이렇게 하면 개발 빌드와 프로덕션 빌드가 다를 수 있는 빌드의 특정 부분을 훨씬 쉽게 커스터마이징할 수 있다.

예를 들어 라이브러리의 개발 빌드에서는 선언 파일을 생성할 필요가 없지만 프로덕션 빌드에서는 생성해야 할 수 있다. 프로젝트에서 선언 파일 생성을 기본적으로 해제하도록 구성하고

```bash
tsc --build -p ./my-project-dir
```

내부 루프에서 반복을 완료하면 "프로덕션" 빌드에서 `--declaration` 플래그를 전달하기만 하면 된다.

```bash
tsc --build -p ./my-project-dir --declaration
```

## **Case-Insensitive Import Sorting in Editors**

Visual Studio 및 VS Code와 같은 편집기에서 TypeScript는 가져오기 및 내보내기를 구성하고 정렬하는 환경을 지원한다. 하지만 종종 목록이 '정렬'되는 시점에 대해 서로 다른 해석이 있을 수 있다.

예를 들어 다음 가져오기 목록은 정렬되어 있을까?

```tsx
import { Toggle, freeze, toBoolean } from './utils';
```

의외로 대답은 "상황에 따라 다르다"일 수 있다. 대소문자 구분을 신경 쓰지 않는다면 이 목록은 정렬되지 않은 것이 분명하다. 문자 `f`는 `t`와 `T` 앞에온다.

하지만 대부분의 프로그래밍 언어에서 정렬은 기본적으로 문자열의 바이트 값을 비교한다. 자바스크립트가 문자열을 비교하는 방식은 ASCII 문자 인코딩에 따라 대문자가 소문자보다 먼저 오기 때문에 항상 "`Toggle`"이 "`Freeze`"보다 먼저 온다는 것을 의미한다. 따라서 이러한 관점에서 가져오기 목록이 정렬된다.

이전에 TypeScript는 대소문자를 구분하는 기본 정렬을 수행했기 때문에 가져오기 목록이 정렬된 것으로 간주했다. 대소문자를 구분하지 않는 정렬을 선호하거나 기본적으로 대소문자를 구분하지 않는 정렬이 필요한 ESLint와 같은 도구를 사용하는 개발자에게는 불만스러운 점이 될 수 있다.

이제 TypeScript는 기본적으로 대소문자 구분을 감지한다. 즉, TypeScript와 ESLint와 같은 도구가 임포트를 가장 잘 정렬하는 방법을 놓고 서로 '싸우지' 않는다는 뜻이다.

저희 팀에서는 추가적인 정렬 전략도 실험하고 있으며, 이에 대한 내용은 여기에서 확인할 수 있다. 이러한 옵션은 결국 편집자가 구성할 수 있다. 현재로서는 아직 불안정하고 실험적인 상태이며, 지금 바로 VS Code에서 JSON 옵션의 `typescript.unstable`항목을 사용하여 해당 옵션을 선택할 수 있다. 다음은 사용해 볼 수 있는 모든 옵션이다(기본값으로 설정됨)

```tsx
{
    "typescript.unstable": {
        // Should sorting be case-sensitive? Can be:
        // - true
        // - false
        // - "auto" (auto-detect)
        "organizeImportsIgnoreCase": "auto",

        // Should sorting be "ordinal" and use code points or consider Unicode rules? Can be:
        // - "ordinal"
        // - "unicode"
        "organizeImportsCollation": "ordinal",

        // Under `"organizeImportsCollation": "unicode"`,
        // what is the current locale? Can be:
        // - [any other locale code]
        // - "auto" (use the editor's locale)
        "organizeImportsLocale": "en",

        // Under `"organizeImportsCollation": "unicode"`,
        // should upper-case letters or lower-case letters come first? Can be:
        // - false (locale-specific)
        // - "upper"
        // - "lower"
        "organizeImportsCaseFirst": false,

        // Under `"organizeImportsCollation": "unicode"`,
        // do runs of numbers get compared numerically (i.e. "a1" < "a2" < "a100")? Can be:
        // - true
        // - false
        "organizeImportsNumericCollation": true,

        // Under `"organizeImportsCollation": "unicode"`,
        // do letters with accent marks/diacritics get sorted distinctly
        // from their "base" letter (i.e. is é different from e)? Can be
        // - true
        // - false
        "organizeImportsAccentCollation": true
    },
    "javascript.unstable": {
        // same options valid here...
    },
}
```

## **Exhaustive `switch`/`case` Completions**

이제 스위치 문을 작성할 때 TypeScript는 검사 대상 값에 리터럴 타입이 있는지 감지한다. 그렇다면 발견되지 않은 각 대소문자를 스캐폴딩하는 완결성을 제공한다.

![](https://velog.velcdn.com/images/hustle-dev/post/64923339-79c3-4012-9aec-3c566381086d/image.png)

## **Speed, Memory, and Package Size Optimizations**

TypeScript 5.0에는 코드 구조, 데이터 구조 및 알고리즘 구현 전반에 걸쳐 많은 강력한 변경 사항이 포함되어 있다. 이 모든 것이 의미하는 바는 TypeScript를 실행하는 것뿐만 아니라 설치하는 것까지 전체 경험이 더 빨라진다는 것이다.

다음은 TypeScript 4.9와 비교하여 속도와 크기 면에서 달성한 몇 가지 흥미로운 성과이다.

| Scenario                            | Time or Size Relative to TS 4.9 |
| ----------------------------------- | ------------------------------- |
| material-ui build time              | 90%                             |
| TypeScript Compiler startup time    | 89%                             |
| Playwright build time               | 88%                             |
| TypeScript Compiler self-build time | 87%                             |
| Outlook Web build time              | 82%                             |
| VS Code build time                  | 80%                             |
| typescript npm Package Size         | 59%                             |

![](https://velog.velcdn.com/images/hustle-dev/post/153b57fc-16cf-4b85-a7b3-931f22cba405/image.png)

![](https://velog.velcdn.com/images/hustle-dev/post/b96f4e2a-9ae7-43c7-87ea-e2039589552c/image.png)

앞으로 몇 가지 주목할 만한 개선 사항을 더 자세히 알려드리고자 한다. 하지만 블로그 포스팅을 기다리게 하지는 않겠다.

우선, 최근 네임스페이스에서 모듈로 TypeScript를 마이그레이션하여 스코프 호이스트와 같은 최적화를 수행할 수 있는 최신 빌드 툴을 활용할 수 있게 되었다. 이 툴을 사용하여 패키징 전략을 재검토하고 더 이상 사용되지 않는 코드를 제거함으로써 TypeScript 4.9의 63.8MB 패키지 크기에서 약 26.4MB를 줄일 수 있었다. 또한 직접 함수 호출을 통해 눈에 띄는 속도 향상을 가져왔다.

또한 TypeScript는 컴파일러 내의 내부 객체 유형에 더 많은 균일성을 추가했으며, 일부 객체 유형에 저장되는 데이터도 슬림화했다. 이를 통해 다형성 연산을 줄이면서 객체 모양을 더 균일하게 만드는 데 따른 메모리 사용량 증가의 균형을 맞출 수 있었다.

또한 정보를 문자열로 직렬화할 때 일부 캐싱을 수행했다. 오류 보고, 선언 방출, 코드 완성 등의 일부로 발생할 수 있는 유형 표시는 결국 상당히 많은 비용을 초래할 수 있다. 이제 TypeScript는 이러한 작업에서 재사용할 수 있도록 일반적으로 사용되는 몇 가지 메커니즘을 캐싱한다.

구문 분석기를 개선한 또 다른 주목할 만한 변경 사항은 var를 활용하여 클로저에서 let과 const를 사용하는 데 드는 비용을 가끔씩 우회하는 것이다. 이를 통해 구문 분석 성능이 일부 개선되었다.

전반적으로 대부분의 코드베이스에서 TypeScript 5.0에서 속도 향상을 기대할 수 있으며, 지속적으로 10%에서 20% 사이의 속도 향상을 재현할 수 있었다. 물론 하드웨어와 코드베이스 특성에 따라 다르겠지만, 지금 바로 코드베이스에서 사용해 보시기 바란다!

## **Breaking Changes and Deprecations**

### **Runtime Requirements**

TypeScript는 이제 ECMAScript 2018을 대상으로 한다. TypeScript 패키지는 또한 최소 예상 엔진을 12.20으로 설정했다. Node 사용자의 경우 TypeScript 5.0의 최소 버전 요구 사항이 Node.js 12.20 이상이라는 뜻이다.

### `lib.d.ts` Changes

DOM의 유형이 생성되는 방식이 변경되어 기존 코드에 영향을 미칠 수 있다. 특히 특정 프로퍼티가 숫자에서 숫자 리터럴 타입으로 변환되었으며, 잘라내기, 복사, 붙여넣기 이벤트 처리를 위한 프로퍼티와 메서드가 인터페이스 전반으로 이동되었다.

### API Breaking Changes

TypeScript 5.0에서는 모듈로 전환하고, 불필요한 인터페이스를 제거했으며, 일부 정확성을 개선했다.

### Forbidden Implicit Coercions in Relational Operators

TypeScript의 특정 연산은 암시적으로 문자열을 숫자로 강제 변환할 수 있는 코드를 작성할 경우 이미 경고한다.

```tsx
function func(ns: number | string) {
  return ns * 4; // Error, possible implicit coercion
}
```

5.0에서는 관계 연산자 >, <, <=, >=에도 이 기능이 적용될 예정이다

```tsx
function func(ns: number | string) {
  return ns > 4; // Now also an error
}
```

원하는 경우 이를 허용하려면 +를 사용하여 피연산자를 숫자로 명시적으로 강제할 수 있다.

```tsx
function func(ns: number | string) {
  return +ns > 4; // OK
}
```

### Enum Overhaul

TypeScript는 처음 출시된 이래로 열거형과 관련하여 오랜 기간 동안 몇 가지 이상한 점이 있었다. 5.0에서는 이러한 문제 중 일부를 해결하고 선언할 수 있는 다양한 열거형 유형을 이해하는 데 필요한 개념 수를 줄였다.

그 일환으로 두 가지 주요 오류가 새로 추가되었다. 첫 번째는 열거형 유형에 도메인 외부 리터럴을 할당하면 이제 예상대로 오류가 발생한다는 것이다.

```tsx
enum SomeEvenDigit {
  Zero = 0,
  Two = 2,
  Four = 4,
}

// Now correctly an error
let m: SomeEvenDigit = 1;
```

다른 하나는 숫자와 간접 문자열 열거형 참조가 혼합되어 선언된 값이 있는 열거형은 모든 숫자 열거형을 잘못 생성한다는 것이다.

```tsx
enum Letters {
  A = 'a',
}
enum Numbers {
  one = 1,
  two = Letters.A,
}

// Now correctly an error
const t: number = Numbers.two;
```

### **More Accurate Type-Checking for Parameter Decorators in Constructors Under `--experimentalDecorators`**

TypeScript 5.0에서는 `--experimentalDecorators` 아래의 데코레이터에 대한 유형 검사가 더 정확해졌다. 이것이 분명하게 드러나는 한 곳은 생성자 매개변수에 데코레이터를 사용할 때이다.

```tsx
export declare const inject: (entity: any) => (target: object, key: string | symbol, index?: number) => void;

export class Foo {}

export class C {
  constructor(@inject(Foo) private x: any) {}
}
```

이 호출은 `key`가 `string | symbol`를 기대하지만 생성자 매개 변수가 `undefined` 키를 수신하기 때문에 실패한다. 올바른 수정 방법은 `inject` 내에서 키 유형을 변경하는 것이다. 업그레이드할 수 없는 라이브러리를 사용하는 경우 합리적인 해결 방법은 `inject`를 보다 유형에 안전한 데코레이터 함수로 감싸고 키에 타입 단언을 사용하는 것이다.

### **Deprecations and Default Changes**

TypeScript 5.0에서는 다음 설정 및 설정 값이 더 이상 사용되지 않는다

- `--target: ES3`
- `--out`
- `--noImplicitUseStrict`
- `--keyofStringsOnly`
- `--suppressExcessPropertyErrors`
- `--suppressImplicitAnyIndexErrors`
- `--noStrictGenericChecks`
- `--charset`
- `--importsNotUsedAsValues`
- `--preserveValueImports`
- `prepend` in project references

이러한 설정은 TypeScript 5.5까지 계속 허용될 것이며, 그때까지 이러한 설정을 사용하면 경고가 발생하지만, `"ignoreDeprecations": "5.0"`을 지정하여 이러한 경고를 무시할 수 있다. TypeScript 5.0 및 이후 릴리스 5.1, 5.2, 5.3 및 5.4에서 교차 플랫폼 동작을 더 개선하기 위해 일부 설정을 변경했다.

자바스크립트 파일에 출력되는 줄 끝을 제어하는 `--newLine`은 이제 명시하지 않으면 현재 운영 체제에 따라 추론되지 않으며, 가능한 한 결정론적인 빌드가 되어야 한다고 생각한다. 또한, Windows Notepad가 이제 줄 끝 행 종결자를 지원하므로, 새로운 기본 설정은 `LF`이다. 예전의 OS별 추론 동작은 더 이상 사용할 수 없다.

프로젝트 내에서 동일한 파일 이름을 참조하는 모든 참조가 케이스에 대해 동의하도록 보장하는 `--forceConsistentCasingInFileNames`은 이제 `true`로 기본 설정된다. 이것은 케이스가 대소문자를 구분하지 않는 파일 시스템에서 작성된 코드에 대한 차이점 문제를 해결하는 데 도움이 될 수 있다.
