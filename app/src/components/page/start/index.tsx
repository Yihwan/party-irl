import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import useSolana from 'src/hooks/useSolana';

const Start = () => {
  const { wallet } = useSolana();

  return (
    <div>
      {wallet ? (
        <div style={{ fontFamily: 'Space Mono' }}>START!</div>
      ) : (
        <div>Connect wallet</div>
      )}
      <WalletMultiButton />
    </div>
  );
};

export default Start;
