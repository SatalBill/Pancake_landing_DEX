import React from 'react'
import styled from 'styled-components'

const StyledFarmStakingCard = styled.div`
  width: 100%;
  height: 100px;
  border: 2px solid white;
  border-radius: 30px;
  display:  flex;
  align-items: center;
  margin: 5px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 60%;
    height: 100px;
    margin: 20px 0;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    width: 346px;
    height: 100px;
    margin: 25px 0;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    width: 433px;
    height: 139px;
    margin: 30px 0;
  }

  &:hover {
    background: #fff3;
    backdrop-filter: blur(5px);
    cursor: pointer;
  }
`

const Title = styled.span`
  color: white;
  font-size: 28px;
  margin-left: 10px;
  &:hover {
    font-weight: bold;
  }
`

const StyledImage = styled.img`
  width: 97px;
  height: 88px;

  ${({ theme }) => theme.mediaQueries.xl} {
    width: 121px;
    height: 110px;
  }
`

interface props {
  btnTitle: string,
  src: string,
}


const CardItem: React.FC<props> = ({ ...props }) => {
  const goToTendieBet = () => {
    window.location.href = "https://www.tendiebets.org"
  }
  const goToFarming = () => {
    window.location.href = "https://app.tendieswap.org/#/farms"
  }
  const goToDEX = () => {
    window.location.href = "https://app.tendieswap.org"
  }
  const iff = (condition: boolean, then: () => void, otherwise: () => void) => condition ? then : otherwise;
  return (
    <StyledFarmStakingCard onClick={
      props.btnTitle === "TendieBet" ? goToTendieBet : iff(props.btnTitle === "DEX", goToDEX, goToFarming)
    }>
      <StyledImage src={props.src} alt="dex-planet" />
      <Title id="title">{props.btnTitle}</Title>
    </StyledFarmStakingCard>
  )
}

export default CardItem
