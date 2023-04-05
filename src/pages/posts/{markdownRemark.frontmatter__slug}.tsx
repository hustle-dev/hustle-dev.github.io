import { graphql, HeadProps, PageProps } from 'gatsby';
import { GatsbyImage, getImage, getSrc, IGatsbyImageData } from 'gatsby-plugin-image';
import React from 'react';
import { Giscus, ProfileCard, Seo, TableOfContents, Tag } from '@components';
import * as styles from './Post.module.css';
import { TYPO } from '@styles';

const BlogPostTemplate = ({ data }: PageProps<Queries.PostQuery>) => {
  const { title, date, tags, heroImage, heroImageAlt } = data.markdownRemark?.frontmatter!;

  return (
    <>
      <div className={styles.pseudoHeader}></div>
      <main className={styles.wrapper}>
        <h1 style={TYPO.D2} className={styles.title}>
          {title}
        </h1>
        <p style={TYPO.B7} className={styles.date}>
          {date}
        </p>
        <ul className={styles.tagList}>
          {tags.map((tag) => (
            <Tag
              key={tag}
              style={{
                padding: '3px 12.5px 6px',
                backgroundColor: 'transparent',
              }}
              name={tag}
            ></Tag>
          ))}
        </ul>
        <GatsbyImage
          image={getImage(heroImage?.childImageSharp?.gatsbyImageData!) as IGatsbyImageData}
          alt={heroImageAlt}
          className={styles.heroImage}
        />
        <div className={styles.contentWrapper}>
          <section
            className={styles.mainText}
            dangerouslySetInnerHTML={{ __html: data.markdownRemark?.html! }}
          ></section>
          <TableOfContents html={data.markdownRemark?.tableOfContents!}></TableOfContents>
        </div>
        <section className={styles.bio}>
          <ProfileCard />
        </section>
        <Giscus />
      </main>
    </>
  );
};

export const query = graphql`
  query Post($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "YY.MM.DD")
        description
        heroImage {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
        heroImageAlt
        tags
        title
      }
      tableOfContents
    }
  }
`;

export const Head = ({ data: { markdownRemark }, location: { pathname } }: HeadProps<Queries.PostQuery>) => {
  const seo = {
    title: markdownRemark?.frontmatter.title,
    description: markdownRemark?.frontmatter.description,
    heroImage: markdownRemark?.frontmatter.heroImage!,
  };

  return (
    <Seo
      title={seo.title}
      description={seo.description}
      heroImage={getSrc(seo.heroImage.childImageSharp?.gatsbyImageData!)}
      pathname={pathname}
    ></Seo>
  );
};

export default BlogPostTemplate;
