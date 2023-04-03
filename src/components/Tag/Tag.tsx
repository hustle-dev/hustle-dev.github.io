import { TYPO } from '@styles';
import React from 'react';
import * as styles from './Tag.module.css';
import type { TagProps } from './types';

export const Tag = ({ name, style }: TagProps) => {
  return (
    <div style={style} className={styles.tag}>
      <span style={TYPO.B7}>{name}</span>
    </div>
  );
};
