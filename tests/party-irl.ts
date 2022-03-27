import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PartyIrl } from "../target/types/party_irl";

describe("party-irl", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.PartyIrl as Program<PartyIrl>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
