import { TYPO } from '@styles';
import React, { useEffect, useRef } from 'react';
import * as styles from './TableOfContents.module.css';
import Pen from '@images/pen.svg';

type TableOfContentsProps = {
  html: string;
};

export const TableOfContents = ({ html }: TableOfContentsProps) => {
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            const tocItem = tocRef.current?.querySelector(`a[href="#${encodeURI(id)}"]`);

            if (!tocItem) return;

            const prevActiveItem = tocRef.current?.querySelector(`.${styles.active}`);
            if (prevActiveItem) prevActiveItem.classList.remove(styles.active);

            tocItem.classList.add(styles.active);
          }
        });
      },
      {
        rootMargin: '0% 0% -90% 0%',
        threshold: 0,
      }
    );

    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]');
    headings.forEach((heading) => observer.observe(heading));

    return () => {
      headings.forEach((heading) => observer.unobserve(heading));
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <Pen className={styles.pen} />
      <div
        ref={tocRef}
        style={TYPO.B7}
        className={styles.tableOfContents}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  );
};
