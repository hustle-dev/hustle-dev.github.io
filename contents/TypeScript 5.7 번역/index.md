---
title: TypeScript 5.7 번역
description: TypeScript 5.7 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2024-12-04
slug: /translate-ts-5-7
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->




<!-- 본문 -->

> TypeScript 5.7에서 중요하다고 생각되는 부분을 번역했습니다. 더 자세한 글은 아래 원글 링크를 참고해주세요.
> https://devblogs.microsoft.com/typescript/announcing-typescript-5-7/

## 초기화되지 않은 변수에 대한 검사

이전부터 타입스크립트는 모든 분기에서 변수가 초기화되지 않은 문제를 감지할 수 있었다.

```ts
let result: number
if (someCondition()) {
    result = doSomeWork();
}
else {
    let temporaryWork = doSomeWork();
    temporaryWork *= 2;
    // forgot to assign to 'result'
}

console.log(result); // error: Variable 'result' is used before being assigned.
```

하지만 아래와 같이 변수가 별도의 함수내에서 접근되는 경우 제대로 작동하지 않았다.

```ts
function foo() {
    let result: number
    if (someCondition()) {
        result = doSomeWork();
    }
    else {
        let temporaryWork = doSomeWork();
        temporaryWork *= 2;
        // forgot to assign to 'result'
    }

    printResult();

    function printResult() {
        console.log(result); // no error here.
    }
}

```

TypeScript 5.7은 이제 초기화되지 않은 변수에 대해서는 오류를 보고한다.

```ts
function foo() {
    let result: number
    
    // do work, but forget to assign to 'result'

    function printResult() {
        console.log(result); // error: Variable 'result' is used before being assigned.
    }
}
```

## 상대 경로에 대한 경로 재작성

TypeScript 코드를 `ts-node`, `tsx`, `Deno`, `Bun` 과 같은 도구에서 직접 실행할 있다. 최근에 Node.js 에서도 `--experimental-strip-types` 및 `--experimental-transform-types`을 통해 이 기능을 지원한다. 이런 기능은 빌드 작업을 다시 실행할 필요 없이 빠르게 반복 작업을 수행할 수 있어 편리하다.

하지만 이런 기능을 사용하려면 TypeScript 파일은 런타임 시 적절한 `.ts` 확장자로 가져와야 한다. 예를 들어 `foo.ts`라는 파일을 가져오려면 Node.js의 실험적인 지원에서 아래와 같이 작성해야 한다.

```ts
// main.ts

import * as foo from "./foo.ts"; // <- we need foo.ts here, not foo.js
```

TypeScript는 이런 방식을 사용하면 출력 파일을 가져오는 것으로 예상해 오류를 발생시킨다. 하지만 일부 도구는 `.ts` 가져오기는 허용해 TS는 이미 `--allowImportingTsExtensions`라는 옵션을 통해 이 가져오기 방식을 지원하고 있다.

그러나 `.ts` 파일에서 실제로 `.js` 파일을 생성해야하는 경우에는 어떻게 해야 할까? 이러한 시나리오는 지원하기 위해 새로운 컴파일러 옵션인 `--rewriteRelativeImportExtensions`가 추가되었다. 이 옵션은 다음 조건을 만족할 때 가져오기 경로를 해당 JS 확장자로 재작성한다.

- 가져오기 경로가 상대 경로(`./` 또는 `../`로 시작)일 때
- TypeScript 확장자(`.ts`, `.tsx`, `.mts`, `.cts`)로 끝날 때
- 선언 파일이 아닐 때


```ts
// Under --rewriteRelativeImportExtensions...

// these will be rewritten.
import * as foo from "./foo.ts";
import * as bar from "../someFolder/bar.mts";

// these will NOT be rewritten in any way.
import * as a from "./foo";
import * as b from "some-package/file.ts";
import * as c from "@some-scope/some-package/file.ts";
import * as d from "#/file.ts";
import * as e from "./file.js";
```


컴파일러는 경로를 JS 확장자(`.js`, `.jsx`, `.mjs`, `.cjs`)로 재작성한다.

TypeScript가 경로 재작성을 피했던 이유를 말하면 "동적 가져오기" 때문이다. 아래와 같은 코드에서 가져오기 경로를 처리하는 것은 간단하지 않다. 사실, 종속성 내에서 `import` 동작을 재정의하는 것은 불가능하다.

```ts
function getPath() {
    if (Math.random() < 0.5) {
        return "./foo.ts";
    }
    else {
        return "./foo.js";
    }
}

let myImport = await import(getPath());
```

또 다른 문제는, 위에서 본 것처럼 상대 경로만 재작성되며, 이는 단순하게만 작성되어 TypeScript의 `baseUrl`과 `paths`를 사용하는 경로는 재작성되지 않는다.

```json
// tsconfig.json

{
    "compilerOptions": {
        "module": "nodenext",
        // ...
        "paths": {
            "@/*": ["./src/*"]
        }
    }
}
```

```ts
// Won't be transformed, won't work.
import * as utilities from "@/utilities.ts";
```

`package.json`의 내보내기 및 가져오기 필드를 통해 resolve 될 수 있는 경로도 마찬가지이다.

```json
// package.json
{
    "name": "my-package",
    "imports": {
        "#root/*": "./dist/*"
    }
}
```

```ts
// Won't be transformed, won't work.
import * as utilities from "#root/utilities.ts";
```

따라서 워크스페이스 스타일의 레이아웃을 사용해 여러 패키지가 서로를 참조하는 경우, 이를 처리하려면 조건부 내보내기와 사용자 지정 범위 조건을 사용해야할 수 있다. 

```json
// my-package/package.json

{
    "name": "my-package",
    "exports": {
        ".": {
            "@my-package/development": "./src/index.ts",
            "import": "./lib/index.js"
        },
        "./*": {
            "@my-package/development": "./src/*.ts",
            "import": "./lib/*.js"
        }
    }
}
```

`.ts` 파일을 가져오고 싶을 때 다음과 같이 실행할 수 있다.

```bash
node --conditions=@my-package/development
```

위에서 사용된 조건인 `@my-package/development`의 "네임스페이스" 또는 "범위"에 주목해라. 이는 동일한 `development` 조건을 사용하는 종속성과 충돌을 피하기 위한 임시 방편이다. 만약 모든 패키지가 `development`를 내보내면 경로 해석이 `.ts` 파일로 시도될 수 있고 올바르게 동작하지 않을 수 있다.

## `--target es2024` 및 `--lib es2024` 지원

TypeScript 5.7에선 ECMAScript 2024 런타임을 대상으로 `--target es2024` 옵션을 지원한다. 이를 통해 `SharedArrayBuffer`와 `ArrayBuffer`의 새로운 기능, `Object.groupBy`, `Map.groupBy`, `Promise.withResolvers` 등을 포함하는 `--lib es2024를` 지정할 수 있다. 또한, `Atomics.waitAsync`가 `--lib es2022`에서 `--lib es2024`로 이동되었다.

`SharedArrayBuffer`와 `ArrayBuffer`의 변경사항으로 인해, 두 객체는 이제 약간의 차이가 있다. 이 격차를 해소하고 기본 버퍼 타입을 유지하기 위해, 모든 `TypedArray`(예: `Uint8Array` 등)는 이제 제네릭으로 정의된다.

```ts
interface Uint8Array<TArrayBuffer extends ArrayBufferLike = ArrayBufferLike> {
    // ...
}
```

각 `TypedArray`는 이제 `TArrayBuffer`라는 타입 매개변수를 가지며, 이 매개변수는 기본 타입 인수를 갖는다. 따라서 `Int32Array`를 참조할 때 `Int32Array<ArrayBufferLike>`와 같이 명시적으로 작성하지 않아도 된다.

이 업데이트로 인해 문제가 발생한다면, `@types/node`를 업데이트해야 할 수 있다.

## 프로젝트 소유권을 위한 상위 구성 파일 검색

TS 파일이 `TSServer`를 사용하는 편집기에서 로드되면 편집기는 `tsconfig.json`을 찾으려고 편집 중인 파일의 디렉터리에서 상위 디렉터리로 이동하며 이 파일을 검색한다.

이전에는 검색이 첫 번째 `tsconfig.json` 파일을 찾는 즉시 중단되었다. 하지만 아래와 같은 프로젝트 구조를 상상해 보자.

```
project/
├── src/
│   ├── foo.ts
│   ├── foo-test.ts
│   ├── tsconfig.json
│   └── tsconfig.test.json
└── tsconfig.json
```

여기서 핵심 아이디어는 `src/tsconfig.json`이 프로젝트의 주요 구성 파일이며, `src/tsconfig.test.json`은 테스트 실행을 위한 구성 파일이라는 점이다.

```json
// src/tsconfig.json
{
    "compilerOptions": {
        "outDir": "../dist"
    },
    "exclude": ["**/*.test.ts"]
}
```

```json
// src/tsconfig.test.json
{
    "compilerOptions": {
        "outDir": "../dist/test"
    },
    "include": ["**/*.test.ts"],
    "references": [
        { "path": "./tsconfig.json" }
    ]
}
```

```json
// tsconfig.json
{
    // This is a "workspace-style" or "solution-style" tsconfig.
    // Instead of specifying any files, it just references all the actual projects.
    "files": [],
    "references": [
        { "path": "./src/tsconfig.json" },
        { "path": "./src/tsconfig.test.json" },
    ]
}
```

문제는 `foo-test.ts` 파일을 편집할 때 편집기가 `project/src/tsconfig.json`을 해당 파일의 "소유" 구성 파일로 간주한다는 점이다. 이는 우리가 원하는 파일이 아닐 수 있고 디렉터리 검색이 멈춘다면 원하는 겨로가를 얻지 못할 수 있다.

이 문제를 피하기 위해 이전에는 `src/tsconfig.json`의 이름을 `src/tsconfig.src.json`과 같이 변경해야 했다. 이렇게 하면 모든 파일이 최상위 `tsconfig.json` 파일에 도달 해 이 파일은 모든 프로젝트를 참조하도록 설정된다. 하지만 이 방식은 비효율적일 수 있다.

```
project/
├── src/
│   ├── foo.ts
│   ├── foo-test.ts
│   ├── tsconfig.src.json
│   └── tsconfig.test.json
└── tsconfig.json
```

이제 TypeScript 5.7은 개발자에게 이러한 작업을 강요하는 대신, 디렉터리 트리를 계속 탐색하여 편집기에서 사용할 적절한 `tsconfig.json` 파일을 찾는다.

## 복합 프로젝트에서 더 빠른 프로젝트 소유권 확인

다음과 같은 구조를 가진 대규모 코드베이스를 상상해보자.

```
packages
├── graphics/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── sound/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── networking/
│   ├── tsconfig.json
│   └── src/
│       └── ...
├── input/
│   ├── tsconfig.json
│   └── src/
│       └── ...
└── app/
    ├── tsconfig.json
    ├── some-script.js
    └── src/
        └── ...
```

`packages`의 각 디렉터리는 별도의 TypeScript 프로젝트이며, 앱 디렉터리는 다른 모든 프로젝트에 종속되는 메인 프로젝트이다.

```json
// app/tsconfig.json
{
    "compilerOptions": {
        // ...
    },
    "include": ["src"],
    "references": [
        { "path": "../graphics/tsconfig.json" },
        { "path": "../sound/tsconfig.json" },
        { "path": "../networking/tsconfig.json" },
        { "path": "../input/tsconfig.json" }
    ]
}
```

`app` 디렉터리에 `some-script.js` 파일이 있다고 가정하고 편집기에서 열면 TypeScript는 이 팡리이 어느 프로젝트에 속하는지 파악하여 적절한 설정을 적용하려 한다.

이 경우, 가장 가까운 `tsconfig.json`파일(`app/tsconfig.json`)이 이 파일을 포함하지 않는다면 과거에는 TypeScript가 이를 확인하기 위해 각 프로젝트를 하나씩 로드해 `some-script.js`를 포함하는 프로젝트를 찾는 즉시 중단했다. 이 접근은 대규모 코드베이스에서 심각하고 예측하기 어려운 성능 문제를 유발했다. 

다른 프로젝트가 참조할 수 있는 모든 프로젝트는 `composite` 플래그를 활성화해야 한다. 이 플래그는 모든 입력 소스 파일이 미리 알려져 있어야 한다는 규칙을 강제한다. 따라서 TypeScript 5.7은 복합 프로젝트를 탐색할 때, 파일이 해당 프로젝트의 루트 파일 집합에 속하는지만 확인한다. 이를 통해 일반적으로 발생하던 최악의 성능 문제를 방지할 수 있다.

## `--module nodenext`에서 JSON 가져오기에 대한 검증

`--module nodenext` 옵션을 사용해 `.json` 파일을 가져올 때, TypeScript는 런타임 오류를 방지하기 위해 특정 규칙을 강제한다.

첫 번째로 JSON 파일을 가져오는 경우 반드시 `type: "json"` 속성이 포함된 import attribute가 있어야 한다.

```ts
import myConfig from "./myConfig.json";
//                   ~~~~~~~~~~~~~~~~~
// ❌ error: Importing a JSON file into an ECMAScript module requires a 'type: "json"' import attribute when 'module' is set to 'NodeNext'.

import myConfig from "./myConfig.json" with { type: "json" };
//                                          ^^^^^^^^^^^^^^^^
// ✅ This is fine because we provided `type: "json"`

```

이 규칙은 런타임에 발생할 수 있는 잠재적인 문제를 미리 방지하기 위한 것으로, JSON 파일을 명확히 구분하고 안전하게 가져올 수 있도록 한다.

이 검증 외에도 TypeScript는 `.json` 파일에 대해 "named" export를 생성하지 않는다. 따라서 JSON 파일의 내용은 오직 기본(default) 가져오기를 통해서만 접근할 수 있다.

```ts
// ✅ This is okay:
import myConfigA from "./myConfig.json" with { type: "json" };
let version = myConfigA.version;

///////////

import * as myConfigB from "./myConfig.json" with { type: "json" };

// ❌ This is not:
let version = myConfig.version;

// ✅ This is okay:
let version = myConfig.default.version;
```

## Node.js의 V8 컴파일 캐싱 지원

Node.js 22는 새로운 API인 `module.enableCompileCache()`를 지원한다. 이 API는 도구의 첫 실행 이후에 수행된 일부 파싱 및 컴파일 작업을 재사용할 수 있도록 해준다.

TypeScript 5.7은 이 API를 활용하여 더 빠르게 유용한 작업을 시작할 수 있다. TypeScript 팀의 자체 테스트에서는 `tsc --version` 명령 실행 속도가 약 2.5배 빨라지는 결과를 확인했다.

