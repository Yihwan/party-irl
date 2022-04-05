import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { assert, expect } from "chai";
import { PartyIrl } from "../target/types/party_irl";
import dayjs from 'dayjs';

const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;

const DEFAULT_PARTY_NAME = 'Test Party Name';
const DEFAULT_PARTY_AT = dayjs().add(24, 'hour').unix();
const DEFAULT_CHECK_IN_ENDS_AT = dayjs().add(25, 'hour').unix();
const DEFAULT_STAKE_IN_LAMPORTS = 1 * LAMPORTS_PER_SOL;
const DEFAULT_MAXIMUM_GUESTS = 4;

describe("party-irl", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const mainPublicKey = anchor.getProvider().wallet.publicKey;
  const mainProgram = anchor.workspace.PartyIrl as Program<PartyIrl>;
  
  it('can create a party', async () => {
    const party = await createParty();
    const partyAccount = await mainProgram.account.party.fetch(party.publicKey);

    assert.equal(partyAccount.name, DEFAULT_PARTY_NAME);
    assert.equal(partyAccount.partyAt.toNumber(), DEFAULT_PARTY_AT);
    assert.equal(partyAccount.checkInEndsAt.toNumber(), DEFAULT_CHECK_IN_ENDS_AT);
    assert.equal(partyAccount.stakeInLamports.toNumber(), DEFAULT_STAKE_IN_LAMPORTS);
    assert.equal(partyAccount.creator.toBase58(), mainPublicKey.toBase58());
    assert.equal(partyAccount.addedGuestsCount, 0);
    assert.equal(partyAccount.checkedInGuestsCount, 0);
  });

  it('cannot create a party with a name longer than 64 chars', async () => {
    try {
      await createParty({ name: 'x'.repeat(65) });
    } catch({ error }) {
        assert.equal(error.errorCode.code, 'PartyNameTooLong');
        return;
    }

    assert.fail('The instruction should have failed.');
  });

  it('cannot create a party that starts in the past', async () => {
    try {
      await createParty({ partyAt: 1649105580 });
    } catch({ error }) {
        assert.equal(error.errorCode.code, 'PartyAtInThePast');
        return;
    }

    assert.fail('The instruction should have failed.');
  });

  it('cannot create a party with a check-in time less than 5 min', async () => {
    try {
      await createParty({ 
        partyAt: dayjs().add(60, 'min').unix(), 
        checkInEndsAt: dayjs().add(61, 'min').unix(),
      });
    } catch({ error }) {
        assert.equal(error.errorCode.code, 'CheckInTimeTooShort');
        return;
    }

    assert.fail('The instruction should have failed.');
  });

  it('can add guest to an upcoming party', async () => {
    const guest = await createUser();

    const party = await createParty();
    const initialPartyBalance = await getAccountBalance(party.publicKey);
    
    const guestPda = await addGuest({ party, guest });
    const partyBalanceAfterAddingGuest = await getAccountBalance(party.publicKey);

    const guestAccount = await mainProgram.account.guest.fetch(guestPda);
    const partyAccount = await mainProgram.account.party.fetch(party.publicKey);

    assert.equal(guestAccount.party.toBase58(), party.publicKey.toBase58());
    assert.equal(guestAccount.guestAuthority.toBase58(), guest.key.publicKey.toBase58());
    assert.isFalse(guestAccount.hasCheckedIn);
    assert.isFalse(guestAccount.hasSettledStake);
    assert.equal(partyAccount.addedGuestsCount, 1);
  
    assert.equal(partyBalanceAfterAddingGuest - initialPartyBalance, DEFAULT_STAKE_IN_LAMPORTS);
  });

  it('cannot add guest other than self', async () => {
    try {
      const guest = await createUser();
      const rando = await createUser(); 

      const party = await createParty();

      const [guestAccount] = await anchor.web3.PublicKey.findProgramAddress(
        ['guest', party.publicKey.toBytes(), guest.key.publicKey.toBytes()],
        mainProgram.programId
      );

      const program = programForUser(guest);

      await program.rpc.addGuest({
        accounts: {
          party: party.publicKey,
          guest: guestAccount,
          guestAuthority: rando.key.publicKey,
          systemProgram: SystemProgram.programId,
        }
      });
    } catch {
      return;
    }

    assert.fail('The instruction should have failed.');
  })

  it('can check in a guest', async () => {
    const guest = await createUser();
    const party = await createParty({
      partyAt: dayjs().unix(),
      checkInEndsAt: dayjs().add(2, 'hour').unix(),
    }); 
    const guestPda = await addGuest({ party, guest }); 

    const program = programForUser(guest);

    await program.rpc.checkInGuest({
      accounts: {
        guest: guestPda,
        party: party.publicKey,
        guestAuthority: guest.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    });

    const guestAccount = await mainProgram.account.guest.fetch(guestPda);
    const partyAccount = await mainProgram.account.party.fetch(party.publicKey);

    assert.equal(guestAccount.hasCheckedIn, true);
    assert.equal(partyAccount.addedGuestsCount, 1);
    assert.equal(partyAccount.checkedInGuestsCount, 1);
  });

  it('cannot check in on behalf of another guest', async () => {
    try {
      const guest = await createUser();
      const rando = await createUser();
      const party = await createParty(); 
      const guestPda = await addGuest({ party, guest }); 

      const program = programForUser(guest);

      await program.rpc.checkInGuest({
        accounts: {
          guest: guestPda,
          party: party.publicKey,
          guestAuthority: rando.key.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });

      const guestAccount = await mainProgram.account.guest.fetch(guestPda);

      assert.equal(guestAccount.hasCheckedIn, true);
    } catch {
      return;
    }

    assert.fail('The instruction should have failed.');
  });

  // TODO: Simulate system times, ran various settle scenarios manually for now.
  // it('can settle guest', async () => {
  //   const guest = await createUser();
  //   const rando = await createUser();
  //   const party = await createParty({
  //     partyAt: dayjs().unix(),
  //     checkInEndsAt: dayjs().add(10, 'minute').unix(),
  //   }); 
  //   const guestPda = await addGuest({ party, guest }); 

  //   console.log('startGuestBalance', await getAccountBalance(guest.key.publicKey))
  //   console.log('startPartyBalance', await getAccountBalance(party.publicKey))

  //   const program = programForUser(guest);

  //   await program.rpc.checkInGuest({
  //     accounts: {
  //       guest: guestPda,
  //       party: party.publicKey,
  //       guestAuthority: guest.key.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //   });

  //   await program.rpc.settleGuest({
  //     accounts: {
  //       guest: guestPda,
  //       party: party.publicKey,
  //       guestAuthority: guest.key.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //   });
  //   await program.rpc.settleGuest({
  //     accounts: {
  //       guest: guestPda,
  //       party: party.publicKey,
  //       guestAuthority: guest.key.publicKey,
  //       systemProgram: anchor.web3.SystemProgram.programId,
  //     },
  //   });

  //   const guestAccount = await mainProgram.account.guest.fetch(guestPda);
  //   const partyAccount = await mainProgram.account.party.fetch(party.publicKey);

  //   console.log('endPartyBalance', await getAccountBalance(party.publicKey))
  //   console.log('endGuestBalance', await getAccountBalance(guest.key.publicKey))
    
  //   assert.equal(guestAccount.hasCheckedIn, true);
  //   assert.equal(guestAccount.hasSettledStake, true);
  //   assert.equal(partyAccount.addedGuestsCount, 1);
  //   // assert.equal(partyAccount.checkedInGuestsCount, 1);
  // });

  const createParty = async ({
    name = DEFAULT_PARTY_NAME,
    maximumGuests = DEFAULT_MAXIMUM_GUESTS,
    partyAt = DEFAULT_PARTY_AT,
    checkInEndsAt = DEFAULT_CHECK_IN_ENDS_AT,
    stakeInLamports = DEFAULT_STAKE_IN_LAMPORTS,
  } = {}) => {
    const party = anchor.web3.Keypair.generate();

    await mainProgram.rpc.createParty(
      name,
      maximumGuests,
      new anchor.BN(partyAt),
      new anchor.BN(checkInEndsAt),
      new anchor.BN(stakeInLamports),
      {
        accounts: {
          party: party.publicKey,
          creator: mainPublicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [party],
      },
    )

    return party;
  }

  const addGuest = async ({ party, guest }) => {
    const program = programForUser(guest);

    const [guestPda] = await anchor.web3.PublicKey.findProgramAddress(
      ['guest', party.publicKey.toBytes(), guest.key.publicKey.toBytes()],
      program.programId
    );

    await program.rpc.addGuest({
      accounts: {
        party: party.publicKey,
        guest: guestPda,
        guestAuthority: guest.key.publicKey,
        systemProgram: SystemProgram.programId,
      }, 
    });

    return guestPda;
  }

  const programForUser = (user) => (
    new anchor.Program(mainProgram.idl, mainProgram.programId, user.provider)
  );

  const createUser = async (airdropBalance = 10 * LAMPORTS_PER_SOL) =>{
    let user = anchor.web3.Keypair.generate();
    let sig = await provider.connection.requestAirdrop(user.publicKey, airdropBalance);
    await provider.connection.confirmTransaction(sig);

    let wallet = new anchor.Wallet(user);
    let userProvider = new anchor.Provider(provider.connection, wallet, provider.opts);

    return {
      key: user,
      wallet,
      provider: userProvider,
    };
  }

  async function getAccountBalance(pubkey) {
    let account = await provider.connection.getAccountInfo(pubkey);
    return account?.lamports ?? 0;
  }

  function expectBalance(actual, expected, message, slack = 20000) {
    expect(actual, message).within(expected - slack, expected + slack);
  }
});
