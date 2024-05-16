import { ethers } from 'ethers';

import CamelotNitroPool from './abis/CamelotNitroPool.json';
import CamelotPool from './abis/CamelotPool.json';
import ERC20 from './abis/ERC20.json';
import { fromBigNumber } from './utils';

const getContract = (address, abi) => {
  return new ethers.Contract(address, abi, new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'))
}

const fetchUserPoolDetails = async (poolAddress: string, nitroPoolAddress: string, userAddress: string) => {
  // Fetch both pools
  const camelotNitroPool = getContract(nitroPoolAddress, CamelotNitroPool)
  const camelotPool = getContract(poolAddress, CamelotPool)
  // Fetch collateral tokens for pools
  const collateral0 = await camelotPool.token0()
  const collateral1 = await camelotPool.token1()
  const collateral0Contract = getContract(collateral0, ERC20.abi)
  const collateral1Contract = getContract(collateral1, ERC20.abi)

  // 
  const response = await fetch('https://api.camelot.exchange/nitros')
  const res = await response.json()
  const tvlUSD = res.data.nitros[nitroPoolAddress] ?? 0

  const collateralTokens = [
    {
      symbol: await collateral0Contract.symbol(),
      userBalance: fromBigNumber(await collateral0Contract.balanceOf(userAddress)),
      nitroPoolBalance: fromBigNumber(await collateral0Contract.balanceOf(nitroPoolAddress)),
      poolBalance: fromBigNumber(await collateral0Contract.balanceOf(poolAddress)),
      address: collateral0,
    },
    {
      symbol: await collateral1Contract.symbol(),
      userBalance: fromBigNumber(await collateral1Contract.balanceOf(userAddress)),
      nitroPoolBalance: fromBigNumber(await collateral1Contract.balanceOf(nitroPoolAddress)),
      poolBalance: fromBigNumber(await collateral1Contract.balanceOf(poolAddress)),
      address: collateral1,
    }
  ]
    
  const userInfo = await camelotNitroPool.userInfo(userAddress)
  const userDepositAmount = fromBigNumber(userInfo.totalDepositAmount)
  const totalDepositAmount = fromBigNumber(await camelotNitroPool.totalDepositAmount())
  // What percentage of the pool does the user own?
  const userPoolPercentage = userDepositAmount / totalDepositAmount * 100
  const userDollarValue = (userPoolPercentage / 100) * tvlUSD;
  console.log(
    collateralTokens, 
    userInfo,
    userDepositAmount,
    totalDepositAmount,
    userPoolPercentage,
    userDollarValue,
  )
  return {
    collateralTokens, 
    userInfo,
    userDepositAmount,
    totalDepositAmount,
    userPoolPercentage,
    userDollarValue,
  }
}

fetchUserPoolDetails('0x824959a55907d5350e73e151Ff48DabC5A37a657', '0x53F973256F410d1D8b10ce72D03D8dBBD3b1066E', '0xb919e09bb077013d5f93c898dafcc1d0c75559fe')