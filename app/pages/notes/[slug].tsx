import type { NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import { Container } from '@nextui-org/react';

import Layout from 'src/components/layout';

const NotePage: NextPage = ({ frontmatter, content }) => {
  return (
    <div>
      <Head>
        <title>Join a party | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <div style={{ maxWidth: '700px' }}>
          <h2>{frontmatter.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
        </div>
      </Layout>
    </div>
  );
};

export default NotePage;

export async function getStaticPaths() {
  const files = fs.readdirSync('notes');

  const paths = files.map((fileName) => ({
    params: {
      slug: fileName.replace('.md', ''),
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`notes/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content,
    },
  };
}