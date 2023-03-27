import { TYPO } from '@styles';
import React from 'react';
import * as styles from './Tag.module.css';

type TagProps = {
  name: string;
  count: number;
  onClick: () => void;
};

// TODO: 버튼인지 아닌지 구별 필요할듯
export const Tag = ({ name, count, onClick }: TagProps) => {
  return (
    <button onClick={onClick} className={styles.tagButton}>
      <span style={TYPO.B5}>
        {name} ({count})
      </span>
    </button>
  );
};
