import type { GatsbyConfig } from 'gatsby';

const config: GatsbyConfig = {
  flags: {
    DEV_SSR: true,
  },
  siteMetadata: {
    title: `hustle-dev blog`,
    description: `hustle-dev의 기술 블로그 입니다.`,
    siteUrl: `https://hustle-dev.github.io`,
  },
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /src\/images/,
          options: {
            props: {
              className: 'my-class',
            },
          },
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: 'src/images/icon.png',
      },
    },
  ],
};

export default config;
