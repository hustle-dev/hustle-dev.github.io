---
title: Yarn 4.0 릴리즈를 읽어보면서
description: 이번에 릴리즈된 Yarn 4.0을 읽어보면서 모르는 개념을 같이 학습한 글입니다.
date: 2023-10-26
slug: /release-yarn4
tags: [Yarn]
heroImage: ./heroImage.png
heroImageAlt: Yarn
---

<!-- 썸네일 -->

>

<!-- 본문 -->

Yarn 4.0이 출시되었다. 블로그의 글을 읽어보면서 무엇이 변경되었고 그동안 자세하게 알고싶었던 yarn에서 사용하는 개념을 알아보고자 한다.

## 주요 변경 사항

yarn 4.0에선 아래와 같은 것들이 변경되었다.

- Node.js 18 이상 버전이 필요
- `yarn init`으로 생성된 프로젝트에서 더 이상 Zero-install을 활성화하지 않음
- `yarn init`으로 생성된 프로젝트는 `yarnPath`가 아닌 `Corepack`을 사용
- 모든 공식 플러그인(타입스크립트, 인터랙티브 도구)이 기본적으로 포함
- `yarn workspace foreach` 명령의 구문이 약간 변경


> 읽다보니 여기서 궁금한 키워드가 생겼다. `Zero-install`, `yarnPath`, `Corepack`에 대해 알아보자.

### Zero-install

yarn 문서의 [Zero-install](https://yarnpkg.com/features/caching#zero-installs)에는 **브랜치 전환시 `yarn install`을 하지 않아 발생하는 문제를 해결해주는 캐시전략 패턴이라 한다.** 즉, 저장소 내 `.yarn/cache`에 `zip` 파일 형태로 의존성을 관리하고, 이를 `.pnp.cjs` 파일에 정보를 등록해 어디서 의존성을 찾아야하는지 알 수 있어 따로 `yarn install`을 해주지 않아도 된다.

Zero-install 개념을 찾아보다가 [node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)를 보았는데 잘 정리되어 있어 보는 것을 추천한다. 기존 yarn v1과 npm에서 어떤 문제가 있었고 이를 해결하기 위한 Plug'n'Play(PnP)의 장점을 소개한다. 이 과정에서 yarn berry로 설치할 때 생기는 파일인 `pnp.cjs`가 어떤 역할을 하는지, zero-install을 위해 파일을 어떻게 관리하는지 자세히 알 수 있다.

### yarnPath

<img width="450" alt="image" src="https://github.com/hustle-dev/hustle-dev.github.io/assets/53992007/a2090c25-f1c5-46e1-b2f9-9ea96d18a73e">

> 프로젝트안의 `.yarnrc.yml` 파일을 볼 때마다 항상 '이 설정은 뭐지?' 라고 궁금해했다. 

[yarnPath](https://yarnpkg.com/configuration/yarnrc#yarnPath)은 글로벌 경로 대신 사용할 Yarn 바이너리의 경로이다.

일반적으로 `yarnPath`은 `yarnrc.yml`의 아래와 같은 형식으로 저장되어 있다.

```yml
yarnPath: .yarn/releases/yarn-3.6.4.cjs
```

> 여기서 `yarn-3.6.4.cjs` 파일의 역할은 해당 프로젝트 내에서 **Yarn 명령을 실행하는 데 사용되는 yarn 바이너리의 특정 버전**이다. 즉, Yarn 3.6.4 버전에 대한 Yarn 실행 파일이 포함되어 있다.


현재 공식문서에는 `yarnPath` 설정보다 대부분의 경우 `Corepack`을 사용하는 것이 좋다고 한다.


### Corepack

[Corepack](https://nodejs.org/api/corepack.html)은 패키지 매니저 버전을 관리하는 데 도움이 되는 실험적인 도구로, node와 패키지 매니저 간 브릿지 역할을 한다. 

> Corepack을 사용하면 `Yarn, npm, pnpm`을 설치할 필요없이 사용할 수 있다.

Corepack을 사용하면 `yarn`을 사용하고 있는 프로젝트인데 `pnpm`을 사용해 명령어 입력시 올바른 패키지 매니저(yarn)를 사용해 명령을 다시 실행하도록 요청한다. `yarn`을 사용해 명령어를 입력하면 Corepack은 호환 가능한 최신 버전을 자동으로 다운로드하여 캐시한다.


## Yarn 설치하기

`yarnPath` 설정을 2.0버전부터 지원하고 권장했지만 사람들이 저장소에 이런 바이너리를 추가하는 것을 좋아하지 않았다고 한다. 따라서 Corepack이 등장하게 되었고 이는 작업 중인 프로젝트에 맞는 올바른 패키지 관리자 버전을 자동으로 선택해준다.

더이상 `yarnPath`에 의존할 필요가 없고 `package.json`의 `packageManager` 필드를 업데이트 하도록 `yarn init -2` 및 `yarn set version` 명령이 업데이트 되었다.


> Corepack은 `package.json`의 `packageManager` 필드를 보고 어떤 패키지 관리자 버전을 사용할지 알 수 있다. 이 필드는 보통 `corepack use yarn@x.y.z` 명령어를 활용해 설정된다.


## 강화모드

yarn 4.0에선 사용자를 보호하기 위해 강화모드를 도입했다. 여기서 두 가지 추가 유효성 검사를 수행한다.

- lockfile에 저장된 resolution이 해당 범위로 resolve 될 수 있는 것과 일치하는지 검증한다.
- lockfile에 저장된 패키지 메타데이터가 원격 레지스트리 메타데이터와 일치하는지 확인한다.

이를 통해 공격자가 yarn을 사용해 프로젝트에 PR을 할 때 잠금 파일을 몰래 수정하는 것을 방지할 수 있다.

> [예시](https://snyk.io/blog/why-npm-lockfiles-can-be-a-security-blindspot-for-injecting-malicious-modules/)에선 github PR에서 `yarn.lock`파일이 `Load diff` 뜨면서 무엇을 수정했는지 알 수 없어서 이 부분이 취약점이 될 수 있음을 말함 

강화모드는 `enableHardenedMode`를 켜서 활성화할 수 있고, `yarnrc` 파일에서 명시적으로 해제하여 비활성화할 수 있다. 다만 이 제약 조건은 많은 네트워크 요청을 수행해야해서 CI와 같은 환경에서는 환경 변수를 통해 기본적으로 활성화하지 않게 할 수 있다.

```
export YARN_ENABLE_HARDENED_MODE=1
```

## JS 제약조건

기존 yarn에서는 [Prolog](https://en.wikipedia.org/wiki/Prolog#Rules_and_facts)라는 [constraints engine](https://yarnpkg.com/features/constraints)을 사용했다.

> 여기서 constraints engine이란 **모든 워크스페이스에 자동으로 특정한 규칙을 적용하기 위한 것**이다.

그러나 이는 사용하기 매우 복잡해 Yarn 4부터 더 이상 사용되지 않고 TS를 지원하는 새 JS기반 엔진으로 대체되었다. 

새로운 선택 사항인 `enableConstraintsChecks` 설정은 Yarn이 Yarn 설치의 일부로 제약 조건을 실행하도록 한다. 원격 CI가 오류를 발생시킬 때까지 기다리기 전에 오류를 발견할 수 있는 편리한 방법이며, 새 엔진이 매우 빠르기 때문에 설치 시간에 거의 영향을 미치지 않는다고 한다.


## 타입스크립트 통합, 인터렉티브 도구

이제 플러그인 없이 `yarn upgrade-interactive`와 `yarn stage`를 사용할 수 있고, 프로젝트에 TS가 구성되어 있는 경우 `yarn`은 종속성을 업데이트할 때마다 필요에 따라 `@types` 패키지를 자동으로 추가 및 제거한다.


## 성능

제시된 상황(콜드 캐시에서 개츠비와 약 350MiB 종속성 트리를 설치)에서 기존 3.6버전 보다 설치 속도가 약 3배 빨라졌다. 이는 대부분의 시나리오에서 `pnpm`만큼 빨라진 결과를 보인다고 한다.



## 참고링크

- [Release: Yarn 4.0](https://yarnpkg.com/blog/release/4.0)
- [node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)
- [nodejs/corepack](https://github.com/nodejs/corepack)



