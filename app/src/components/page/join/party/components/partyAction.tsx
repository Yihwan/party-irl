import AddGuest from './addGuest';
import CheckInGuest from './checkInGuest';
import SettleGuest from './settleGuest';

const PartyAction = ({ partyData, partyAddress, guestPda, guestData }) => {
  // Guest not added to party
  if (!guestData) {
    return (
      <AddGuest
        partyData={partyData}
        partyAddress={partyAddress}
        guestPda={guestPda}
      />
    );
  }

  // Guest added to party but has not checked in
  if (guestData && !guestData.hasCheckedIn) {
    return (
      <CheckInGuest
        partyData={partyData}
        partyAddress={partyAddress}
        guestPda={guestPda}
      />
    );
  }

  return (
    <SettleGuest
      partyData={partyData}
      partyAddress={partyAddress}
      guestPda={guestPda}
      guestData={guestData}
    />
  );
};

export default PartyAction;
