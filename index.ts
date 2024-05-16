import { ethers, BigNumberish, formatUnits } from 'ethers';

import AlgebraPool from './abis/AlgebraPool.json';
import CamelotNitroPool from './abis/CamelotNitroPool.json';
import CamelotPool from './abis/CamelotPool.json';
import DefiEdgeTwapStrategy from './abis/DefiEdgeTwapStrategy.json';
import ERC20 from './abis/ERC20.json';
import NFTPool from './abis/NFTPool.json';
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

  return {
    collateralTokens, 
    userInfo
  }
}