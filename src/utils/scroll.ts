export const optimizedScroll = (callback: any) => {
  let tick = false;

  return () => {
    if (tick) return;

    tick = true;
    window.requestAnimationFrame(() => {
      callback();
      tick = false;
    });
  };
};
