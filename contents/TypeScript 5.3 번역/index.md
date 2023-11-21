---
title: TypeScript 5.3 번역
description: TypeScript 5.3 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2023-11-21
slug: /translate-ts-5-3
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->



<!-- 본문 -->

> 원글 링크: https://devblogs.microsoft.com/typescript/announcing-typescript-5-3/

## Import Attributes

TS 5.3은 [import attributes](https://github.com/tc39/proposal-import-attributes) 에 대한 최신 업데이트를 지원한다.

`import attributes`의 한 가지 사용 사례는 모듈의 예상 형식에 대한 정보를 런타임에 제공하는 것이다.

```ts
// 이것을 JSON으로만 해석되기를 원하고,
// `.json` 확장자를 가진 실행 가능하거나 악의적인 JavaScript 파일이 아니다.
import obj from "./something.json" with { type: "json" };
```

이 속성들의 내용은 호스트에 따라 다르므로 TypeScript에서 확인하지 않고, 브라우저와 런타임이 처리할 수 있도록 그대로 둔다(에러 가능성 포함).

```ts
// TypeScript는 이것을 허용한다.
// 하지만 브라우저에서는 아닐 수 있다.
import * as foo from "./foo.js" with { type: "fluffy bunny" };
```

동적 `import()` 호출은 두 번째 인수를 통해 `import attributes`를 사용할 수 있다.

```ts
const obj = await import("./something.json", {
    with: { type: "json" }
});
```

두 번째 인수의 예상 타입은 `ImportCallOptions`라는 타입으로 정의되며, 기본적으로 `with`라는 속성을 기대한다.

`import attribute`는 TS 4.5에서 구현된 `import assertions`이라는 이전 제안에서 발전된 것이다. 가장 명확한 차이점은 `assert` 키워드 대신 `with` 키워드를 사용한다는 점이다. 또 다른 차이점은 런타임이 이제 `import` 경로의 해석과 해석을 안내하기 위해 attirbutes를 자유롭게 사용할 수 있게 되었지만, import 단언은 모듈을 로드한 후에만 일부 특성을 `assert`할 수 있었다는 것이다.

시간이 지남에 따라 TS는 `import assertions`의 기존 구문을 폐기하고 `import attributes`에 대한 제안된 구문을 사용할 계획이다. `assert`를 사용하는 기존 코드는 `with` 키워드로 마이그레이션해야 한다. `import attribute`가 필요한 새 코드는 `with`을 사용해야 한다.

## Import Types에서 `resolution-mode` 지원 안정화

TS 4.7에서 TypeScript는 `/// <reference types="..." />`에 `resolution-mode` 속성을 추가하여 지정자가 `import` 또는 `require` 시맨틱을 통해 해석되어야 하는지 제어하는 기능을 지원하기 시작했다.

```ts
/// <reference types="pkg" resolution-mode="require" />

// or

/// <reference types="pkg" resolution-mode="import" />
```

타입 전용 import에 대한 `import assertion`에도 해당 필드가 추가되었지만, 이는 nightly 버전의 TS에서만 지원되었다. 그 이유는 `import assertion`이 본질적으로 모듈 해석을 위한 것이 아니었기 때문이다. 따라서 이 기능은 더 많은 피드백을 얻기 위해 nightly 전용 모드로 실험적으로 제공되었다.

하지만 `import attributes`가 resolution 할 수 있고, 합리적인 사용 사례를 확인했으므로 이제 TS 5.3에서는 `import type`에 대한 `resolution-mode` 속성을 지원한다.

```ts
// `require()`로 import 하는 것처럼 `pkg`를 확인
import type { TypeFromRequire } from "pkg" with {
    "resolution-mode": "require"
};

// `import`로 import하는 것처럼 `pkg`를 확인
import type { TypeFromImport } from "pkg" with {
    "resolution-mode": "import"
};

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

이러한 `import attributes`는 `import()` 타입에도 사용할 수 있다.

```ts
export type TypeFromRequire =
    import("pkg", { with: { "resolution-mode": "require" } }).TypeFromRequire;

export type TypeFromImport =
    import("pkg", { with: { "resolution-mode": "import" } }).TypeFromImport;

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

## `resolution-mode` 모든 모듈 모드에서 지원

이전에는 `resolution-mode`를 사용할 수 있는 `moduleResolution` 옵션은 `node 16` 및 `nodenext`에서만 허용되었다. 타입별로 특정 모듈을 더 쉽게 찾기 위해, 이제 `resolution-mode`는 `bundler`, `node 10`과 같은 다른 모든 `moduleResolution` 옵션에서 적절하게 작동하며 `classic`에서는 오류를 발생시키지 않는다.

## `switch (true)` Narrowing

TS 5.3은 이제 `switch (true)`내의 각 `case` 절의 조건을 기반으로 타입을 좁힐 수 있다.

```ts
function f(x: unknown) {
    switch (true) {
        case typeof x === "string":
            // 'x' is a 'string' here
            console.log(x.toUpperCase());
            // falls through...

        case Array.isArray(x):
            // 'x' is a 'string | any[]' here.
            console.log(x.length);
            // falls through...

        default:
          // 'x' is 'unknown' here.
          // ...
    }
}
```

## Booleans과의 비교를 통한 Narrowing

어떤 조건에서 `true` 또는 `false`를 직접 비교해야 할 때가 있을 수 있다. 보통 이런 비교는 불필요한 비교이지만, 스타일의 한 포인트로 선호하거나 JS 진실성과 관련된 특정 문제를 피하기 위해 사용할 수 있다. 어쨋든 이전에는 TS가 좁히기를 수행할 때 이러한 형식을 인지하지 못했다.

TS 5.3은 변수를 좁힐 때 이러한 표현식을 이해하고 유지한다.

```ts
interface A {
    a: string;
}

interface B {
    b: string;
}

type MyType = A | B;

function isA(x: MyType): x is A {
    return "a" in x;
}

function someFn(x: MyType) {
    if (isA(x) === true) {
        console.log(x.a); // works!
    }
}
```

## `Symbol.hasInstance`를 통한 `instanceof` 좁히기

JS의 난해한 특징은 `instanceof` 연산자의 동작을 재정의할 수 있다는 것이다. 이렇게 하려면 `instanceof`의 오른쪽에 있는 값에 `Symbol.hasInstance`로 명명된 특정 메서드가 있어야 한다.

```ts
class Weirdo {
    static [Symbol.hasInstance](testedValue) {
        // wait, what?
        return testedValue === undefined;
    }
}

// false
console.log(new Thing() instanceof Weirdo);

// true
console.log(undefined instanceof Weirdo);
```

`instanceof`에서 이 동작을 더 잘 모델링하기 위해 TS는 이제 해당 `[Symbol.hasInstance]` 메서드가 존재하고, 타입 예측 함수로 선언되어 있는지 확인한다. 그렇다면 `instanceof` 연산자 왼쪽의 테스트된 값은 해당 타입 예측에 의해 적절하게 좁혀진다.

```ts
interface PointLike {
    x: number;
    y: number;
}

class Point implements PointLike {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceFromOrigin() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    static [Symbol.hasInstance](val: unknown): val is PointLike {
        return !!val && typeof val === "object" &&
            "x" in val && "y" in val &&
            typeof val.x === "number" &&
            typeof val.y === "number";
    }
}


function f(value: unknown) {
    if (value instanceof Point) {
        // 이 두 가지에 접근 가능 - 정확!
        value.x;
        value.y;

        // 이건 접근할 수 없음 - `PointLike`를 가지고 있지만,
        // 실제로 'Point'는 아님
        value.distanceFromOrigin();
    }
}
```

이 예시에서 볼 수 있듯이, `Point`는 자체적인 [Symbol.hasInstance] 메서드를 정의한다. 그것은 사실 `PointLike`라는 별도의 타입에 대한 사용자 지정 타입 가드로 작용한다. `f` 함수에서 `instanceof`를 사용하여 `value`를 `PointLike`로 narrowing 할 수 있었지만 `Point`로는 할 수 없었다. 이는 우리가 `x` 및 `y` 속성에 접근할 수 있지만 `distanceFromOrigin` 메서드에는 접근할 수 없음을 의미한다.

## Instance 필드에 대한 `super` 속성 접근 검사

JS에선 `super` 키워드를 통해 기본 클래스의 선언에 접근할 수 있다.

```ts
class Base {
    someMethod() {
        console.log("Base method called!");
    }
}

class Derived extends Base {
    someMethod() {
        console.log("Derived method called!");
        super.someMethod();
    }
}

new Derived().someMethod();
// 출력:
//   Derived method called!
//   Base method called!
```

이것은 `this.someMethod()`와 같이 쓰는 것과 다르다. 왜냐하면 이것은 오버라이딩된 메서드를 호출할 수 있기 때문이다. 이것은 종종 두 가지가 구별되지 않는 경우가 많아 더욱 미묘한 차이이다.


```ts
class Base {
    someMethod() {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        // 이 둘은 동일하게 작동합니다.
        this.someMethod();
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// 출력:
//   someMethod called!
//   someMethod called!
```

문제는 `super`를 필드로 정의된 메서드에 사용하면 런타임 오류가 발생할 수 있다는 것이다.

```ts
class Base {
    someMethod = () => {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// 💥
// 작동하지 않습니다. 'super.someMethod'는 'undefined'입니다.
```

TS 5.3은 이제 `super` 속성 접근/메서드 호출을 더 면밀히 검사하여 클래스 필드에 해당하는지 확인한다. 즉, 이제 타입 검사 오류가 발생한다.

## Interactive Inlay Hints for Types

TypeScript의 인레이 힌트는 이제 타입의 정의로 이동하는 것을 지원한다! 이것은 코드를 쉽게 탐색하는 데 도움이 된다.

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/ae06db2e-2d94-44ff-958f-bb7ba89e47df)

## `type` Auto-Imports 선호 설정

이전에 TypeScript가 타입 위치에 대한 자동 가져오기를 생성할 때, 설정에 따라 `type` 수정자를 추가했다. 예를 들어, 다음과 같은 경우에 `Person`에 대한 자동 가져오기를 받을 때:

```ts
export let p: Person
```

TS의 편집 경험은 보통 `Person`에 대한 가져오기를 다음과 같이 추가한다:

```ts
import { Person } from "./types";

export let p: Person
```

그리고 `verbatimModuleSyntax`와 같은 특정 설정에서는 타입 수정자를 추가한다:

```ts
import { type Person } from "./types";

export let p: Person
```

하지만, 코드베이스가 이러한 옵션을 사용할 수 없거나 가능한 경우 명시적인 타입 가져오기를 선호할 수 있다.

최근 변경으로 TS는 이제 이를 편집기별 옵션으로 활성화할 수 있다. Visual Studio Code에서는 UI에서 `"TypeScript › Preferences: Prefer Type Only Auto Imports"`로 활성화하거나, JSON 구성 옵션 `typescript.preferences.preferTypeOnlyAutoImports`로 설정할 수 있다.

## JSDoc 파싱 생략에 의한 최적화

`tsc`를 통해 TS를 실행할 때, 컴파일러는 이제 JSDoc 파싱을 피한다. 이것은 파싱 시간을 단축될 뿐만 아니라 주석을 저장하기 위한 메모리 사용량과 가비지 컬렉션에 소요되는 시간도 줄여준다. 전반적으로 컴파일 시간이 약간 빨라지고, `--watch` 모드에서 더 빠른 피드백을 볼 수 있을 것이다.

TS를 사용하는 모든 도구가 JSDoc을 저장할 필요가 없기 때문에 (예: typescript-eslint 및 Prettier), 이 파싱 전략은 API 자체의 일부로 제공되었다. 이를 통해 이러한 도구들도 TS 컴파일러에 도입된 동일한 메모리 및 속도 개선 효과를 얻을 수 있다. 주석 파싱 전략에 대한 새로운 옵션은 `JSDocParsingMode`에 설명되어 있다. 

## 비정규화된 교차점 비교에 의한 최적화

TS에서 합집합과 교집합은 항상 특정 형식을 따르며, 교집합은 항상 타입을 포함할 수 없다. 이는 `A & (B | C)`와 같은 합집합 위에 교집합을 생성할 때, 그 교집합이 `(A & B) | (A & C)`로 정규화됨을 의미한다. 그러나 경우에 따라 타입 시스템은 표시 목적으로 원래 형태를 유지한다.

원래 형태는 타입 간의 몇 가지 빠른 경로 비교에 사용될 수 있다.

예를 들어, `SomeType & (Type1 | Type2 | ... | Type99999NINE)`을 가지고 있고 이것이 `SomeType`에 할당 가능한지 확인하고 싶다고 가정해 보자. 소스 타입으로 실제 교집합을 가지고 있는 것이 아니라 `(SomeType & Type1) | (SomeType & Type2) | ... | (SomeType & Type99999NINE)`과 같은 합집합을 가지고 있다는 것을 기억하자. 합집합이 어떤 대상 타입에 할당 가능한지 확인할 때, 합집합의 모든 구성원이 대상 타입에 할당 가능한지 확인해야 하며, 이는 매우 느릴 수 있다.

TS 5.3에서는 원래의 교집합 형태를 살펴본다. 타입을 비교할 때, 소스 교집합의 구성 요소 중 하나에 대상이 존재하는지 빠르게 확인한다.

## `tsserverlibrary.js`와 `typescript.js` 간의 통합

TS 자체는 두 개의 라이브러리 파일 `tsserverlibrary.js`와 `typescript.js`를 제공한다. `tsserverlibrary.js`에서만 사용할 수 있는 특정 API(`ProjectService` API)가 있으며, 일부 importer에게 유용할 수 있다. 그러나 두 개는 서로 다른 번들로 많은 중복 코드를 패키지에 포함하고 있다. 또한 자동 가져오기 또는 근육 기억(muslce memory)으로 인해 일관되게 하나를 다른 하나보다 사용하는 것이 어려울 수 있다. 실수로 두 모듈을 로드하는 것은 너무 쉽고, 다른 API 인스턴스에서 코드가 제대로 동작하지 않을 수 있다. 심지어 작동한다하더라도 두 번째 번들을 로드하는 것은 리소스 사용량을 증가시킨다.

이를 고려해 두 모듈을 통합하기로 결정했다. 이제 `typescript.js`에는 `tsserverlibrary.js`에 포함되었던 내용이 포함되어 있으며, `tsserverlibrary.js`는 이제 단순히 `typescript.js`를 다시 내보낸다. 이 통합의 전후를 비교하면 패키지 크기가 다음과 같이 감소했다.

- Packed: 6.90 MiB에서 5.48 MiB로 -1.42 MiB 감소 (퍼센트로 -20.61%)
- Unpacked: 38.74 MiB에서 30.41 MiB로 -8.33 MiB 감소 (퍼센트로 -21.50%)

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/d85a75de-eb97-4a52-a906-3b46d62c8107)

즉, 패키지 크기가 20.5% 이상 줄어든 것이다.

## 주요 변경 사항 및 정확성 개선 사항

### `lib.d.ts` 변경 사항

DOM에 대해 생성된 타입은 코드베이스에 영향을 미칠 수 있다. 자세한 정보는 [여기](https://github.com/microsoft/TypeScript/pull/55798) 참고.

### Instance 속성에 대한 `super` 접근 검사

TS 5.3은 `super.` 속성 접근이 클래스 필드를 참조하는 선언을 감지하고 오류를 발생시킨다. 이는 런타임에 발생할 수 있는 오류를 방지한다.

