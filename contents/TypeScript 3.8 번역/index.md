---
title: TypeScript 3.8 번역
description: TypeScript 3.8 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2022-12-30
slug: /translate-ts-3-8
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html

## Type-Only Imports와 Export

이 기능은 대부분의 사용자에겐 생각할 필요가 없는 기능이지만, [isolatedModules](https://www.typescriptlang.org/tsconfig#isolatedModules), TS의 `transpileModule` API 또는 Babel에서 문제가 발생하면 이 기능과 관련이 있을 수 있다.

TS 3.8은 type-only imports, exports를 위한 새로운 구문이 추가되었다.

```ts
import type { SomeThing } from './some-module.js';
export type { SomeThing };
```

`impmort type`은 타입 표기와 선언에 사용될 선언만 import 한다. 이는 항상 완전히 제거되므로, 런타임에 남아있는 것은 없다. 마찬가지로 `export type`은 타입 문맥에 사용할 export만 제공하며, 이 또한 TS의 output에서 제거된다.

클래스는 런타임에 값을 가지고 있고, design-time(프로그래머가 코딩하는중)에 타입이 있으며 상황에 따라 사용이 다르다는 것에 유의해야 한다. 클래스를 import 하기 위해 `import type`을 사용하면, 확장 같은 것은 할 수 없다.

```ts
import type { Component } from 'react';
interface ButtonProps {
  // ...
}
class Button extends Component<ButtonProps> {
  //               ~~~~~~~~~
  // error! 'Component' only refers to a type, but is being used as a value here.
  // ...
}
```

이전에 Flow를 사용해본 적이 있다면, 이 구문은 상당하게 유사하다. 한 가지 차이점은 코드가 모호해 보이지 않도록 몇 가지 제한을 두었다는 것이다.

```ts
// Is only 'Foo' a type? Or every declaration in the import?
// We just give an error because it's not clear.
import type Foo, { Bar, Baz } from 'some-module';
//     ~~~~~~~~~~~~~~~~~~~~~~
// error! A type-only import can specify a default import or
```

`import type`과 함께, TS 3.8은 런타임 시 사용되지 않는 import에서 발생하는 작업을 제어하기 위해 새로운 컴파일 플래그를 추가한다: [importsNotUsedAsValues](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues) 이 플래그는 3 가지 다른 값을 가진다.

- `remove`: 이는 기본값으로, imports를 제거하는 동작이며, 기존 동작을 바꾸는 플래그는 아니다.
- `preserve`: 이는 사용되지 않는 값들을 모두 보존한다. 이로 인해 imports/사이드 이펙트가 보존될 수 있다.
- `error`: 이는 모든(`preserve` 옵션처럼) 모든 imports를 보존하지만, import 값이 타입으로만 사용될 경우 오류를 발생시킨다. 이는 실수로 값을 import하지 않지만 사이드 이펙트 import를 명시적으로 만들고 싶을 때 유용하다.

이 기능에 대한 자세한 정보는 `import type`이 선언될 수 있는 범위를 확대하는 [PR](https://github.com/microsoft/TypeScript/pull/35200)과 [관련된 변경 사항](https://github.com/microsoft/TypeScript/pull/36092/)에서 확인할 수 있다.

## ECMAScript 비공개 필드

TS 3.8은 ECMAScript의 [stage-3 클래스 필드 제안](https://github.com/tc39/proposal-class-fields/)의 비공개 필드를 지원한다.

```ts
class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
let jeremy = new Person('Jeremy Bearimy');
jeremy.#name;
//     ~~~~~
// Property '#name' is not accessible outside class 'Person'
// because it has a private identifier.
```

일반적인 프로퍼티들과 달리, 비공개 필드는 몇 가지 주의해야할 규칙이 있다.

- 비공개 필드는 `#`문자로 시작한다. 때때로 이를 비공개 이름이라고 부른다.
- 모든 비공개 필드 이름은 이를 포함한 클래스 범위에서 유일하다.
- `public` 또는 `private` 같은 TS 접근 지정자는 비공개 필드로 사용될 수 없다.
- JS 사용자로부터도 비공개 필드는 이를 포함한 클래스 밖에서 접근하거나 탐지할 수 없다. 때때로 이를 강한 비공개(hard privacy)라고 부른다.

hard privacy와 별개로, 비공개 필드의 또 다른 장점은 유일하다는 것이다. 예를 들어, 일반적인 프로퍼티 선언은 하위클래스에서 덮어쓰기 쉽다.

```ts
class C {
  foo = 10;
  cHelper() {
    return this.foo;
  }
}
class D extends C {
  foo = 20;
  dHelper() {
    return this.foo;
  }
}
let instance = new D();
// 'this.foo' refers to the same property on each instance.
console.log(instance.cHelper()); // prints '20'
console.log(instance.dHelper()); // prints '20'
```

비공개 필드에서는, 포함하고 있는 클래스에서 각각의 필드 이름이 유일하기 때문에 이에 대해 걱정하지 않아도 된다.

```ts
class C {
  #foo = 10;
  cHelper() {
    return this.#foo;
  }
}
class D extends C {
  #foo = 20;
  dHelper() {
    return this.#foo;
  }
}
let instance = new D();
// 'this.#foo' refers to a different field within each class.
console.log(instance.cHelper()); // prints '10'
console.log(instance.dHelper()); // prints '20'
```

알아두면 좋은 또 다른 점은 다른 타입으로 비공개 필드에 접근하면 `TypeError`를 발생한다는 것이다.

```ts
class Square {
  #sideLength: number;
  constructor(sideLength: number) {
    this.#sideLength = sideLength;
  }
  equals(other: any) {
    return this.#sideLength === other.#sideLength;
  }
}
const a = new Square(100);
const b = { sideLength: 100 };
// Boom!
// TypeError: attempted to get private field on non-instance
// This fails because 'b' is not an instance of 'Square'.
console.log(a.equals(b));
```

마지막으로, 모든 일반 `.js` 파일 사용자들의 경우, 비공개 필드는 항상 할당되기 전에 선언되어야 한다.

```ts
class C {
  // No declaration for '#foo'
  // :(
  constructor(foo: number) {
    // SyntaxError!
    // '#foo' needs to be declared before writing to it.
    this.#foo = foo;
  }
}
```

JS는 항상 사용자들에게 선언되지 않은 프로퍼티에 접근을 허용했지만, TS는 항상 클래스 프로퍼티 선언을 요구했다. 비공개 필드는 `.js` 또는 `.ts`파일에서 동작하는지 상관없이 항상 선언이 필요하다.

```ts
class C {
  /** @type {number} */
  #foo;
  constructor(foo: number) {
    // This works.
    this.#foo = foo;
  }
}
```

구현과 관련한 더 많은 정보는 [원본 PR](https://github.com/Microsoft/TypeScript/pull/30829)을 참고

## Which should I use?

이미 TS 유저로서 어떤 종류의 private를 사용해야 하는지에 대한 많은 질문을 받았다. 주로 `private` 키워드를 사용해야 하나요? 아니면 ECMAScript의 `#` private fields를 사용해야 하나요? 이는 상황마다 다르다.

프로퍼티에서 TS의 `private` 지정자는 완전히 지워진다. 이는 런타임에서는 완전히 일반 프로퍼티처럼 동작하며 이것이 `private` 지정자로 선언되었다고 알릴 방법이 없다. `prviate` 키워드를 사용할 때, 비공개는 오직 컴파일-타임/디자인-타임에만 시행되며, JS 사용자에게는 전적으로 의도기반이다.

```ts
class C {
  private foo = 10;
}
// This is an error at compile time,
// but when TypeScript outputs .js files,
// it'll run fine and print '10'.
console.log(new C().foo); // prints '10'
//                  ~~~
// error! Property 'foo' is private and only accessible within class 'C'.
// TypeScript allows this at compile-time
// as a "work-around" to avoid the error.
console.log(new C()['foo']); // prints '10'
```

이 같은 종류의 약한 비공개(soft privacy)는 사용자가 API에 접근할 수 없는 상태에서 일시적으로 작업을 하는 데 도움이 되며, 어떤 런타임에서도 동작한다.

반면에, ECMAScript의 `#` 비공개는 완벽하게 클래스 밖에서 접근 불가능하다.

```ts
class C {
  #foo = 10;
}
console.log(new C().#foo); // SyntaxError
//                  ~~~~
// TypeScript reports an error *and*
// this won't work at runtime!
console.log(new C()['#foo']); // prints undefined
//          ~~~~~~~~~~~~~~~
// TypeScript reports an error under 'noImplicitAny',
// and this prints 'undefined'.
```

이런 강한 비공개(hard privacy)는 아무도 내부를 사용할 수 없도록 엄격하게 보장하는 데 유용하다. 만약 라이브러리 작성자일 경우, 비공개 필드를 제거하거나 이름을 바꾸는 것이 급격한 변화를 초래해서는 안된다.

> 비공개 필드는 실제로 사용하는 측에서 안보이기 때문에?

언급했듯이, 다른 장점은 ECMAScript의 `#` 비공개가 말그대로의 비공개이기 때문에 서브 클래싱을 쉽게할 수 있다는 것이다. ECMAScript의 `#` 비공개 필드를 사용하면, 어떤 서브 클래스도 필드 네이밍 충돌에 대해 걱정할 필요가 없다. TS의 `private` 프로퍼티 선언에서는, 사용자는 여전히 상위 클래스에 선언된 프로퍼티를 짓밟지 않도록 주의해야 한다.

한 가지 더 생각해봐야할 것은 코드가 실행되기를 의도하는 곳이다. 현재 TS는 이 기능을 ECMAScript 2015(ES6) 이상 버전을 대상으로 하지 않으면 지원할 수 없다. 이는 하위 레벨 구현이 비공개를 강제하기 위해 `WeakMap`을 사용하는데, `WeakMap`은 메모리 누수를 일으키지 않도록 폴리필될 수 없기 때문이다. 반면, TS의 `private`선언 프로퍼티는 모든 대상에서 동작한다. (심지어 ECMASCript 3에서도)

마지막 고려 사항은 속도 일수 있다.: `private` 프로퍼티는 다른 어떤 프로퍼티와 다르지 않기 때문에, 어떤 런타임의 대상으로 하든 다른 프로퍼티와 마찬가지로 접근 속도가 빠를 수 있다. 반면에 `#` 비공개 필드는 `WeakMap`을 이용해 다운 레벨되기 때문에 사용 속도가 느려질 수 잇다. 어떤 런타임은 `#` 비공개 필드 구현을 최적화 하고, 더 빠른 `WeakMap`을 구현을 가지고 있을 수 있지만 모든 런타임에서 그렇지 않을 수 있다.

## export \* as ns 문법

다른 모듈의 모든 멤버를 단일 멤버로 내보내는 단일 진입점을 갖는 것은 종종 일반적이다.

```ts
import * as utilities from './utilities.js';
export { utilities };
```

이는 매우 일반적이어서 ECMAScript 2020은 최근 이 패턴을 지원하기 위해 새로운 문법을 추가했다.

```ts
export * as utilities from './utilities.js';
```

이것은 JS를 한층 더 향상시키고 TS 3.8은 이 문법을 지원한다. 모듈 대상이 `es2020`보다 이전인 경우, TS는 첫번째 코드 스니펫을 따라서 출력할 것이다.

## Top-Level await

TS 3.8은 'top-level `await`'라고 불리는 편리한 ECMAScript기능을 지원한다.

JS 유저는 `await`를 사용하기 위해 `async` 함수를 호출하는데, 이를 정의한 후 즉시 함수를 호출한다.

```ts
async function main() {
  const response = await fetch('...');
  const greeting = await response.text();
  console.log(greeting);
}
main().catch((e) => console.error(e));
```

이는 이전의 JS가 `await` 키워드는 오직 `async` 함수 몸체 안에서 허용되었기 때문에 그랬다. 하지만 top-level `await`과 함께, 모듈의 최상위 레벨에서 `await` 키워드를 사용할 수 있다.

```ts
const response = await fetch('...');
const greeting = await response.text();
console.log(greeting);
// Make sure we're a module
export {};
```

최상위 레벨 `await`은 오직 모듈의 최상단에서 동작하며 타입스크립트가 `import` 혹은 `export`를 찾을 때에만 모듈로 간주된다. 일부 기본적인 경우에, `export {}`와 같은 보일러 플레이트를 작성하여 이를 확인할 필요가 있다.

이러한 경우가 예상되는 모든 환경에서 Top Level `await`은 동작하지 않을 수 있다. 현재, `target` 컴파일러 옵션이 `es2017` 이상이고 `module`이 `esnext`또는 `system`인 경우에만 최상위 레벨 `await`를 사용할 수 잇다. 몇몇 환경과 번들러내에서의 지원은 제한적으로 작동하거나 실험적 지원을 활성화해야할 수 있다.

구현에 관한 더 자세한 정보는 [원본 PR](https://github.com/microsoft/TypeScript/pull/35813)을 참고

## es2020용 target과 module

TS 3.8은 `es2020`을 `module`과 [target](https://www.typescriptlang.org/tsconfig/#target) 옵션으로 지원한다. 이를 통해 옵셔널 체이닝이나 널병합 연산, `export * as ns`, 동적 `import(...)` 문법과 같은 ECMAScript 2020 기능을 사용할 수 있다. 또한 `bigint` 리터럴이 `esnext` 아래에 안정적인 target을 갖는 것을 의미한다.

## JSDoc 프로퍼티 지정자

TS 3.8은 `allowJs` 플래그를 사용하여 JS 파일을 지원하고, `checkJs` 옵션이나 `// @ts-check` 주석을 `.js` 파일의 최상단에 추가함으로써 JS 파일의 타입 검사를 지원한다.

JS 파일에는 타입 체킹을 위한 전용 문법이 없기 때문에, TS는 JSDoc을 활용한다. TS 3.8은 프로퍼티에 대한 몇 가지 새로운 JSDoc 태그를 인식한다.

먼저 접근 지정자이다. `@public`, `@private`, 그리고 `@protected`이다. 이 태그들은 `public` `private`, `protected`와 동일하게 동작한다.

```ts
// @ts-check
class Foo {
  constructor() {
    /** @private */
    this.stuff = 100;
  }
  printStuff() {
    console.log(this.stuff);
  }
}
new Foo().stuff;
//        ~~~~~
// error! Property 'stuff' is private and only accessible within class 'Foo'.
```

- `@public`은 항상 암시적이며 생략될 수 있지만, 어디서든 프로퍼티에 접근 가능함을 의미한다.
- `@private`은 오직 프로퍼티를 포함하는 클래스 안에서만 해당 프로퍼티는 사용할 수 있음을 의미한다.
- `@protected`는 프로퍼티를 포함하는 클래스와 파생된 모든 하위 클래스내에서 해당 프로퍼티를 사용할 수 있지만, 포함하는 클래스의 인스턴스는 해당 프로퍼티를 사용할 수 없다.

다음으로, `@readonly` 지정자를 추가하여 프로퍼티가 초기화 과정 내에서만 값이 쓰이는 것을 보장한다.

```ts
// @ts-check
class Foo {
  constructor() {
    /** @readonly */
    this.stuff = 100;
  }
  writeToStuff() {
    this.stuff = 200;
    //   ~~~~~
    // Cannot assign to 'stuff' because it is a read-only property.
  }
}
new Foo().stuff++;
//        ~~~~~
// Cannot assign to 'stuff' because it is a read-only property.
```

## 리눅스에서 더 나은 디렉터리 감시와 watchOptions

TS 3.8에서는 `node_modules`의 변경사항을 효율적으로 수집하는데 중요한 새로운 디렉터리 감시전략을 제공한다.

리눅스와 같은 운영체제에서 TS는 `node_modules`에 디렉터리 왓쳐를 설치하고 의존성 변화를 감지하기 위해 많은 하위 디렉터리를 설치한다. 왜냐하면 사용 가능한 파일 왓쳐의 수는 `node_modules`의 파일 수에 의해 가려지기 때문이고, 추적할 디렉터리 수가 적기 때문이다.

TS의 이전 버전은 즉각적으로 폴더에 디렉터리 왓쳐를 즉시 설치하며, 초기에는 괜찮을 것이다. 그러나 npm install을 할 때, `node_modules`안에서 많은 일들이 발생할 것이고, TS를 압도하여 종종 에디터 세션을 아주 느리게 만든다. 이를 방지하기 위해, TS 3.8은 디렉터리 왓쳐를 설치하기 전에 조금 기다려서 변동성이 높은 디렉터리에게 안정화될 시간을 준다.

모든 프로젝트는 다른 전략에서 더 잘 작동할 수 있고, 이 새로운 방법은 당신의 작업 흐름에는 잘 맞지 않을 수 있기 때문에, TS 3.8은 파일과 디렉터리를 감시하는데 어떤 감시 전략을 사용할지 컴파일러/언어 서비스에 알려줄 수 있도록 `tsconfig.json`과 `jsconfig.json`에 `watchOptions`란 새로운 필드를 제공한다.

```json
{
  // Some typical compiler options
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },
  // NEW: Options for file/directory watching
  "watchOptions": {
    // Use native file system events for files and directories
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",
    // Poll files for updates more frequently
    // when they're updated a lot.
    "fallbackPolling": "dynamicPriority"
  }
}
```

`watchOptions`는 구성할 수 있는 4가지의 새로운 옵션이 포함되어 있다.

- [watchFile](https://www.typescriptlang.org/tsconfig#watchFile): 각 파일의 감시 방법 전략. 다음과 같이 설정할 수 있다.
  - `fixedPollingInterval`: 고정된 간격으로 모든 파일의 변경을 1초에 여러 번 검사한다.
  - `priorityPollingInterval`: 모든 파일의 변경을 1초에 여러 번 검사한다. 하지만 휴리스틱을 사용하여 특정 타입의 파일은 다른 타입의 파일보다 덜 자주 검사한다.
  - `dynamicPriorityPolling`: 동적 큐를 사용하여 자주 수정되지 않은 파일은 적게 검사한다.
  - `useFsEvents`(디폴트): 파일 변화에 운영체제/파일 시스템의 네이티브 이벤트를 사용한다.
  - `useFsEventsOnParentDirectory`: 파일을 포함하고 있는 디렉터리를 감지할 때, 운영체제/파일 시스템의 네이티브 이벤트를 사용한다. 파일 왓쳐를 적게 사용할 수 있지만, 덜 정확할 수 있다.
- [watchDirectory](https://www.typescriptlang.org/tsconfig#watchDirectory): 재귀적인 파일 감시기능이 없는 시스템 안에서 전체 디렉터리 트리가 감시되는 전략. 다음과 같이 설정할 수 있다.
  - `fixedPollingInterval`: 고정된 간격으로 모든 디렉터리의 변경을 1초에 여러 번 검사한다.
  - `dynamicPriorityPolling`: 동적 큐를 사용하여 자주 수정되지 않은 디렉터리는 적게 검사한다.
  - `useFsEvents`(디폴트): 디렉터리 변경에 운영체제/파일 시스템의 네이티브 이벤트를 사용한다.
- [fallbackPolling](https://www.typescriptlang.org/tsconfig#fallbackPolling)

  - `fixedPollingInterval`: 위 내용 참조
  - `priorityPollingInterval`: 위 내용 참조
  - `dynamicPriorityPolling`: 위 내용 참조
  - `synchronousWatchDirectory`: 디렉터리의 연기된 감시를 비활성화 한다. 연기된 감시는 많은 파일이 한 번에 변경될 때 유용하다. (예를 들어, `npm install`을 실행하여 `node_modules`의 변경), 하지만 보편적이지 않은 설정이기 때문에 비활성화할 수 있다.

  이 변경에 대한 더 자세한 내용은 [Github으로 이동하여 PR 참고](https://github.com/microsoft/TypeScript/pull/35615)

## "빠르고 느슨한" 증분 검사

TS 3.8은 새로운 컴파일러 옵션인 [assumeChangesOnlyAffectDirectDepencies](https://www.typescriptlang.org/tsconfig#assumeChangesOnlyAffectDirectDependencies)을 제공한다. 이 옵션이 활성화 되면, TS는 영향을 받은 파일들은 재검사/재빌드 하지않고, 변경된 파일과 직접 import한 파일만 재검사/재빌드 한다.

예를들어, 다음과 같이 `fileA.ts`를 import한 `fileB.ts`를 import한 `fileC.ts`를 import한 `fileD.ts`를 살펴보자.

```ts
fileA.ts < -fileB.ts < -fileC.ts < -fileD.ts;
```

`--watch` 모드에서는, `fileA.ts`의 변경이 `fileB.ts`, `fileC.ts` 그리고 `fileD.ts`를 TS가 재검사 해야한다는 의미이다. `assumeChangesOnlyAffectDirectDependencies`에서는 `fileA.ts`의 변경은 `fileA.ts`와 `fileB.ts`만 재검사하면 된다.

VSCode와 같은 코드 베이스에서는, 특정 파일의 변경에 대해 약 14초에서 약 1초로 재 빌드 시간을 줄여주었다. 이 옵션을 모든 코드 베이스에서 추천하는 것은 아니지만, 큰 코드베이스를 가지고 있고, 나중까지 전체 프로젝트 오류를 기꺼이 연기하겠다면 이 옵션이 흥미로울 것이다.

더 자세한 내용은 [원본 PR 참고](https://github.com/microsoft/TypeScript/pull/35711)
