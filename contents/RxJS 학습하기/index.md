---
title: RxJS 학습하기
description: RxJS 입문서를 보고 간단하게 정리한 글입니다.
date: 2022-07-13
slug: /study-rxjs-introduction
tags: [학습]
heroImage: ./heroImage.png
heroImageAlt: RxJS 로고
---

## RxJS란?

RxJS는 웹 개발 시 이벤트를 다루거나, 프레임워크, 라이브러리, 유틸리티 등에 적용할 수 있는 함수형 접근방식으로 가장 인기있는 라이브러리 중 하나이다. 그러나 RxJS와 리액티브 프로그래밍은 기존에 우리가 사용하던 명령형과 선언형 프로그래밍과 방식이 달라 배우는데 어렵다.

> 그러나 배우는 것은 어렵지만 그만한 노력이 있다고 한다.

그럼 한번 RxJS 입문서를 통해 RxJS가 무엇인지 알아가보자.

## 옵저버블

옵저버블은 시간의 흐름에 따라 도착하는 스트림, 또는 데이터의 출처를 의미한다.

> 이벤트를 예시로 들면 마우스의 움직임, 버튼 클릭, 텍스트 필드를 채워넣는 행위, 라우트 변경 등을 의미한다.

RxJS에서 마우스 클릭 이벤트 옵저버블을 만드는 예시

```jsx
// fromEvent 연산자를 가져온다.
import { fromEvent } from 'rxjs';

// 버튼 참조
const button = document.getElementById('myButton');

// 버튼 클릭 옵저버블을 생성한다.
const myObservable = fromEvent(button, 'click');
```

이렇게 옵저버블을 만들어두었지만 아직은 아무 행동을 하지 않는다.

→ **옵저버블이 cold하거나 subscription이 있기 전까지는 활성화되지 않기 때문**이다.

## Subscription

Subscriptions은 모든것을 동작하게 하는데, 수도꼭지에서 손잡이를 돌리면 물(옵저버블)이 흐르듯이 이러한 역할을 하게 하는것이 `subscriber`이다.

> 이를 위해, `observer`라고 부르는 함수와 함께 `subscribe` 메서드를 호출해야 한다.

```jsx
// fromEvent 연산자를 가져온다.
import { fromEvent } from 'rxjs';

// 버튼 참조
const button = document.getElementById('myButton');

// 버튼 클릭 옵저버블을 생성한다.
const myObservable = fromEvent(button, 'click');

// subscribe 메서드를 옵저버블과 함께 호출한다.
const subscription = myObservable.subscribe((event) => console.log(event));
```

위 예제에서 `myObservable.subscribe`가 하는 역할은 다음과 같다.

- 버튼 클릭 이벤트에 대한 이벤트 리스너 설정
- 매 클릭 이벤트마다 `subscribe` 메서드와 함께 넘겨준 함수 (observer) 실행 → 위에서는 콘솔 실행 콜백이 observer가 됨
- 적절한 이벤트 리스너 삭제와 같은 일을 하는 `unsubscribe`와 함께 `Subscription` 객체 반환

`Subscribe` 메서드는 함수 대신 다음과 같이 객체를 넘겨 사용할 수 있다.

```jsx
const subscription = myObservable.subscribe({
  // 이벤트 발생 성공 시
  next: (event) => console.log(event),
  // 에러,
  error: (error) => console.log(error),
  // 완료되면,
  complete: () => console.log('complete!'),
});
```

각각의 subscription이 새로운 실행 컨텍스트를 생성한다는 것에 유의하자.

```jsx
// 첫 번째
const subscription = myObservable.subscribe((event) => console.log(event));

// 두번째
const secondSubscription = myObservable.subscribe((event) => console.log(event));

// unsubscribe를 사용해서 삭제
subscription.unsubscribe();
secondSubscription.unsubscribe();
```

일반적으로 Subscription은 옵저버블과 옵저버사이에 1대1인 데이터흐름을 만들어낸다.(unicasting)

- unicasting: 1대1로 옵저버블이 옵저버에게 알리는것
- multicasting: 컨퍼런스처럼 한명의 옵저버블과 수많은 옵저버 형식으로 이루어진것

> RxJS를 “이벤트계의 lodash”로 만들어 준 것은 연산자(Operators) 때문인데 이를 한번 알아보자.

## 연산자(operators)

연산자는 원본데이터를 조작하여 옵저버블로 변환된 값을 제공한다. 예시를 한번 봐보자.

```jsx
const { of, map } = require('rxjs');

const dataSource = of(1, 2, 3, 4, 5);
console.log(dataSource); // Observable { _subscribe: [Function (anonymous)] }

const subscription = dataSource.pipe(map((value) => value + 1)).subscribe((value) => console.log(value)); // 2 3 4 5 6
```

> `of` 을 통해 값을 순차적으로 전달하고, dataSource를 콘솔로 찍어보면 옵저버블이 반환된다. 이후 이를 가지고 **연산자들은 `pipe` 내부에 존재해야해서 `pipe`안에서 `map`을 통해 방출된 값을 바꾸고 이 옵저버블을 `subscribe`** 한다.

대부분의 경우 문제를 해결해줄 수 있는 연산자가 RxJS에 존재하는데, 이런 수많은 연산자의 갯수에 압도당하지 말고 잘 사용하자.

## 파이프

파이프함수는 연산자 조립 라인으로 데이터를 조작, 필터링, 변환시킬 수 있는 파이프라고 불리는 과정을 거치게 된다. `pipe` 함수 안에서는 옵저버블 체인을 이용하여 5개혹은 그 이상의 연산자를 사용하는 일도 가능하다.

옵저버블을 활용한 자동완성 기능

```jsx
inputValue
  .pipe(
    // 200ms 정지
    debounce(200),
    // 값이 똑같은면, 무시.
    distinctUntilChanged(),
    // 아직 요청중일 때 업데이트된 값이 수신되는 경우, 이전 요청을 취소하고 새로운 옵저버블로 '변경'
    switchMap((searchTerm) => typeaheadApi.search(searchTerm))
  )
  // subscription 생성.
  .subscribe((results) => {
    // dom 업데이트
  });
```

## 연산자들의 종류

자신이 필요한 연산자를 찾기 위해서는 관련 카테고리를 찾는것이 중요하다. 관련 카테고리로는 아래와 같은 것들이 있다.

- 생성 연산자(fromEvent, of, from)
- 조합 연산자(combineLatest, concat, merge, startWith, withLatestFrom)
- 에러 핸들링 연산자(catchError)
- 필터링 연산자(take, debounceTime, distinctUntilChanged, filter, takeUntil)
- 멀티캐스팅 연산자(shareReplay)
- 변환 연산자(concatMap, map, mergeMap, scan, switchMap)

이후 개발 시 필요한 연산자들은 찾아보면서 개발하면 될것 같다.
