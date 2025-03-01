---
title: TypeScript 5.8 번역
description: TypeScript 5.8 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2025-03-01
slug: /translate-ts-5-8
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->



<!-- 본문 -->


> TypeScript 5.8에서 중요하다고 생각되는 부분을 번역했습니다. 더 자세한 글은 아래 원글 링크를 참고해주세요.
> https://devblogs.microsoft.com/typescript/announcing-typescript-5-8/

## 반환 표현식에서의 세분화된 검토

TypeScript가 `cond ? trueBranch : falseBranch`와 같은 조건 표현식을 검사할 때 해당 표현식의 타입은 두 분기의 타입을 포함하는 유니온 타입으로 처리된다. 

따라서 아래의 예제는 `any | string`이 되는데 `any`가 다른 타입과 결합 시 전염성이 강해 `any`가 되어버린다.

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
}
```

따라서 위 예제의 타입 시스템은 해당 코드에서 버그를 감지할 수 있는 정보를 이미 잃어버린 상태가 된다.


TypeScript 5.8에선 `return`문 내부의 조건 표현식에 대해 타입 시스템이 조건 표현식의 각 분기를 함수의 선언된 반환 타입과 **개별적으로 비교**해 검사한다.

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
    //  ~~~~~~~~~
    // error! Type 'string' is not assignable to type 'URL'.
}
```

## `--module nodenext`에서 ECMAScript 모듈의 `require()` 지원

수년 동안 Node.js는 CommonJS 모듈과 함께 ECMAScript 모듈을 지원했지만 상호 운용하는데에 있어 몇 가지 문제가 있었다.

- ESM 파일은 CommonJS 파일을 `import`할 수 있음
- CommonJS 파일은 ESM 파일을 `require()`할 수 

이로 인해 라이브러리 개발자들은 보통 다음 중 하나를 선택해야 했다.

- CommonJS 지원을 포기하고 ESM만 제공
- ESM과 CommonJS를 모두 지원하기 위해 "이중 배포(ESM과 CommonJS에 각각 별도의 진입점 제공)"
  - 복잡하고 오류가 발생하기 쉬움
  - 패키지 코드량이 거의 2배로 증가
- 그냥 CommonJS만 계속 유지

Node.js 22에서는 이러한 제한 사항이 완화되어 CommonJS 모듈에서 `require("esm")`을 통해 ESM 모듈을 가져올 수 있다. 다만 `top-level await`이 포함된 ESM 파일은 여전히 `require()`로 가져올 수 없다.

TypeScript 5.8에서는 `--module nodenext` 옵션을 사용할 경우 CommonJS에서 ESM 파일을 `require()` 하는 코드에 대해 오류를 발생시키지 않는다. 

미래의 TypeScript 버전에서는 `node20` 버전 이하에서도 이 기능을 안정적으로 제공할 가능성이 있다. 따라서 현재의 권장사항은 다음과 같다.

- Node.js 22 이상을 사용하는 경우 -> `--module nodenext` 사용
- 이전 버전의 Node.js를 사용하는 경우
  - 기존의 `--module node16` 유지
  - 혹은 `--module node18`로 업그레이드


## `--module node18` 지원

TypeScript 5.8에서는 새로운 안정적인 `--module node18` 플래그를 도입했다. 이 옵션은 Node.js 18을 고정적으로 사용하는 유저들에게 일관된 동작을 보장한다.

--module node18 vs. --module nodenext 비교

| 기능 | `--module node18` | `--module nodenext` |
| -- | --------------- | ----------- |
| CommonJS에서 ESM require() | ❌ (불가능) | ✅ (가능) |
| import 어설션 (import assertions) 지원 | ✅ (가능) | ❌ (불가능, import 속성으로 대체됨) |

## ``--erasableSyntaxOnly` 옵션

최근 Node.js 23.6에선 TypeScript 파일을 직접 실행할 수 있도록 하는 실험적 기능이 플래그 없이 제공되었다. 하지만 이 모드에서는 특정 TypeScript 문법만 지원한다. 

Node.js에서는 `--experimental-strip-types` 모드를 도입했는데, 이 ㅁ드에서는 TypeScript 전용 문법이 런타임 동작을 가지면 안된다. 즉 TypeScript 문법을 지워도 유효한 JS 코드가 남아있어야 한다.

아래와 같은 런타임에서 의미를 가지는 TypeScript 문법은 지원되지 않는다.

- `enum` 선언
- `namespaces` 및 런타임 코드를 포함한 `module`
- 클래스의 매개변수 속성
- `import =` 형식의 별칭 

```ts
// ❌ error: A namespace with runtime code.
namespace container {
    foo.method();

    export type Bar = string;
}

// ❌ error: An `import =` alias
import Bar = container.Bar;

class Point {
    // ❌ error: Parameter properties
    constructor(public x: number, public y: number) { }
}

// ❌ error: An enum declaration.
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```


기존 `ts-blank-space`나 `Amaro`(Node.js에서 타입 제거를 담당하는 라이브러리)와 같은 유사한 도구들은 오류 메시지를 제공하지만 실제로 코드를 실행해보기 전까지는 코드가 동작하지 않는다는 사실을 알 수 없다.


TypeScript 5.8 에서는 `--erasableSyntaxOnly` 도입해 이 플래그가 활성화되면 런타임 동작을 가지는 대부분의 TypeScript 전용 문법에 대해 오류를 발생시킨다.

권장 옵션 조합
- `--erasableSyntaxOnly`
- `--verbatimModuleSyntax` (모듈의 import 문법을 강제하고, import 생략을 방지)


```ts
class C {
    constructor(public x: number) { 
    //          ~~~~~~~~~~~~~~~~
    // error! This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
    }
}
```


## `--libReplacement` 플래그

TypeScript 4.5에서 기본 `lib` 파일을 사용자 정의 파일로 대체할 수 있는 기능을 도입했다. 이는 `@typescript/lib-*` 패키지에서 라이브러리 파일을 가져올 수 있도록 하는 방식에 기반한다.

예를들어 `@types/web` 패키지의 특정 버전의 DOM 라이브러리를 고정하려면 다음과 같이 `package.json`을 설정할 수 있다.


```json
{
    "devDependencies": {
       "@typescript/lib-dom": "npm:@types/web@0.0.199"
     }
}
```


위 패키지가 설치되면 TypeScript는 `dom` 라이브러리를 포함하는 설정이 있을 경우 항상 해당 패키지를 조회한다.

이 기능은 강력하지만 추가적인 성능 비용이 발생한다.

- 해당 기능을 사용하지 않더라도 TypeScript는 항상 이 라이브러리를 찾으려고 시도한다.
- 또한 `node_modules`을 감시하여 새로운 라이브러리 대체 패키지가 추가되었는지 확인해야 한다.


TypeScript 5.8에는 이 동작을 비활성화할 수 있는 `--libReplacement` 플래그가 도입되었다. 

- 기본적으로 --libReplacement`를 사용하지 않는다면, --libReplacement false` 옵션을 설정하여 이 동작을 비활성화할 수 있다.
- 현재 이 기능을 사용하는 경우, `--libReplacement true`를 명시적으로 설정하는 것이 좋다.
- 향후 TypeScript에서 `--libReplacement false`가 기본값이 될 가능성이 높으므로, 이 기능이 필요하다면 명시적으로 활성화해야 한다.


## 선언 파일에서 계산된 프로퍼티 이름 보존

선언 파일에서 계산된 프로퍼티를 보다 예측 가능하게 만들기 위해 TypeScript 5.8은 클래스의 계산된 프로퍼티 이름(`bareVariables`나 `dotted.names.that.look.like.this`와 같은 엔터티)을 일관되게 보존한다. 

```ts
// 이전 버전의 TypeScript에선 이 모듈에 대한 선언 파일 생성 시 오류 발생
// 최선의 노력으로 index signature를 생성함
// [propName] 부분을 [x: string]: number와 같은 인덱스 시그니처 생성
export let propName = "theAnswer";

export class MyClass {
    [propName] = 42;
//  ~~~~~~~~~~
// error!
// A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
}


// TypeScript 5.8에서 아래 예제는 허용되고 선언 파일을 작성한 내용과 일치
export declare let propName: string;
export declare class MyClass {
    [propName]: number;
}
```


이 기능은 클래스에 정적으로 이름이 지정된 프로퍼티를 생성하지 않는다. 여전히 `[x: string]: number`와 같은 인덱스 시그니처 형태로 출력된다.
따라서 이 경우에는 `unique symbols`이나 리터럴 타입을 사용해야 할 수 있다.

현재 `--isolatedDeclarations` 플래그 아래에서는 이 코드를 작성하는 것이 오류로 처리된다. 하지만 이번 변경 덕분에, 계산된 프로퍼티 이름이 선언 파일에서 일반적으로 허용될 것으로 예상된다.

또한, TypeScript 5.8에서 컴파일된 파일이 TypeScript 5.7 이하 버전과 호환되지 않는 선언 파일을 생성할 가능성도 있지만, 이는 드물게 발생할 것이다.

