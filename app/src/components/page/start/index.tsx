import {
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useAnchorWallet } from "@solana/wallet-adapter-react";

const Start = () => {
  const wallet = useAnchorWallet();

  return(
    <div>
      {wallet ? <div style={{ fontFamily: 'Space Mono'}}>START!</div> : <div>Connect wallet</div>}
      <WalletMultiButton />
    </div>
  );
}

export default Start;