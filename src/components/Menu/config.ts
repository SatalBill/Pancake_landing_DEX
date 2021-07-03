import { MenuEntry } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'

const config: (t: ContextApi['t']) => MenuEntry[] = (t) => [
  {
    label: t('Home'),
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Buy TENDIE',
    icon: 'TradeIcon',
    href: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x9853a30c69474bed37595f9b149ad634b5c323d9',
  },
  {
    label: t('Farms'),
    icon: 'FarmIcon',
    href: '/farms',
  },
  {
    label: t('Buckets'),
    icon: 'PoolIcon',
    href: '/pools',
  },
  {
    label: t('Prediction (BETA)'),
    icon: 'PredictionsIcon',
    items: [
      {
        label: 'BNBUSDT',
        href: '/bnbprediction',
      },
      /*
      {
        label: 'BTCUSDT',
        href: '/btcprediction',
      },
      {
        label: 'ETHUSDT',
        href: '/ethprediction',
      },
      {
        label: 'DOGEUSDT',
        href: '/dogeprediction'
      },
      */  
    ]
  },
  {
    label: 'Fight Night',
    icon: 'PredictionsIcon',
    href: '/fightnight',
  },
  {
    label: 'More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/tendieswap',
      },
      {
        label: 'Docs',
        href: 'https://coloneltendie.gitbook.io/tendieswap',
      },
      {
        label: 'Blog',
        href: 'https://tendieswap.medium.com',
      },
    ],
  },
]

export default config
