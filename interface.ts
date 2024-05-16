import { BigNumberish } from "ethers"

export type NitroPoolDetails = {
  tvl: number
  pendingRewards: {
      pending1: number
      pending2: number
  }
  settings: {
      startTime: BigNumberish
      endTime: BigNumberish
      harvestStartTime: BigNumberish
      depositEndTime: BigNumberish
      lockDurationReq: BigNumberish
      lockEndReq: BigNumberish
      depositAmountReq: BigNumberish
      whitelist: boolean
      description: string
  }
  rewardsPerSecond: number
  lpTokenBalance: number
  userInfo: {
      totalDepositAmount: BigNumberish
      rewardDebtToken1: BigNumberish
      rewardDebtToken2: BigNumberish
      pendingRewardsToken1: BigNumberish
      pendingRewardsToken2: BigNumberish
  } | null
  rewardTokens: {
      address: string
      symbol: string
  }[]
  apy: number
  collateralTokens: {
      symbol: string
      balance: number
      address: string
      price: number
  }[]
}