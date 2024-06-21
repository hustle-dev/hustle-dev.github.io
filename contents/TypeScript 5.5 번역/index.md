---
title: TypeScript 5.5 번역
description: TypeScript 5.5 Release를 번역하면서 어떤 기능들이 나왔는지 학습합니다.
date: 2024-06-21
slug: /translate-ts-5-5
tags: [Typescript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

<!-- 썸네일 -->




<!-- 본문 -->

> TypeScript 5.5에서 중요하다고 생각되는 부분을 번역했습니다. 더 자세한 글은 아래 원글 링크를 참고해주세요.
> https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/


## 추론된 타입 서술

TypeScript의 제어 흐름 분석은 변수 타입이 코드에서 어떻게 변화하는지 추적한다. 

```ts
interface Bird {
    commonName: string;
    scientificName: string;
    sing(): void;
}

// Maps country names -> national bird.
// Not all nations have official birds (looking at you, Canada!)
declare const nationalBirds: Map<string, Bird>;

function makeNationalBirdCall(country: string) {
  const bird = nationalBirds.get(country);  // bird has a declared type of Bird | undefined
  if (bird) {
    bird.sing();  // bird has type Bird inside the if statement
  } else {
    // bird has type undefined here.
  }
}
```

`undefined` 경우를 처리하도록 하여 TypeScript는 더 견고한 코드를 작성하도록 유도한다.

과거에는 이러한 타입 정제를 배열에 적용하기 어려웠다. 이 코드는 이전 모든 버전의 TypeScript에서 오류가 발생했을 것이다.

```ts
function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // error: 'bird' is possibly 'undefined'.
  }
}
```

모든 `undefined` 값을 목록에서 필터링 했기 때문에 이 코드는 완벽하게 정상이지만 TypeScript가 따라가지 못했다.

TypeScript 5.5에서는 타입 체커가 이 코드를 올바르게 처리한다.

```ts
function makeBirdCalls(countries: string[]) {
  // birds: Bird[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // ok!
  }
}
```

`birds`의 더 정밀한 타입을 주목하자.

이는 TypeScript가 이제 `filter` 함수에 대해 타입 서술을 추론하기 때문이다. 이를 독립된 함수로 분리하여 더 명확하게 볼 수 있다.


```ts
// function isBirdReal(bird: Bird | undefined): bird is Bird
function isBirdReal(bird: Bird | undefined) {
  return bird !== undefined;
}
```

`bird is Bird`는 type predicate(타입 서술)이다. 즉 함수가 참을 반환하면 `Bird`가 되고 `false`를 반환하면 `undefined`라는 것을 의미한다. `Array.prototype.filter`는 타입 서술을 알고 있으므로 더 정밀한 타입을 얻을 수 있다.

TypeScript는 다음 조건이 충족되면 함수가 타입 서술을 반환한다고 추론한다

1. 명시적 반환 타입 또는 타입 서술 주석이 없음
2. 단일 반환문과 암시적 반환이 없음
3. 매개변수를 변형하지 않음
4. 매개변수의 정제와 관련된 boolean 표현식을 반환함


추론된 타입 서술의 몇 가지 예는 다음과 같다.

```ts
// const isNumber: (x: unknown) => x is number
const isNumber = (x: unknown) => typeof x === 'number';

// const isNonNullish: <T>(x: T) => x is NonNullable<T>
const isNonNullish = <T,>(x: T) => x != null;
```

이전에는 TypeScript가 이러한 함수가 `boolean`을 반환한다고만 추론했지만, 이제는 `x is number` 또는 `x is NonNullable<T>`와 같은 타입 서술을 포함한 시그니처를 추론한다.

타입 서술은 "오직 ~한 경우에만"이라는 의미를 가진다. 함수가 `x is T`를 반환하면

1. 함수가 `true`를 반환하면 `x`는 타입 `T`를 가진다.
2. 함수가 `false`를 반환하면 `x`는 타입 `T`를 가지지 않는다.

타입 서술이 추론되지 않는 경우, 두 번째 규칙을 어겼을 가능성이 크다. 이는 종종 "truthiness" 검사에서 발생한다.

```ts
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => !!score);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // error: Object is possibly 'undefined'.
}
```

TypeScript는 `score => !!score`에 대해 타입 서술을 추론하지 않는다. 이는 올바른 판단이다. 이 함수가 `true`를 반환하면 `score`는 `number`이지만, `false`를 반환하면 `score`는 `undefined` 또는 숫자(구체적으로 `0`)일 수 있다. 이는 실제 버그로, 시험에서 0점을 받은 학생의 점수를 필터링하면 평균이 왜곡된다. 

따라서, `undefined` 값을 명시적으로 필터링하는 것이 좋다.


```ts
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => score !== undefined);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;  // ok!
}
```

참거짓(truthiness) 검사는 모호성이 없는 객체 타입에 대해서는 타입 서술을 추론한다. 함수가 추론된 타입 서술의 후보가 되려면 boolean을 반환해야 한다: `x => !!x`는 타입 서술을 추론할 수 있지만 `x => x`는 그렇지 못한다.

명시적 타입 서술은 기존과 동일하게 작동하며, TypeScript는 동일한 타입 서술을 추론할지 여부를 확인하지 않는다. 명시적 타입 서술("is")은 타입 단언("as")과 마찬가지로 안전하지 않다.

이 기능이 더 정밀한 타입을 추론하여 기존 코드를 깨뜨릴 가능성이 있다. 예를 들어

```ts
// Previously, nums: (number | null)[]
// Now, nums: number[]
const nums = [1, 2, 3, null, 5].filter(x => x !== null);

nums.push(null);  // ok in TS 5.4, error in TS 5.5
```

해결책은 명시적으로 배열에 타입을 사용하는 것이다.

```ts
const nums: (number | null)[] = [1, 2, 3, null, 5].filter(x => x !== null);
nums.push(null);  // ok in all versions
```

## 상수 인덱스 접근에 대한 제어 흐름 좁히기

TypeScript는 이제 `obj`와 `key`가 모두 사실상 상수일 때 `obj[key]` 형태의 표현식을 좁힐 수 있다.

```ts
function f1(obj: Record<string, unknown>, key: string) {
    if (typeof obj[key] === "string") {
        // Now okay, previously was error
        obj[key].toUpperCase();
    }
}
```

위 예제에서, `obj`나 `key`는 변경되지 않으므로 TypeScript는 `typeof` 검사를 통해 `obj[key]`의 타입을 `string`으로 좁힐 수 있다.

## JSDoc `@import` 태그

오늘날 JavaScript 파일에서 타입 검사만을 위해 무언가를 가져오려면 번거롭다. JavaScript 개발자는 런타임에 존재하지 않는 `SomeType`이라는 이름의 타입을 단순히 import할 수 없다.


```ts
// ./some-module.d.ts
export interface SomeType {
    // ...
}

// ./index.js
import { SomeType } from "./some-module"; // ❌ runtime error!

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

`SomeType`는 런타임에 존재하지 않으므로 import가 실패한다. 대신, 개발자는 네임스페이스 import를 사용할 수 있다.

```ts
import * as someModule from "./some-module";

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

그러나 `./some-module`은 여전히 런타임에 import된다.

이를 피하기 위해, 개발자들은 일반적으로 JSDoc 주석에서 `import(...)` 타입을 사용해야 했다.

```ts
/**
 * @param {import("./some-module").SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

여러 곳에서 동일한 타입을 재사용하려면, `typedef`를 사용하여 import를 반복하는 것을 피할 수 있다.

```ts
/**
 * @typedef {import("./some-module").SomeType} SomeType
 */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

이 방식은 `SomeType`의 로컬 사용에는 도움이 되지만, 많은 import에 반복적으로 사용하면 번거로울 수 있다.

그래서 TypeScript는 이제 ECMAScript import와 동일한 문법을 사용하는 새로운 `@import` 주석 태그를 지원한다.

```ts
/** @import { SomeType } from "some-module" */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

여기서 명시적 import를 사용했다. 네임스페이스 import로도 작성할 수 있다.

```ts
/** @import * as someModule from "some-module" */

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

이는 JSDoc 주석일 뿐이므로 런타임 동작에 전혀 영향을 미치지 않는다.

## 정규 표현식 구문 검사

지금까지 TypeScript는 코드에서 대부분의 정규 표현식을 건너뛰었다. 이는 정규 표현식이 확장 가능한 문법을 가지고 있으며, TypeScript가 이전 버전의 JavaScript로 컴파일하는 노력을 기울이지 않았기 때문이다. 그 결과, 정규 표현식에서 많은 일반적인 문제들이 발견되지 못하고 런타임 오류로 이어지거나 조용히 실패하곤 했다.

그러나 이제 TypeScript는 정규 표현식에 대한 기본 구문 검사를 수행한다! 이를 통해 많은 일반적인 오류를 사전에 발견할 수 있게 되었다.

```ts
let myRegex = /@robot(\s+(please|immediately)))? do some task/;
//                                            ~
// error!
// Unexpected ')'. Did you mean to escape it with backslash?
```

이것은 단순한 예제이지만, 이러한 검사는 많은 일반적인 실수를 잡아낼 수 있다. 사실, TypeScript의 검사는 단순한 구문 검사를 넘어선다. 예를 들어, 존재하지 않는 역참조(backreference) 문제를 잡아낼 수 있다.

```ts
let myRegex = /@typedef \{import\((.+)\)\.([a-zA-Z_]+)\} \3/u;
//                                                        ~
// error!
// This backreference refers to a group that does not exist.
// There are only 2 capturing groups in this regular expression.
```

같은 원칙이 명명된 캡처 그룹(named capturing groups)에도 적용된다.


```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<namedImport>/;
//                                                                                        ~~~~~~~~~~~
// error!
// There is no capturing group named 'namedImport' in this regular expression.
```

TypeScript의 검사는 이제 특정 RegExp 기능이 ECMAScript의 대상 버전보다 최신일 때도 인식한다. 예를 들어, ES5 타겟에서 위와 같이 명명된 캡처 그룹을 사용하면 오류가 발생한다.

```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<importedEntity>/;
//                                  ~~~~~~~~~~~~         ~~~~~~~~~~~~~~~~
// error!
// Named capturing groups are only available when targeting 'ES2018' or later.
```

특정 정규 표현식 플래그도 마찬가지이다.

TypeScript의 정규 표현식 지원은 정규 표현식 리터럴로 제한된다. 문자열 리터럴을 사용하여 new RegExp를 호출하면 TypeScript는 제공된 문자열을 검사하지 않는다.

## 새로운 ECMAScript Set 메서드 지원

TypeScript 5.5는 ECMAScript `Set` 타입에 대한 새로운 제안된 메서드를 선언한다.

이러한 메서드 중 일부는 `union`, `intersection`, `difference`, `symmetricDifference`로, 다른 `Set`을 받아 새로운 `Set`을 반환한다. 다른 메서드인 `isSubsetOf`, `isSupersetOf`, `isDisjointFrom`은 다른 `Set`을 받아 `boolean`을 반환한다. 이들 메서드는 원래의 `Set`을 변경하지 않는다.

다음은 이러한 메서드를 사용하는 예제이다.

```ts
let fruits = new Set(["apples", "bananas", "pears", "oranges"]);
let applesAndBananas = new Set(["apples", "bananas"]);
let applesAndOranges = new Set(["apples", "oranges"]);
let oranges = new Set(["oranges"]);
let emptySet = new Set();

////
// union
////

// Set(4) {'apples', 'bananas', 'pears', 'oranges'}
console.log(fruits.union(oranges));

// Set(3) {'apples', 'bananas', 'oranges'}
console.log(applesAndBananas.union(oranges));

////
// intersection
////

// Set(2) {'apples', 'bananas'}
console.log(fruits.intersection(applesAndBananas));

// Set(0) {}
console.log(applesAndBananas.intersection(oranges));

// Set(1) {'apples'}
console.log(applesAndBananas.intersection(applesAndOranges));

////
// difference
////

// Set(3) {'apples', 'bananas', 'pears'}
console.log(fruits.difference(oranges));

// Set(2) {'pears', 'oranges'}
console.log(fruits.difference(applesAndBananas));

// Set(1) {'bananas'}
console.log(applesAndBananas.difference(applesAndOranges));

////
// symmetricDifference
////

// Set(2) {'bananas', 'oranges'}
console.log(applesAndBananas.symmetricDifference(applesAndOranges)); // no apples

////
// isDisjointFrom
////

// true
console.log(applesAndBananas.isDisjointFrom(oranges));

// false
console.log(applesAndBananas.isDisjointFrom(applesAndOranges));

// true
console.log(fruits.isDisjointFrom(emptySet));

// true
console.log(emptySet.isDisjointFrom(emptySet));

////
// isSubsetOf
////

// true
console.log(applesAndBananas.isSubsetOf(fruits));

// false
console.log(fruits.isSubsetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSubsetOf(oranges));

// true
console.log(fruits.isSubsetOf(fruits));

// true
console.log(emptySet.isSubsetOf(fruits));

////
// isSupersetOf
////

// true
console.log(fruits.isSupersetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSupersetOf(fruits));

// false
console.log(applesAndBananas.isSupersetOf(oranges));

// true
console.log(fruits.isSupersetOf(fruits));

// false
console.log(emptySet.isSupersetOf(fruits));
```

## 격리된 선언

선언 파일(`.d.ts` 파일)은 기존 라이브러리와 모듈의 구조를 TypeScript에 설명한다. 이 파일들은 라이브러리의 타입 시그니처를 포함하지만 함수 본문과 같은 구현 세부 사항은 제외된다. 선언 파일을 직접 작성할 수 있지만, TypeScript가 `--declaration` 옵션을 사용하여 소스 파일에서 자동으로 생성하게 하는 것이 더 안전하고 간단하다.

TypeScript 컴파일러와 API는 항상 선언 파일을 생성하는 역할을 해왔지만, 다른 도구를 사용하거나 기존 빌드 프로세스가 확장되지 않는 경우도 있다.

### 유즈 케이스: 더 빠른 선언 파일 생성 도구

더 빠른 선언 파일 생성 도구를 만들고 싶다면, 특히 출판 서비스나 새로운 번들러의 일부로서 고려할 수 있다. TypeScript를 JavaScript로 변환하는 빠른 도구들은 많지만, TypeScript를 선언 파일로 변환하는 도구는 그렇지 않다. 그 이유는 TypeScript의 추론 기능을 사용하면 명시적으로 타입을 선언하지 않고도 코드를 작성할 수 있게 하기 때문이다.

예를 들어, 두 개의 가져온 변수를 더하는 간단한 함수를 고려해 보자.

```ts
// util.ts
export let one = "1";
export let two = "2";

// add.ts
import { one, two } from "./util";
export function add() { return one + two; }
```

우리가 단지 `add.d.ts` 파일을 생성하려고 하더라도, TypeScript는 다른 가져온 파일(`util.ts`)로 들어가서 `one`과 `two`의 타입이 문자열임을 추론하고, 두 문자열에 대한 `+` 연산자가 `string` 반환 타입을 가진다는 것을 계산해야 한다.

```ts
// add.d.ts
export declare function add(): string;
```

이러한 추론은 개발자 경험에 중요하지만, 선언 파일을 생성하려는 도구는 타입 체커의 일부를 복제하고, 추론 및 모듈 지정자를 해결하여 import를 따라가야 한다.

### 유즈 케이스: 병렬 선언 파일 생성 및 병렬 검사

여러 프로젝트가 있는 모노레포와 다중 코어 CPU가 있다면, 각 프로젝트를 다른 코어에서 동시에 검사할 수 있다면 좋을 것이다. 하지만 의존성 순서대로 프로젝트를 빌드해야 한다. 예를 들어, `backend와` `frontend`가 `core`에 의존할 경우, `core`가 빌드되어 선언 파일이 생성될 때까지 `frontend`나 `backend`를 검사할 수 없다.

![image](https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/5f072d29-187b-4d16-b5c0-4f094cad1599)

위 그래프에서 병목 현상이 발생하는 것을 볼 수 있다. `frontend`와 `backend`를 병렬로 빌드할 수 있지만, 먼저 `core`가 빌드 완료될 때까지 기다려야 한다.

이 문제를 개선하려면 어떻게 해야 할까? 빠른 도구가 `core`의 선언 파일을 병렬로 생성할 수 있다면, TypeScript는 이를 통해 `core`, `frontend`, `backend`를 병렬로 타입 검사할 수 있다.

### 해결책: 명시적 타입!

두 가지 사용 사례의 공통 요구 사항은 선언 파일을 생성하기 위한 파일 간 타입 검사기가 필요하다는 것이다. 도구 커뮤니티에게 많은 것을 요구하는 셈이다.

복잡한 예로, 다음 코드를 위한 선언 파일이 필요하다면...


```ts
import { add } from "./add";

const x = add();

export function foo() {
    return x;
}

```

`foo`의 시그니처를 생성해야 한다. 이를 위해 `foo`의 구현을 봐야 하고, `foo`는 `x`를 반환하므로 `x`의 타입을 얻기 위해 `add`의 구현을 살펴봐야 한다. 이는 `add`의 의존성까지 살펴봐야 할 수 있다. 이는 선언 파일을 생성하려면 다양한 위치의 타입을 알아내기 위한 많은 논리가 필요하다는 것을 의미한다.

그러나 빠른 반복 시간과 완전한 병렬 빌드를 원하는 개발자들에게는 다른 접근 방식이 있다. 선언 파일은 모듈의 공개 API 타입만 필요하다. 개발자가 내보내는 항목의 타입을 명시적으로 작성하면, 도구는 모듈의 구현을 보지 않고 선언 파일을 생성할 수 있다. 이는 전체 타입 검사기를 재구현하지 않아도 된다.

이때 새로운 `--isolatedDeclarations` 옵션이 필요하다. 이 옵션은 타입 검사기 없이 모듈을 신뢰할 수 있게 변환할 수 없을 때 오류를 보고한다. 즉, 내보내는 항목이 충분히 주석 처리되지 않은 파일이 있는 경우 TypeScript가 오류를 보고한다.

위 예제에서는 다음과 같은 오류가 발생할 수 있다.


```ts
export function foo() {
//              ~~~
// error! Function must have an explicit
// return type annotation with --isolatedDeclarations.
    return x;
}

```

### 왜 오류가 바람직한가요?

오류는 TypeScript가 다음을 가능하게 하기 때문이다

1. 다른 도구가 선언 파일을 생성하는 데 문제가 있는지 미리 알려준다.
2. 누락된 주석을 추가하는 데 도움을 주는 빠른 수정을 제공한다.

이 모드는 모든 곳에 주석을 요구하지 않는다. 공개 API에 영향을 미치지 않는 로컬 변수에 대해서는 주석이 없어도 된다. 예를 들어, 다음 코드는 오류를 발생시키지 않는다.


```ts
import { add } from "./add";

const x = add("1", "2"); // no error on 'x', it's not exported.

export function foo(): string {
    return x;
}
```

계산하기에 '사소한' 유형인 특정 표현식도 있다.

```ts
// No error on 'x'.
// It's trivial to calculate the type is 'number'
export let x = 10;

// No error on 'y'.
// We can get the type from the return expression.
export function y() {
    return 20;
}

// No error on 'z'.
// The type assertion makes it clear what the type is.
export function z() {
    return Math.max(x, y()) as number;
}
```

### 격리된 선언 사용

`isolatedDeclarations`는 `declaration` 또는 `composite` 플래그가 설정되어 있어야 한다.

`isolatedDeclarations`는 TypeScript의 emit 방식을 변경하지 않고, 오류 보고 방식만 변경한다. 이 기능은 아직 초기 단계에 있으며, 클래스와 객체 리터럴의 계산된 속성 선언과 같은 일부 시나리오는 지원되지 않는다.

이 기능을 도입할 때는 각 경우를 신중하게 고려해야 한다. 일부 개발자 경험이 손실될 수 있지만, 병렬 빌드 전략의 최적화 기회를 제공한다.

### `${configDir}` 템플릿 변수 for 설정 파일

많은 코드베이스에서 다른 구성 파일의 "베이스" 역할을 하는 공유 `tsconfig.json` 파일을 재사용하는 것이 일반적이다. 이 작업은 `tsconfig.json` 파일의 `extends` 필드를 사용하여 수행한다.

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

이 문제 중 하나는 `tsconfig.json` 파일의 모든 경로가 파일 자체의 위치에 상대적이라는 것이다. 즉, 여러 프로젝트에서 사용하는 공유 `tsconfig.base.json` 파일이 있는 경우 파생된 프로젝트에서 상대 경로가 유용하지 않은 경우가 많다. 예를 들어 다음 `tsconfig.base.json`을 상상해 보자.

```json
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types"
            "./custom-types"
        ],
        "outDir": "dist"
    }
}
```

만약 작성자가 모든 `tsconfig.json` 파일이 이 파일을 확장하여 다음과 같은 설정을 의도했다면

1. 파생된 `tsconfig.json`에 상대적인 `dist` 디렉토리에 출력.
2. 파생된 `tsconfig.json`에 상대적인 `custom-types` 디렉토리 사용.


위의 방법은 작동하지 않을 것이다. `typeRoots` 경로는 공유된 `tsconfig.base.json` 파일의 위치를 기준으로 하기 때문에, 각 프로젝트는 동일한 `outDir`과 `typeRoots`를 선언해야 한다. 

이를 해결하기 위해 TypeScript 5.5는 새로운 템플릿 변수 `${configDir}`을 도입했다. `tsconfig.json` 또는 `jsconfig.json` 파일의 특정 경로 필드에 `${configDir}`을 작성하면 이 변수는 지정된 컴파일에서 구성 파일의 포함 디렉터리로 대체된다. 즉, 위의 `tsconfig.base.json`을 다음과 같이 다시 작성할 수 있다.

```json
{
    "compilerOptions": {
        "typeRoots": [
            "${configDir}/node_modules/@types"
            "${configDir}/custom-types"
        ],
        "outDir": "${configDir}/dist"
    }
}
```

이제 프로젝트에서 이 파일을 확장할 때 경로는 공유된 `tsconfig.base.json` 파일이 아니라 파생된 `tsconfig.json`에 상대적인 경로가 된다. 이렇게 하면 프로젝트 간에 구성 파일을 공유하기가 더 쉬워지고 구성 파일의 이식성이 향상된다.

`tsconfig.json` 파일을 확장할 수 있게 만들려면 `./` 대신 `${configDir}`로 작성해야 하는지 고려하자.

