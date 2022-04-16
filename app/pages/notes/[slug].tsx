import type { NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import { Text, Spacer } from '@nextui-org/react';
import dayjs from 'dayjs';

import Layout from 'src/components/layout';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

const NotePage: NextPage = ({ frontmatter, content }) => {
  const { title, metaTitle, metaDesc, publishedAt } = frontmatter;

  return (
    <div>
      <Head>
        <title>{metaTitle || title} | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
        {metaDesc && <meta name="description" content={metaDesc} />}
      </Head>

      <Layout>
        <div>
          <Text h2 css={{ maxWidth: '900px' }}>
            {title}
          </Text>
          <Text h4 weight="normal">
            {dayjs(publishedAt).format('LL')} by{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://twitter.com/yihwan`}
            >
              yihwan
            </a>
            .
          </Text>

          <Spacer y={2} />
          <div
            style={{ maxWidth: '700px' }}
            dangerouslySetInnerHTML={{ __html: md().render(content) }}
          />
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
      slug: fileName.replace('.md', '')
    }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params: { slug } }) {
  const fileName = fs.readFileSync(`notes/${slug}.md`, 'utf-8');
  const { data: frontmatter, content } = matter(fileName);
  return {
    props: {
      frontmatter,
      content
    }
  };
}
