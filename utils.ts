import { BigNumberish, formatUnits } from 'ethers';

export const SECONDS_IN_YEAR = 31536000

export function fromBigNumber(number: BigNumberish, decimals: number = 18): number {
  return parseFloat(formatUnits(number.toString(), decimals))
}