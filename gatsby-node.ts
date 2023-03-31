import type { CreateSchemaCustomizationArgs, CreateWebpackConfigArgs, GatsbyNode } from 'gatsby';
import path from 'path';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ actions }: CreateWebpackConfigArgs) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        '@components': path.resolve(__dirname, 'src/components'),
        '@images': path.resolve(__dirname, 'src/images'),
        '@styles': path.resolve(__dirname, 'src/styles'),
        '@hooks': path.resolve(__dirname, 'src/hooks'),
      },
    },
  });
};

export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({
  actions,
}: CreateSchemaCustomizationArgs) => {
  const { createTypes } = actions;

  createTypes(`
    type SiteSiteMetadata {
      title: String!
      siteUrl: String!
      description: String!
      heroImage: String!
      keywords: [String!]!
    }

    type Site implements Node {
      siteMetadata: SiteSiteMetadata!
    }

    type Frontmatter {
      title: String!
      description: String!
      slug: String!
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter!
      id: String!
      html: String!
    }
  `);
};
