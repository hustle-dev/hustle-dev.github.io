---
title: 순수 TS 개발환경 설정하기
description: ESLint, Prettier, Webpack을 활용한 개발환경 설정
date: 2022-06-14
slug: /know-about-web-component
tags: [개발]
heroImage: ./heroImage.png
heroImageAlt: 도구 목록
---

## 글을 쓰게 된 이유

스터디에서 Woowacourse의 미션들을 실습한다. 그래서 평범하게 ESM 모듈을 사용해서 순수 JS로 코드를 짜려다가, 이참에 TypeScript로 코드를 짜면서 TS에 익숙해지고 전체적인 개발환경에 필요한 각종 도구들을 자세히 공부하고 정리해놓으면 좋을것 같았다.

> ESLint, Prettier, Webpack 관련 사용하는 설정에 대한 학습 내용이 주를 이룰것 같다.

## ESLint

### 초기설정

```bash
yarn init
```

> 나는 보통 yarn을 사용하기 때문에 yarn으로 초기 설정을 해준다.

순수 JS환경에서 작업을 하기 위한 ESLint 설정은 다음과 같다.

```bash
yarn add -D eslint eslint-config-airbnb-base eslint-plugin-import eslint-plugin-html
```

이를 하나하나 살펴보자.

- `eslint-plugin-import`: ES6+ import/export 지원 플러그인
- `eslint-plugin-html`: HTML 파일에 포함된 인라인 자바스크립트 지원 플러그인
- `eslint-config-airbnb-base`: Airbnb 자바스크립트 스타일을 지원하는 플러그인

> `eslint-config-airbnb`와 달리 **`eslint-config-airbnb-base`는 React 관련 플러그인이 미포함 되어있기 때문에 순수 환경에서는 이것을 사용하는 것이 좋다!**

그 후, `.eslintrc.json`을 만들어주자.

```js
{
  // ESLint 사용을 위해 지원하려는 JS 언어 옵션
  "parserOptions": {
    // 사용할 ECMAScript 버전 설정
    "ecmaVersion": "latest"
    // parser의 export 형태를 설정
    "sourceType": "module"
  },
  // 사전 정의된 전역 변수 사용(브라우저, node, es2021의 전역 변수 사용)
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  // 서드파티 플러그인
  "plugins": ["import", "html"],
  // 플러그인에서 사용할 규칙을 설정한다.
  "extends": "airbnb-base",
  "rules": {}
}
```

> 여기까지가 ESM 모듈만을 사용할때 ESLint 설정이다. 그 이후는 TS 설정이다.

### TS 설정

TS를 위한 환경으로 아래의 패키지들을 설치한다.

```bash
yarn add -D typescript eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

- `eslint-config-airbnb-typescript`: Airbnb ESLint 기능을 typescript까지 지원하여 향상시키는 패키지이다.
- `@typescript-eslint/eslint-plugin`: TS 코드에 대한 규칙을 설정하는 ESLint 플러그인이다.
- `@typescript-eslint/parser`: TypeScript 고유의 문법을 파싱하기 위한 패키지이다.

`.eslintrc.json`

```js
{
  // tsconfig에 정의된 것을 바탕으로 옵션 조정
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  // 타입스크립트 고유 문법을 위한 파서
  "parser": "@typescript-eslint/parser",
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "plugins": ["import", "html"],
  "extends": ["airbnb-base", "airbnb-typescript/base"],
  "rules": {}
}
```

> 아까 처음에 만든 `.eslintrc.json`파일에서 `parserOptions`과 `parser`부분을 위와 같이 `typescript`전용으로 바꾸어준다.
> 또한 `extends`에서 아까 추가한 플러그인인 `airbnb-typescript/base`를 등록해준다.

`.eslintrc.json` 파일의 `parserOptions`를 위해 아래의 파일을 만들어준다.

`tsconfig.json`

```js
{
  "compilerOptions": {
    // 타입스크립트파일을 어떤 버전의 자바스크립트로 바꿔줄지 정하는 부분
    "target": "es5",
    // 자바스크립트 파일간 import 문법을 구현할 때 어떤 문법을 쓸지 정하는 곳
    "module": "ESNext",
    // 엄격한 유형 검사 켜기
    "strict": true,
    // /*!로 시작하는 copy-right 헤더 주석을 제외한 모든 주석을 제거
    "removeComments": true,
    // 소스맵 생성
    "sourceMap": true
  }
}
```

## Prettier

Prettier를 같이 사용하기 위해 아래의 패키지를 설치하자.

```bash
yarn add -D prettier eslint-config-prettier
```

- `eslint-config-prettier`: ESLint 설정 중에서 Prettier와 충돌하는 부분을 비활성화 한다.

이후 `.prettierrc`를 다음과 같이 설정하였다.

```js
{
  // 인덴트 탭 간격
  "tabWidth": 2,
  // 작은 따옴표 사용
  "singleQuote": true,
  // 괄호 사이 간격 띄우기
  "bracketSpacing": true,
  // 마지막 괄호를 따로 띄우지 않고 바로 옆에 붙이기
  "bracketSameLine": true,
  // 화살표함수에서 인수가 1개일때는 괄호를 붙이지 않음
  "arrowParens": "avoid",
  // 한줄에 표시할 수 있는 길이
  "printWidth": 120
}
```

이후 코드를 작성하고 저장을 누르면 자동으로 린팅이 되는것을 확인할 수 있다.

![](https://velog.velcdn.com/images/hustle-dev/post/1f6ec87b-bad4-4da9-b6ee-652b1ea9a792/image.gif)

## Webpack

### 패키지 설치

이제 TS 코드를 작성하면, 자동으로 반영된 결과를 확인하기 위해 웹팩 데브서버를 사용하자.

이를 위해 아래의 패키지를 설치한다.

```bash
yarn add -D webpack webpack-cli webpack-dev-server css-loader style-loader ts-loader html-webpack-plugin
```

- `webpack-cli`: webpack 명령어를 사용할 수 있게해주는 모듈
- `webpack-dev-server`: 실시간으로 변경사항을 보여주는 live server
- `css-loader`: js에서 css import를 할 수 있게 해줌
- `style-loader`: DOM에 css를 주입해줌
- `ts-loader`: 웹팩과 함께 TS를 사용하게 해줌
- `html-webpack-plugin`: template html에 자동으로 번들 파일을 자동으로 추가해줌

### config 설정

다음으로 `webpack.config.js` 파일을 아래와 같이 설정하자.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/js/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, './dist'),
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    hot: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};
```

마지막으로 `package.json`에 명령어를 다음과 같이 등록한 후에,

```js
  "scripts": {
    "start": "webpack serve --open"
  }
```

명령어를 실행시키면 DevServer가 실행되고 TS 작업도중에 바뀐것들을 바로바로 보여주게 된다.

## 참고사이트

- https://poiemaweb.com/eslint
- https://eslint.org/docs/user-guide/configuring
- https://codingapple.com/unit/typescript-tsconfig-json/
- https://typescript-kr.github.io/pages/compiler-options.html
- https://prettier.io/docs/en/options.html
- https://sangjuntech.tistory.com/25
- https://webpack.kr/guides/getting-started/
- https://velog.io/@ssh1997/webpack-typescript-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0
