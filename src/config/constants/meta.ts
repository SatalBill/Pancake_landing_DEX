import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'TendieSwap',
  description:
    'DeFi for the People, By the People',
  image: 'https://tendieswap.org/images/chicken-mask-logo.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  switch (path) {
    case '/':
      return {
        title: `${t('Home')} | ${t('TendieSwap')}`,
      }
    case '/competition':
      return {
        title: `${t('Trading Battle')} | ${t('TendieSwap')}`,
      }
    case '/prediction':
      return {
        title: `${t('Prediction')} | ${t('TendieSwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('TendieSwap')}`,
      }
    case '/pools':
      return {
        title: `${t('Pools')} | ${t('TendieSwap')}`,
      }
    case '/lottery':
      return {
        title: `${t('Lottery')} | ${t('TendieSwap')}`,
      }
    case '/collectibles':
      return {
        title: `${t('Collectibles')} | ${t('TendieSwap')}`,
      }
    case '/ifo':
      return {
        title: `${t('Initial Farm Offering')} | ${t('TendieSwap')}`,
      }
    case '/teams':
      return {
        title: `${t('Leaderboard')} | ${t('TendieSwap')}`,
      }
    case '/profile/tasks':
      return {
        title: `${t('Task Center')} | ${t('TendieSwap')}`,
      }
    case '/profile':
      return {
        title: `${t('Your Profile')} | ${t('TendieSwap')}`,
      }
    default:
      return null
  }
}
