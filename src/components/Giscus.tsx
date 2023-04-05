import React, { useEffect, useRef } from 'react';

// TODO: 모드 변경에 따른 댓글 테마 변경
export const Giscus = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    // script.setAttribute('data-repo', 'hustle-devlog/hustle-devlog.github.io');
    script.setAttribute('data-repo', 'hustle-dev/astro_tutorial');
    script.setAttribute('data-repo-id', 'R_kgDOJAAqrA');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'DIC_kwDOJAAqrM4CU1WE');
    script.setAttribute('data-mapping', 'og:title');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'transparent_dark');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current === null) return;
      containerRef.current.removeChild(script);
    };
  }, []);

  return <div id="comment" ref={containerRef} />;
};
