---
title: 웹 성능을 위한 이미지 최적화
description: 이미지 최적화 방법론
date: 2021-08-21
slug: /image-optimization
tags: [개발]
heroImage: ./heroImage.png
heroImageAlt: 이미지 태그
---

> 팀 과제로 한 이미지 최적화 방법 자료조사입니다.

# 이미지 최적화

## 이미지 최적화를 해야하는 이유

<img src="https://miro.medium.com/max/660/1*jvoa4e5EhEav-SwsYjNbQw.png">

위의 통계자료를 보면, 웹 페이지에서 대부분의 용량을 차지하는 것은 이미지이다.

이미지 최적화를 통해 이미지 용량을 줄인다면, 다음과 같은 이점을 얻을 수 있다.

1. 웹 페이지 바이트를 절약할 수 있다.

   > 따라서 사이트 성능 또한 향상할 수 있다.

2. 브라우저가 다운로드해야하는 바이트가 줄어든다.

   > 클라이언트의 대역폭에 여유가 생긴다.

3. 콘텐츠를 더 빨리 다운로드하여 화면에 렌더링한다.

   > 최적의 사용자 경험을 제공할 수 있다.
   > 사이트 방문자의 40%가 3초안에 웹페이지가 로딩되지 않으면 떠난다.

4. 서버 저장공간이 적게 필요한다. (비용절감)

5. 구글의 SEO 순위를 결정할 때 모바일 응답성을 고려하여, 검색순위에 노출한다.
   > 이미지 최적화를 통해서 모바일 응답성을 빠르게 한다면, 검색 결과의 상위권에 노출될 수 있다.

<br>

---

## 이미지 최적화 방법론

웹 화면에 렌더링을 빠르게 하기 위해선, 이미지의 리소스 최적화가 반드시 필요하다. 이미지를 최적화 하는 방법으로 8가지의 방법론을 소개하고자 한다.

- 이미지 `폭`을 조절하라.

- 최적화된 이미지 `포맷`을 사용하라.

- `<img>`에 `width, height` 값을 선언해 `Reflow`를 방지하라.

- `여러 버전의 이미지`를 제공하라.

- 이미지 크기 조절 `툴`을 사용하라.

- `Image CDNs`을 사용하라

- `CSS Sprite` 기법을 사용하라.

- `lazy loading`을 활용하라.

<br>

---

### 이미지 폭 조절

페이지에서 사용하는 이미지는 보통 가로폭이 1,000px이 넘지 않는다. 블로그 처럼 좌측 우측 메뉴가 존재한다면 800px로도 충분하다.

DSLR 카메라 또는 핸드폰으로 찍은 사진은 가로폭이 3,000px을 넙기 때문에, 이미지 사이즈를 줄여주는 것 만으로도 큰 효과를 얻을 수 있다.

#### 예시

![](https://images.velog.io/images/hustle-dev/post/ee7fd3e8-ec54-4ae3-9cd3-a53ee3074021/image.png)

위의 규격 4032 × 3024 이미지를 800 × 600 규격으로 줄인 결과 용량차이는 다음과 같다.

- 4032 × 3024 : 2.7MB
- 800 × 600 : 133KB

이미지의 크기를 줄인 결과, 20배 정도 용량이 줄어들었다.

---

### 이미지 포맷(format) 설정

이미지의 종류에 맞게 포맷을 설정하면 이미지 최적화를 할 수 있다. 전통적으로 많이 사용하는 JPG, PNG 포맷은 다음과 같은 이미지에서 최적화되어있다.

- JPG : 카메라로 찍은 실제 사진
- PNG : 만들어진 이미지

#### 예시1 실제 사진

![](https://images.velog.io/images/hustle-dev/post/10e4a219-524e-45f7-a184-8516fbc0147e/image.png)

아래의 규격 4032 × 3024 이미지를 JPG와 PNG로 저장했을 때 용량차이는 다음과 같다.

- JPG : 2.7MB
- PNG : 9.9MB

PNG가 JPG의 3.6배 용량이 더 크다.

#### 예시2 만들어진 이미지

![](https://images.velog.io/images/hustle-dev/post/bca75095-166d-4346-8871-9e440e94e682/image.png)

아래의 규격 2224 × 1668 이미지를 JPG와 PNG로 저장했을 때 용량차이는 다음과 같다.

- JPG : 907KB
- PNG : 654KB

JPG가 PNG의 1.5배 용량이 더 크다.

따라서 이미지 종류에 맞는 포멧을 사용할 필요가 있다.

<br>

#### JPEG, WebP, AVIF

웹 브라우저에 최적화된 이미지를 찾기 위해 AVIF, WebP, JPEG를 비교한 사례에 대해서 가져왔다.

**JPEG**는 'Joint Photographic Experts Group' 의 약자이며 확장자는 '.jpg' 또는 '.jpeg' 이다.
JPEG는 손실이 많은 압축 디지털 이미지를 만드는 데 사용할 수 있는 압축 방법이다. 크기와 품질 사이에서 절충하기 위해 압축 정도를 선택할 수 있다.

**WebP**는 구글이 2010년에 발표한 포맷으로 파일 크기를 줄이기 위해 손실 없는 압축과 무손실 압축을 모두 사용하고 있다. 웹사이트의 트래픽 감소 및 로딩 속도 단축을 겨냥한 것으로, 주로 사진 이미지 압축 효과가 높은 것으로 알려졌다.

**AVIF**는 AOMedia에서 개발한 이미지 포맷으로 손실 압축과 비 손실 압축을 전부 지원하기 때문에 WebP처럼 GIF, PNG, JPEG 등의 상용 이미지 포맷을 대체할 수 있다. 또한 애니메이션 기능이 있어 움짤로 쓸 수 있고, 압축 효율이 뛰어나다는 점에서 WebP를 닮았다.

<br>

#### JPEG vs WebP vs AVIF

이미지 포맷 비교 테스트는 가장 인기 있는 이미지 500개를 선택하여 원본 형식(PNG/JPEG), WebP 및 최종 AVIF출력 형식으로 진행하였다.

결과는 다음과 같다.

- 93% 경우 AVIF 이미지가 WebP 이미지보다 작았다.
- 평균적으로 AVIF 이미지는 WebP 이미지보다 47% 작았다.
- WebP 이미지는 99%의 경우 최적화된 PNG/JPEG 이미지보다 작았다.

한가지 구체적인 예를 살펴보면 원본 이미지는 다음과 같다.

![](https://images.velog.io/images/hustle-dev/post/9cfa1085-faff-438f-b001-766e20932232/image.png)

| Format | Size  |
| :----: | :---: |
|  JPEG  | 101Kb |
|  WebP  | 66kb  |
|  AVIF  | 33kb  |

이러한 결과를 통해 다음과 같은 제안을 할 수 있다.

**브라우저가 AVIF를 지원하면 AVIF를 사용하고, 그렇지 않은 경우 WebP, 그렇지 않은 경우 PNG 또는 JPEG의 사용이다.**

<br>

#### HTML에서 사용법

```html
<picture>
  <source srcset="supercar.avif" type="image/avif" />
  <source srcset="supercar.webp" type="image/webp" />
  <img src="supercar.jpeg" alt="Fast red car" />
</picture>
```

> 다음과 같이 `picture` 태그와 `source`태그, `img`태그를 이용하여 avif파일 및 webp파일을 지원하지 않는 경우에 jpeg파일을 사용하게 할 수 있다.

---

### 이미지 고정값

#### Reflow

어떠한 액션이나 이벤트에 의해 DOM요소의 크기나 위치 등을 변경하면 해당 노드의 하위 노드와 상위의 노드들을 포함하여 Layout 단계를 다시 수행하게 된다. 변경하려는 특정 요소의 위치와 크기뿐만 아니라 연관된 요소들의 위치와 크기도 재계산을 하기 때문에 브라우저의 퍼포먼스를 저하시키는 요인이다.

<br>

#### Reflow를 발생시키는 원인(치수가 없는 이미지) 해결법

치수가 없는 이미지들은 Reflow를 발생시켜 퍼포먼스를 저하시키기 때문에 이를 해결하기 위해 이미지 및 비디오 요소에 `width`와 `height`속성을 항상 포함하거나 또는 CSS를 사용하여 필요한 공간 `aspect-ratio`를 잡는다. 이 방법을 사용하면 이미지가 로드되는 동안 브라우저가 문서의 공간을 올바르게 할당할 수 있다.

```html
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons" />
```

> 다음의 방식으로 reflow와 re-layout을 최소화할 수 있다.

<br>

반응형 웹 디자인의 경우 width와 height를 생략하고 CSS를 사용하여 이미지 크기를 조정하기 시작하였는데

```css
img {
  width: 100%; /* or max-width: 100%; */
  height: auto;
}
```

이 접근 방식의 단점은 다운로드가 시작되고 브라우저가 크기를 결정할 수 있는 경우에만 이미지를 위한 공간을 할당할 수 있다는 점이다. 이미지가 로드되어 각 이미지가 화면에 나타나면 reflow 되어 텍스트가 갑자기 화면 아래로 튀어나가는 등의 문제가 발생하였는데 이것을 방지하기 위해 `aspect-ratio`를 사용한다.

이 `aspect-ratio`속성을 사용하면 복잡한 계산 없이 간단하게 속성으로 레이아웃 이동 방지를 할 수 있다.

---

### 여러 버전의 이미지 제공

여러 이미지 버전을 지정하면 브라우저에서 사용하기에 가장 적합한 버전을 선택한다.

```html
# Before
<img src="flower-large.jpg" />

# After
<img src="flower-large.jpg" srcset="flower-small.jpg 480w, flower-large.jpg 1080w" sizes="50vw" />
```

#### src 속성

브라우저가 `srcset` 과 `sizes` 속성을 지원하지 않으면 fall back으로 `src` 속성이 동작한다.

> `src` 속성은 모든 디바이스 크기에서 동작할 수 있을만큼 충분히 커야한다.

<br>

#### srcset 속성

`srcset` 속성은 이미지 파일명과 width 또는 density 설명을 쉼표로 구분한다.

`480w` 는 480px 임을 브라우저에게 말해준다.

width를 명시하는 것은 브라우저에 이미지의 너비를 알려주는 방법이다. 이러면 브라우저에서 크기를 결정하기 위해 이미지를 다운로드할 필요가 없다.

> 너비를 명시하려면 px 단위 대신 w단위를 사용

<br>

#### size 속성

`size` 속성은 이미지가 표시될 때의 너비를 브라우저에게 말해준다. 그러나 `size` 속성은 display 크기에 영향을 주지 않으며 여전히 CSS가 필요하다.

브라우저는 로드할 이미지를 결정하기 위해 유저의 디바이스 정보와 함께 `size` 속성의 정보를 사용한다.

> 단위에 % 는 `size` 속성과 함께 사용할 수 없다.

<br>

#### 몇 개의 이미지 버전을 만들어야 좋을까?

일반적으로 정답은 없다. 하지만 일반적으로 3 ~ 5개의 서로 다른 크기의 이미지를 제공한다. 더 많은 이미지 크기를 제공하면 성능이 향상되지만, 그만큼 서버에서 더 많은 공간을 차지하고 HTML 을 조금 더 작성해야 한다.

---

### 이미지 크기 조절 툴

가장 많이 사용되는 이미지 크기 조절 툴은 sharp npm package 그리고 ImageMagick CLI tool이 있다.

sharp 패키지는 이미지 크기 조절을 자동화하는데 적합하다 (예를 들어 웹사이트의 모든 비디오에 대해 여러 크기의 썸네일 생성). 반면 ImageMagick 은 전부 커맨드 라인으로부터 사용되기 때문에 일회성 이미지 크기 조절에 편리하다.

#### sharp

```jsx
const sharp = require('sharp');
const fs = require('fs');
const directory = './images';

fs.readdirSync(directory).forEach((file) => {
  sharp(`${directory}/${file}`)
    .resize(200, 100) // width, height
    .toFile(`${directory}/${file}-small.jpg`);
});
```

<br>

#### ImageMagick

이미지 크기를 원래 크기의 33%로 조절하기

```jsx
convert -resize 33% flower.jpg flower-small.jpg
```

<br>

너비 300픽셀 \* 높이 200 픽셀에 맞게 이미지 크기 조절하기

```jsx
# macOS/Linux
convert flower.jpg -resize 300x200 flower-small.jpg

# Windows
magick convert flower.jpg -resize 300x200 flower-small.jpg
```

<br>

#### 그 외 서비스들

**Thumbor**나 **Cloudinary** 같은 이미지 서비스도 있다. Thumbor 는 서버에 설치하여 설정된다. Cloudinary는 이러한 세부 정보를 처리하며 서버 설정이 필요하지 않다.

---

### Image CDNs

#### Image CDN을 사용하는 이유

Image content delivery networks(CDNs) 는 이미지 최적화에 탁월하다. image CDN으로 전환하면 이미지 파일 크기를 40 ~ 80% 줄일 수 있다.

<br>

#### Image CDN이란 ?

Image CDN은 이미지 변환, 최적화 및 전송을 전문으로 한다. 또한 사이트에서 사용되는 이미지에 대한 접근이나 조작을 위한 API로 생각할 수 있다. Image CDN에서 로드된 이미지의 경우 이미지 URL은 이미지뿐만 아니라 크기, 포맷, 품질 같은 매개변수도 나타낸다. 이를 통해 다양한 사용 사례에 대한 이미지 변형을 쉽게할 수 있다.

![](https://images.velog.io/images/hustle-dev/post/95051695-cbee-4b7d-be7d-4ae3f7a02197/image.png)

<br>

#### 이미지 CDN이 URL을 사용하여 최적화 옵션을 나타내는 법

image CDN이 사용하는 image URL은 이미지와 변형 및 최적화 관련 중요한 정보를 전송한다.

URL 포맷은 image CDN에 따라 다르지만 대략적으로 모두 유사한 기능을 가지고 있다.

![](https://images.velog.io/images/hustle-dev/post/afd1871e-e114-452b-a99b-6633331ce783/image.png)

- Origin: 도메인
- Image: 이미지 검색
- Security key: 다른 사람이 이미지의 새 버전을 만드는 것을 방지
- Transformations: 다양한 이미지 변환 제공

[`https://my-site.example-cdn.com/https://flowers.com/daisy.jpg/quality=auto`](https://my-site.example-cdn.com/https://flowers.com/daisy.jpg/quality=auto) 의 URL 은

[`https://flowers.com/daisy.jpg`](https://flowers.com/daisy.jpg) 의 URL에 있는 daisy.jpg 이미지를 검색하고 최적화 한다.

---

### Css Sprite

페이지의 첫 로딩 속도를 줄여주는 여러 방법 중에서도 서버로의 요청 횟수를 최소화 하는 것은 최적화 요소중에서도 중요하며, 이 중 CSS sprites는 실제 적용하기에 아주 손쉬운 방법중 하나이다.

웹페이지에 필수적으로 자주 사용되는 아이콘, 버튼 같은 이미지들을 쓸 때마다 여러 이미지들을 불러오는 것이 아니라, 한 이미지 파일로 통합한 후 배경 이미지로 만들어 놓고 `postiion`값으로 각각의 이미지를 불러오는 것이 `css sprite`기법 이다.

이러한 방식으로 이미지를 불러오게 되면 트래픽이 절약되고 HTTP요청 횟수를 줄여 빠른 웹 브라우징을 할 수 있게 된다.

#### CSS에서의 사용법

```css
div#sprite {
  background: url(/images/sprite.png) no-repeat;
} //한 이미지를 불러옴

// position으로 각 이미지를 불러옴
div#sprite > .first {
  background-position: 0 0;
}
div#sprite > .second {
  background-position: 0 -15px;
}
div#sprite > .third {
  background-position: 0 -30px;
}
```

> 다음과 같이 한 이미지를 불러와서 `background-position`값을 조절하여 원하는 이미지를 가져오는 것이 CSS Sprite 기법이다.

---

### Lazy loading

#### Lazy loading이란 무엇인가?

페이지를 로드할 때, 모든 이미지를 로드하는 것이 아니라 중요하지 않은 자원 또는 당장 필요 없는 자원의 경우

서버에 요청을 미루고 필요한 경우 해당 자원을 요청 받는 방법을 말한다.

<br>

#### Lazy loading이 필요한 이유

1. 데이터의 낭비를 막을 수 있다.

- 서버로부터 모든 자원을 요청하는 것은 잠재적으로 사용자들이 사용하지 않거나 볼 가능성이 적은 모든 자원들까지 요청받는 것이다.

> 따라서 서버로부터 필요한 자원만 요청 받고, 필요할 때만 해당 자원을 요청 받는 것이 효율적이다.

2. 브라우저의 랜더링 시간을 줄여준다.

- 브라우저는 서버로부터 자원을 요청받고 난 뒤에 화면에 랜더링을 한다. 따라서 불필요한 자원의 다운로드를 막는 것만으로도 프로세스 시간이 단축될 수 있다.

<br>

#### Lazy loading 사용하는 방법

**Browser-level**

1. 사용 방법

모던 브라우저의 경우 `img` 태그 내의 속성을 통해 lazy-loading을 지원한다. 모던 브라우저가 아닌 경우, 해당 속성은 무시된다.

다음과 같이 `img` 태그 내의 loading 속성 값을 부여하면 된다.

```html
<img loading="lazy" />
```

```html
<picture>
  <source media="(min-width: 800px)" srcset="large.jpg 1x, larger.jpg 2x" />
  <img src="photo.jpg" loading="lazy" />
</picture>
```

`loading`의 속성 값은 다음 3가지와 같다.

- `auto` : 디폴트 값으로, 속성값을 지정하지 않은 것과 동일하다.

- `lazy` : 뷰포트 상에서 해당 이미지의 위치를 계산하여 이미지 자원을 요청함

- `eager` : 어느 위치에 있든지 이미지 자원을 바로 요청받음

2. 주의 사항

- 해당 속성을 사용할 경우 되도록 해당 이미지 영역의 크기를 지정하는 것이 권장된다.

  - 영역의 크기에 대한 정보가 없으면, 브라우저는 해당 영역의 크기를 알 수 없어 해당 영역을 0x0으로 처음에 인식하게 된다.
  - 만약 해당 이미지 영역으로 스크롤 할 경우 이미지가 로드 되면서 layout shift가 일어날 수 있기 때문에 되도록 해당 img 태그에 명시적으로 높이/너비 값을 지정해야 함.

- 페이지의 첫 시작부터 보이는 이미지에 대해서는 lazy-loading을 사용하지 말아야 한다.
- background-image에서는 적용 안 된다.
- `<iframe loading="lazy">` 은 아직 비표준이다.([링크](https://web.dev/lazy-loading-images/#images-inline-browser-level))

3. 브라우저 지원 현황

![](https://images.velog.io/images/hustle-dev/post/90cab5c8-da6e-489c-8f43-ce552527ecc2/image.png)

**Intersaction Observer API**

MDN 문서에 따르면 타겟 요소와 상위 요소 또는 최상위 document 의 viewport 사이의 intersection 내의 변화를 비동기적으로 관찰하는 방법이라고 소개되어 있다.

즉, 비동기적으로 사용자의 이벤트를 관찰하는 방법을 제공하는 웹 API로서 사용자가 웹 페이지를 스크롤 할 때 어떤 Element 이미지가 해당 뷰포트내에 교차(intersection)되었는지를 판단할 수 있는 방법을 제공한다.

이 방법을 이용해 해당 이미지가 교차 되면 이미지를 로딩할 수 있도록 JavaScript 핸들링을 하면 된다.

1. Intersaction Observer API 사용 방법

다음과 같이 기본적으로 callback 함수와 option을 받는다.

```JavaScript
const io = new IntersectionObserver(callback[, options])
```

**`callback`**

- `callback`: 타겟 엘리먼트가 교차되었을 때 실행할 함수
  - `entries`: [IntersectionObserverEntry](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry) 객체의 리스트. 배열 형식으로 반환하기 때문에 forEach를 사용해서 처리를 하거나, 단일 타겟의 경우 배열인 점을 고려해서 코드를 작성해야 한다.
  - `observer`: 콜백함수가 호출되는 IntersectionObserver

**`options`**

- `root`
  - default: `null`, 브라우저의 viewport
  - 교차 영역의 기준이 될 root 엘리먼트. observe의 대상으로 등록할 엘리먼트는 반드시 root의 하위 엘리먼트여야 한다.
- `rootMargin`
  - default: `'0px 0px 0px 0px'`
  - root 엘리먼트의 마진값. css에서 margin을 사용하는 방법으로 선언할 수 있고, 축약도 가능하다. px과 %로 표현할 수 있다. rootMargin 값에 따라 교차 영역이 확장 또는 축소된다.
- `threshold`
  - default: `0`
  - 0.0부터 1.0 사이의 숫자 혹은 이 숫자들로 이루어진 배열로, 타겟 엘리먼트에 대한 교차 영역 비율을 의미한다. 0.0의 경우 타겟 엘리먼트가 교차영역에 진입했을 시점에 observer를 실행하는 것을 의미하고, 1.0의 경우 타켓 엘리먼트 전체가 교차영역에 들어왔을 때 observer를 실행하는 것을 의미한다.

2. IntersectionObserverEntry 객체의 배열을 동작시킬 수 있는 속성

IntersectionObserver의 callback 함수를 통해 생성된 객체의 배열의 속성을 확인할 수 있는 방법은 다음과 같다.

- [IntersectionObserverEntry.boundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/boundingClientRect): 타겟 엘리먼트의 정보를 반환한다.
- [IntersectionObserverEntry.rootBounds](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/rootBounds): root 엘리먼트의 정보를 반환합니다. root를 선언하지 않았을 경우 null을 반환한다.
- [IntersectionObserverEntry.intersectionRect](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRect): 교차된 영역의 정보를 반환한다.
- [IntersectionObserverEntry.intersectionRatio](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/intersectionRatio): IntersectionObserver 생성자의 options의 threshold와 비슷하다. 교차 영역에 타겟 엘리먼트가 얼마나 교차되어 있는지(비율)에 대한 정보를 반환한다. threshold와 같이 0.0부터 1.0 사이의 값을 반환한다.
- [IntersectionObserverEntry.isIntersecting](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/isIntersecting): 타겟 엘리먼트가 교차 영역에 있는 동안 true를 반환하고, 그 외의 경우 false를 반환한다.
- [IntersectionObserverEntry.target](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/target): 타겟 엘리먼트를 반환한다.
- [IntersectionObserverEntry.time](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry/time): 교차가 기록된 시간을 반환한다.

3. 실사용 예제 (출처 : [링크](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/))

```html
<div class="example">
  <img src="https://picsum.photos/600/400/?random?0" alt="random image" class="image-default" />
  <img data-src="https://picsum.photos/600/400/?random?1" alt="random image" class="image" />
  <img data-src="https://picsum.photos/600/400/?random?2" alt="random image" class="image" />
  <img data-src="https://picsum.photos/600/400/?random?3" alt="random image" class="image" />
</div>
```

```js
// IntersectionObserver 를 등록한다.
// entries는 위에 data-src로 설정된 img 태그들의 배열
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    // 관찰 대상이 viewport 안에 들어온 경우 image 로드
    if (entry.isIntersecting) {
      // data-src 정보를 타켓의 src 속성에 설정
      entry.target.src = entry.target.dataset.src;
      // 이미지를 불러왔다면 타켓 엘리먼트에 대한 관찰을 멈춘다.
      observer.unobserve(entry.target);
    }
  });
}, options);

// 관찰할 대상을 선언하고, 해당 속성을 관찰시킨다.
const images = document.querySelectorAll('.image');
images.forEach((el) => {
  io.observe(el);
});
```

<br>

---

## 번외

### 웹 사이트 성능 및 속도 분석 사이트

웹사이트 성능을 개선하기 위해, 서비스 배포 하기 전에 미리 최적화를 하는 것이 좋다.
아래의 사이트는 최적의 웹사이트를 유지하는데 도움이 되는 분석도구다.

1. [Pingdom](https://tools.pingdom.com/)

핑덤은 페이지 용량이나 다운로드 속도, 코드 분석을 통한 성능 등급과 개발 제안을 하며 웹페이지의 다이어트 진행 상황 또한 기록할 수 있어 매우 유용한 사이트이다.

2. [Google PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/)

구글에서 운영하는 페이지 스피드 인사이트는 웹페이지의 콘텐츠를 분석하여 페이지 속도를 개선할 방법을 추천해준다.
총 페이지 용량이나 다운로드 속도 통계는 표시하지 않지만, 모바일 장치 밑 데스크탑 장치용 페이지의 성능을 측정한다.

3. [Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)

구글의 크롬 확장 기능으로, 원하는 페이지의 속도와 관련된 문제를 파악할 수 있다.
라이트 하우스는 웹 앱의 품질을 개선하는 오픈 소스 자동화 도구로, 확인할 URL을 지정하고, 페이지에 대한 테스트를 실행한 다음, 페이지에 대한 보고서를 생성한다. 여기에서 실패한 테스트는 앱을 개선하기 위해 할 수 있는 것에 대한 지표로 사용할 수 있다.

<br>

---

## 참고 사이트

- [WebP는 정말 JPG보다 뛰어날까? 최신 이미지 파일 3종 비교](https://techit.kr/view/?no=20200701213803)

- [Is WebP really better than JPEG?](https://siipo.la/blog/is-webp-really-better-than-jpeg)

- [A practical comparison of image formats for the web. JPEG vs WebP vs AVIF.](https://fronius.me/articles/2020-10-14-comparing-image-formats-jpg-webp-avif.html)

- [WebP and AVIF: Image File Formats You Need to Know About](https://creativepro.com/webp-and-avif-file-formats-you-need-to-know-about/)

- [Load Your Images Faster with the Next-Gen AVIF Format](https://pixboost.com/blog/next-gen-avif-format/)

- [Google 엔지니어가 말하는 "웹 사이트의 이미지 가져오기"를 최적화하는 방법](https://nerowang.tistory.com/995)

- [새로운 웹페이지 성능 측정 지표 CLS(Cumulative Layout Shift)](https://wit.nts-corp.com/2020/12/28/6240)

- [이미지 최적화하기](https://web.dev/fast/#optimize-your-images)

- [CSS Sprite(스프라이트) 기법이란?](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=goodleedw&logNo=221470292886)

- [CSS sprites 기법](https://dev.eyegood.co.kr/entry/HTML5-CSS3-CSS-sprites-%EA%B8%B0%EB%B2%95)

- [Fast load times](https://web.dev/fast/#optimize-your-images)

- [Total Blocking Time (TBT)](https://web.dev/tbt/)

- [Browser-level image lazy-loading for the web](https://web.dev/browser-level-image-lazy-loading/#images-should-include-dimension-attributes)

- [웹 성능 최적화를 위한 Image Lazy Loading 기법](https://helloinyong.tistory.com/297#title-5)

- [Intersection Observer API의 사용법과 활용방법](http://blog.hyeyoonjung.com/2019/01/09/intersectionobserver-tutorial/)
