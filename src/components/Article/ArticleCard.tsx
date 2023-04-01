import { TYPO } from '@styles';
import { Tag } from '@components';
import { Link } from 'gatsby';
import { GatsbyImage, getImage, type IGatsbyImageData } from 'gatsby-plugin-image';
import React from 'react';
import * as styles from './ArticleCard.module.css';
import type { ArticleProps } from './types';

export const ArticleCard = ({ title, description, date, tags, slug, heroImage, heroImageAlt }: ArticleProps) => {
  const image = getImage(heroImage) as IGatsbyImageData;

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      <article className={styles.wrapper}>
        <figure>
          <GatsbyImage image={image} alt={heroImageAlt} className={styles.gatsbyImage} />
          <figcaption className={styles.figcaption}>
            <span style={TYPO.B7} className={styles.date}>
              {date}
            </span>
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
          </figcaption>
        </figure>
      </article>
    </Link>
  );
};
