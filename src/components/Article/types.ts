import type { IGatsbyImageData } from 'gatsby-plugin-image';

export type ArticleProps = {
  title: string;
  description: string;
  date: string;
  tags: readonly string[];
  slug: string;
  heroImage: IGatsbyImageData;
  heroImageAlt: string;
};
