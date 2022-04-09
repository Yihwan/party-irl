import Link from 'next/link';
import { Text, Spacer } from '@nextui-org/react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

const Notes = ({ notes }) => {
  console.log(notes)
  return (
    <>
      <Text h1 css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}>
        Notes
      </Text>
      <Text h4 weight="normal" css={{ maxWidth: '700px'}}>
        Mostly for myself as I dive into web3.
      </Text>

      <Spacer y={2} />

      {notes.map((note, idx) => (
        <div key={`${note.slug}-${idx}`}>
          <Text h2 css={{ maxWidth: '900px' }}>
            <Link href={`/notes/${note.slug}`}>
              {note.frontmatter.title}
            </Link>
          </Text>
          <Text h4 weight="normal" css={{ maxWidth: '700px'}}>{note.frontmatter.metaDesc}</Text>
          <Spacer y={2} />
        </div>
      ))}
    </>
  );
};

export default Notes;
