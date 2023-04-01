import { TYPO } from '@styles';
import React from 'react';
import * as styles from './Tag.module.css';

type TagProps = {
  isButton?: boolean;
  name: string;
  count?: number;
  onClick?: () => void;
  isSelected?: boolean;
};

export const Tag = ({ isButton = true, name, count, onClick, isSelected = false }: TagProps) => {
  return isButton ? (
    <button onClick={onClick} className={`${styles.tagButton} ${isSelected ? styles.active : ''}`}>
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
