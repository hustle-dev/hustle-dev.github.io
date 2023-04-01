import { TYPO } from '@styles';
import { Link } from 'gatsby';
import { GatsbyImage, getImage, IGatsbyImageData } from 'gatsby-plugin-image';
import React from 'react';
import * as styles from './ArticleCard.module.css';

type ArticleCardProps = {
  title: string;
  description: string;
  date: string;
  tags: readonly string[];
  slug: string;
  heroImage: IGatsbyImageData;
  heroImageAlt: string;
};

export const ArticleCard = ({ title, description, date, tags, slug, heroImage, heroImageAlt }: ArticleCardProps) => {
  const image = getImage(heroImage) as IGatsbyImageData;

  console.log(tags);

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      <article className={styles.wrapper}>
        <figure>
          <GatsbyImage image={image} alt={heroImageAlt} className={styles.gatsbyImage} />
          <figcaption className={styles.figcaption}>
            <span style={TYPO.B7} className={styles.date}>
              {date}
            </span>
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