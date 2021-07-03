import styled from 'styled-components'


export const LandingPage = styled.div`
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
  height: 100vh;
  width: 100%;
  padding: 30px;
  padding-top: 170px;
  display: flex;
  flex-direction: column;
  
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 60px;
    padding-top: 170px;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    padding: 60px;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    background-position: right;
    flex-direction: row;
  }
`

export const ItemGroup = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff6;
  backdrop-filter: blur(5px);
  padding: 10px;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    align-items: flex-start;
    width: 50%;
    background: transparent;
    backdrop-filter: blur(0);
  }
`

export const LinkGroup = styled.div`
  width: 100%;
  height: 100%;
  background: #fff6;
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 50%;
    align-items: flex-end;
    background: transparent;
    backdrop-filter: blur(0);
  }
`

export const WalletBtn = styled.button`
  width: 80%;
  height: 50px;
  border-radius: 25px;
  border: none;
  background: #FFA200;
  color: white;
  font-weight: bold;
  font-size: 26px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin-top: 30px;
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 262px;
  }
  &:hover {
    box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.3), 0 6px 20px 0 rgba(0, 0, 0, 0.2);  
  }
  &:active {
    background: #e47007;
  }
`

export const IconGroup = styled.div`
  display: flex;
  flex-direction: row;
`

export const IconItem = styled.div`
  display: flex;
  align-items: center;
  margin: 0 10px;
  &:hover {
    cursor: pointer;
  }
`

export const BgSwitch = styled.img`
  &:hover {
    cursor: pointer;
  }
`

export const PriceSpan = styled.span`
  margin: 0 15px 0 5px;
  color: white;
`
 const Test = styled.div`
  display: block
`;
export default Test;