import { useEffect, useState } from 'react';
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Provider, Program, Idl, web3 } from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";

import idl from '../idl.json';

// TODO: Change this to read-only RPC request from connection.
const DUMMY_WALLET = {
  async signTransaction(tx: Transaction) {
    return tx;
  },
  async signAllTransactions(txs: Transaction[]) {
    return txs;
  },
  publicKey: web3.Keypair.generate().publicKey,
}

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

  const getProvider = (wallet: AnchorWallet) => {
    return new Provider(connection, wallet, PROVIDER_OPTIONS)
  };

  useEffect(() => {
    const provider = getProvider(wallet || DUMMY_WALLET);
    const programInner = new Program(idl as Idl, PROGRAM_ID, provider);

    setProgram(programInner);
  }, [wallet]);

  return {
    program,
    connection,
    wallet,
    PROGRAM_ID,
  };
}

export default useSolana;