import { useEffect, useState } from 'react';
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { Provider, Program, Idl } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import idl from '../idl.json';

const PROGRAM_ID = new PublicKey(idl.metadata.address);
const CONNECTION_ENDPOINT='http://127.0.0.1:8899'
const PROVIDER_OPTIONS: { preflightCommitment: "processed" } = {
  preflightCommitment: "processed",
};
type  Maybe<T> = T | null;

const useSolana = () => {
  const connection = new Connection(
    CONNECTION_ENDPOINT,
    PROVIDER_OPTIONS.preflightCommitment
  );
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<Maybe<Program<Idl>>>(null);
  const [provider, setProvider] = useState(null);

  const getProvider = (wallet: AnchorWallet) => new Provider(connection, wallet, PROVIDER_OPTIONS);

  useEffect(() => {
    if (!wallet) {
      return;
    }

    const providerInner = getProvider(wallet);
    const programInner = new Program(idl as Idl, PROGRAM_ID, providerInner);

    setProgram(programInner);
    // @ts-ignore
    setProvider(providerInner);
  }, [wallet]);

  return {
    wallet,
    program,
    provider,
    connection,
  };
}

export default useSolana;