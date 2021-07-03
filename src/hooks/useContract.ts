import { useMemo } from 'react'
import useWeb3 from 'hooks/useWeb3'
import {
  getBep20Contract,
  getCakeContract,
  getBunnyFactoryContract,
  getBunnySpecialContract,
  getPancakeRabbitContract,
  getProfileContract,
  getIfoV1Contract,
  getIfoV2Contract,
  getLotteryContract,
  getLotteryTicketContract,
  getMasterchefContract,
  getPointCenterIfoContract,
  getSouschefContract,
  getClaimRefundContract,
  getTradingCompetitionContract,
  getEasterNftContract,
  getErc721Contract,
  getCakeVaultContract,
  getBnbPredictionsContract,
  getBnbChainlinkOracleContract,
  getDogePredictionsContract,
  getDogeChainlinkOracleContract,
  getBtcPredictionsContract,
  getBtcChainlinkOracleContract,
  getEthPredictionsContract,
  getEthChainlinkOracleContract,
  getSouschefV2Contract,
  getMayweatherPaulPredictionContract,
} from 'utils/contractHelpers'

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useIfoV1Contract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoV1Contract(address, web3), [address, web3])
}

export const useIfoV2Contract = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getIfoV2Contract(address, web3), [address, web3])
}

export const useERC20 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getBep20Contract(address, web3), [address, web3])
}

/**
 * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
 */
export const useERC721 = (address: string) => {
  const web3 = useWeb3()
  return useMemo(() => getErc721Contract(address, web3), [address, web3])
}

export const useCake = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeContract(web3), [web3])
}

export const useBunnyFactory = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnyFactoryContract(web3), [web3])
}

export const usePancakeRabbits = () => {
  const web3 = useWeb3()
  return useMemo(() => getPancakeRabbitContract(web3), [web3])
}

export const useProfile = () => {
  const web3 = useWeb3()
  return useMemo(() => getProfileContract(web3), [web3])
}

export const useLottery = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryContract(web3), [web3])
}

export const useLotteryTicket = () => {
  const web3 = useWeb3()
  return useMemo(() => getLotteryTicketContract(web3), [web3])
}

export const useMasterchef = () => {
  const web3 = useWeb3()
  return useMemo(() => getMasterchefContract(web3), [web3])
}

export const useSousChef = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefContract(id, web3), [id, web3])
}

export const useSousChefV2 = (id) => {
  const web3 = useWeb3()
  return useMemo(() => getSouschefV2Contract(id, web3), [id, web3])
}

export const usePointCenterIfoContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getPointCenterIfoContract(web3), [web3])
}

export const useBunnySpecialContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBunnySpecialContract(web3), [web3])
}

export const useClaimRefundContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getClaimRefundContract(web3), [web3])
}

export const useTradingCompetitionContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getTradingCompetitionContract(web3), [web3])
}

export const useEasterNftContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getEasterNftContract(web3), [web3])
}

export const useCakeVaultContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getCakeVaultContract(web3), [web3])
}

export const useBnbPredictionsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBnbPredictionsContract(web3), [web3])
}

export const useBnbChainlinkOracleContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBnbChainlinkOracleContract(web3), [web3])
}

export const useDogePredictionsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getDogePredictionsContract(web3), [web3])
}

export const useDogeChainlinkOracleContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getDogeChainlinkOracleContract(web3), [web3])
}

export const useBtcPredictionsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBtcPredictionsContract(web3), [web3])
}

export const useBtcChainlinkOracleContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getBtcChainlinkOracleContract(web3), [web3])
}


export const useEthPredictionsContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getEthPredictionsContract(web3), [web3])
}

export const useEthChainlinkOracleContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getEthChainlinkOracleContract(web3), [web3])
}

export const useMayweatherPaulPredictionContract = () => {
  const web3 = useWeb3()
  return useMemo(() => getMayweatherPaulPredictionContract(web3), [web3])
}

