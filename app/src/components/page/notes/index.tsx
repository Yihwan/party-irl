import Link from 'next/link';
import { Text, Spacer } from '@nextui-org/react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(LocalizedFormat);

const Notes = () => {

  return (
    <>
      <Text h1 css={{ textGradient: '45deg, $blue500 -20%, $pink500 50%' }}>
        Notes
      </Text>
      <Text h4 weight="normal" css={{ maxWidth: '700px'}}>
        Mostly for myself.
      </Text>

      <Spacer y={2} />

      
    </>
  );
};

export default Notes;
