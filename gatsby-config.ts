import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  siteMetadata: {
    title: `hustle-dev blog`,
    description: `hustle-dev의 기술 블로그 입니다.`,
    siteUrl: `https://hustle-dev.github.io`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [`gatsby-plugin-sitemap`],
};

export default config;
