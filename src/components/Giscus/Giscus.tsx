import { Theme, useTheme } from '@contexts';
import React, { useEffect, useRef } from 'react';

// TODO: 모드 변경에 따른 댓글 테마 변경
export const Giscus = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (containerRef.current === null) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'hustle-dev/hustle-dev.github.io');
    script.setAttribute('data-repo-id', 'R_kgDOJUJ_0Q');
    script.setAttribute('data-category', 'Comments');
    script.setAttribute('data-category-id', 'DIC_kwDOJUJ_0c4CVoHk');
    script.setAttribute('data-mapping', 'og:title');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute(
      'data-theme',
      theme === Theme.LIGHT
        ? 'light'
        : 'https://cdn.jsdelivr.net/gh/hustle-dev/hustle-dev.github.io@main/src/components/Giscus/giscus.css'
    );
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current === null) return;
      containerRef.current.removeChild(script);
    };
  }, [theme]);

  return <div id="comment" ref={containerRef} />;
};
