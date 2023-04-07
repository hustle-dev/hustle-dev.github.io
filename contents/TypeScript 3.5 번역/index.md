---
title: TypeScript 3.5 번역
description: TypeScript 3.5 Release를 번역하면서 어떤 기능들이 전에 나왔는지 학습합니다.
date: 2022-12-05
slug: /translate-ts-3-5
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

> 원글 링크: https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-5.html

## 속도 향상

TypeScript 3.5는 `타입 체킹`과 `증분 빌드`와 관련하여 몇 가지 최적화를 도입한다.

### 타입 체킹 속도 향상

TypeScript 3.5는 TypeScript 3.4보다 더 효율적인 타입 체크를 위한 특정 최적화를 포함한다. 이러한 개선은 타입 체크가 코드 완료 목록과 같은 작업을 수행하는 에디터 시나리오에서 훨씬 더 뚜렷하게 볼 수 있다.

### '--incremental' 개선

TypeScript 3.5는 컴파일러 설정, 파일 검색 이유, 파일 검색 위치 등 파일 정보가 계산된 상태정보를 저장함으로써 3.4의 증분 모드를 개선한다. `--build` 모드에서 [TypeScript의 프로젝트 참조를 사용하는 수백 개의 프로젝트가 포함된 시나리오에서 TypeScript 3.4에 비해 재구성 시간을 최대 68%까지 줄일 수 있음을 발견했다.](https://github.com/Microsoft/TypeScript/pull/31101)

자세한 정보는 아래 PR 확인

- https://github.com/Microsoft/TypeScript/pull/31100
- https://github.com/Microsoft/TypeScript/pull/31101

> → 증분 모드란?
> TypeScript에서 프로젝트 그래프에 대한 정보를 마지막 컴파일부터 디스크에 저장된 파일까지 저장하도록 한다. 그러면 컴파일 출력과 동일한 폴더에 일련에 `.tsbuildinfo` 파일이 생성된다. 실행 시 JS에서 사용하지 않으며 안전하게 삭제할 수 있다.

## Omit 헬퍼 타입

TypeScript 3.5는 새로운 `Omit` 헬퍼 타입을 도입하여 원본에서 일부 속성이 삭제된 새로운 유형을 생성한다.

```ts
type Person = {
  name: string;
  age: number;
  location: string;
};

type QuantumPerson = Omit<Person, 'location'>;

// equicalent to
type QuantumPerson = {
  name: string;
  age: number;
};
```

`Omit` 헬퍼를 사용하여 `location`을 제외한 `Person`의 모든 속성을 복사할 수 있다.

원글의 자세한 사항을 확인하기위해 PR을 확인해보면 `Omit`이란 타입은 아래와 같이 선언되어 있음을 확인할 수 있다.

```ts
type Omit<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
```

### 유니온 타입에서 초과 속성 검사 개선

타입스크립트 3.4 및 이전 버전에서는 특정 초과 속성이 있어서는 안되는 상황에서 허용되었다. 예를 들어, TS 3.4는 객체 리터럴에 잘못된 이름 속성을 허용하였다.

```ts
type Point = {
  x: number;
  y: number;
};

type Label = {
  name: string;
};

const thing: Point | Label = {
  x: 0,
  y: 0,
  name: true, // 3.5 버전 이후엔 잘못되었음을 체킹
};
```

## '--allowUmdGlobalAccess' 플래그

타입스크립트 3.5에서 다음과 같은 UMD 글로벌 선언을 참조할 수 있다.

→ UMD는 AMD와 CommonJS 등과 같은 어떠한 모듈 시스템을 사용하더라도 모든 경우를 커버할 수 있도록 동작되게 만드는 것

```ts
export as namespace foo;
```

새 `allowUmdGlobalAccess` 플래그를 사용하여 어디에서나 액세스를 할 수 있다. 이 모드는 서드파트 라이브러리를 혼합하고 매칭할 수 있는 유연성을 추가하며, 여기서 라이브러리가 선언하는 글로벌을 모듈 내에서도 항상 소비할 수 있다.

## 보다 더 스마트한 유니온 타입 체킹

타입스크립트 3.4에서는 아래와 같은 예제는 실패했다.

```ts
type S = { done: boolean; value: number };
type T = { done: false; value: number } | { done: true; value: number };
declare let source: S;
declare let target: T;
target = source;
```

S라는 타입을 `{ done: false; value: number }` 또는 `{ done: true; value: number }`에 할당할 수 없기 때문인데, S의 완료 속성이 충분히 구체적이지 않기 때문이다. 이는 `boolean`인 반면 T의 각 구상요소는 구체적으로 `true`이거나 `false`인 완료 속성을 가지고 있다. 그것이 의미하는 바는 각 구성 요소 유형이 고립되어 확인된다는 것이다. TS는 단순히 각 속성을 결합하여 S가 할당 가능한지 확인하지 않는다.

TS 3.5에서는 T와 같은 판별 속성을 가진 유형에 할당할 때, 언어는 실제로 S와 같은 유형을 가능한 유형의 조합으로 분해한다. 이 경우 `boolean`은 `true`와 `false`의 조합이므로 S는 `{ done: false; value: number }` 및 `{ done: true; value: number }`의 조합으로 간주된다.

## 제너릭 생성자의 고차 유형 추론

타입스크립트 3.4에서 다음과 같은 함수를 반환하는 일반 함수에 대한 추론을 개선했다.

```ts
function compose<T, U, V>(f: (x: T) => U, g: (y: U) => V): (x: T) => V {
  return (x) => g(f(x));
}
```

이를 사용한 예제를 보자.

```ts
function arrayify<T>(x: T): T[] {
  return [x];
}
type Box<U> = { value: U };
function boxify<U>(y: U): Box<U> {
  return { value: y };
}
let newFn = compose(arrayify, boxify);
```

TS 3.4의 추론은 `(x: {}) => Box<{}[]>`와 같은 비교적 쓸모없는 유형 대신에 새로운 Fn이 일반적일 수 있게 한다. 즉 `newFn`의 타입은 `<T>(x: T) => Box<T[]>` 이다.

타입스크립트 3.5는 이 동작을 생성자 함수에서도 작동하도록 일반화한다.

```ts
class Box<T> {
  kind: 'box';
  value: T;
  constructor(value: T) {
    this.value = value;
  }
}
class Bag<U> {
  kind: 'bag';
  value: U;
  constructor(value: U) {
    this.value = value;
  }
}
function composeCtor<T, U, V>(F: new (x: T) => U, G: new (y: U) => V): (x: T) => V {
  return (x) => new G(new F(x));
}
let f = composeCtor(Box, Bag); // has type '<T>(x: T) => Bag<Box<T>>'
let a = f(1024); // has type 'Bag<Box<number>>'
```

위와 같은 구성 패턴 외에도 제너릭 생성자에 대한 이러한 새로운 추론은 리액트와 같은 특정 UI 라이브러리의 클래스 구성 요소에서 작동하는 함수가 제너릭 클래스 구성 요소에서 더 정확하게 작동할 수 있음을 의미한다.

```tsx
type ComponentClass<P> = new (props: P) => Component<P>;
declare class Component<P> {
  props: P;
  constructor(props: P);
}
declare function myHoc<P>(C: ComponentClass<P>): ComponentClass<P>;
type NestedProps<T> = { foo: number; stuff: T };
declare class GenericComponent<T> extends Component<NestedProps<T>> {}
// type is 'new <T>(props: NestedProps<T>) => Component<NestedProps<T>>'
const GenericComponent2 = myHoc(GenericComponent);
```

타입스크립트 관련 PR링크: https://github.com/microsoft/TypeScript/pull/31116
