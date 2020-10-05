import { hexToBytes } from '.';
import { keccak256 as sha3 } from 'js-sha3';
import { recover } from './recoverSignature';
import Cns from '../Cns';
import standardKeys from './standardKeys';
import BN from 'bn.js';

export const isValidTwitterSignature = async ({
  tokenId,
  owner,
  twitterHandle,
  validationSignature,
}: {
  tokenId: string;
  owner: string;
  twitterHandle: string;
  validationSignature: string;
}): Promise<boolean> => {
  const tokenIdInDecimals = fromHexStringToDecimals(tokenId);
  const message = [
    tokenIdInDecimals,
    owner,
    standardKeys.twitter_username,
    twitterHandle,
  ]
    .map((value: string) => '0x' + sha3(value.startsWith('0x') ? hexToBytes(value) : value))
    .reduce((message, hashedValue) => message + hashedValue, '');
  const signerAddress = recover(message, validationSignature);
  return signerAddress === Cns.TwitterVerificationAddress;
};

const fromHexStringToDecimals = (value: string): string => {
  if (value.startsWith('0x')) {
    const valueWithoutPrefix = value.slice(2, value.length);
    const bn = new BN(valueWithoutPrefix, 16);
    return bn.toString(10);
  }

  return value;
};
