import { TYPO } from '@styles';
import React from 'react';
import * as styles from './Tag.module.css';

type TagProps = {
  isButton?: boolean;
  name: string;
  count?: number;
  onClick?: () => void;
};

export const Tag = ({ isButton = true, name, count, onClick }: TagProps) => {
  return isButton ? (
    <button onClick={onClick} className={styles.tagButton}>
      <span style={TYPO.B5}>
        {name} ({count})
      </span>
    </button>
  ) : (
    <div className={styles.tag}>
      <span style={TYPO.B7}>{name}</span>
    </div>
  );
};
