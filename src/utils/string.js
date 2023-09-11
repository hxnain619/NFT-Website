const bs58 = require("bs58");

const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));

const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

const convertIpfsCidV0ToByte32 = (cid) => {
  const hex = `${bs58.decode(cid).slice(2).toString("hex")}`;
  const base64 = `${bs58.decode(cid).slice(2).toString("base64")}`;

  const buffer = Buffer.from(bs58.decode(cid).slice(2).toString("base64"), "base64");

  return { base64, hex, buffer };
};

export { fromHexString, toHexString, convertIpfsCidV0ToByte32 };
