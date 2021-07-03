import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { Team } from 'config/constants/types'
import Nfts from 'config/constants/nfts'
import { getWeb3NoAccount } from 'utils/web3'
import { getBalanceAmount, getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from 'hooks/useRefresh'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import {
  fetchFarmsPublicDataAsync,
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchCakeVaultPublicData,
  fetchCakeVaultUserData,
  fetchCakeVaultFees,
  setBlock,
} from './actions'
import { State, Farm, Pool, ProfileState, TeamsState, AchievementState, PriceState, FarmsState } from './types'
import { fetchProfile } from './profile'
import { fetchTeam, fetchTeams } from './teams'
import { fetchAchievements } from './achievements'
import { fetchPrices } from './prices'
import { fetchWalletNfts } from './collectibles'
import { getCanClaim } from './bnbpredictions/helpers'
import { transformPool } from './pools/helpers'
import { fetchPoolsStakingLimitsAsync } from './pools'
import { QuoteToken } from '../config/constants/types'

export const useFetchPublicData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()
  const web3 = getWeb3NoAccount()
  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }
    dispatch(fetchFarmsPublicDataAsync())
    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh, web3])

  useEffect(() => {
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      dispatch(setBlock(blockNumber))
    }, 6000)

    return () => clearInterval(interval)
  }, [dispatch, web3])
}

// Farms

export const useFarms = (): FarmsState => {
  const farms = useSelector((state: State) => state.farms)
  return farms
}

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.pid === pid))
  return farm
}

export const useFarmFromLpSymbol = (lpSymbol: string): Farm => {
  const farm = useSelector((state: State) => state.farms.data.find((f) => f.lpSymbol === lpSymbol))
  return farm
}

export const useFarmUser = (pid) => {
  const farm = useFarmFromPid(pid)

  return {
    allowance: farm.userData ? new BigNumber(farm.userData.allowance) : BIG_ZERO,
    tokenBalance: farm.userData ? new BigNumber(farm.userData.tokenBalance) : BIG_ZERO,
    stakedBalance: farm.userData ? new BigNumber(farm.userData.stakedBalance) : BIG_ZERO,
    earnings: farm.userData ? new BigNumber(farm.userData.earnings) : BIG_ZERO,
  }
}

// Return a farm for a given token symbol. The farm is filtered based on attempting to return a farm with a quote token from an array of preferred quote tokens
export const useFarmFromTokenSymbol = (tokenSymbol: string, preferredQuoteTokens?: string[]): Farm => {
  const farms = useSelector((state: State) => state.farms.data.filter((farm) => farm.token.symbol === tokenSymbol))
  const filteredFarm = filterFarmsByQuoteToken(farms, preferredQuoteTokens)
  return filteredFarm
}

export const useBusdPriceFromPid = (pid: number): BigNumber => {
  const farm = useFarmFromPid(pid)
  const bnbPriceBusd = usePriceBnbBusd()
  const quoteTokenFarm = useFarmFromTokenSymbol(farm?.quoteToken?.symbol)

  // Catch in case a farm isn't found
  if (!farm) {
    return null
  }

  // With a quoteToken of BUSD or wBNB, it is straightforward to return the token price.
  if (farm.quoteToken.symbol === 'BUSD') {
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === 'wBNB') {
    return bnbPriceBusd.gt(0) ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or wBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC
  // we find the pBTC farm (pBTC - BNB)'s quote token - BNB
  // from the BNB - pBTC BUSD price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === 'wBNB') {
    const quoteTokenInBusd = bnbPriceBusd.gt(0) && bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return farm.tokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === 'BUSD') {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return quoteTokenInBusd ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd) : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/wBNB quoteToken
  return BIG_ZERO
}

export const useBusdPriceFromToken = (tokenSymbol: string): BigNumber | null => {
  const tokenFarmForPriceCalc = useFarmFromTokenSymbol(tokenSymbol)
  const tokenPrice = useBusdPriceFromPid(tokenFarmForPriceCalc?.pid)
  return tokenPrice
}

export const useLpTokenPrice = (symbol: string) => {
  const farm = useFarmFromLpSymbol(symbol)
  const farmTokenPriceInUsd = useBusdPriceFromPid(farm.pid)
  let lpTokenPrice = BIG_ZERO

  if (farm.lpTotalSupply && farm.lpTotalInQuoteToken) {
    // Total value of base token in LP
    const valueOfBaseTokenInFarm = farmTokenPriceInUsd.times(farm.tokenAmountTotal)
    // Double it to get overall value in LP
    const overallValueOfAllTokensInFarm = valueOfBaseTokenInFarm.times(2)
    // Divide total value of all tokens, by the number of LP tokens
    const totalLpTokens = getBalanceAmount(farm.lpTotalSupply)
    lpTokenPrice = overallValueOfAllTokensInFarm.div(totalLpTokens)
  }

  return lpTokenPrice
}

// Pools

export const usePools = (account): Pool[] => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const pools = useSelector((state: State) => state.pools.data)
  return pools.map(transformPool)
}

export const usePoolFromPid = (sousId: number): Pool => {
  const pool = useSelector((state: State) => state.pools.data.find((p) => p.sousId === sousId))
  return transformPool(pool)
}

export const useFetchCakeVault = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchCakeVaultPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchCakeVaultUserData({ account }))
  }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchCakeVaultFees())
  }, [dispatch])
}

export const useCakeVault = () => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalCakeInVault: totalCakeInVaultAsString,
    estimatedCakeBountyReward: estimatedCakeBountyRewardAsString,
    totalPendingCakeHarvest: totalPendingCakeHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      cakeAtLastUserAction: cakeAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => state.pools.cakeVault)

  const estimatedCakeBountyReward = useMemo(() => {
    return new BigNumber(estimatedCakeBountyRewardAsString)
  }, [estimatedCakeBountyRewardAsString])

  const totalPendingCakeHarvest = useMemo(() => {
    return new BigNumber(totalPendingCakeHarvestAsString)
  }, [totalPendingCakeHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalCakeInVault = useMemo(() => {
    return new BigNumber(totalCakeInVaultAsString)
  }, [totalCakeInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const cakeAtLastUserAction = useMemo(() => {
    return new BigNumber(cakeAtLastUserActionAsString)
  }, [cakeAtLastUserActionAsString])

  return {
    totalShares,
    pricePerFullShare,
    totalCakeInVault,
    estimatedCakeBountyReward,
    totalPendingCakeHarvest,
    fees: {
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      cakeAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}

// Profile

export const useFetchProfile = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProfile(account))
  }, [account, dispatch])
}

export const useProfile = () => {
  const { isInitialized, isLoading, data, hasRegistered }: ProfileState = useSelector((state: State) => state.profile)
  return { profile: data, hasProfile: isInitialized && hasRegistered, isInitialized, isLoading }
}

// Teams

export const useTeam = (id: number) => {
  const team: Team = useSelector((state: State) => state.teams.data[id])
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeam(id))
  }, [id, dispatch])

  return team
}

export const useTeams = () => {
  const { isInitialized, isLoading, data }: TeamsState = useSelector((state: State) => state.teams)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTeams())
  }, [dispatch])

  return { teams: data, isInitialized, isLoading }
}

// Achievements

export const useFetchAchievements = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (account) {
      dispatch(fetchAchievements(account))
    }
  }, [account, dispatch])
}

export const useAchievements = () => {
  const achievements: AchievementState['data'] = useSelector((state: State) => state.achievements.data)
  return achievements
}

// Prices
export const useFetchPriceList = () => {
  const { slowRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchPrices())
  }, [dispatch, slowRefresh])
}

export const useGetApiPrices = () => {
  const prices: PriceState['data'] = useSelector((state: State) => state.prices.data)
  return prices
}

export const useGetApiPrice = (address: string) => {
  const prices = useGetApiPrices()

  if (!prices) {
    return null
  }

  return prices[address.toLowerCase()]
}

export const usePriceBnbBusd = (): BigNumber => {
  const bnbBusdFarm = useFarmFromPid(3)
  return bnbBusdFarm.tokenPriceVsQuote ? new BigNumber(1).div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO
}

export const usePriceCakeBusd = (): BigNumber => {
  const cakeBnbFarm = useFarmFromPid(1)
  const bnbBusdPrice = usePriceBnbBusd()

  const cakeBusdPrice = cakeBnbFarm.tokenPriceVsQuote ? bnbBusdPrice.times(cakeBnbFarm.tokenPriceVsQuote) : BIG_ZERO

  return cakeBusdPrice
}

// Block
export const useBlock = () => {
  return useSelector((state: State) => state.block)
}

export const useInitialBlock = () => {
  return useSelector((state: State) => state.block.initialBlock)
}

// Predictions bnb
export const useBnbIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.bnbpredictions.isHistoryPaneOpen)
}

export const useBnbIsChartPaneOpen = () => {
  return useSelector((state: State) => state.bnbpredictions.isChartPaneOpen)
}

export const useBnbGetRounds = () => {
  return useSelector((state: State) => state.bnbpredictions.rounds)
}

export const useBnbGetSortedRounds = () => {
  const roundData = useBnbGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useBnbGetCurrentEpoch = () => {
  return useSelector((state: State) => state.bnbpredictions.currentEpoch)
}

export const useBnbGetIntervalBlocks = () => {
  return useSelector((state: State) => state.bnbpredictions.intervalBlocks)
}

export const useBnbGetBufferBlocks = () => {
  return useSelector((state: State) => state.bnbpredictions.bufferBlocks)
}

export const useBnbGetTotalIntervalBlocks = () => {
  const intervalBlocks = useBnbGetIntervalBlocks()
  const bufferBlocks = useBnbGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useBnbGetRound = (id: string) => {
  const rounds = useBnbGetRounds()
  return rounds[id]
}

export const useBnbGetCurrentRound = () => {
  const currentEpoch = useBnbGetCurrentEpoch()
  const rounds = useBnbGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useBnbGetPredictionsStatus = () => {
  return useSelector((state: State) => state.bnbpredictions.status)
}

export const useBnbGetHistoryFilter = () => {
  return useSelector((state: State) => state.bnbpredictions.historyFilter)
}

export const useBnbGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.bnbpredictions.currentRoundStartBlockNumber)
}

export const useBnbGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.bnbpredictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useBnbGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.bnbpredictions.isFetchingHistory)
}

export const useBnbGetHistory = () => {
  return useSelector((state: State) => state.bnbpredictions.history)
}

export const useBnbGetHistoryByAccount = (account: string) => {
  const bets = useBnbGetHistory()
  return bets ? bets[account] : []
}

export const useBnbGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.bnbpredictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

export const useBnbBetCanClaim = (account: string, roundId: string) => {
  const bet = useBnbGetBetByRoundId(account, roundId)

  if (!bet) {
    return false
  }

  return getCanClaim(bet)
}

export const useBnbGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.bnbpredictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
}

//  Predictionsdoge
export const useDogeIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.dogepredictions.isHistoryPaneOpen)
}

export const useDogeIsChartPaneOpen = () => {
  return useSelector((state: State) => state.dogepredictions.isChartPaneOpen)
}

export const useDogeGetRounds = () => {
  return useSelector((state: State) => state.dogepredictions.rounds)
}

export const useDogeGetSortedRounds = () => {
  const roundData = useDogeGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useDogeGetCurrentEpoch = () => {
  return useSelector((state: State) => state.dogepredictions.currentEpoch)
}

export const useDogeGetIntervalBlocks = () => {
  return useSelector((state: State) => state.dogepredictions.intervalBlocks)
}

export const useDogeGetBufferBlocks = () => {
  return useSelector((state: State) => state.dogepredictions.bufferBlocks)
}

export const useDogeGetTotalIntervalBlocks = () => {
  const intervalBlocks = useDogeGetIntervalBlocks()
  const bufferBlocks = useDogeGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useDogeGetRound = (id: string) => {
  const rounds = useDogeGetRounds()
  return rounds[id]
}

export const useDogeGetCurrentRound = () => {
  const currentEpoch = useDogeGetCurrentEpoch()
  const rounds = useDogeGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useDogeGetPredictionsStatus = () => {
  return useSelector((state: State) => state.dogepredictions.status)
}

export const useDogeGetHistoryFilter = () => {
  return useSelector((state: State) => state.dogepredictions.historyFilter)
}

export const useDogeGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.dogepredictions.currentRoundStartBlockNumber)
}

export const useDogeGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.dogepredictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useDogeGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.dogepredictions.isFetchingHistory)
}

export const useDogeGetHistory = () => {
  return useSelector((state: State) => state.dogepredictions.history)
}

export const useDogeGetHistoryByAccount = (account: string) => {
  const bets = useDogeGetHistory()
  return bets ? bets[account] : []
}

export const useDogeGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.dogepredictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

export const useDogeBetCanClaim = (account: string, roundId: string) => {
  const bet = useDogeGetBetByRoundId(account, roundId)

  if (!bet) {
    return false
  }

  return getCanClaim(bet)
}

export const useDogeGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.dogepredictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
}




//  Predictionsbtc
export const useBtcIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.btcpredictions.isHistoryPaneOpen)
}

export const useBtcIsChartPaneOpen = () => {
  return useSelector((state: State) => state.btcpredictions.isChartPaneOpen)
}

export const useBtcGetRounds = () => {
  return useSelector((state: State) => state.btcpredictions.rounds)
}

export const useBtcGetSortedRounds = () => {
  const roundData = useBtcGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useBtcGetCurrentEpoch = () => {
  return useSelector((state: State) => state.btcpredictions.currentEpoch)
}

export const useBtcGetIntervalBlocks = () => {
  return useSelector((state: State) => state.btcpredictions.intervalBlocks)
}

export const useBtcGetBufferBlocks = () => {
  return useSelector((state: State) => state.btcpredictions.bufferBlocks)
}

export const useBtcGetTotalIntervalBlocks = () => {
  const intervalBlocks = useBtcGetIntervalBlocks()
  const bufferBlocks = useBtcGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useBtcGetRound = (id: string) => {
  const rounds = useBtcGetRounds()
  return rounds[id]
}

export const useBtcGetCurrentRound = () => {
  const currentEpoch = useBtcGetCurrentEpoch()
  const rounds = useBtcGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useBtcGetPredictionsStatus = () => {
  return useSelector((state: State) => state.btcpredictions.status)
}

export const useBtcGetHistoryFilter = () => {
  return useSelector((state: State) => state.btcpredictions.historyFilter)
}

export const useBtcGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.btcpredictions.currentRoundStartBlockNumber)
}

export const useBtcGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.btcpredictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useBtcGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.btcpredictions.isFetchingHistory)
}

export const useBtcGetHistory = () => {
  return useSelector((state: State) => state.btcpredictions.history)
}

export const useBtcGetHistoryByAccount = (account: string) => {
  const bets = useBtcGetHistory()
  return bets ? bets[account] : []
}

export const useBtcGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.btcpredictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

export const useBtcBetCanClaim = (account: string, roundId: string) => {
  const bet = useBtcGetBetByRoundId(account, roundId)

  if (!bet) {
    return false
  }

  return getCanClaim(bet)
}

export const useBtcGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.btcpredictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
}










//  Predictionseth
export const useEthIsHistoryPaneOpen = () => {
  return useSelector((state: State) => state.ethpredictions.isHistoryPaneOpen)
}

export const useEthIsChartPaneOpen = () => {
  return useSelector((state: State) => state.ethpredictions.isChartPaneOpen)
}

export const useEthGetRounds = () => {
  return useSelector((state: State) => state.ethpredictions.rounds)
}

export const useEthGetSortedRounds = () => {
  const roundData = useEthGetRounds()
  return orderBy(Object.values(roundData), ['epoch'], ['asc'])
}

export const useEthGetCurrentEpoch = () => {
  return useSelector((state: State) => state.ethpredictions.currentEpoch)
}

export const useEthGetIntervalBlocks = () => {
  return useSelector((state: State) => state.ethpredictions.intervalBlocks)
}

export const useEthGetBufferBlocks = () => {
  return useSelector((state: State) => state.ethpredictions.bufferBlocks)
}

export const useEthGetTotalIntervalBlocks = () => {
  const intervalBlocks = useEthGetIntervalBlocks()
  const bufferBlocks = useEthGetBufferBlocks()
  return intervalBlocks + bufferBlocks
}

export const useEthGetRound = (id: string) => {
  const rounds = useEthGetRounds()
  return rounds[id]
}

export const useEthGetCurrentRound = () => {
  const currentEpoch = useEthGetCurrentEpoch()
  const rounds = useEthGetSortedRounds()
  return rounds.find((round) => round.epoch === currentEpoch)
}

export const useEthGetPredictionsStatus = () => {
  return useSelector((state: State) => state.ethpredictions.status)
}

export const useEthGetHistoryFilter = () => {
  return useSelector((state: State) => state.ethpredictions.historyFilter)
}

export const useEthGetCurrentRoundBlockNumber = () => {
  return useSelector((state: State) => state.ethpredictions.currentRoundStartBlockNumber)
}

export const useEthGetMinBetAmount = () => {
  const minBetAmount = useSelector((state: State) => state.ethpredictions.minBetAmount)
  return useMemo(() => new BigNumber(minBetAmount), [minBetAmount])
}

export const useEthGetIsFetchingHistory = () => {
  return useSelector((state: State) => state.ethpredictions.isFetchingHistory)
}

export const useEthGetHistory = () => {
  return useSelector((state: State) => state.ethpredictions.history)
}

export const useEthGetHistoryByAccount = (account: string) => {
  const bets = useEthGetHistory()
  return bets ? bets[account] : []
}

export const useEthGetBetByRoundId = (account: string, roundId: string) => {
  const bets = useSelector((state: State) => state.ethpredictions.bets)

  if (!bets[account]) {
    return null
  }

  if (!bets[account][roundId]) {
    return null
  }

  return bets[account][roundId]
}

export const useEthBetCanClaim = (account: string, roundId: string) => {
  const bet = useEthGetBetByRoundId(account, roundId)

  if (!bet) {
    return false
  }

  return getCanClaim(bet)
}

export const useEthGetLastOraclePrice = (): BigNumber => {
  const lastOraclePrice = useSelector((state: State) => state.ethpredictions.lastOraclePrice)
  return new BigNumber(lastOraclePrice)
}

// Collectibles
export const useGetCollectibles = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { isInitialized, isLoading, data } = useSelector((state: State) => state.collectibles)
  const identifiers = Object.keys(data)

  useEffect(() => {
    // Fetch nfts only if we have not done so already
    if (!isInitialized) {
      dispatch(fetchWalletNfts(account))
    }
  }, [isInitialized, account, dispatch])

  return {
    isInitialized,
    isLoading,
    tokenIds: data,
    nftsInWallet: Nfts.filter((nft) => identifiers.includes(nft.identifier)),
  }
}


export const useTotalValue = (): BigNumber => {
  const farms = useFarms();
  const pools = useSelector((state: State) => state.pools.data);
  const bnbPrice = usePriceBnbBusd();
  const cakePrice = usePriceCakeBusd();
  const prices = useGetApiPrices();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.data.length; i++) {
    const farm = farms.data[i]
    if (farm.lpTotalInQuoteToken) {
      let val;
      if (farm.quoteToken.symbol === QuoteToken.BNB) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      }else if (farm.quoteToken.symbol === QuoteToken.CAKE) {
        val = (cakePrice.times(farm.lpTotalInQuoteToken));
      }else{
        val = (farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
  for (let i = 0; i < pools.length; i++) {
    const pool = pools[i]
    const totalStaked = getBalanceNumber(pool.totalStaked, pool.stakingToken.decimals);
    const symbol = pool.stakingToken.symbol.toLowerCase();
    let priceToken;
    if (symbol === "tendie")
      priceToken = cakePrice;
    else
      priceToken = prices[symbol];
    if (priceToken) {
      value = value.plus(new BigNumber(totalStaked).times(priceToken));
    }
  }
  return value;
}

