---
title: React 18에서 고쳐진 버그 (feat. Dan의 답변)
description: 이 문제에 대해 아시나요?
date: 2023-03-22
slug: /bug-fixed-in-react-18
tags: [TypeScript, 번역]
heroImage: ./heroImage.png
heroImageAlt: 타입스크립트
---

## 문제

아래와 같은 react 18 버전 코드가 있다.

```tsx
import { MouseEvent, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type DropdownProps = {
  target: HTMLElement | null;
  children: ReactNode;
};

function Dropdown({ target, children }: DropdownProps) {
  useEffect(() => {
    if (!target) return;

    const listener = () => {
      console.log('listener executed');
    };

    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [target]);

  if (!target) {
    return null;
  }

  return <div>{children}</div>;
}

function App() {
  const [target, setTarget] = useState<HTMLButtonElement | null>(null);

  return (
    <div>
      <button onClick={(e: MouseEvent<HTMLButtonElement>) => setTarget(e.currentTarget)}>Button</button>
      <Dropdown target={target}>dropdown test</Dropdown>
    </div>
  );
}

export default App;
```

코드 샌드박스 링크: https://codesandbox.io/s/sad-firefly-sphup6?file=/src/App.tsx

> 이 코드에 대해서 간략하게 설명하면, `target`이 `falsy` 값일 경우에는 `Dropdown` 컴포넌트의 listener가 실행되고 있지 않다가 `target`이 `falsy` 값이 아니게 되면, 이벤트 리스너가 부착되는 코드이다.

이 코드의 동작방식을 예측하면, **당연히 처음 버튼을 눌렀을 때, `target`의 값이 초기화되면서, `document`에 listener가 부착되고, 그 이후에 버튼을 다시 눌렀을 때 listener가 실행되는 것을 예상**했다. 그러나 실제 동작방식은 아래의 화면과 같았다.

![](https://velog.velcdn.com/images/hustle-dev/post/e26326ce-97c4-469f-8212-b7459e60f081/image.gif)

> **버튼을 누르자마자 listener가 실행**된것이다.

react 17에선 같은 코드가 이렇게 동작하지 않고, react 18의 `createRoot`를 사용할 때, 이런 일이 발생하였는데 왜 이런일이 발생한 것일까?

## Dan abramov의 답변

계속 고민하다가 왜 이렇게 동작하는 지 이해가 안가서 다음과 같이 [facebook/react](https://github.com/facebook/react) 레포에 [Issue](https://github.com/facebook/react/issues/26090)를 올렸다.

우선 결론부터 말하면 저 동작은 **의도된 동작**이라는 것이다.

> 처음에 이 답변을 듣고, 내가 React를 지금까지 잘못 알고 있었나 생각이 들었다.

위 이슈에 달린 Dan의 답변을 토대로 정리해보면 원래 React17에서는 이러한 동작이 **일관성 없게 동작**을 하였다고 한다. 즉, 저렇게 작성을 하여도 어떤 경우에는 **이벤트가 부착만 되고 이벤트 리스너가 실행되지 않는 경우가 있었고**, **이벤트가 동기식으로 처리되어 이벤트 리스너가 실행되는 경우도 있었다**고 한다.

아래 예시 코드샌드박스를 보면 확인할 수 있다.

- React 17에서 이벤트가 동기식으로 처리되는 경우(portal과 함께 사용)
  https://codesandbox.io/s/runtime-glitter-256mit?file=/src/App.js

- React 17에서 이벤트가 동기식으로 처리되지 않는 경우
  https://codesandbox.io/s/little-cherry-hbvwik?file=/src/App.js

> 즉, 정리해보면 처음 문제의 코드에서 원래 이벤트가 부착이 되고 `listener`가 실행되는 동작이 정상적인 동작이며 17에선 버그였다고 한다. 그림으로 그려보면 아래와 같다.

![](https://velog.velcdn.com/images/hustle-dev/post/c0f02420-0f8c-4ae0-9f01-fe9e0c7f7801/image.png)

> 18에서는 이러한 동작이 일관되어 항상 이벤트를 포착하고, 클릭/입력과 같은 의도적인 사용자 이벤트로 인한 렌더링 효과는 항상 동기적으로 처리 된다고 한다.

## 처음 의도한 대로 코드를 실행시키려면?

우선 Dan이 댓글에 언급한 대로, `setTimeout` 방법이 있다.

### setTimeout

이벤트의 부착하는 시점을 `setTimeout`으로 감싼다.

```tsx
setTimeout(() => {
  document.addEventListener('click', listener);
}, 0);
```

추후 더 고민해보니 아래와 같은 방법으로도 해결할 수 있었다.

### useDeferredValue

기존 코드의 `target`을 사용하는 부분을 `useDeferredValue`로 감싼 값으로 사용한다.

```tsx
const deferredTarget = useDeferredValue(target);
```

### startTransition

`setState`하는 부분의 코드를 `startTransition`으로 감싼다.

```tsx
      <button
        onClick={(e: MouseEvent<HTMLButtonElement>) => {
          startTransition(() => {
            setTarget(e.currentTarget);
          });
        }}
      >
```

## 참고자료

- https://github.com/facebook/react/issues/26090
- https://github.com/facebook/react/issues/24657
- https://github.com/facebook/react/issues/20074
