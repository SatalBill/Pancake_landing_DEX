import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'
import { poolsConfig } from 'config/constants'
import { PoolCategory } from 'config/constants/types'

// Addresses
import {
  getAddress,
  getPancakeProfileAddress,
  getPancakeRabbitsAddress,
  getBunnyFactoryAddress,
  getBunnySpecialAddress,
  getCakeAddress,
  getLotteryAddress,
  getLotteryTicketAddress,
  getMasterChefAddress,
  getPointCenterIfoAddress,
  getClaimRefundAddress,
  getTradingCompetitionAddress,
  getEasterNftAddress,
  getCakeVaultAddress,
  getBnbPredictionsAddress,
  getBnbChainlinkOracleAddress,
  getDogePredictionsAddress,
  getDogeChainlinkOracleAddress,
  getBtcPredictionsAddress,
  getBtcChainlinkOracleAddress,
  getEthPredictionsAddress,
  getEthChainlinkOracleAddress,
  getMayweatherPaulPredictionAddress,
} from 'utils/addressHelpers'

// ABI
import profileABI from 'config/abi/pancakeProfile.json'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import bunnyFactoryAbi from 'config/abi/bunnyFactory.json'
import bunnySpecialAbi from 'config/abi/bunnySpecial.json'
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import cakeAbi from 'config/abi/cake.json'
import ifoV1Abi from 'config/abi/ifoV1.json'
import ifoV2Abi from 'config/abi/ifoV2.json'
import pointCenterIfo from 'config/abi/pointCenterIfo.json'
import lotteryAbi from 'config/abi/lottery.json'
import lotteryTicketAbi from 'config/abi/lotteryNft.json'
import masterChef from 'config/abi/masterchef.json'
import sousChef from 'config/abi/sousChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import claimRefundAbi from 'config/abi/claimRefund.json'
import tradingCompetitionAbi from 'config/abi/tradingCompetition.json'
import easterNftAbi from 'config/abi/easterNft.json'
import cakeVaultAbi from 'config/abi/cakeVault.json'
import predictionsAbi from 'config/abi/predictions.json'
import chainlinkOracleAbi from 'config/abi/chainlinkOracle.json'
import mayweatherPaulPredictionAbi from 'config/abi/MayweatherPaulPrediction.json'

const getContract = (abi: any, address: string, web3?: Web3) => {
  const _web3 = web3 ?? web3NoAccount
  return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
  return getContract(bep20Abi, address, web3)
}
export const getErc721Contract = (address: string, web3?: Web3) => {
  return getContract(erc721Abi, address, web3)
}
export const getLpContract = (address: string, web3?: Web3) => {
  return getContract(lpTokenAbi, address, web3)
}
export const getIfoV1Contract = (address: string, web3?: Web3) => {
  return getContract(ifoV1Abi, address, web3)
}
export const getIfoV2Contract = (address: string, web3?: Web3) => {
  return getContract(ifoV2Abi, address, web3)
}
export const getSouschefContract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = config.poolCategory === PoolCategory.BINANCE ? sousChefBnb : sousChef
  return getContract(abi, getAddress(config.contractAddress), web3)
}
export const getSouschefV2Contract = (id: number, web3?: Web3) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), web3)
}
export const getPointCenterIfoContract = (web3?: Web3) => {
  return getContract(pointCenterIfo, getPointCenterIfoAddress(), web3)
}
export const getCakeContract = (web3?: Web3) => {
  return getContract(cakeAbi, getCakeAddress(), web3)
}
export const getProfileContract = (web3?: Web3) => {
  return getContract(profileABI, getPancakeProfileAddress(), web3)
}
export const getPancakeRabbitContract = (web3?: Web3) => {
  return getContract(pancakeRabbitsAbi, getPancakeRabbitsAddress(), web3)
}
export const getBunnyFactoryContract = (web3?: Web3) => {
  return getContract(bunnyFactoryAbi, getBunnyFactoryAddress(), web3)
}
export const getBunnySpecialContract = (web3?: Web3) => {
  return getContract(bunnySpecialAbi, getBunnySpecialAddress(), web3)
}
export const getLotteryContract = (web3?: Web3) => {
  return getContract(lotteryAbi, getLotteryAddress(), web3)
}
export const getLotteryTicketContract = (web3?: Web3) => {
  return getContract(lotteryTicketAbi, getLotteryTicketAddress(), web3)
}
export const getMasterchefContract = (web3?: Web3) => {
  return getContract(masterChef, getMasterChefAddress(), web3)
}
export const getClaimRefundContract = (web3?: Web3) => {
  return getContract(claimRefundAbi, getClaimRefundAddress(), web3)
}
export const getTradingCompetitionContract = (web3?: Web3) => {
  return getContract(tradingCompetitionAbi, getTradingCompetitionAddress(), web3)
}
export const getEasterNftContract = (web3?: Web3) => {
  return getContract(easterNftAbi, getEasterNftAddress(), web3)
}
export const getCakeVaultContract = (web3?: Web3) => {
  return getContract(cakeVaultAbi, getCakeVaultAddress(), web3)
}
export const getBnbPredictionsContract = (web3?: Web3) => {
  return getContract(predictionsAbi, getBnbPredictionsAddress(), web3)
}
export const getBnbChainlinkOracleContract = (web3?: Web3) => {
  return getContract(chainlinkOracleAbi, getBnbChainlinkOracleAddress(), web3)
}

export const getDogePredictionsContract = (web3?: Web3) => {
  return getContract(predictionsAbi, getDogePredictionsAddress(), web3)
}
export const getDogeChainlinkOracleContract = (web3?: Web3) => {
  return getContract(chainlinkOracleAbi, getDogeChainlinkOracleAddress(), web3)
}


export const getBtcPredictionsContract = (web3?: Web3) => {
  return getContract(predictionsAbi, getBtcPredictionsAddress(), web3)
}
export const getBtcChainlinkOracleContract = (web3?: Web3) => {
  return getContract(chainlinkOracleAbi, getBtcChainlinkOracleAddress(), web3)
}


export const getEthPredictionsContract = (web3?: Web3) => {
  return getContract(predictionsAbi, getEthPredictionsAddress(), web3)
}
export const getEthChainlinkOracleContract = (web3?: Web3) => {
  return getContract(chainlinkOracleAbi, getEthChainlinkOracleAddress(), web3)
}

export const getMayweatherPaulPredictionContract = (web3?: Web3) => {
  return getContract(mayweatherPaulPredictionAbi, getMayweatherPaulPredictionAddress(), web3)
}
