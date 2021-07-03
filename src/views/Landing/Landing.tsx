import React from 'react'
import CardItem from 'views/Landing/components/CardItem'
import { useWeb3React } from '@web3-react/core'
import { useWalletModal } from '@pancakeswap/uikit'
import useAuth from 'hooks/useAuth'
import { usePriceCakeBusd } from 'state/hooks'
import linkings from './Constants'
import {
  LandingPage,
  ItemGroup,
  LinkGroup,
  WalletBtn,
  IconGroup,
  IconItem,
  BgSwitch,
  PriceSpan
} from './components/Elements'

const lightBg = "url('/images/landing.png')"
const darkBg = "url('/images/landing-dark.png')"
const lightSwitch = "images/light-switch.png"
const darkSwitch = "images/dark-switch.png"

const Landing: React.FC = () => {
  const [lightbg, setLightbg] = React.useState(true)
  const { account } = useWeb3React()
  const cakePriceUsd = usePriceCakeBusd()
  const { login, logout } = useAuth()
  const { onPresentConnectModal, onPresentAccountModal } = useWalletModal(login, logout, account)
  const onBgSwitch = () => setLightbg(!lightbg)

  return (
    <LandingPage style={{
      backgroundImage: lightbg ? lightBg : darkBg
    }}>
      <ItemGroup>
        <CardItem btnTitle="DEX" src="images/dex-planet.png" />
        <CardItem btnTitle="Farming &amp; Stacking" src="images/farming-planet.png" />
        <CardItem btnTitle="TendieBet" src="images/tendie-planet.png" />
      </ItemGroup>
      <LinkGroup>
        {
          account ?
            <WalletBtn onClick={onPresentAccountModal}>{account?.slice(0, 4)}...{account?.slice(account.length - 4)} </WalletBtn>
            :
            <WalletBtn onClick={onPresentConnectModal}>Connect Wallet</WalletBtn>
        }
        <IconGroup>
          <IconItem>
            <a href={linkings.pancakeURL} style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} >
              <img src="images/pricemark.png" alt="price" />
              <PriceSpan> {cakePriceUsd.toNumber().toFixed(3)} </PriceSpan>
            </a>
          </IconItem>
          <IconItem>
            <a href={linkings.twitterURL} >
              <img src="images/twitter.png" alt="twitter" />
            </a>
          </IconItem>
          <IconItem>
            <a href={linkings.facebookURL} >
              <img src="images/facebook.png" alt="facebook" />
            </a>
          </IconItem>
          <IconItem>
            <a href={linkings.instagramURL} >
              <img src="images/instagram.png" alt="instagram" />
            </a>
          </IconItem>
          <IconItem>
            <BgSwitch src={lightbg ? lightSwitch : darkSwitch} alt="price" onClick={onBgSwitch} />
          </IconItem>
        </IconGroup>
      </LinkGroup>
    </LandingPage>
  )
}

export default Landing
