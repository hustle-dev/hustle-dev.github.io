---
title: TypeScript 3.9 번역
description: TypeScript 3.9 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2023-01-07
slug: /translate-ts-3-9
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html

## Promise.all과 추론 개선

최신 버전의 TS(약 3.7)은 `Promise.all` 및 `Promise.race`와 같은 함수 선언이 업데이트 되었다. 특히 `null` 또는 `undefined`와 값을 혼합할 때, 약간의 회귀가 발생했다.

```ts
interface Lion {
  roar(): void;
}
interface Seal {
  singKissFromARose(): void;
}
async function visitZoo(lionExhibit: Promise<Lion>, sealExhibit: Promise<Seal | undefined>) {
  let [lion, seal] = await Promise.all([lionExhibit, sealExhibit]);
  lion.roar(); // uh oh
  //  ~~~~
  // Object is possibly 'undefined'.
}
```

이 동작은 이상하다. `sealExhibit`가 `undefined`를 포함하는 것은 `lion`의 타입에 `undefined`를 포함하게 주입하는 것이다.

[Jack Bates](https://github.com/jablko)의 [PR](https://github.com/microsoft/TypeScript/pull/34501) 덕분에, TS 3.9의 추론 프로세스가 개선되었다. 위 오류는 더 이상 발생하지 않는다. `Promise`와 관련된 문제로 인해 이전 버전의 TS에서 고생했다면, 3.9를 사용하는 것이 좋을 것이다.

## awaited 타입은 무엇인가?

이슈 트래커와 설계 노트를 봐왔다면, [awaited라는 새로운 연산자](https://github.com/microsoft/TypeScript/pull/35998)에 대한 일부 작업을 알고 있을 것이다. 이 타입 연산자의 목표는 JS에서 `Promise`를 푸는 방식을 정확하게 모델링 하는 것이다.

처음에는 TS 3.9에서 `awaited`을 제공할 것으로 예상했지만, 기존 코드 베이스와 함께 초기 TS 빌드를 실행함으로써 모든 사용자에게 원활하게 배포하기 전에 이 기능에 더 많은 설계 작업이 필요하다는 사실을 알았다. 결과적으로, 더 확실해질 때까지 메인 브랜치에서 이 기능을 빼기로 결정했다. 이 기능에 대해 더 많은 실험을 할 예정이지만, 이번 릴리스에서는 제공하지 않는다.

## 속도 향상

TS 3.9는 많은 새로운 속도 향상 기능이 포함되어 있다. material-ui 및 styled-components와 같은 패키지를 사용할 때 편집/컴파일 속도가 매우 열악한 것을 확인한 후 성능에 중점을 두었다. 거대한 unions, intersections, 조건별 타입, 그리고 매핑된 타입과 관련된 특정 병리학적 사례를 최적화 하는 다양한 PR로 심층 분석했다.

- https://github.com/microsoft/TypeScript/pull/36576
- https://github.com/microsoft/TypeScript/pull/36590
- https://github.com/microsoft/TypeScript/pull/36607
- https://github.com/microsoft/TypeScript/pull/36622
- https://github.com/microsoft/TypeScript/pull/36754
- https://github.com/microsoft/TypeScript/pull/36696

이러한 각 PR은 특정 코드 베이스에서 컴파일 시간이 약 5-10% 단축된다. 전체적으로 material-ui의 컴파일 시간이 약 40% 단축되었다.

또한 에디터 시나리오에서 파일 이름 변경 기능이 일부 변경되었다. VSCode 팀으로부터 파일 이름을 바꿀 때 어떤 import문을 업데이트해야 하는지 파악하는데 5초에서 10초가 소요될 수 있다고 들었다. TS 3.9는 [컴파일러 및 언어 서비스가 파일 조회를 캐싱하는 방식의 내부 변경](https://github.com/microsoft/TypeScript/pull/37055)을 통해 이 문제를 해결한다.

여전히 개선의 여지가 있지만, 이 작업이 모든 사람들에게 보다 빠른 경험으로 이어지기를 바란다.

## // @ts-expect-error 주석

TS로 라이브러리를 작성하고 퍼블릭 API의 일부분으로 `doStuff`라는 함수를 export 한다고 상상해보자. TS 사용자가 타입-체크 오류를 받을 수 있도록 `doStuff` 함수의 타입은 두 개의 `string`을 갖는다고 선언하지만, 또한 JS 사용자에게 유용한 오류를 제공하기 위해 런타임 오류를 체크한다. (개발 빌드 시에만 가능).

```js
function doStuff(abc: string, xyz: string) {
  assert(typeof abc === 'string');
  assert(typeof xyz === 'string');
  // do some stuff
}
```

그래서 TS 사용자는 함수를 잘못 사용할 경우 유용한 빨간 오류 밑줄과 오류 메시지를 받게 되며, JS 사용자는 단언 오류를 얻게 된다. 이러한 작동을 테스트하기 위해, 유닛 테스트를 작성하겠다.

```ts
expect(() => {
  doStuff(123, 456);
}).toThrow();
```

불행히도 위의 테스트가 TS에서 작동된다면, TS는 오류를 발생시킬 것이다.

```ts
doStuff(123, 456);
//          ~~~
// error: Type 'number' is not assignable to type 'string'.
```

그래서 TS 3.9는 `// @ts-expect-error` 주석이라는 새로운 기능을 도입했다. 라인 앞에 `// @ts-expect-error` 주석이 붙어있을 경우, TS는 해당 오류를 보고하는 것을 멈춘다. 그러나 오류가 존재하지 않으면, TS는 `// @ts-expect-error`가 필요하지 않다고 보고할 것이다.

간단한 예로, 다음 코드는 괜찮다.

```ts
// @ts-expect-error
console.log(47 * 'octopus');
```

그러나 다음 코드는

```ts
// @ts-expect-error
console.log(1 + 1);
```

오류로 이어질 것이다.

```ts
Unused '@ts-expect-error' directive.
```

이 기능을 구현한 컨트리뷰터, [Josh Goldberg](https://github.com/JoshuaKGoldberg)에게 큰 감사를 드린다. 자세한 내용은 [the ts-expect-error pull request](https://github.com/microsoft/TypeScript/pull/36014)를 참고하라.

## ts-ignore 또는 ts-expect-error ?

어떤 점에서는 `// @ts-expect-error` 가 `// @ts-ignore`와 유사하게 억제 주석(supressiong comment)로 작용할 수 있다. 차이점은 `// @ts-ignore`는 다음 행에 오류가 없을 경우 아무것도 하지 않는다는 것이다.

기존 `// @ts-ignore` 주석을 `// @ts-expect-error`로 바꾸고 싶은 마음이 들 수 있으며, 향후 코드에 무엇이 적합한지 궁금할 수 있다. 이는 전적으로 당신과 당신 팀의 선택이지만, 어떤 상황에서 어떤 것을 선택할 것인지에 대한 몇 가지 아이디어를 아래에서 확인할 수 있다.

다음 경우라면 `ts-expect-error`를 선택하라.

- 타입 시스템이 기능에 대한 오류를 발생시키는 테스트 코드 작성을 원하는 경우
- 수정이 빨리 이루어지길 원하며 빠른 해결책이 필요한 경우
- 오류가 발생한 코드가 다시 유효해지면 바로 억제 주석을 삭제하길 원하는 혁신적인 팀이 이끄는 적당한-크기의 프로젝트에서 작업하는 경우

다음 경우라면 `ts-ignore`를 선택하라.

- 더 큰 프로젝트를 갖고 있고 코드에서 발생한 새로운 오류의 명확한 책임자를 찾기 힘든 경우
- TS의 두 가지 버전 사이에서 업그레이드하는 중이고, 한 버전에서는 코드 오류가 발생하지만 나머지 버전에서는 그렇지 않은 경우
- 솔직히 어떤 옵션이 더 나은지 결정할 시간이 없는 경우

## 조건문에서 호출되지 않은 함수 체크

TS 3.7에서 함수 호출을 잊어버렸을 경우 오류를 보고하기 위해 호출되지 않은 함수 체크를 도입했다.

```ts
function hasImportantPermissions(): boolean {
  // ...
}
// Oops!
if (hasImportantPermissions) {
  //  ~~~~~~~~~~~~~~~~~~~~~~~
  // This condition will always return true since the function is always defined.
  // Did you mean to call it instead?
  deleteAllTheImportantFiles();
}
```

그러나 이 오류는 `if`문의 조건에만 적용된다. [Alexander Tarasyuk](https://github.com/a-tarasyuk)의 [PR](https://github.com/microsoft/TypeScript/pull/36402) 덕분에 이 기능은 삼항 조건 연산자에도 지원하게 되었다.

```ts
declare function listFilesOfDirectory(dirPath: string): string[];
declare function isDirectory(): boolean;
function getAllFiles(startFileName: string) {
  const result: string[] = [];
  traverse(startFileName);
  return result;
  function traverse(currentPath: string) {
    return isDirectory
      ? //     ~~~~~~~~~~~
        // This condition will always return true
        // since the function is always defined.
        // Did you mean to call it instead?
        listFilesOfDirectory(currentPath).forEach(traverse)
      : result.push(currentPath);
  }
}
```

https://github.com/microsoft/TypeScript/issues/36048

## 에디터 개선

TS 컴파일러는 주요 에디터의 TS 작성 경험뿐만 아니라, Visual Studio 계열 에디터 또는 그 이상의 에디터에 JS 작성 경험에도 영향을 준다. 에디터에서 새로운 TS/JS 기능을 사용하는 것은 에디터에 따라 다르겠지만

- VSCode는 [다른 버전의 TS 선택](https://code.visualstudio.com/docs/typescript/typescript-compiling#_using-the-workspace-version-of-typescript)을 지원한다. 또는 최신으로 유지하기 위한 [JS/TS Nightly Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)도 있다.
- Visual Studio 2017/2019 에는 SDK 설치 프로그램과 [MSBuild 설치](https://www.nuget.org/packages/Microsoft.TypeScript.MSBuild)가 있다.
- Sublime Text 3은 다른 버전의 TS 선택을 지원한다.

## JS에서 CommonJS 자동-import

CommonJS 모듈을 사용하는 JS 파일에서 자동-import 기능이 크게 개선되었다.

이전 버전에서는, TS는 항상 파일에 관계없이 ECMAScript 스타일의 import를 원한다고 가정했다.

```ts
import * as fs from 'fs';
```

그러나, 모든 사람들이 JS 파일을 작성할 때, ECMAScript 스타일의 모듈을 원하는 것은 아니다. 많은 사용자가 여전히 CommonJS 스타일의 `require(...)` import를 사용하고 있다.

```ts
const fs = require('fs');
```

이제 TS는 파일 스타일을 깔끔하고 일관되게 유지하기 위해서 사용중인 import 유형을 자동으로 검색한다.

이 변화에 대한 자세한 정보는 [해당 PR](https://github.com/microsoft/TypeScript/pull/37027)을 참고하라.

## 코드 작업 개행 유지

TS의 리팩터링과 빠른 수정은 종종 개행을 유지하는데 큰 역할을 하지는 않았다. 기본적인 예로 다음 코드를 보자.

```ts
const maxValue = 100;
/*start*/
for (let i = 0; i <= maxValue; i++) {
  // First get the squared value.
  let square = i ** 2;

  // Now print the squared value.
  console.log(square);
}
/*end*/
```

에디터에서 `/*시작*/`에서 `/*끝*/`까지 범위를 강조하여 새로운 함수로 추출한다면, 다음과 같은 코드가 된다.

> 이 부분은 TS 공식문서의 [첨부된 영상](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#code-actions-preserve-newlines) 참고

```ts
const maxValue = 100;

printSquares();

function printSquares() {
  for (let i = 0; i <= maxValue; i++) {
    // First get the squared value.
    let square = i ** 2;
    // Now print the squared value.
    console.log(square);
  }
}
```

이건 이상적이지 않다. - `for` 루프에서 각각의 문 사이에 빈 줄이 있었지만 리팩터링이 없애버렸다! TS 3.9은 우리가 작성한 것을 보존하기 위해 조금 더 신경을 쓴다.

```ts
const maxValue = 100;

printSquares();

function printSquares() {
  for (let i = 0; i <= maxValue; i++) {
    // First get the squared value.
    let square = i ** 2;

    // Now print the squared value.
    console.log(square);
  }
}
```

[이 PR](https://github.com/microsoft/TypeScript/pull/36688)에서 구현에 대해 더 자세히 볼 수 있다.

## 누락된 반환문 빠른 수정(quick fixes)

특히 화살표 함수에 중괄호를 추가할 때, 함수의 마지막 문의 값을 반환하는 것을 잊는 경우가 있다.

```ts
// before
let f1 = () => 42;

// oops - not the same!
let f2 = () => {
  42;
};
```

커뮤니티 멤버인 [Wenlu Wang](https://github.com/Kingwl)의 [PR](https://github.com/microsoft/TypeScript/pull/26434) 덕분에, TS는 누락된 `return`문을 추가하거나, 중괄호를 제거하거나, 객체 리터럴처럼 보이는 화살표 함수 몸체에 괄호를 추가하는 빠른 수정을 제공할 수 있다.

## tsconfig.json 파일 '솔루션 스타일' 지원

에디터는 파일이 어떤 설정 파일에 속하는지 파악하여 적절한 옵션을 적용할 수 있도록 하고 현재 '프로젝트'에 어떤 다른 파일이 포함되어 있는지 파악해야 한다. 기본적으로, TS의 언어 서버가 영향을 주는 에디터는 각 상위 디렉터리를 따라 올라가 `tsconfig.json`을 찾음으로써 이 작업을 수행한다.

이 문제가 약간 실패하는 경우 중 하나는 `tsconfig.json`이 단순히 다른 `tsconfig.json` 파일을 참조하기 위해 존재할 때였다.

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.shared.json" },
    { "path": "./tsconfig.frontend.json" },
    { "path": "./tsconfig.backend.json" }
  ]
}
```

다른 프로젝트 파일을 관리만 하는 이 파일은 어떤 환경에서는 종종 '솔루션'이라고 불린다. 여기서 `tsconfig.*.json`파일 중 어떤 파일도 서버에 의해 검색되지 않지만, 현재 `.ts`파일이 루트의 `tsconfig.json`에 언급된 프로젝트 중 하나에 속한다는 것을 언어 서버가 이해하기를 원한다.

TS 3.9는 이 설정에 대한 시나리오 수정을 지원한다. 더 자세한 사항은 [이 기능을 추가한 PR](https://github.com/microsoft/TypeScript/pull/37239)을 확인하라.

## 주요 변경 사항

### 옵셔널 체이닝과 널이 아닌 단언에서 파싱 차이점

최근에 TS는 옵셔널 체이닝 연산자를 도입했지만, 널이 아닌 단언 연산자(`!`)와 함께 사용하는 선택적 체이닝(`?.`)의 동작이 매우 직관적이지 않다는 사용자 피드백을 받았다.

구체적으로, 이전 버전에서는 코드가

```ts
foo?.bar!.baz;
```

다음 JS와 동일하게 해석되었다.

```ts
(foo?.bar).baz;
```

위의 코드에서 괄호는 옵셔널 체이닝의 '단축평가' 동작을 중단한다. 그래서 만약 `foo`가 `undefined`이면, `baz`에 접근하는 것은 런타임 오류를 발생시킨다.

이 동작을 지적한 바벨 팀과 피드백을 준 대부분의 사용자들은 이 동작이 잘못되었다고 생각한다. `bar`의 타입에서 `null`과 `undefined`를 제거하는 것이 의도이기 때문에 가장 많이 들은 말은 `!` 연산자는 그냥 '사라져야 한다' 이다.

즉, 대부분의 사람들은 원본 문장을 다음과 같이

```ts
foo?.bar.baz;
```

`foo`가 `undefined`일 때, 그냥 `undefined`로 평가하는 것으로 해석되어야 한다고 생각한다.

이것이 주요 변경 사항이지만, 대부분의 코드가 새로운 해석을 염두에 두고 작성되었다고 생각한다. 이전 동작으로 되돌리고 싶은 사용자는 `!` 연산자 왼쪽에 명시적인 괄호를 추가할 수 있다.

```ts
(foo?.bar)!.baz;
```

### }와 >는 이제 유효하지 않은 JSX 텍스트 문자이다.

JSX 명세서에는 텍스트 위치에 `}`와 `>` 문자의 사용을 금지한다. TS와 바벨은 이 규칙을 더 적합하게 적용하기로 결정했다. 이 문자를 넣기 위한 새로운 방법은 HTML 이스케이프 코드를 사용하거나 (예를 들어, `<span> 2 &gt 1 </span>`) 문자열 리터럴로 표현식을 넣는 것이다.(예를 들어, `<span> 2 {">"} 1 </span>`).

다행히, [Brad Zacher](https://github.com/bradzacher)의 [PR](https://github.com/microsoft/TypeScript/pull/36636) 덕분에, 다음 문장과 함께 오류 메시지를 받을 수 있다.

예를 들어

```ts
let directions = <span>Navigate to: Menu Bar > Tools > Options</div>
//                                           ~       ~
// Unexpected token. Did you mean `{'>'}` or `>`?
```

이 오류 메시지는 편리한 빠른 수정과 함께 제공되고, [Alexander Tarasyuk](https://github.com/a-tarasyuk) 덕분에, 많은 오류가 있으면 [이 변경사항을 일괄 적용](https://github.com/microsoft/TypeScript/pull/37436)할 수 있다.

### 교집합과 선택적 프로퍼티에 대한 더 엄격해진 검사

일반적으로 `A & B`와 같은 교차 타입은 `A` 또는 `B`가 `C`에 할당할 수 있으면, `A & B`는 `C`에 할당할 수 있다. 하지만, 가끔 선택적 프로퍼티에서 문제가 생긴다. 예를 들어, 다음을 보자.

```ts
interface A {
  a: number; // 'number' 인 것에 주목
}
interface B {
  b: string;
}
interface C {
  a?: boolean; // 'boolean' 인것에 주목
  b: string;
}
declare let x: A & B;
declare let y: C;
y = x;
```

이전 버전의 TS에서는 `A`가 `C`와 완전히 호환되지 않지만, `B`가 `C`와 호환되었기 때문에 허용되었다.

TS 3.9에서는, 교집합 안에 모든 타입이 구체적인 객체 타입이면, 타입 시스템은 모든 프로퍼티를 한 번에 고려한다. 결과적으로, TS는 `A & B`의 `a` 프로퍼티는 `C`의 `a` 프로퍼티와 호환되지 않는다고 본다.

```ts
Type 'A & B' is not assignable to type 'C'.
  Types of property 'a' are incompatible.
    Type 'number' is not assignable to type 'boolean | undefined'.
```

이 변경사항에 대한 자세한 정보는, [해당 PR](https://github.com/microsoft/TypeScript/pull/37195)을 참조하라.

### 판별 프로퍼티로 줄어든 교집합

존재하지 않는 값을 기술하는 타입으로 끝날 수 있는 몇 가지 경우가 있다. 예를 들어

```ts
declare function smushObjects<T, U>(x: T, y: U): T & U;
interface Circle {
  kind: 'circle';
  radius: number;
}
interface Square {
  kind: 'square';
  sideLength: number;
}
declare let x: Circle;
declare let y: Square;
let z = smushObjects(x, y);
console.log(z.kind);
```

이 코드는 `Circle`과 `Square`의 교집합을 생성할 방법이 전혀 없기 때문에 약간 이상하다. - 호환되지 않는 두 `kind` 필드가 있다. 이전 버전의 TS에서는, 이 코드는 허용되었고 `"circle" & "square"`가 `절대(never)` 존재할 수 없는 값의 집합을 기술했기 때문에 `kind` 자체의 타입은 `never`였다.

TS 3.9에서는, 타입 시스템이 더 공격적이다. `kind` 프로퍼티 때문에 `Circle`과 `Square`를 교차하는 것이 불가능하다는 것을 알고 있다. 그래서 `z.kind`를 `never`로 축소하는 대신, `z` 자체(`Circle & Square)` 타입을 `never`로 축소한다. 즉 위의 코드는 다음과 같은 오류가 발생한다.

```ts
Property 'kind' does not exist on type 'never'.
```

위에서 본 대부분의 오류는 약간의 잘못된 타입 선언에 대응하는 것으로 보인다. 자세한 내용은 [원문 PR](https://github.com/microsoft/TypeScript/pull/36696)을 보아라.

### Getters/Setters는 더 이상 Enumerable이 아니다.

이전 버전의 TS에서 클래스의 `get`과 `set` 접근자는 enumerable로 방출되었다. 그러나 이는, `get`과 `set`은 열거할 수 없다는 ECMAScript 사양을 따른 것이 아니었다. 결과적으로 ES5와 ES2015를 타겟팅 하는 TS 코드는 동작이 다를 수 있다.

깃허브 사용자 [pathurs](https://github.com/pathurs)의 [PR](https://github.com/microsoft/TypeScript/pull/37195) 덕분에 TS 3.9는 이와 관련하여 ECMAScript와 더 밀접하게 호환된다.

### any로 확장된 타입 매개변수는 더 이상 any처럼 행동하지 않음

이전 버전의 TS에서 `any`로 제한된 타입 매개변수는 `any`로 다룰 수 있었다.

```ts
function foo<T extends any>(arg: T) {
  arg.spfjgerijghoied; // 오류가 아님!
}
```

이는 실수였다. 그래서 TS 3.9에서는 더 보수적인 접근을 취하고 이런 의심스러운 작업에 대해 오류를 발생시킨다.

```ts
function foo<T extends any>(arg: T) {
  arg.spfjgerijghoied;
  //  ~~~~~~~~~~~~~~~
  // 'spfjgerijghoied' 프로퍼티는 'T' 타입에 존재하지 않습니다.
}
```

### export \* 은 항상 유지된다.

이전 TS 버전에서 `export * from 'foo'` 같은 선언은 `foo`가 어떠한 값도 export 하지 않으면 JS 출력에서 제외되었다.이런 내보내기는 타입 지향적이고 바벨에서 에뮬레이트 될 수 없기 때문에 문제가 된다. TS 3.9는 이런 `export *` 선언을 항상 내보낸다. 이 변화가 기존 코드에 영향을 줄 것이라고 생각하진 않는다.

### 더 많은 libdom.d.ts 개선

Web IDL 파일에서 바로 TS의 내장 .d.ts 라이브러리가 생성될 수 있도록 DOM 규격의 TS의 내장 .d.ts 라이브러리를 옮기는 작업을 계속 진행하고 있다. 그 결과 미디어 액세스와 관련된 일부 벤더별 타입이 제거되었다.

프로젝트의 ambient `*.d.ts` 파일에 이 파일을 추가하면 다시 복구할 수 있다.

```ts
interface HTMLVideoElement {
  msFrameStep(forward: boolean): void;
  msInsertVideoEffect(activatableClassId: string, effectRequired: boolean, config?: any): void;
  msSetVideoRectangle(left: number, top: number, right: number, bottom: number): void;
  webkitEnterFullScreen(): void;
  webkitEnterFullscreen(): void;
  webkitExitFullScreen(): void;
  webkitExitFullscreen(): void;
  msHorizontalMirror: boolean;
  readonly msIsLayoutOptimalForPlayback: boolean;
  readonly msIsStereo3D: boolean;
  msStereo3DPackingMode: string;
  msStereo3DRenderMode: string;
  msZoom: boolean;
  onMSVideoFormatChanged: ((this: HTMLVideoElement, ev: Event) => any) | null;
  onMSVideoFrameStepCompleted: ((this: HTMLVideoElement, ev: Event) => any) | null;
  onMSVideoOptimalLayoutChanged: ((this: HTMLVideoElement, ev: Event) => any) | null;
  webkitDisplayingFullscreen: boolean;
  webkitSupportsFullscreen: boolean;
}
interface MediaError {
  readonly msExtendedCode: number;
  readonly MS_MEDIA_ERR_ENCRYPTED: number;
}
```
