export const shortenString = (string: String) =>
  `${string.slice(0, 4)}...${string.slice(string.length - 4, string.length)}`;
