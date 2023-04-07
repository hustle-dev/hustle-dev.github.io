---
title: 다른 색깔 찾기 게임 제작 챌린지
description: 넘블 다른 색깔 찾기 게임 제작 챌린지 구현과정에 관한 글입니다.
date: 2022-02-11
slug: /numble-different-colors-game-challenge
tags: [개발, React]
heroImage: ./heroImage.png
heroImageAlt: 넘블 로고
---

## 🏁 챌린지 시작

설 연휴에 무엇을 할지 고민하다가 우연찮게 페이스북 광고로 넘블 챌린지를 보게되었습니다.

이 챌린지는 **프론트엔드를 대상으로 상태관리 라이브러리를 사용하지 않고 다른 색깔 찾기 게임구현**하는 것이었는데, 리액트와 타입스크립트로 게임을 구현하면서 활용 능력을 올리고 싶어서 참여하게 되었습니다.

참고 사이트: [[React] 상태관리 라이브러리를 사용하지 않고 다른 색깔 찾기 게임 제작](https://www.numble.it/920213f2-f9de-4bde-969b-1fbaaaf1983a)

### 1️⃣ 미션

아래 페이지를 클론 코딩

https://numble-react.vercel.app/

> 마크업보다 데이터 흐름, 컴포넌트 구분에 집중하여 설계를 목표

#### 상세 스펙

- **`Math.pow(Math.round((stage + 0.5) / 2) + 1, 2)`** 개의 사각형이 표시되며, 그 중 하나만 색깔이 다릅니다.
- 한 stage의 제한 시간은 15초입니다.
- 색이 다른 사각형(정답)을 클릭한 경우 아래 변경사항이 적용됩니다.
  - 다음 스테이지로 넘어갑니다.
  - **`Math.pow(stage, 3) * 남은시간`** 만큼의 score가 누적됩니다
- 오답을 클릭한 경우 아래 변경사항이 적용됩니다.
  - 현재 stage의 남은 시간이 3초 줄어듭니다.
- 남은 시간이 0초 이하가 되면 게임이 종료됩니다. 최종 stage와 누적 score를 출력하고, 새로운 게임을 시작할 수 있습니다.
- stage가 올라갈수록 정답과 오답의 색상 차이가 줄어듭니다.

### 2️⃣ 조건

- React를 사용
- Function Component 활용
- Javascript보다는 Typescript를 활용
- 서버에 배포할 것 (Vercel과 같은 서비스를 이용)
- Context, Redux, Mobx, Recoil 등 상태관리 도구를 사용하지 않을 것

> 기존에 서버를 배포할때 netlify와 heroku만 사용해보았는데 **vercel**을 사용해보면서 쉽게 서버에 배포할 수 있었습니다.

## 🛠 설계 및 코드 설명

### 🖼 마크업

우선 마크업 설계를 하기 위해 클론 코딩할 페이지에 들어가서 분석을 하고, 다음과 같이 설계를 하였습니다.

![](https://images.velog.io/images/hustle-dev/post/b5da4078-0114-4525-879f-e90c1ebb2894/image.png)

`App.tsx`

```tsx
export default function App(): JSX.Element {
  ...
  return (
    <>
      <Header>
        <A11yHidden as="h1">다른 색깔 찾기 게임</A11yHidden>
        <Header.GameInfo gameInfo={gameInfo} />
      </Header>
      <Board>
        <Board.List boardData={boardData} onClick={onClick} />
      </Board>
    </>
  );
}
```

기초적인 컴포넌트를 만들고 난 후, **아래와 같은 고민**이 필요했습니다.

1. 게임에 필요한 상태가 무엇이고, 어떤 상태를 저장할지
2. 이 상태들을 어디서, 어떻게 관리할지
3. 게임에 필요한 데이터들을 어떻게 만들지(보드 기본 색상과 오답용 기본 색상 구분)

### 📸 게임에 필요한 상태

게임에 필요한 상태를 보기위해 다시 클론코딩할 사이트에 들어가서 분석을 해보았습니다. 그러다가 콘솔창을 보게되었는데 다음과 같은 항목들을 볼 수 있었습니다.

![](https://images.velog.io/images/hustle-dev/post/81b15da5-7dd6-4066-927c-bb42176ff1ee/image.png)

이 항목들을 참고하여 저장해서 관리할 상태를 생각해보았습니다. 그래서 **아래와 같은 항목**을 저장하기로 결정하였습니다.

- **isPlaying**: 플레이의 여부를 통한 alert창 표시를 위해 상태관리
- **stage**: 최종 결과를 보여주기 위한 stage 상태
- **time**: 시간이 어떻게 지나고 있는지 표시되기 위한 상태
- **score**: 최종 결과에 stage와 같이 보여줄 최종 점수를 위한 상태
- **boardColor**: 기본 Board 색상
- **answerBoardColor**: 정답 Board 색상

> 나머지 상태(answer, onSelect 등)은 스테이지가 시작하고 그 순간에 만들어 props로 전달하면 된다고 생각하여 따로 관리하지는 않았습니다.

### 🗂 상태를 어디서 관리할지

어떤 것들을 상태로 관리할지 정했고, 그 다음은 상태를 어디서 관리할지가 고민이었습니다. 현재 **`App.tsx` 가 상태 데이터들이 필요한 GameInfo, Board의 가장 가까운 부모여서 이곳에서 관리하기로 결정**하였습니다.

### 💣 게임에 필요한 데이터 만들기

게임에 필요한 데이터로 stage, score는 이미 상세 스펙으로 어떻게 만들지 나와있었습니다. 그러나 아래와 같이 **기본 색상과 정답이 되는 색상과 스테이지별 Board의 사이즈는 어떻게 구현할지 나와있지는 않았습니다.**

![](https://images.velog.io/images/hustle-dev/post/91c2c856-3e79-4a67-addf-be5dccd0048c/image.png)

이 색상에 대해 좀더 알기 위해 다시 클론코딩할 사이트에 들어가 콘솔을 확인하였습니다.

![](https://images.velog.io/images/hustle-dev/post/1400a7c8-4b43-41f4-8144-1589d89fd71f/image.png)

이 콘솔을 보면 규칙을 발견할 수 있었습니다.
기본 색상과 정답이 되는 색상간의 차이가 아래와 같이 식으로 구현할 수 있었습니다.

```ts
Math.max(25 - Math.floor((stage + 1) / 3), 1);
```

> 이를 이용하여 기본 색상에 뺄지 말아야할지 결정을 하여 정답이 되는 색상을 구하였습니다.

BoardItem의 사이즈는 콘솔에서 확인하였을 때 다음과 같은 스타일을 갖고있었습니다.

![](https://images.velog.io/images/hustle-dev/post/e98572de-b578-45b3-92b3-b8511972f90e/image.png)

이를 이용하여 stage마다 상자의 개수에 따른 board별 크기를 구할 수 있었습니다.

```ts
`${(360 - lengthOfBoardRow * 2 * 2) / lengthOfBoardRow}px`;
```

### 🎯 주요 코드

이번 코드를 작성하면서, 따로 라이브러리들을 활용하지는 않았습니다. 라이브러리보다 리액트의 자체 훅인 `useEffect`, `useReducer`, `useMemo`, `useCallback`등을 사용해보려고 노력하였습니다.

주요 코드라고 생각하는 부분을 다음과 같이 나누어보았습니다.

- 상태관리 코드
- 타이머 구현 부분
- Board용 데이터 생성하는 부분

#### 1. 상태관리 코드

상태관리는 리액트의 `useReducer`를 활용하여 구현하였습니다.

```ts
import { getColor, getScore } from 'utils';
import { INITIAL_REMAINING_TIME, INITIAL_STAGE, ONE_SECOND, PENALTY_TIME } from './gameConstants';
import { actionType, stateProps } from './gameReducer.types';

export const initialState = Object.freeze({
  isPlaying: true,
  time: INITIAL_REMAINING_TIME,
  stage: INITIAL_STAGE,
  score: 0,
  ...getColor(INITIAL_STAGE),
});

export function reducer(state: stateProps, action: actionType) {
  switch (action.type) {
    case 'CHOOSE_ANSWER':
      return {
        ...state,
        stage: state.stage + 1,
        time: INITIAL_REMAINING_TIME,
        score: state.score + getScore(state.stage, state.time),
        ...getColor(state.stage + 1),
      };

    case 'CHOOSE_WRONG_ANSWER':
      return {
        ...state,
        time: state.time - PENALTY_TIME < 0 ? 0 : state.time - PENALTY_TIME,
      };

    case 'TICK_TOCK':
      return {
        ...state,
        time: state.time - ONE_SECOND < 0 ? 0 : state.time - ONE_SECOND,
      };

    case 'GAME_OVER':
      return {
        ...state,
        isPlaying: false,
      };

    case 'GAME_RESET':
      return {
        ...initialState,
        ...getColor(INITIAL_STAGE),
      };

    default:
      throw new Error('잘못된 동작입니다.');
  }
}
```

> useState를 사용할지 고민을 하다가 **컴포넌트에서 관리하는 값이 여러개여서 상태 구조가 복잡해질 것 같아 useReducer를 사용**하게 되었습니다.

#### 2. 타이머 구현 부분

타이머는 useEffect를 사용하여 dispatch와 함께 아래와 같이 구현하였습니다.

```tsx
useEffect(() => {
  const intervalID = setInterval(() => {
    dispatch({ type: 'TICK_TOCK' });
  }, 1000);

  if (time === 0) dispatch({ type: 'GAME_OVER' });

  return () => {
    clearInterval(intervalID);
  };
}, [time, dispatch]);
```

> useEffect가 실행된 후에 메모리 누수 방지를 위해 클린업 함수를 넣었습니다.

#### 3. Board용 데이터 생성하는 부분

board용 데이터는 **스테이지마다 변경되고, 어느정도 연산이 있기 때문에 최적화가 필요**할 것이라고 생각했습니다. 따라서 다음과 같이 `useMemo`를 사용하여 구현하였습니다.

```tsx
const boardData = useMemo(() => {
  const lengthOfBoardRow = getLengthOfBoardRow(stage);
  const numOfBoardItems = getNumOfBoardItems(lengthOfBoardRow);
  const size = getBoardItemSize(lengthOfBoardRow);
  const answerIndex = getAnswerIndex(0, numOfBoardItems);

  return {
    size,
    numOfBoardItems,
    answerIndex,
  };
}, [stage]);
```

> size와 boardColor는 위에서 언급한 방법으로 구하였습니다.

### 💡 프로젝트를 진행할 때 어려웠던 점/고민했던 부분과 해결방법

**1. useReducer를 처음 사용하여 설계하는 부분**

useReducer훅을 처음 사용해서 어떤식으로 사용해야하는지 감이 잡히질 않았습니다. 그래서 구글링을 하다가 벨로퍼트님이 useReducer에 대해 [작성한 글](https://react.vlpt.us/basic/20-useReducer.html)을 볼 수 있었습니다.

이를 많이 참고하여 따라해보면서 useReducer를 이해하고 사용할 수 있었습니다.

**2. 정답색상을 기본색상과 비교하여 어떻게 구할지에 관한 부분**

처음에 정답색상을 다음과 같이 구하였습니다.

```ts
const getAnswerBoardColor = ([red, green, blue]: number[], diff: number): string =>
  `rgb(${red + diff > 255 ? red - diff : red + diff},
${green + diff > 255 ? green - diff : green + diff},
${blue + diff > 255 ? blue - diff : blue + diff})`;
```

> 이렇게 구하고 색을 확인해보니 색상의 차이가 너무 많이 났고 이를 어떻게 처리할지가 문제였습니다.

그래서 클론코딩할 사이트를 가보았는데 다음과 같이 음수 값을 주고있었습니다.

![](https://images.velog.io/images/hustle-dev/post/dc334fbe-215c-473d-a24e-e3fa7d619edd/image.png)

이렇게 음수값을 줄 지 생각을 하다가 rgb의 범위는 0~255라는 것을 찾아보았고, 다음과 같이 코드를 수정하였습니다.

```ts
const getAnswerBoardColor = ([red, green, blue]: number[], diff: number): string => `rgb(
${getRandomBoolean() ? Math.min(255, red + diff) : Math.max(0, red - diff)},
${getRandomBoolean() ? Math.min(255, green + diff) : Math.max(0, green - diff)},
${getRandomBoolean() ? Math.min(255, blue + diff) : Math.max(0, blue - diff)})`;
```

> `getRandomBoolean`은 기본 색상에서 뺄지 더할지를 결정하기 위해 임의로 true혹은 false값을 받는 함수입니다.

**3. 생성할 BoardItem의 키 생성**

리액트 공식문서에서는 리스트렌더링을 할 시, 리스트의 key로 index를 웬만하여 사용하지 말라고 적혀있습니다. 그 이유로 셔플과 같은 작업을 할 시 개발자의 의도대로 작동되지 않을 가능성이 있기 때문입니다.

그래서 색깔과 id를 가진 객체를 만들어 보내야하나 생각을 해보았는데 스테이지가 지날때마다 boardItem들이 증가하기 때문에 **메모리 측면에서 좋지 않을 것이라고 판단**하였습니다. 또한 각 Item들이 셔플되지 않기 때문에 key를 index로 사용하여도 충분할 것이라고 생각하였습니다.

**4. 시간이 0초가 되기전에 나오는 경고창**

시간이 0초가 되기전에 다음과 같이 경고창이 뜨는 에러가 있었습니다.

![](https://images.velog.io/images/hustle-dev/post/6d01ceac-1aae-4bfa-8ddf-7844637bd343/image.png)

이 부분의 기존 코드는 다음과 같습니다.

```tsx
useEffect(() => {
  const intervalID = setInterval(() => {
    dispatch({ type: 'TICK_TOCK' });
  }, 1000);

  // time이 0이되면 dispatch로 인해 isPlaying이 false로 변함
  if (time === 0) dispatch({ type: 'GAME_OVER' });

  return () => {
    clearInterval(intervalID);
  };
}, [time, dispatch]);

useEffect(() => {
  if (isPlaying) return;

  window.alert(`GAME OVER!\n스테이지: ${stage}, 점수: ${score}`);

  dispatch({ type: 'GAME_RESET' });
}, [isPlaying, dispatch, stage, score]);
```

> 이를 해결하기 위해 `useInterval` 이라는 custom hook을 사용해보았지만 시작할때 15초가 아닌 14초로 표시되는 경우가 있어 아래와 같이 해결하였습니다.

다음과 같이 `setTimeout`을 사용하여 해결하였습니다.

```tsx
useEffect(() => {
  if (isPlaying) return;

  setTimeout(() => {
    window.alert(`GAME OVER!\n스테이지: ${stage}, 점수: ${score} ${time}`);

    dispatch({ type: 'GAME_RESET' });
  }, 100);
}, [isPlaying, dispatch, stage, score]);
```

### 🔗 최종 코드 레포 주소 및 배포 사이트

레포주소: https://github.com/hustle-dev/numble_challenge

배포사이트: https://numble-challenge-kappa.vercel.app/
