import { graphql, useStaticQuery } from 'gatsby';
import React, { PropsWithChildren } from 'react';

type SeoProps = {
  title?: string;
  description?: string;
  heroImage?: string;
  tags?: readonly string[];
  pathname: string;
};

type SeoQuery = {
  file: {
    publicURL: string;
  };
  site: {
    siteMetadata: {
      title: string;
      description: string;
      siteUrl: string;
      keywords: string[];
    };
  };
};

export const Seo = ({ title, description, heroImage, tags, pathname, children }: PropsWithChildren<SeoProps>) => {
  const data = useStaticQuery<SeoQuery>(
    graphql`
      query SeoQuery {
        site {
          siteMetadata {
            title
            description
            siteUrl
            keywords
          }
        }
        file(relativePath: { eq: "blogImage.png" }) {
          publicURL
        }
      }
    `
  );

  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
    keywords: defaultTags,
  } = data.site.siteMetadata;

  const { publicURL: defaultImage } = data.file;

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
    tags: tags || defaultTags,
    image: `https://hustle-dev.github.io${heroImage || defaultImage}`,
  };

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {/* TODO: 태그 관련 작업 */}
      {/* <meta name="keywords" content={seo.tags} /> */}
      {/* TODO: image 관련 작업 */}
      {/* <meta name="image" content={seo.image} /> */}
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="blog" />
      <meta property="og:url" content="{seo.url}"></meta>
      {/* <meta property="og:image" content="{seo.image}"></meta> */}
      {/* TODO: 트위터 관련 작업 */}
      {/* Twiiter */}
      {/* <meta name="twitter:card" content="summary" />
      <meta
        name="twitter:creator"
        content={site.siteMetadata?.social?.twitter || ``}
      />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} /> */}
      {/* <meta property="twitter:image" content={seo.image}></meta> */}
      {/* <meta property="twitter:url" content={seo.url}></meta> */}
      {children}
    </>
  );
};
