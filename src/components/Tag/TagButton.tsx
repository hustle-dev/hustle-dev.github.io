import { TYPO } from '@styles';
import React from 'react';
import { TagProps } from './types';
import * as styles from './Tag.module.css';

type TagButtonProps = TagProps & {
  count: number;
  onClick: () => void;
  isSelected: boolean;
};

export const TagButton = ({ name, count, onClick, isSelected }: TagButtonProps) => {
  return (
    <button onClick={onClick} className={`${styles.tagButton} ${isSelected ? styles.active : ''}`}>
      <span style={TYPO.B5}>
        {name} ({count})
      </span>
    </button>
  );
};
