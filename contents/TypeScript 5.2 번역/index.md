---
title: TypeScript 5.2 번역
description: TypeScript 5.2 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2023-08-29
slug: /translate-ts-5-2
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->



<!-- 본문 -->

> 원글 링크: https://devblogs.microsoft.com/typescript/announcing-typescript-5-2/

## `using` 선언 및 명시적 리소스 관리 사용

TS 5.2에는 곧 출시될 ECMAScript의 명시적 리소스 관리 기능이 추가된다. 이 기능이 나오게 된 원인을 사용이점을 이해해보자.

객체를 생성한 후 일종의 '정리(클린업)'를 해야 하는 경우가 있다. 예를 들어 네트워크 연결을 닫거나 임시 파일을 삭제하거나 메모리를 확보해야 하는 것이다.

임시 파일을 생성하고 읽고 쓴 파일을 닫은 뒤, 삭제하는 함수를 상상해보자.

```js
import * as fs from "fs";

export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

조기 종료가 필요한 경우는 어떻게 될까?

```js
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...
    if (someCondition()) {
        // do some more work...

        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
        return;
    }

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

잊어버리기 쉬운 clean-up(클린업)이 일부 중복되기 시작했다. 또한 오류가 발생하면 파일을 닫고 삭제한다는 보장도 없다. 이 모든 것을 `try/finally` 블록으로 감싸면 이 문제를 해결할 수 있다.

```js
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    try {
        // use file...

        if (someCondition()) {
            // do some more work...
            return;
        }
    }
    finally {
        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
    }
}
```

이 방법은 더 강력하지만 코드에 상당한 '노이즈'가 추가된다. `finally` 블록에 더 많은 clean-up(클린업) 로직을 추가하기 시작하면 다른 리소스를 처리하지 못하게 하는 예외와 같은 다른 발목을 잡는 문제도 발생할 수 있다. [명시적 리소스 관리](https://github.com/tc39/proposal-explicit-resource-management) 제안이 해결하고자 하는 것이 바로 이 문제이다. 제안의 핵심 아이디어는 처리하려고 하는 clean-up(클린업)을 자바스크립트에서 first class 아이디어로 지원하는 것이다.

이 작업은 `Symbol.dispose`라는 새로운 내장 `symbol`을 추가하는 것으로 시작되며, `Symbol.dispose` 메서드를 가진 객체를 생성할 수 있다. 편의를 위해 TypeScript는 이를 설명하는 `Disposable`이라는 새로운 전역 타입을 정의한다.

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}
```

나중에 해당 메서드(`[Symbol.dispose]`)를 호출할 수 있다.

```ts
export function doSomeWork() {
    const file = new TempFile(".some_temp_file");

    try {
        // ...
    }
    finally {
        file[Symbol.dispose]();
    }
}
```

clean-up 로직을 `TempFile` 자체로 옮긴다고 해서 크게 얻을 수 있는 것은 없다. 기본적으로 `finally` 블록의 모든 clean-up을 메서드로 옮긴 것일 뿐이며, 이는 항상 가능했다. 하지만 이 메서드에 잘 알려진 '이름'이 있다는 것은 자바스크립트가 그 위에 다른 기능을 구축할 수 있다는 것을 의미한다.

이 기능의 첫 번째 주인공은 바로 `using` 선언이다! `using` 선언은 `const`처럼 새로운 고정 바인딩을 선언할 수 있는 새로운 키워드다. 가장 큰 차이점은 `using`으로 선언된 변수는 스코프가 끝날 때 `Symbol.dispose` 메서드가 호출된다는 점이다!

따라서 코드를 다음과 같이 간단하게 작성할 수 있다

```ts
export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

전과 비교해보면 `try/finally` 블록이 없다. 기능적으로는 `using` 선언을 사용하면 바로 이 작업을 수행할 수 있지만, 굳이 그렇게 할 필요는 없다.

C#에서 `using` 선언을 사용하거나 Python에서 `with` 문을 사용하거나 Java에서 `try`-with-resource 선언을 사용하는 데 익숙할 수 있다. 이들은 모두 JavaScript의 새로운 `using` 키워드와 유사하며, 스코프 끝에서 객체의 "분해"를 수행하는 유사한 명시적 방법을 제공한다.

`using` 선언을 사용하면 containing scope의 맨 끝 또는 `return`이나 `throw Error`와 같은 "조기 반환" 직전에 이러한 clean-up을 수행한다. 또한 스택처럼 선입선출 순서로 처리한다.

```ts
function loggy(id: string): Disposable {
    console.log(`Creating ${id}`);

    return {
        [Symbol.dispose]() {
            console.log(`Disposing ${id}`);
        }
    }
}

function func() {
    using a = loggy("a");
    using b = loggy("b");
    {
        using c = loggy("c");
        using d = loggy("d");
    }
    using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    using f = loggy("f");
}

func();
// Creating a
// Creating b
// Creating c
// Creating d
// Disposing d
// Disposing c
// Creating e
// Disposing e
// Disposing b
// Disposing a
```

`using` 선언을 사용하는 함수는 예외에 탄력적이어야 하며, 에러가 발생하면 처분 후 다시 던져진다. 반면에 함수 본문은 예상대로 실행될 수 있지만 `Symbol.dispose`가 `throw`될 수 있다. 이 경우 해당 예외도 다시 발생한다.

하지만 처분 전후의 로직이 모두 오류를 발생시키면 어떻게 될까? 이러한 경우를 위해 `SuppressedError`가 `Error`의 새로운 하위 타입으로 도입되었다. 마지막으로 던져진 에러를 보관하는 `suppressed` 프로퍼티와 가장 최근에 던져진 에러에 대한 `error` 프로퍼티가 있다.

```ts
class ErrorA extends Error {
    name = "ErrorA";
}
class ErrorB extends Error {
    name = "ErrorB";
}

function throwy(id: string) {
    return {
        [Symbol.dispose]() {
            throw new ErrorA(`Error from ${id}`);
        }
    };
}

function func() {
    using a = throwy("a");
    throw new ErrorB("oops!")
}

try {
    func();
}
catch (e: any) {
    console.log(e.name); // SuppressedError
    console.log(e.message); // An error was suppressed during disposal.

    console.log(e.error.name); // ErrorA
    console.log(e.error.message); // Error from a

    console.log(e.suppressed.name); // ErrorB
    console.log(e.suppressed.message); // oops!
}
```

예제에서 동기 메서드를 사용하고 있다는 것을 눈치챘을 것이다. 하지만 많은 리소스 처리는 비동기 작업과 관련이 있으며, 다른 코드를 계속 실행하기 전에 해당 작업이 완료될 때까지 기다려야 한다.

그렇기 때문에 새로운 `Symbol.asyncDispose`가 있으며, `await using` 선언을 사용하여 대기하는 다음 단계로 넘어간다. `using` 선언을 사용하는 것과 비슷하지만, 핵심은 누구의 처분을 `await` 하는지 조회한다는 것이다. 이 메서드들은 `Symbol.asyncDispose`라는 다른 메서드를 사용하지만, `Symbol.dispose`가 있는 모든 것에 대해 작동할 수 있다. 편의를 위해 TypeScript는 비동기 처분 메서드가 있는 모든 객체를 설명하는 `AsyncDisposable`이라는 전역 타입도 도입했다.

```ts
async function doWork() {
    // Do fake work for half a second.
    await new Promise(resolve => setTimeout(resolve, 500));
}

function loggy(id: string): AsyncDisposable {
    console.log(`Constructing ${id}`);
    return {
        async [Symbol.asyncDispose]() {
            console.log(`Disposing (async) ${id}`);
            await doWork();
        },
    }
}

async function func() {
    await using a = loggy("a");
    await using b = loggy("b");
    {
        await using c = loggy("c");
        await using d = loggy("d");
    }
    await using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    await using f = loggy("f");
}

func();
// Constructing a
// Constructing b
// Constructing c
// Constructing d
// Disposing (async) d
// Disposing (async) c
// Constructing e
// Disposing (async) e
// Disposing (async) b
// Disposing (async) a
```

다른 사람이 일관되게 해체 로직을 수행할 것으로 예상되는 경우 `Disposable` 및 `AsyncDisposable`로 타입을 정의하면 코드를 훨씬 쉽게 작업할 수 있다. 실제로 `dispose()` 또는 `close()` 메서드가 있는 기존 타입이 많이 존재한다. 예를 들어 Visual Studio Code API는 자체 `Disposable` 인터페이스를 정의하기도 한다. 브라우저와 Node.js, Deno, Bun과 같은 런타임의 API도 파일 핸들, 연결 등과 같이 이미 정리 메서드가 있는 객체에 대해 `Symbol.dispose` 및 `Symbol.asyncDispose`를 사용하도록 선택할 수 있다.

라이브러리에서는 이 모든 것이 훌륭하게 들릴지 모르지만 시나리오에서는 약간 무거울 수 있다. 임시 clean-up을 많이 하는 경우 새로운 타입을 만들면 지나치게 추상화되고 모범 사례에 대한 의문이 생길 수 있다. 예를 들어 `TempFile`의 예를 다시 살펴보자.

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

두 개의 함수를 호출하는 것만 기억하면 되지만, 이것이 최선의 작성 방법일까? 생성자에서 `openSync`를 호출해야 할까, 아니면 `open()` 메서드를 만들어야 할까, 아니면 핸들을 직접 전달해야 할까? 수행해야 하는 모든 가능한 연산에 대해 메서드를 노출해야 할까, 아니면 프로퍼티만 공개해야 할까?

이제 이 기능의 마지막 스타를 소개한다. `DisposableStack`과 `AsyncDisposableStack`이다. 이 객체들은 일회성 및 많은 clean-up을 수행하는 데 유용하다. `DisposableStack`은 `Disposable` 객체를 추적하는 여러 메서드가 있는 객체로, 임의의 정리 작업을 수행하기 위한 함수를 지정할 수 있다. 또한 `using` 변수를 사용해 할당할 수도 있는데, 이것도 `Disposable`이기 때문이다! 원래 예제를 이렇게 작성할 수 있을 것이다.

```ts
function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    using cleanup = new DisposableStack();
    cleanup.defer(() => {
        fs.closeSync(file);
        fs.unlinkSync(path);
    });

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }

    // ...
}
```

여기서 `defer()` 메서드는 콜백을 받기만 하며, 이 콜백은 `cleanup`이 처리되면 실행된다. 일반적으로 `defer`(`use` 및 `adopt`와 같은 `DisposableStack` 메서드)는 리소스를 생성한 직후에 호출해야 한다. 이름에서 알 수 있듯이 `DisposableStack`은 스택처럼 추적하는 모든 것을 선입선출 순서로 폐기하므로 값을 생성한 직후에 defer를 호출하면 이상한 종속성 문제를 피할 수 있다. `AsyncDisposableStack`은 비슷하게 작동하지만 `async` 함수와 `AsyncDisposable`s을 추적할 수 있으며, 그 자체로 `AsyncDisposable`이다.

`defer` 메서드는 Go, Swift, Zig, Odin 등의 `defer` 키워드와 여러 가지 면에서 유사하며, 규칙도 비슷해야한다.

이 기능은 최신 기능이기 때문에 대부분의 런타임에서 기본적으로 지원하지 않는다. 이 기능을 사용하려면 다음에 대한 런타임 폴리필이 필요하다.

- `Symbol.dispose`
- `Symbol.asyncDispose`
- `DisposableStack`
- `AsyncDisposableStack`
- `SuppressedError`

그러나 `using`과 `await using`에만 관심이 있다면 내장된 `symbol`을 폴리필링하는 것만으로도 충분할 것이다. 대부분의 경우 다음과 같은 간단한 방법으로 해결할 수 있다.

```ts
Symbol.dispose ??= Symbol("Symbol.dispose");
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
```

또한 컴파일 `target`을 `es2022` 이하로 설정하고 `lib` 설정에 `"esnext"` 또는 `"esnext.disposable"`을 포함하도록 구성해야한다.

```ts
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.disposable", "dom"]
    }
}
```

## Decorator Metadata

타입스크립트 5.2는 데코레이터 메타데이터라는 곧 출시될 ECMAScript 기능을 구현한다.

이 기능의 핵심 아이디어는 데코레이터가 사용하는 클래스 또는 그 안에서 메타데이터를 쉽게 생성하고 사용할 수 있도록 하는 것이다.

이제 데코레이터 함수를 사용할 때마다 컨텍스트 객체의 새 `metadata` 프로퍼티에 액세스할 수 있다. `metadata` 프로퍼티는 단순한 객체만 보유한다. 자바스크립트에서는 프로퍼티를 임의로 추가할 수 있으므로 각 데코레이터가 업데이트하는 사전으로 사용할 수 있다. 또는 클래스의 각 데코레이션 부분에 대해 모든 `metadata` 객체가 동일하므로 이를 `Map`의 키로 사용할 수 있다. 클래스에 있는 모든 데코레이터가 실행되면 해당 오브젝트는 `Symbol.metadata`를 통해 클래스에서 액세스할 수 있다.

```ts
interface Context {
    name: string;
    metadata: Record;
}

function setMetadata(_target: any, context: Context) {
    context.metadata[context.name] = true;
}

class SomeClass {
    @setMetadata
    foo = 123;

    @setMetadata
    accessor bar = "hello!";

    @setMetadata
    baz() { }
}

const ourMetadata = SomeClass[Symbol.metadata];

console.log(JSON.stringify(ourMetadata));
// { "bar": true, "baz": true, "foo": true }
```

이는 여러 가지 시나리오에서 유용할 수 있다. 디버깅, 직렬화, 데코레이터를 사용한 의존성 주입 등 다양한 용도로 메타데이터를 첨부할 수 있다. 메타데이터 객체는 데코레이터가 적용된 클래스별로 생성되므로 프레임워크는 메타데이터 객체를 `Map` 또는 `WeakMap`의 키로 비공개로 사용하거나 필요에 따라 프로퍼티를 붙일 수 있다.

예를 들어, `JSON.stringify`를 다음과 같이 사용할 때 어떤 프로퍼티와 접근자가 직렬화 가능한지 추적하기 위해 데코레이터를 사용한다고 가정해 보자.

```ts
import { serialize, jsonify } from "./serializer";

class Person {
    firstName: string;
    lastName: string;

    @serialize
    age: number

    @serialize
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toJSON() {
        return jsonify(this)
    }

    constructor(firstName: string, lastName: string, age: number) {
        // ...
    }
}
```

여기서 의도는 `age`와 `fullName`만 직렬화해야 한다는 것인데, 이는 `@serialize` 데코레이터로 표시되어 있기 때문이다. 이를 위해 `toJSON` 메서드를 정의하지만, `@serialize`가 생성한 메타데이터를 사용하는 `jsonify`를 호출할 뿐이다.

다음은 `./serialize.ts` 모듈이 어떻게 정의되는지에 대한 예시이다:

```ts
const serializables = Symbol();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name === "symbol") {
        throw new Error("Cannot serialize symbol-named properties.");
    }

    const propNames =
        (context.metadata[serializables] as string[] | undefined) ??= [];
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata?.[serializables] as string[] | undefined;
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }

    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

이 모듈에는 `@serializable`로 표시된 프로퍼티의 이름을 저장하고 검색하기 위해 `serializables`라는 로컬 `symbol`이 있다. 이 모듈은 `@serializable`을 호출할 때마다 메타데이터에 이러한 프로퍼티 이름 목록을 저장한다. `jsonify`가 호출되면 메타데이터에서 속성 목록을 가져와 인스턴스에서 실제 값을 검색하는 데 사용되며, 결국 해당 이름과 값을 직렬화한다.

`symbol`을 사용하면 기술적으로 다른 사람이 이 데이터에 액세스할 수 있다. 메타데이터 객체를 키로 사용하는 `WeakMap`을 사용하는 것도 대안이 될 수 있다. 이 경우 데이터를 비공개로 유지하고 타입 단언을 더 적게 사용하지만 그 외에는 비슷하다.

```ts
const serializables = new WeakMap();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name !== "string") {
        throw new Error("Can only serialize string properties.");
    }

    let propNames = serializables.get(context.metadata);
    if (propNames === undefined) {
        serializables.set(context.metadata, propNames = []);
    }
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata && serializables.get(metadata);
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }
    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

참고로, 이러한 구현은 서브클래싱과 상속을 처리하지 않는다. 이는 자신의 몫이다.(그리고 어떤 버전의 파일이 다른 버전보다 더 쉽다는 것을 알게 될 수도 있다!).

이 기능은 아직 새 기능이기 때문에 대부분의 런타임은 기본적으로 지원하지 않는다. 이 기능을 사용하려면 Symbol.metadata에 대한 폴리필이 필요하다. 대부분의 경우 다음과 같은 간단한 방법으로 해결할 수 있다.

```ts
Symbol.metadata ??= Symbol("Symbol.metadata");
```

또한 컴파일 대상을 `es2022` 이하로 설정하고 라이브러리 설정에 `"esnext"` 또는 `"esnext.decorators"`를 포함하도록 구성해야 한다.

## 명명된 요소 및 익명 튜플 요소

튜플 타입은 각 요소에 대해 선택적 레이블 또는 이름을 지원한다.

```ts
type Pair = [first: T, second: T];
```

이러한 레이블은 가독성과 툴링에 도움을 주기 위한 것일 뿐, 레이블로 허용되는 작업을 변경하는 것은 아니다.

하지만 이전에는 튜플에 레이블이 있는 요소와 레이블이 없는 요소를 섞어서 사용할 수 없다는 규칙이 있었다. 즉, 어떤 요소도 튜플에 레이블을 가질 수 없거나 모든 요소에 레이블이 필요했다.

```ts
// ✅ fine - no labels
type Pair1 = [T, T];

// ✅ fine - all fully labeled
type Pair2 = [first: T, second: T];

// ❌ previously an error
type Pair3 = [first: T, T];
//                         ~
// Tuple members must all have names
// or all not have names.
```

`rest` 또는 `tail`과 같은 레이블을 추가해야하는 나머지 요소들의 경우 이는 성가신 일이 될 수 있다.

```ts
// ❌ previously an error
type TwoOrMore_A = [first: T, second: T, ...T[]];
//                                          ~~~~~~
// Tuple members must all have names
// or all not have names.

// ✅
type TwoOrMore_B = [first: T, second: T, rest: ...T[]];
```

또한 이 제한은 타입 시스템 내부에서 적용되어야 했기 때문에 TypeScript가 레이블을 잃게 된다.

```ts
type HasLabels = [a: string, b: string];
type HasNoLabels = [number, number];
type Merged = [...HasNoLabels, ...HasLabels];
//   ^ [number, number, string, string]
//
//     'a' and 'b' were lost in 'Merged'
```

TypeScript 5.2에서는 튜플 레이블에 대한 제한이 해제되었다. 이제 레이블이 없는 튜플로 스프레드할 때 레이블을 보존할 수도 있다.

## 배열의 유니온에 더 쉬운 메서드 사용

이전 버전의 TypeScript에서는 배열의 유니온에서 메서드를 호출하는 것이 어려웠다.

```ts
declare let array: string[] | number[];

array.filter(x => !!x);
//    ~~~~~~ error!
// This expression is not callable.
//   Each member of the union type '...' has signatures,
//   but none of those signatures are compatible
//   with each other.
```

이 예제에서 TypeScript는 `string[]` 및 `number[]`에서 각 버전의 `filter`가 호환되는지 확인하려고 시도한다. 일관된 전략이 없으면 TypeScript는 허공에 손을 던지고 "작동하게 만들 수 없습니다"라고 말한다.

TypeScript 5.2에서는 이러한 경우 포기하기 전에 배열의 공용체를 특수한 경우로 취급한다. 각 멤버의 요소 타입으로 새로운 배열 타입을 구성한 다음 그 배열에 메서드를 호출한다.

예를 들어 위의 `string[] | number[]`는 `(문자열 | 숫자)[]`(또는 `Array<string | number>`)로 변환되고 해당 타입에 대해 `filter`가 호출된다. 필터가 `string[] | number[]` 대신 `Array<string | number>`를 생성한다는 약간의 주의 사항이 있지만, 새로 생성된 값의 경우 "잘못된" 문제가 발생할 위험이 적다.

즉, `filter`, `find`, `some`, `every`, `reduce`와 같은 많은 메서드가 이전에는 사용할 수 없었던 배열의 조합에 대해 모두 호출할 수 있어야 한다.

## 배열 메서드 복사
TypeScript 5.2에는 "복사하여 배열 변경" 제안에서 ECMAScript에 추가된 메서드에 대한 정의가 포함되어 있다.

자바스크립트의 배열에는 이미 `sort()`, `splice()`, `reverse()` 등 몇 가지 유용한 메서드가 있었지만, 이 메서드들은 현재 배열을 업데이트했다. 종종 원본에 영향을 주지 않고 완전히 별도의 배열을 만드는 것이 바람직할 때가 있다. 이를 위해 `slice()` 또는 배열 스프레드(예: `[...myArray]`)를 사용하여 먼저 복사본을 가져온 다음 연산을 수행할 수 있다. 예를 들어, `myArray.slice().reverse()`를 작성하여 반전된 복사본을 얻을 수 있다.

복사본을 만들되 단일 요소를 변경하는 또 다른 일반적인 경우도 있다. 이를 수행하는 방법에는 여러 가지가 있지만, 가장 확실한 방법은 아래와 같이 여러개의 문으로 된 긴 코드를 작성하는 것이다.

```ts
const copy = myArray.slice();
copy[someIndex] = updatedValue;
doSomething(copy);
```

또는 아래와 같이 작성할 수 있다.

```ts
doSomething(myArray.map((value, index) => index === someIndex ? updatedValue : value));
```

이 모든 것이 너무 일반적인 연산의 경우 번거롭다. 그래서 자바스크립트에는 이제 동일한 연산을 수행하지만 원본 데이터에 영향을 주지 않는 새로운 메서드 4가지(`toSorted`, `toSpliced`, `toReversed`, `with`)가 추가되었다. 처음 3개의 메서드는 돌연변이 메서드와 동일한 연산을 수행하지만 새 배열을 반환한다. 또한 `with` 메서드는 새 배열을 반환하지만 단일 요소가 업데이트된다(위에서 설명한 대로).

| Mutating | Copying |
| :---: | :---: |
|myArray.reverse() |	myArray.toReversed() |
|myArray.sort((a, b) => ...) |	myArray.toSorted((a, b) => ...)  |
|myArray.splice(start, deleteCount, ...items)|	myArray.toSpliced(start, |deleteCount, ...items) |
|myArray[index] = updatedValue |	myArray.with(index, updatedValue)|


복사 메서드는 항상 새 배열을 생성하는 반면, mutating 연산은 일관성이 없다는 점에 유의하자

이러한 메서드는 일반 배열에서만 사용할 수 있는 것이 아니라 `Int32Array`, `Uint8Array` 등과 같은 타입 배열에서도 사용할 수 있다.

## `symbol`s as `WeakMap` and `WeakSet` Keys

`symbol`을 `WeakMap` 및 `WeakSet`의 키로 사용할 수 있으며, 이는 ECMAScript 자체에 이 기능이 추가된 것을 반영한다.

```ts
const myWeakMap = new WeakMap();

const key = Symbol();
const someObject = { /*...*/ };

// Works! ✅
myWeakMap.set(key, someObject);
myWeakMap.has(key);
```

## TypeScript 구현 파일 확장자를 가진 타입 전용 가져오기 경로

TypeScript는 이제 `allowImportingTsExtensions`의 활성화 여부에 관계없이 선언 및 구현 파일 확장명을 모두 타입 전용 가져오기 경로에 포함할 수 있다.

즉, 이제 `.ts`, `.mts`, `.cts` 및 `.tsx` 파일 확장명을 사용하는 `import type` 문을 작성할 수 있다.

```ts
import type { JustAType } from "./justTypes.ts";

export function f(param: JustAType) {
    // ...
}
```

또한 JSDoc을 사용하여 TypeScript와 JavaScript 모두에서 사용할 수 있는 `import()` 타입이 해당 파일 확장자를 사용할 수 있음을 의미한다.

```ts
/**
 * @param {import("./justTypes.ts").JustAType} param
 */
export function f(param) {
    // ...
}
```

## 객체 멤버의 쉼표 완성

객체에 새 속성을 추가할 때 쉼표를 추가하는 것을 잊어버리기 쉽다. 이전에는 쉼표를 잊어버리고 자동 완성을 요청하면 TypeScript에서 관련 없는 잘못된 완성 결과가 표시되어 혼란스러웠다.

이제 TypeScript 5.2에서는 쉼표가 누락된 경우 객체 멤버 완성을 정상적으로 제공한다. 하지만 구문 오류로 표시되는 것을 건너뛰기 위해 누락된 쉼표도 자동으로 삽입한다.

<img width="751" alt="image" src="https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/d3766590-082b-4929-9d28-e0873c256139">


## 인라인 변수 리팩토링

이제 TypeScript 5.2에는 변수의 내용을 모든 사용 사이트에 인라인 처리하는 리팩터링 기능이 있다.

<img width="748" alt="image" src="https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/a0e959a0-94f1-405b-8fe2-acb890a2614e">


"인라인 변수" 리팩터링을 사용하면 변수가 제거되고 변수의 모든 사용처가 해당 이니셜라이저로 대체된다. 이 경우 이니셜라이저의 부작용이 변수가 사용된 횟수만큼 다른 시간에 실행될 수 있다는 점에 유의하자.

## 클릭 가능한 인레이 매개변수 힌트

인레이 힌트는 매개변수 이름, 추론된 유형 등 코드 내에 존재하지 않는 정보도 한눈에 파악할 수 있게 해준다. TypeScript 5.2에서는 인레이 힌트와 상호 작용할 수 있는 기능이 추가되었다. 예를 들어 Visual Studio 코드 인사이더에서는 이제 인레이 힌트를 클릭하여 매개변수의 정의로 이동할 수 있다.

<img width="748" alt="image" src="https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/e3b705a8-4949-49f6-98a9-d3fee09dce33">


## 지속적인 타입 호환성 확인 최적화


TypeScript는 구조적 타입 시스템이기 때문에 멤버별로 타입을 비교해야 하는 경우가 있지만 재귀 타입은 여기에 몇 가지 문제가 있다. 예를 들어

```ts
interface A {
    value: A;
    other: string;
}

interface B {
    value: B;
    other: number;
}
```

타입 A가 타입 B와 호환되는지 확인할 때 타입스크립트는 결국 A와 B의 값 타입이 각각 호환되는지 확인하게 된다. 이 시점에서 타입 시스템은 더 이상 확인을 중단하고 다른 멤버를 확인해야 한다. 이를 위해 타입 시스템은 두 타입이 이미 관련되어 있는 경우를 추적해야 한다.

이전에는 타입스크립트가 이미 타입 쌍의 스택을 보관하고 이를 반복하여 해당 타입이 관련되어 있는지 확인했다. 이 스택이 얕을 때는 문제가 되지 않지만, 스택이 얕지 않을 때는 문제가 된다.

TypeScript 5.2에서는 간단한 `Set`으로 이 정보를 추적할 수 있다. 이를 통해 드리즐 라이브러리를 사용한 보고된 테스트 케이스에 소요되는 시간이 33% 이상 단축되었다!

## 변경 사항 및 오류 수정

TypeScript는 불필요하게 변경하지 않기 위해 노력하지만, 때로는 코드를 더 잘 분석할 수 있도록 수정하고 개선해야 할 때가 있다.

### `lib.d.ts Changes`

DOM용으로 생성된 타입은 코드베이스에 영향을 미칠 수 있다. 자세한 내용은 TypeScript 5.2의 DOM 업데이트를 참조하세요.

### `labeledElementDeclarations`은 `undefined` 요소를 보유할 수 있음

레이블이 지정된 요소와 레이블이 지정되지 않은 요소의 혼합을 지원하기 위해 TypeScript의 API가 약간 변경되었다. `TupleType`의 `labeledElementDeclarations` 속성은 요소가 레이블이 지정되지 않은 각 위치에 대해 `undefined` 상태로 유지될 수 있다.

```ts
  interface TupleType {
-     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration)[];
+     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration | undefined)[];
  }
```

### `module`과 `moduleResolution`는 최근 Node.js 설정에서 일치해야 한다.

`module` 옵션과 `moduleResolution` 옵션은 각각 `node16`과 `nodenext` 설정을 지원한다. 이는 사실상 모든 최신 Node.js 프로젝트에서 사용해야 하는 "최신 Node.js" 설정이다. 이 두 옵션이 Node.js 관련 설정을 사용하는지 여부에 대해 일치하지 않으면 프로젝트가 사실상 잘못 구성된다는 사실을 발견했다.

TypeScript 5.2에서는 `--module` 및 `--moduleResolution` 옵션 중 하나에 `node16` 또는 `nodenext`를 사용하는 경우 이제 다른 옵션에도 유사한 Node.js 관련 설정이 있어야 한다. 설정이 서로 다른 경우 다음과 같은 오류 메시지가 표시될 수 있다.

```ts
Option 'moduleResolution' must be set to 'NodeNext' (or left unspecified) when option 'module' is set to 'NodeNext'.

// 또는

Option 'module' must be set to 'Node16' when option 'moduleResolution' is set to 'Node16'.
```

예를 들어 `--module esnext --muleResolution node16`은 거부되지만, `--module nodenext`만 사용하거나 `--module esnext --muleResolution` 번들러를 사용하는 것이 더 나을 수 있다.

### 병합된 기호에 대한 일관된 export 확인

두 선언이 병합되면 두 선언이 모두 내보낼지 여부가 일치해야 한다. 버그로 인해 선언 파일이나 `declare module` 블록과 같은 주변 컨텍스트에서 TypeScript가 특정 경우를 놓쳤다. 예를 들어, 다음과 같이 `replaceInFile`이 내보낸 함수로 한 번 선언되고 내보내지 않은 네임스페이스로 한 번 선언되는 경우에는 오류가 발생하지 않는다.

```ts
declare module 'replace-in-file' {
    export function replaceInFile(config: unknown): Promise;
    export {};

    namespace replaceInFile {
        export function sync(config: unknown): unknown[];
  }
}
```

주변 모듈에서 `export { ... }` 또는 `export default ...`와 같은 유사한 구문을 추가하면 모든 선언이 자동으로 내보내지는지 여부가 암시적으로 변경된다. 이제 TypeScript는 안타깝게도 이러한 혼란스러운 의미를 보다 일관되게 인식하고 `replaceInFile`의 모든 선언이 수정자에서 일치해야 한다는 사실에 대해 다음과 같은 오류를 발생시킨다:

```ts
Individual declarations in merged declaration 'replaceInFile' must be all exported or all local.
```

### `module` 항상 `namespace`로 방출

타입스크립트의 `namespace`는 사실 `module` 키워드를 사용하기 시작했는데, ECMAScript도 같은 용도로 사용할 수 있을 것으로 보였기 때문dl다. 원래는 이를 "내부 모듈"이라고 불렀지만 내부 모듈은 결국 자바스크립트에 포함되지 않았다.

수년 동안(2015년부터 TypeScript 1.5부터!) TypeScript는 혼동을 피하기 위해 `namespace` 키워드를 지원해 왔다. 이를 한 단계 더 발전시켜 TypeScript 5.2에서는 선언 파일을 생성할 때 항상 네임스페이스 키워드를 방출한다. 따라서 다음과 같이 코딩하자.

```ts
module foo {
    export function f() {}
}
```

를 실행하면 다음과 같은 선언 파일이 생성된다.

```ts
declare namespace foo {
    function f(): void;
}
```

훨씬 더 오래된 버전의 TypeScript와 호환되지 않을 수 있지만, 그 영향은 제한적일 것으로 예상된다.

다음과 같은 주변 모듈 선언에 유의하자.

```ts
// UNAFFECTED
declare module "some-module-path" {
    // ...
}
```

이는 영향을 받지 않는다.

