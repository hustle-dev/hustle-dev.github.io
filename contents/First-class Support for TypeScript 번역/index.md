---
title: First-class Support for TypeScript 번역
description: 2023년 1월 3일에 올라온 React Native Blog 번역 글입니다.
date: 2023-01-04
slug: /translate-react-native-ts-first
tags: [React Native, 번역]
heroImage: ./heroImage.png
heroImageAlt: 리액트 네이티브
---

> 원문: https://reactnative.dev/blog/2023/01/03/typescript-first

> 이 포스트는 현재 릴리스 후보인 RN 0.71의 TS 기능들에 대해서 다룬다. [이곳에서 현재 릴리즈 상태](https://github.com/reactwg/react-native-releases/discussions/41?sort=new#discussion-4499027)를 확인할 수 있다.

리액트 네이티브는 0.71의 출시와 함께 아래와 같은 변경 사항을 포함하여 TS 경험에 애쓰고 있다.

## 타입스크립트를 기본으로 한 새로운 앱 템플릿

0.71부터 React Native CLI를 통해 새 React Native를 만들면 기본적으로 TS 어플리케이션이 제공된다.

```bash
npx react-native init My71App --version 0.71.0
```

![](https://velog.velcdn.com/images/hustle-dev/post/c46c0b2b-4dd7-4cdb-bc96-84b5da8f9305/image.png)

새로 생성된 앱의 진입점은 `App.js` 가 아닌 `App.tsx` 로, 완전한 TS 타입 파일이다. 새 프로젝트는 이미 `tsconfig.json` 으로 설정되어 있으므로 즉시 IDE를 사용하여 타입스크립트 코드를 작성할 수 있다!

## TS 선언이 리액트 네이티브와 함께 제공

0.71은 TS 선언이 내장된 첫 번째 릴리즈 버전이다.

이전에 리액트 네이티브에 대한 타입스크립트 선언은 [@types/react-native](https://www.npmjs.com/package/@types/react-native)에서 호스팅 되는 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 레포에서 제공되었다. 리액트 네이티브 소스와 함께 타입스크립트 타입을 공존하게 한 결정은 정확성과 유지보수를 개선하기 위한 것이었다.

`@types/react-native`은 stable 릴리즈 버전에 대한 타입을 제공한다. 즉, TS에서 React Native의 pre-release 버전으로 개발하려면 부정확할 수 있는 이전 릴리즈된 버전의 타입을 사용해야 한다. `@types/react-native`를 해제하는 것도 오류가 발생하기 쉽다. 이 릴리즈는 리액트 네이티브 릴리즈를 지연시키며, 이 프로세스는 리액트 네이티브의 공용 API에 대한 타입 변경을 수동으로 검사하고 TS 선언을 일치하도록 업데이트 하는 것을 포함한다.

TS 타입은 리액트 네이티브 소스와 함께 공존하므로 TS 타입의 가시성과 소유권이 더 높아진다. 우리 팀은 Flow와 TS간의 정렬을 유지하기 위한 툴을 적극적으로 개발하고 잇다.

이렇게 변경하면 리액트 네이티브 사용자가 관리할 종속성도 제거된다. 0.71 이상으로 업그레이드할 대 종속성으로 `@types/react-native`를 제거할 수 있다. [TS 지원을 설정하는 방법은 새 앱 템플릿을 참조하라.](https://github.com/facebook/react-native/blob/main/template/tsconfig.json)

0.73 이상 버전에서는 `@types/react-native`를 더 이상 사용하지 않을 계획이다. 구체적으로 이것은 다음을 의미한다.

- `@types/react-native`를 지속적으로 유지하는 React Native 버전 0.71 및 0.72가 출시된다. 이것들은 리액트 네이티브에 관련된 릴리즈 브랜치에 있는 타입들과 동일하다.
- 리액트 네이티브 0.73 이상의 경우 TS 타입은 React Native에서만 사용할 수 있다.

### 어떻게 마이그레이션을 할지

가능한 한 빨리 공존하는 타입을 먼저 마이그레이션 하라. 필요에 따라 마이그레이션 하는 방법에 대한 자세한 내용은 다음과 같다.

**앱 메인테이너**

0.71 이상의 리액트네이티브로 업그레이드 한 후에는 `devDependency`에서 `@types/react-native`를 제거할 수 있다.

`@types/react-native`를 `peerDependency`로써 참조하는 라이브러리를 사용해서 경고가 발생한 경우 해당 라이브러리에 대해 이슈를 제기하거나 PR을 올려서 선택적 peerDependency를 사용하고 현재는 경고를 무시하라.

**라이브러리 메인테이너**

0.71 미만의 리액트 네이티브 버전을 대상으로 하는 라이브러리는 `@types/react-native`의 `peerDependency`를 사용하여 앱 버전의 타이핑을 확인할 수 있다. 이 디펜던시는 [peerDependenciesMeta](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependenciesmeta)에서 선택사항으로 표기되어야 한다. 그래서 TS가 없는 사용자가 타입이 기본적으로 제공되는 0.71 사용자의 경우에는 입력이 필요하지 않도록 해야한다.

**`@types/react-native`에 의존하는 TS 선언 메인테이너**

마이그레이션 할 준비가 되어있는지 확인하려면 함께 [도입된 변경사항](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)을 확인하라.

0.71이 릴리즈 후보에 있는 동안에는 [변경 로그 PR](https://github.com/facebook/react-native/pull/35200/files)을 확인할 수 있다.

### 만약 Flow를 쓴다면?

Flow 사용자는 0.71 이상을 대상으로 하는 타입체킹 어플리케이션을 계속 사용할 수 있지만 이에 대한 구성 로직은 더 이상 템플릿에 기본으로 제공되지 않는다.

Flow 사용자는 `flow-bin`을 수동으로 업데이트하여 새 앱 템플릿으로부터 `.flowconfig`를 병합하여 리액트 네이티브의 Flow 타입을 업그레이드했다. 새 앱 템플릿에는 더 이상 `.flowconfig`가 없지만 [앱의 기본으로 사용할 수 있는 리액트 네이티브 레포지토리에는 여전히 `.flowconfig`가 있다.](https://github.com/facebook/react-native/blob/main/.flowconfig)

Flow에서 새 React Native 앱을 시작해야하는 경우 [0.70에서 새 엡 템플릿을 참조](https://github.com/facebook/react-native/tree/0.70-stable/template)할 수 있다.

### 만약 내가 TS 선언에서 버그를 발견한다면?

내장 TS 유형을 사용하든 `@types/react-native`를 사용하든 상관없이 버그를 발견하면 [리액트 네이티브](https://github.com/facebook/react-native)와 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped)에게 PR을 제출하라. 이 문제를 해결하는 방법을 모를 경우, RN 저장소에 깃헙 이슈를 제출하고 해당 문제에 대해 [@lunaleaps](https://github.com/lunaleaps)를 멘션하라.

## 문서는 TS First 이다.

일관된 TS 경험을 보장하고, TS를 새로운 기본 언어로 반영하기 위해 RN 문서를 여러 번 업데이트해야했다.

이러한 문서 업데이트는 0.71이 사전 릴리즈 중인 동안 [next](https://reactnative.dev/docs/next/getting-started)와 같이 레이블이 지정된 0.71문서를 참조한다.

현재 코드 예제는 인라인 타입스크립트를 허용하고 있고, 170개 이상의 interactive 코드 예제가 업데이트되어 새로운 템플릿에서 린팅, 포맷 및 타입 검사를 통과한다. 대부분의 예제는 TS와 JS 모두에서 유효하다. 호환되지 않는 경우 두 언어 중 하나로 예제를 볼 수 있다.

만약 당신이 실수를 발견했거나 개선점이 있다면, 그 웹사이트는 오픈 소스라는 것을 기억하고 당신의 PR을 받고 싶다!

## RN Typescript 커뮤니티에 감사드린다.

마지막으로, 리액트 네이티브 개발자가 TS를 사용할 수 있도록 커뮤니티가 수년간 수행한 모든 작업을 인정하고 싶다.

2015년부터 `@types/react-native`를 유지해 온 모든 기여자에게 감사드린다. RN 사용자가 최상의 환경을 경험할 수 있도록 여러분 모두의 노력과 정성을 확인할 수 있었다.

TypeScript 타입을 React Native로 이동하기 위해 도움을 준 @acoates, @eps1lon, @kelset, @tido64, @Titoz 및 @ZihanChen-MSFT에 감사드린다.

마찬가지로, 우리는 첫날부터 리액트 네이티브에서 새로운 앱 개발을 위한 TypeScript 경험을 지원해준 리액트 네이티브 템플릿 유형 스크립트의 유지보수자들에게 감사하고 싶다.

React Native 저장소에서 보다 직접적으로 협업하고 React Native 개발자 환경을 지속적으로 개선할 수 있기를 기대한다!
