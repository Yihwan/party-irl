import type { NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import matter from 'gray-matter';

import Layout from 'src/components/layout';
import Notes from 'src/components/page/notes';

const NotesPage: NextPage = ({ notes }) => {

  return (
    <div>
      <Head>
        <title>Notes | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <Notes notes={notes} />
      </Layout>
    </div>
  );
};

export async function getStaticProps() {
  const files = fs.readdirSync('notes');

  const notes = files.map((fileName) => {
    const slug = fileName.replace('.md', '');
    const readFile = fs.readFileSync(`notes/${fileName}`, 'utf-8');
    const { data: frontmatter } = matter(readFile);
    
    return {
      slug,
      frontmatter,
    };
  });

  return {
    props: {
      notes,
    },
  };
}

export default NotesPage;
