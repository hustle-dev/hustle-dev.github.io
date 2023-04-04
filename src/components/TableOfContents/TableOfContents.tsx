import { TYPO } from '@styles';
import React from 'react';
import * as styles from './TableOfContents.module.css';

type TableOfContentsProps = {
  html: string;
};

export const TableOfContents = ({ html }: TableOfContentsProps) => {
  return <div style={TYPO.B7} className={styles.tableOfContents} dangerouslySetInnerHTML={{ __html: html }}></div>;
};
