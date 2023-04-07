---
title: 웹 컴포넌트를 알아보자
description: ❓ 웹 컴포넌트가 무엇인지 궁금하신 분들께...
date: 2022-05-13
slug: /know-about-web-component
tags: [학습]
heroImage: ./heroImage.png
heroImageAlt: 웹 컴포넌트 로고
---

## ❗️ 웹 컴포넌트를 들어가기에 앞서..

현대의 어플리케이션이 점점 커지고 복잡해지면서 **컴포넌트 기반 아키텍처**가 등장하였습니다.

> 컴포넌트 기반 아키텍처란?
> **복잡한 소프트웨어를 간단한 부분들로 나누고 조립**하는 과정을 통해 어플리케이션을 만드는 것으로, 웹 UI 라이브러리의 React가 대표적인 예입니다.

아래의 트위터 예시를 살펴봅시다.

![](https://velog.velcdn.com/images/hustle-dev/post/72332cc6-3ec8-4d54-9028-379c572bf80a/image.png)

위 트위터는 다음과 같은 컴포넌트들로 구성되어 있습니다.

1. 상단 내비게이션
2. 사용자 정보
3. 추천 팔로우
4. 글쓰기 양식
5. 메시지들(6, 7 포함)

> 트위터라는 큰 어플리케이션을 컴포넌트 단위로 나누어 간단한 컴포넌트부터 개발한다면 조금 더 개발이 수월해질 것입니다.

### 🌟 컴포넌트가 갖추어야 할 것

- 고유한 자바스크립트 클래스
- 외부코드가 접근할 수 없으며 해당 클래스에서만 관리되는 DOM 구조(`캡슐화` 원칙)
- 구성요소에 적용되는 CSS 스타일
- 다른 구성요소와 상호작용하기 위한 이벤트, 클래스, 메서드 등을 일컫는 API

> 이를 기반으로 웹 컴포넌트를 살펴봅시다.

## 🧱 웹 컴포넌트

### 📍 정의

웹 컴포넌트란 **컴포넌트의 기능을 다른 코드로부터 캡슐화하여 재사용 가능한 custom element를 생성하고 웹 앱에서 활용할 수 있도록 해주는 다양한 기술들의 모음**입니다.

### 📍 언제, 왜 사용?

웹 컴포넌트를 사용하는 이유

- 관심사별로 컴포넌트를 관리하고 싶을 때
- Shadow DOM을 통한 다른 컴포넌트와 스타일 충돌을 피하고 싶을때
- Vendor lock-in을 피하고 싶을때

**1. 관심사별로 컴포넌트를 관리**

![](https://velog.velcdn.com/images/hustle-dev/post/0aae2aa7-e6d8-4e12-98f6-1404fc239458/image.png)

전통적으로 html/css/js를 이용한 개발을 할때는 전체적인 html, css, js 각각 따로 만들고 관리할것입니다.

> 이러한 경우 **페이지내의 컴포넌트별 관심사의 분리**가 불가능해집니다.

따라서 위에서 설명한것처럼 복잡하고 거대한 어플리케이션을 만들때, 조그마한 기능별로 관리를 하기 위해 웹 컴포넌트를 사용하여 기능별 html/css/js를 따로 관리할 수 있습니다.

**2. Shadow DOM을 통한 캡슐화**

![](https://velog.velcdn.com/images/hustle-dev/post/258276ec-8157-4b9a-9055-27a4b2dcf7bb/image.png)

Shadow DOM이란 웹 컴포넌트의 캡슐화부분을 담당합니다. 이를 통해 컴포넌트는 **자체적인 공간(shadow Tree)을 갖게 되어 페이지안의 다른 코드들로부터 분리하여 충돌을 피할** 수 있습니다.

> 따라서 컴포넌트의 코드가 다른 스타일의 영향을 받거나 충돌이 발생할 때, Shadow DOM을 사용하여 회피할 수 있습니다.

**3. Vendor lock-in**

![](https://velog.velcdn.com/images/hustle-dev/post/14f7ebdb-2351-4c5a-b868-b5f8a7c8ba84/image.png)

Vendor lock-in이란 **특정 기술에 크게 의존하여, 다른 시스템으로 갈아타기 어려운 상황**을 의미합니다.

현재 프론트엔드 개발은 React를 통한 개발이 주를 이루고 있습니다. 그러나 이러한 기술은 언제든지 새로운 기술에 의해 대체될 가능성이 높고, 그러한 순간이 온다면 현재 개발한 리액트를 다른 라이브러리로 마이그레이션 하는등의 작업이 필요합니다.

이러한 **Vendor lock-in을 줄이기 위해서는 웹 표준인 웹 컴포넌트를 사용**하게 되면 이러한 상황에 유연하게 대처할 수 있습니다.

### 📍 주요 기술

- **Custom elements**: 사용자가 만든 `custom element`를 정의하는데 사용됩니다.

```js
class MyComponent extends HTMLElement {...}

// html의 <my-component>태그에 MyComponent 클래스를 정의
customElements.define("my-component", MyComponent);
```

- **Shadow DOM**: main document DOM으로 부터 독립적으로 렌더링되는 DOM 트리를 생성하여 캡슐화를 담당합니다.

```js
class MyComponent extends HTMLElement {
  // element가 문서에 추가되었을 때, 브라우저가 이 메서드를 호출함
  connectedCallback() {
    // mode속성은 캡슐화 레벨을 설정하며, open은 코드로 접근할 수 있고, closed는 항상 elem.shadowRoot의 값이 null이다.
    this.attachShadow({ mode: 'open' });
  }
}
```

- **HTML 템플릿**: HTML 마크업 템플릿의 저장소로 사용됩니다. `<template>`이라는 태그를 가진 요소는 브라우저가 무시하며, JS를 사용해 접근하여 element를 생성할 수 있습니다.

```html
<body>
  <!-- html 템플릿 -->
  <template id="helloWorld">
    <h1>Hello, world!</h1>
  </template>

  <script src="main.js">
    // div태그 요소하나를 생성하고,
    const $div = document.createElement('div');
    // helloWorld라는 id를 가진 템플릿요소의 내용을 복제하는 true 속성을 주면 children까지 복제합니다.
    // https://developer.mozilla.org/ko/docs/Web/API/Node/cloneNode
    $div.append(helloWorld.content.cloneNode(true));
    // DOM의 바디에 붙임
    document.body.append($div);
  </script>
</body>
```

`결과 화면`

![](https://velog.velcdn.com/images/hustle-dev/post/dc4e520a-87d9-494c-8d0f-1507b36fdf4e/image.png)

### 📍 기본 접근법

- ECMAScript 2015(ES6) 클래스 문법을 사용해 웹 컴포넌트 기능을 명시하는 클래스 생성합니다.
- [CustomElementRegistry.define()](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) 메서드를 사용해 새로운 커스텀 엘리먼트를 등록하고, 정의할 엘리먼트 이름, 기능을 명시하고 있는 클래스, 상속받은 엘리먼트 전달합니다.
- [Element.attachShadow()](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow) 메서드를 사용해 shadow DOM을 커스텀 엘리먼트에 추가합니다.
- 필요한 경우, [`<template>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/template)과 [`<slot>`](https://developer.mozilla.org/ko/docs/Web/HTML/Element/slot) 을 사용해 HTML 템플릿을 정의합니다.
- 일반적인 HTML 엘리먼트처럼, 페이지의 원하는 어느곳이든 커스텀 엘리먼트 사용 가능합니다.

## 📝 웹 컴포넌트 코드 예시

현재 아래와 같이 `h2`라는 글자의 색상이 `red`로 되어있습니다. 이 상황에서 웹 컴포넌트를 사용하여 스타일의 충돌을 피하고 `blue` 색상을 가진 사용자 정의 h2 요소를 만들어 봅시다.

![](https://velog.velcdn.com/images/hustle-dev/post/e50c41fb-a3af-45d9-9fbb-bc25be0c91ac/image.png)

> 현재 코드는 아래와 같습니다.

`index.html`

```html
<body>
  <h2>일반적인 DOM의 h2태그 색상은 Red입니다.</h2>
</body>
```

`style.css`

```css
h2 {
  color: red;
}
```

이 상황에서 js만을 사용하여 웹 컴포넌트를 생성하면 다음과 같이 만들 수 있습니다.

`main.js`

```js
// 화면에 띄울 custom-h2를 위한 사용자 정의 엘리먼트 태그를 넣어줍니다.
document.body.insertAdjacentHTML('beforeend', '<custom-h2></custom-h2>');

// 템플릿을 정의합니다.
const h2_template = document.createElement('template');
h2_template.innerHTML = `
<style>
  h2 { color: blue; }
</style>
<h2>웹 컴포넌트의 h2 태그 색상은 Blue입니다.</h2>`;

// 사용자 정의 엘리먼트를 클래스를 이용하여 만듭니다.
class MyComponent extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(h2_template.content.cloneNode(true));
  }
}

// 사용자 정의 요소를 정의합니다.
customElements.define('custom-h2', MyComponent);
```

![](https://velog.velcdn.com/images/hustle-dev/post/b97ef7b1-9cb2-47b9-9009-7d64521c04cb/image.png)

> 간단하게 style 충돌을 피하는 웹 컴포넌트를 만들 수 있습니다.

위에서는 간단한 element이기 때문에 `connectedCallback` 라이프사이클 콜백 함수 1개를 사용하였는데 사실 여러개의 함수가 있습니다.

```js
class MyComponent extends HTMLElement {
  // element 생성시
  constructor() {
    super();
    ...
  }

  // element가 document에 추가될 때 브라우저가 이 메서드를 호출합니다.
  // element가 추가/제거될 때마다 반복적으로 호출합니다.
  connectedCallback() {
    ...
  }

  // element가 document에서 제거될 때 브라우저가 이 메서드를 호출합니다.
  // 마찬가지로 element가 추가/제거될 때마다 반복적으로 호출합니다.
  disconnectedCallback() {
    ...
  }

  // 변경을 감지할 attribute들을 모니터링하기 위한 메서드입니다.
  static get observedAttributes() {
    return [...];
  }

  // 위에서 모니터링중인 attribute가 변경되었을 때, 호출됩니다.
  attributeChangedCallback(name, oldValue, newValue) {
    ...
  }

  // element가 새로운 document로 움직였을때 호출합니다.
  adoptedCallback() {
    ...
  }

  // 그외의 다른 Property나 메서드 존재..
}
```

> 이렇듯 React와 비슷하게 **다양한 라이프 사이클 콜백 함수가 존재**하므로 복잡한 앱을 만들때, 웹 컴포넌트를 사용해서 한번 개발해 보시는것을 추천드립니다.

## 참고 사이트

- [Vendor lock-in](https://en.wikipedia.org/wiki/Vendor_lock-in)
- [WebComponent, 써야할까?](https://hong-jh.tistory.com/entry/WebComponent-%EC%8D%A8%EC%95%BC%ED%95%A0%EA%B9%8C)
- [웹 컴포넌트 - 웹 컴포넌트 | MDN](https://developer.mozilla.org/ko/docs/Web/Web_Components)
- [shadow DOM 사용하기 - 웹 컴포넌트 | MDN](https://developer.mozilla.org/ko/docs/Web/Web_Components/Using_shadow_DOM)
- [궤도의 높이에서](https://ko.javascript.info/webcomponents-intro)
- [Custom elements](https://ko.javascript.info/custom-elements)
