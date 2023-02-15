// import { ChainId } from '@intercroneswap/swap-sdk';
import { useState } from 'react';
import { Text } from 'rebass';
import { NavLink } from 'react-router-dom';
import { darken } from 'polished';
import { useTranslation } from 'react-i18next';

import styled from 'styled-components';
import Logo from '../../assets/images/ISwap.svg';
// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
import { useActiveWeb3React } from '../../hooks';
// import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks';
// import { CardNoise } from '../vote/styled'
// import { CountUp } from 'use-count-up'
// ExternalLink
// import { ExternalLink } from '../../theme'

// import { YellowCard } from '../Card';
import Settings from '../Settings';
import Menu from '../Menu';
import { Box } from 'rebass/styled-components';
// import Row from '../Row'
import Web3Status from '../Web3Status';
// import ClaimModal from '../claim/ClaimModal'
// import { useShowClaimPopup } from '../../state/application/hooks'
// import { useUserHasAvailableClaim } from '../../state/claim/hooks'
// import { useUserHasSubmittedClaim } from '../../state/transactions/hooks'
// import { Dots } from '../swap/styleds'
import Modal from '../Modal';
// import KwikBalanceContent from './KwikBalanceContent'
// import usePrevious from '../../hooks/usePrevious'

const HeaderFrame = styled.div`
  // display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;

  top: 0;
  position: relative;
  // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1rem;
  z-index: 2;
  background: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    padding: 0 1rem;
    width: calc(100%);
    position: relative;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
        padding: 0.5rem 1rem;
  `}
`;

// const HeaderControls = styled.div`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-self: flex-end;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//     flex-direction: row;
//     justify-content: space-between;
//     justify-self: center;
//     width: 100%;
//     max-width: 960px;
//     padding: 1rem;
//      position: fixed;
//     bottom: 0px;
//     left: 0px;

//     width: 100%;
//     z-index: 99;
//     height: 72px;
//     border-radius: 12px 12px 0 0;
//     background-color: ${({ theme }) => theme.bg1};
//   `};
// `;

// const HeaderElement = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 8px;
//   position: fixed;
//   left: 0;
//   bottom: 16px;

//   ${({ theme }) => theme.mediaWidth.upToMedium`
//    flex-direction: row-reverse;
//     align-items: center;
//   `};
// `;

// const HeaderElementWrap = styled.div`
//   display: flex;
//   position: fixed;
//   right: 17px;
//   bottom: 16px;
//   -webkit-align-items: center;
//   -webkit-box-align: center;
//   -ms-flex-align: center;
//   align-items: center;
// `;
const Row = styled(Box)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  // width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;
export const PercentageDiv = styled(Row)<{ align?: string; padding?: string; border?: string; borderRadius?: string }>`
  width: 100%;
  display: flex;
  padding: 0;
  align-items: ${({ align }) => (align ? align : 'center')};
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius};
`;

export const RowBetween = styled(Row)`
  justify-content: space-between;
`;

export const RowFlat = styled.div`
  display: flex;
  align-items: flex-end;
`;

export const AutoRow = styled(Row)<{ gap?: string; justify?: string }>`
  flex-wrap: wrap;
  margin: ${({ gap }) => gap && `-${gap}`};
  justify-content: ${({ justify }) => justify && justify};

  & > * {
    margin: ${({ gap }) => gap} !important;
  }
`;

const HeaderRowFixed = styled(Row)<{ gap?: string; justify?: string }>`
  // width: fit-content;
  // background-color: red;
  justify-content: space-between;
  margin: ${({ gap }) => gap && `-${gap}`};
`;

const HeaderRow = styled(HeaderRowFixed)`
  ${({ theme }) => theme.mediaWidth.upToMedium`
   width: 100%;
   
  `};
`;

const HeaderLinks = styled(Row)`
  justify-content: center;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem 0 1rem 1rem;
    justify-content: flex-end;
    
`};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  // background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  // border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
  /* :hover {
    background-color: ${({ theme, active }) => (!active ? theme.bg2 : theme.bg4)};
  } */
`;

// const KWIKAmount = styled(AccountElement)`
//   color: black;
//   padding: 4px 8px;
//   height: 36px;
//   border-radius: 10px;
//   font-weight: 500;
//   border:${({ theme }) => `1px solid ${theme.BorderColor}`};
//   color: ${({ theme }) => theme.BUYTEXT};
//   // background-color:  ${({ theme }) => theme.BorderColor};
//   // background-color: ${({ theme }) => theme.bg3};
//   // background-color: ${({ theme }) => theme.bgSWAP6};
// `
// // background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
// const KWIKWrapper = styled.span`
//   width: fit-content;
//   position: relative;
//   cursor: pointer;

//   :hover {
//     opacity: 0.8;
//   }

//   :active {
//     opacity: 0.9;
//   }
// `

// const HideSmall = styled.span`
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     display: none;
//   `};
// `;

// const NetworkCard = styled(YellowCard)`
//   border-radius: 12px;
//   color: ${({ theme }) => theme.text1};
//   padding: 8px 12px;
//   ${({ theme }) => theme.mediaWidth.upToSmall`
//     margin: 0;
//     margin-right: 0.5rem;
//     width: initial;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     flex-shrink: 1;
//   `};
// `;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const KwikIcon = styled.div`
  filter: ${({ theme }) => theme.pngLOGOCOLOR};
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
`;

const activeClassName = 'ACTIVE';

// const StyledNavVoteLink = styled(NavLink).attrs({
//   activeClassName
// })`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;
//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;
//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }
//     ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
//       `}
// `
const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.text2};
  font-size: 1rem;
  width: fit-content;
  margin: 0 12px;
  font-weight: 500;
  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`;

// const StyledExternalLink = styled(ExternalLink).attrs({
//   activeClassName
// }) <{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;

//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: none;
// `}
// `
// const StyledExternalLocalLink = styled(ExternalLink).attrs({
//   activeClassName
// }) <{ isActive?: boolean }>`
//   ${({ theme }) => theme.flexRowNoWrap}
//   align-items: left;

//   border-radius: 3rem;
//   outline: none;
//   cursor: pointer;
//   text-decoration: none;
//   color: ${({ theme }) => theme.text2};
//   font-size: 1rem;
//   width: fit-content;
//   margin: 0 12px;
//   font-weight: 500;

//   &.${activeClassName} {
//     border-radius: 12px;
//     font-weight: 600;
//     color: ${({ theme }) => theme.text1};
//   }

//   :hover,
//   :focus {
//     color: ${({ theme }) => darken(0.1, theme.text1)};
//   }

//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//       display: block;
// `}
// `
const LinksContainer = styled.div`
  position: relative;
  :hover > div,
  :focus > div {
    display: block;
  }
`;
// const StyledDropDown = styled.div`
// position:absolute;
// bottom:0;
// left:0;
// background-color: ${({ theme }) => theme.settingCardbg};
// border-radius:10px;
// transform:translate(-25%,100%);
// padding:10px;
// display:none;
// z-index:1000;
// `
// const NETWORK_LABELS: { [chainId in ChainId]: string | undefined } = {
//   [ChainId.MAINNET]: undefined,
//   [ChainId.NILE]: 'Nile',
//   [ChainId.SHASTA]: 'Shasta',
// };

export default function Header() {
  const {
    account,
    //  chainId
  } = useActiveWeb3React();
  const { t } = useTranslation();

  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  // const [isDark] = useDarkModeManager()

  // const toggleClaimModal = useToggleSelfClaimModal()

  // const availableClaim: boolean = useUserHasAvailableClaim(account)

  // const { claimTxn } = useUserHasSubmittedClaim(account ?? undefined)

  // const aggregateBalance: TokenAmount | undefined = useAggregateKwikBalance()

  const [showKwikBalanceModal, setShowKwikBalanceModal] = useState(false);
  // const showClaimPopup = useShowClaimPopup()

  // const countUpValue = aggregateBalance?.toFixed(0) ?? '0'
  // const countUpValuePrevious = usePrevious(countUpValue) ?? '0'

  return (
    <HeaderFrame>
      {/* <ClaimModal /> */}
      <Modal isOpen={showKwikBalanceModal} onDismiss={() => setShowKwikBalanceModal(false)}></Modal>
      <HeaderRow>
        <Title href=".">
          <KwikIcon>
            <img width={'115px'} src={Logo} alt="logo" />
          </KwikIcon>
        </Title>
        <HeaderLinks>
          <div style={{ display: 'none' }}>
            <LinksContainer>
              <StyledNavLink id={`swap-nav-link`} to={'/swap'}>
                {t('swap')}
              </StyledNavLink>
            </LinksContainer>
            <StyledNavLink
              id={`pool-nav-link`}
              to={'/pool'}
              isActive={(match, { pathname }) =>
                Boolean(match) ||
                pathname.startsWith('/add') ||
                pathname.startsWith('/remove') ||
                pathname.startsWith('/create') ||
                pathname.startsWith('/find')
              }
            >
              {t('pool')}
            </StyledNavLink>
          </div>
          <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} TRX
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
          <Settings />
          <Menu />
        </HeaderLinks>
      </HeaderRow>
      {/* <HeaderControls>
        <HeaderElement>
          <HideSmall>
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall> */}
      {/* {availableClaim && !showClaimPopup} */}
      {/* {!availableClaim && aggregateBalance && (
            <KWIKWrapper onClick={() => setShowKwikBalanceModal(true)}>
              <KWIKAmount active={!!account && !availableClaim} style={{ pointerEvents: 'auto' }}>
                {account && (
                  <HideSmall>
                    <TYPE.white
                      style={{
                        paddingRight: '.4rem'
                      }}
                    >
                      <CountUp
                        key={countUpValue}
                        isCounting
                        start={parseFloat(countUpValuePrevious)}
                        end={parseFloat(countUpValue)}
                        thousandsSeparator={','}
                        duration={1}
                      />
                    </TYPE.white>
                  </HideSmall>
                )}
                KWIK
              </KWIKAmount>
              <CardNoise />
            </KWIKWrapper>
          )} */}
      {/* <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} TRX
              </BalanceText>
            ) : null}
            <Web3Status />
          </AccountElement>
        </HeaderElement>
        <HeaderElementWrap>
          <Settings />
          <Menu />
        </HeaderElementWrap>
      </HeaderControls> */}
    </HeaderFrame>
  );
}
