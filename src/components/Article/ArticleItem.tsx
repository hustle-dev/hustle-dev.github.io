import { GatsbyImage, getImage, type IGatsbyImageData } from 'gatsby-plugin-image';
import React from 'react';
import type { ArticleProps } from './types';
import * as styles from './ArticleItem.module.css';
import { Link } from 'gatsby';
import { TYPO } from '@styles';
import { Tag } from '@components';

export const ArticleItem = ({ title, description, date, tags, slug, heroImage, heroImageAlt }: ArticleProps) => {
  const image = getImage(heroImage) as IGatsbyImageData;

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      <article className={styles.wrapper}>
        <figure className={styles.figure}>
          <GatsbyImage image={image} alt={heroImageAlt} className={styles.gatsbyImage} />
          <figcaption className={styles.figcaption}>
            <ul className={styles.tagList}>
              {tags.map((tag) => (
                <Tag key={tag} isButton={false} name={tag}></Tag>
              ))}
            </ul>
            <h3 style={TYPO.H1} className={styles.title}>
              {title}
            </h3>
            <p style={TYPO.B5} className={styles.description}>
              {description}
            </p>
            <span style={TYPO.B7} className={styles.date}>
              {date}
            </span>
          </figcaption>
        </figure>
      </article>
    </Link>
  );
};
