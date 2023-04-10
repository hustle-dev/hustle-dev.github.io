---
title: velog to Gatsby 블로그 이전기
description: velog를 떠나 나만의 블로그로..
date: 2023-04-09
slug: /velog-to-gatsby-blog
tags: [개발, 회고]
heroImage: ./heroImage.png
heroImageAlt: hustle-dev 블로그
---

> 새로운 블로그 주소: https://hustle-dev.github.io/

## velog에서의 추억

velog를 처음에 어떻게 접하게된 것인지는 기억이 잘 나진 않지만, 첫 글이 [2020년 11월에 적은 C++ 관련 글](https://velog.io/@hustle-dev/C-Chapter-01-C%EC%96%B8%EC%96%B4-%EA%B8%B0%EB%B0%98%EC%9D%98-C)인 것으로 보아 막 컴퓨터공학을 복수전공하면서 공부한 내용을 이곳에 적은것 같다.

약 3년이 안된 시간동안 학교도 졸업하고, 부트캠프, 취업까지.. 얼마 안되는 기간동안 이렇게나 많은 일들이 있었다니 다시 되돌아보니 너무 신기했다. 또한 이 기간동안 `velog`에서 약 250개 정도의 글을 작성하면서 트렌딩에도 몇번 올라가보기도 하고, 많은 분들이 작성한 글을 좋아해주셔서 정말 좋은 경험을 한 것 같다.

> 이렇게 적으니 다시는 `velog`에 안올 것처럼 보이는데 앞으로도 다른 기술글들을 보기 위해 `velog`를 자주 방문하지 않을까 싶다.

## 블로그를 만들게된 계기

블로그를 만들게 된 이유는 딱히 `velog`가 맘에 안들어서는 아니다. 트렌딩이라는 공간을 통해 다른사람들이 작성한 좋은 글을 볼 수 있고, 댓글과 좋아요를 통해 상호작용 할 수 있어서 좋았다.

전에 취준하면서 react나 next와 같은 best-practice 코드를 보려면 어떻게 해야하는지 궁금했다. 그러던 중 Numble의 다른 색깔 찾기 게임 제작 챌린지에서 코드리뷰를 받을 때 리뷰어분이 이 [leerob.io](https://github.com/leerob/leerob.io) 사이트를 추천해주셨다.

이 분도 자신의 블로그를 만들면서 최신 기술을 블로그에 사용하는 것을 볼 수 있는데 나도 나중에 나만의 블로그를 만들어서 각종 기술들을 적용시켜보고 싶다는 생각이 들었다.

> 이 이유말고도 아래와 같은 이유도 있었다.

- 블로그를 만드는데 고려해야하는 것들이 어떤 것들인지 알고 싶어서
- Gatsby와 GraphQL을 사용해보고 싶어서
- 최근 사내에서 [css-for-js](https://css-for-js.dev/) 스터디를 하는데 공부한 것들을 적용해보고 싶어서
- google analytics를 붙여서 블로그에 얼마나 들어오는지 확인하고 싶어서
- 광고 같은 것을 붙여서 수익화 같이 나중에 커스터마이징을 하고 싶어서

## 블로그 만들기

처음에 블로그를 만들 때, `Astro`로 만들지 `Gatsby`로 만들지 고민했다. Gatsby는 이미 plugin 생태계가 풍부했고 블로그를 만들기에 최적화 되어있다. Astro는 나온지 얼마 되지 않았지만 island architecture와 같이 필요한 부분에만 hydration을 하고, 빌드 속도가 빠르다는 장점이 있어서 이것도 한번 써보면 재미있을 것 같다고 생각했다.

![](https://velog.velcdn.com/images/hustle-dev/post/6380dc27-dbe2-420d-a6cf-4557c1d311eb/image.png)

> npm trend로 보았을 땐, 아직 `Gatsby`가 앞서있지만 점점 `Astro`가 올라올 것 같다는 생각이 든다.

고민끝에 사용자 경험 측면에는 아직까진 `Gatsby`가 더 나은것 같아서 `Gatsby` 프레임워크를 선택했다.

### 고려해야 할 것

가장 간단하게 블로그를 만든다고 하더라도 아래와 같은 고민이 필요했다.

- markdown을 어떻게 파싱해서 화면에 보여줄 것인지?
- 댓글 시스템을 어떻게 만들지?
- 블로그에 작성한 글을 어떻게 많은 사람들에게 보여줄 수 있을 지?

> 이 모든 고민들은 gatsby의 plugin과 라이브러리를 통해 해결할 수 있었다.

### Gatsby를 사용하면서 좋았던 점

위에선 가장 중요한 기능들을 언급했지만 실제로 블로그를 만들기 위해 필요한 기능들이 많다.

- gtag
- sitemap
- robots.txt
- markdown parsing
- toc
- rss feed

등등..

하지만 대부분의 것들이 gatsby plugin으로 존재하고 있고, 필요한 데이터들은 GraphQL이라는 데이터 계층을 통해 데이터를 가공해서 만들어 가져올 수 있어서 편했다.

또한 Gatsby에서 자체적으로 제공하는 Built-in API들을 사용함으로써 이미지처리를 쉽게 할 수 있었고, 사용자 경험을 좋게 만들 수 있었다.

### Gatsby를 사용하면서 불편했던 점

내가 Gatsby를 잘못다룬 것일 수도 있지만, TypeScript를 함께 사용하였는데 `GraphQL`로 값을 가져올때, 특정 필드마다 `null`일 수 있어서 `createSchemaCustomization`를 사용하여 non-null 값을 지정해주는 이런 과정들이 필요했고, 몇몇 필드를 사용할 땐 optional 혹은 null 단언을 해주어야해서 불편했다.

## 앞으로 할일

배포를 했지만 앞으로 해야할 작업들이 많이 남아있다.

### Issue to Markdown Parsing system

velog에 있던 글을 그대로 옮기다보니까 현재 마크다운의 글을 보면 아래와 같이 이미지를 가져올 때, velog에서 사용하는 CDN을 이용해 가져온다.

![](https://velog.velcdn.com/images/hustle-dev/post/4792f16b-c880-412c-a0d7-2b22d261656c/image.png)

또한 VSCode에서도 마크다운에 이미지를 바로 등록하려고하면 되지 않아서 손수 이미지파일을 폴더로 복사하고 경로를 맞춰주어야 하는데 너무 번거롭기 때문에 github의 Issue를 CMS로 하여 이슈로 글을 작성하면 Workflow를 통해 자동으로 `content/${글제목}`에 image와 md파일을 만들어 배포되도록 할 예정이다.

### giscus 테마작업

![](https://velog.velcdn.com/images/hustle-dev/post/5608f1ee-005f-4778-8c34-0740ab343938/image.png)

현재 댓글 시스템으로 giscus를 사용하고 있는데 테마중 그나마 다크모드와 라이트모드에 가장 어울리는 transparent를 사용하고 있는데 가독성이 좋지 않아서 커스텀 테마를 만들 예정이다.

### 그 외

그외로 post 페이지에 prev, next가 들어가는 기능들을 넣고 스타일링을 해보고 싶고, tailwind CSS를 활용하여 마이그레이션을 하면서 이 기술을 배워보고 싶다.
