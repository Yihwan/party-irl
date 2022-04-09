import type { NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import matter from 'gray-matter';

import Layout from 'src/components/layout';

const NotesPage: NextPage = ({ notes }) => {
  console.log(notes)
  return (
    <div>
      <Head>
        <title>Join a party | partyIRL</title>
        <link rel="icon" href="/balloon_favicon.png" />
      </Head>

      <Layout>
        <h1>Inspiration for partyIRL</h1>
        <p>asddsa</p>
        <p>asddsa</p>
        <p>asddsa</p>
        <p>asddsa</p>

        <code>asd</code>
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
