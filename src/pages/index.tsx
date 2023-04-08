import React, { useEffect, useState } from 'react';
import type { HeadProps, PageProps } from 'gatsby';
import { graphql } from 'gatsby';
import * as styles from './index.module.css';
import { ArticleCard, ArticleItem, FloatingButton, ProfileCard, Seo, Tag, TagButton } from '@components';
import { TYPO } from '@styles';

const IndexPage = ({ data }: PageProps<Queries.IndexQuery>) => {
  const allPosts = data.allMarkdownRemark.nodes;
  const recentPosts = allPosts.slice(0, 2);
  const sortedTagsWithTotalCount = [
    { fieldValue: 'All', totalCount: data.allMarkdownRemark.totalCount },
    ...data.allMarkdownRemark.group,
  ].sort((a, b) => b.totalCount - a.totalCount);

  const [selectedTag, setSelectedTag] = useState<string>('All');
  const filteredPosts = allPosts.filter(
    ({ frontmatter: { tags } }) => selectedTag === 'All' || tags.includes(selectedTag)
  );

  const [displayedItems, setDisplayedItems] = useState(8);
  const visiblePosts = filteredPosts.slice(0, displayedItems);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;

        if (displayedItems <= data.allMarkdownRemark.totalCount) {
          setDisplayedItems((prev) => prev + 8);
        } else {
          observer.disconnect();
        }
      },
      { threshold: 0 }
    );
    observer.observe(document.querySelector('footer') as HTMLElement);
    return () => observer.disconnect();
  }, [displayedItems]);

  return (
    <>
      <main className={styles.main}>
        <aside className={styles.aside}>
          <ProfileCard />
        </aside>
        <div className={styles.shrinkSpace}></div>
        <section className={styles.wrapper}>
          <h2 style={TYPO.T2} className={styles.heading}>
            New posts 📑
          </h2>
          <ul className={styles.articleRowList}>
            {recentPosts.map(
              ({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageAlt }, id }) => (
                <ArticleCard
                  key={id}
                  title={title}
                  description={description}
                  date={date}
                  tags={tags}
                  slug={slug}
                  heroImage={heroImage?.childImageSharp?.gatsbyImageData!}
                  heroImageAlt={heroImageAlt}
                />
              )
            )}
          </ul>
          <hr className={styles.divider}></hr>
          <ul className={styles.tagList}>
            {sortedTagsWithTotalCount.map(({ fieldValue, totalCount }) => (
              <li key={fieldValue!} className={styles.tagItem}>
                <TagButton
                  name={fieldValue!}
                  count={totalCount}
                  onClick={() => {
                    setSelectedTag(fieldValue!);
                  }}
                  isSelected={selectedTag === fieldValue!}
                />
              </li>
            ))}
          </ul>
          <ul className={styles.articleList}>
            {visiblePosts.map(
              ({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageAlt }, id }) => (
                <ArticleItem
                  key={id}
                  title={title}
                  description={description}
                  date={date}
                  tags={tags}
                  slug={slug}
                  heroImage={heroImage?.childImageSharp?.gatsbyImageData!}
                  heroImageAlt={heroImageAlt}
                />
              )
            )}
          </ul>
        </section>
        <FloatingButton />
      </main>
    </>
  );
};

export const query = graphql`
  query Index {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      totalCount
      nodes {
        frontmatter {
          tags
          slug
          description
          date(formatString: "YY.MM.DD")
          title
          heroImage {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED)
            }
          }
          heroImageAlt
        }
        id
      }
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    site {
      siteMetadata {
        siteUrl
        description
        title
        keywords
      }
    }
    file(relativePath: { eq: "blogImage.png" }) {
      publicURL
    }
  }
`;

export default IndexPage;

export const Head = ({ location: { pathname }, data: { site, file } }: HeadProps<Queries.IndexQuery>) => {
  const seo = {
    title: site?.siteMetadata.title,
    description: site?.siteMetadata.description,
    heroImage: file?.publicURL!,
  };

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname}></Seo>;
};
