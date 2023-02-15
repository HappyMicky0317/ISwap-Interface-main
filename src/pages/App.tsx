import { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import GoogleAnalyticsReporter from '../components/analytics/GoogleAnalyticsReporter';
// import AddressClaimModal from '../components/claim/AddressClaimModal'
import Header from '../components/Header';
// import Polling from '../components/Header/Polling'
import URLWarning from '../components/Header/URLWarning';
import Popups from '../components/Popups';
import Web3ReactManager from '../components/Web3ReactManager';
// import { ApplicationModal } from '../state/application/actions'
// import { useModalOpen, useToggleModal } from '../state/application/hooks'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader';
import AddLiquidity from './AddLiquidity';
import {
  RedirectDuplicateTokenIds,
  RedirectOldAddLiquidityPathStructure,
  RedirectToAddLiquidity,
} from './AddLiquidity/redirects';
import { VoteComingSoon } from './Vote/vote';
// import Earn from './Earn'
// import Manage from './Earn/Manage'
// import MigrateV from './MigrateV'
// import MigrateVExchange from './MigrateV/MigrateVExchange'
// import RemoveVExchange from './MigrateV/RemoveVExchange'
import Pool from './Pool';
import PoolFinder from './PoolFinder';
import RemoveLiquidity from './RemoveLiquidity';
import { RedirectOldRemoveLiquidityPathStructure } from './RemoveLiquidity/redirects';
import Swap from './Swap';
import { RedirectPathToSwapOnly, RedirectToSwap } from './Swap/redirects';

// import Vote from './Vote'
// import VotePage from './Vote/VotePage'

const AppWrapper = styled.div`
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  overflow-x: hidden;
`;

const HeaderWrapper = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  width: 100%;
  justify-content: space-between;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // justify-content: center;
  padding-top: 0px;
  align-items: center;
  flex: 1;
  overflow-y: hidden;
  overflow-x: hidden;
  z-index: 10;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 16px;
    padding-top: 2rem;
  `};

  z-index: 1;
`;

const Marginer = styled.div`
  margin-top: 5rem;
`;
// const LeftLine = styled.div`
// width: 624px;
// height: 1px;
// z-index: -1;
// background: linear-gradient(to right, #F97341 15%,#f6f6f6 100%);
// position: fixed;
// bottom: 187px;
// left: -118px;
// z-index: -1;
// box-shadow: 13px 0px 0px 0px #F97341;
// opacity: 0.3;
// transform: rotate(36.5deg);
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const LeftLine1 = styled.div`
// width: 754px;
// height: 1px;
// z-index: -1;
// background: linear-gradient(to right, #F97341 15%,#f6f6f6 100%);
// position: fixed;
// bottom: 196px;
// left: -80px;
// box-shadow: 13px 0px 0px 0px #F97341;
// opacity: 0.3;
// transform: rotate(37deg);
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const RightLine = styled.div`
// width: 602px;
// height: 1px;
// z-index: -1;
// /* background-color: #F97341; */
// background: linear-gradient(to right, #00FF14 0%,#707070 100%);
// position: fixed;
// top: 160px;
// right: -105px;
// box-shadow: 13px 0px 0px 0px #00FF14;
// opacity: 0.3;
// transform: rotate(35.5deg);
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const RightLine1 = styled.div`
// width: 736px;
// height: 1px;
// z-index: -1;
// background: linear-gradient(to right,#00FF14 0%,#707070 100%);
// position: fixed;
// top: 158px;
// right: -61px;
// box-shadow: 13px 0px 0px 0px #00FF14;
// opacity: 0.3;
// -webkit-transform: rotate(35.5deg);
// -ms-transform: rotate(35.5deg);
// transform: rotate(35.5deg);
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const YellowStar = styled.div`
// width: 13px;
//     height: 13px;
//     z-index: -1;
//     position: relative;
//     left: -516px;
//     bottom: -1px;
//     /* left: 23px; */
//     /* margin-left: -409px; */
//     /* margin-top: 13px; */
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     transform: rotate(45deg);
//     background-color: #D4F421;
//     box-shadow: 0px 0px 27px 3px #D4F421;
//     @media only screen and (max-width:1140px){
//       display: none;
//     }
// `
// const CGreen = styled.div`
// width: 11px;
//     height: 11px;
//     position: relative;
//     left: -296px;
//     bottom: -81px;
//     z-index: -1;
//     border-radius: 50px;
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     transform: rotate(45deg);
//     background-color: #13E4F5;
//     box-shadow: 0px 0px 24px 3px #13E4F5;
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const BrownStar = styled.div`
// width: 8px;
//     height: 8px;
//     position: relative;
//     z-index: -1;
//     left: -310px;
//     bottom: -310px;
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     -webkit-transform: rotate(48deg);
//     -ms-transform: rotate(48deg);
//     transform: rotate(48deg);
//     background-color: #F97341;
//     box-shadow: 0px 0px 18px 3px #F97341;
// @media only screen and (max-width:1140px){
//   display: none;
// }

// `
// const HexaGon = styled.div`
// width: 6px;
//     height: 6px;
//     z-index: -1;
//     position: relative;
//     top: 473px;
//     right: 181px;
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     transform: rotate(45deg);
//     background-color: #D4F421;
//     box-shadow: 0px 0px 30px 3px #D4F421;
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const BlueCircle = styled.div`
// width: 9px;
// height: 9px;
// z-index: -1;
// position: relative;
// top: 486px;
// left: 115px;
// border-radius: 50px;
// -webkit-transform: rotate(45deg);
// -ms-transform: rotate(45deg);
// -webkit-transform: rotate(45deg);
// -ms-transform: rotate(45deg);
// transform: rotate(45deg);
// background-color: #0F48E3;
// box-shadow: 0px 0px 29px 5px #0F48E3;
//     @media only screen and (max-width:1140px){
//       display: none;
//     }
//  `
// const CGreenSimpleDiv = styled.div`
// width: 6px;
// height: 6px;
// position: relative;
// top: 418px;
// left: 330px;
// z-index: -1;
// background-color: #13E4F5;
// box-shadow: 0px 0px 36px 4px #13E4F5;
//     @media only screen and (max-width:1140px){
//       display: none;
//     }
// `
// const DarkGreenStar = styled.div`
// width: 10px;
//     height: 10px;
//     z-index: -1;
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     position: absolute;
//     right: 104px;
//     bottom: 308px;
//     -webkit-transform: rotate(45deg);
//     -ms-transform: rotate(45deg);
//     transform: rotate(45deg);
//     background-color: #0CBE2E;
//     box-shadow: 0px 0px 27px 3px #0CBE2E;
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `
// const BlueStar = styled.div`
// width: 12px;
// height: 12px;
// z-index: -1;
// -webkit-transform: rotate(45deg);
// -ms-transform: rotate(45deg);
// position: relative;
// left: 319px;
// bottom: 83px;
// -webkit-transform: rotate(45deg);
// -ms-transform: rotate(45deg);
// transform: rotate(45deg);
// background-color: #1C90F4;
// box-shadow: 0px 0px 27px 3px #1C90F4;
// @media only screen and (max-width:1140px){
//   display: none;
// }
// `

const StyledHeading = styled.h1`
  text-transform: uppercase;
  font-family: Jost;
  font-style: normal;
  font-weight: 900;
  font-size: 56px;
  line-height: 72px;
  text-align: center;
  width: 100%;
  color: ${({ theme }) => theme.primary3};
  background: ${({ theme }) => theme.primary1};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0px 10px;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
  font-size:46px;
  line-height: 62px;
  `};

  ${({ theme }) => theme.mediaWidth.upToMedium`
  font-size:50px;
  line-height: 66px;
`};
`;

// function TopLevelModals() {
//   const open = useModalOpen(ApplicationModal.ADDRESS_CLAIM)
//   const toggle = useToggleModal(ApplicationModal.ADDRESS_CLAIM)
//   return <AddressClaimModal isOpen={open} onDismiss={toggle} />
// }

export default function App() {
  return (
    <Suspense fallback={null}>
      <Route component={GoogleAnalyticsReporter} />
      <Route component={DarkModeQueryParamReader} />
      <AppWrapper>
        <URLWarning />
        <HeaderWrapper>
          <Header />
        </HeaderWrapper>
        <StyledHeading>swap your trc20 tokens</StyledHeading>
        <BodyWrapper>
          {/* <YellowStar></YellowStar>
          <CGreen></CGreen>
          <BrownStar></BrownStar>
          <HexaGon></HexaGon>
          <BlueCircle></BlueCircle>
          <CGreenSimpleDiv></CGreenSimpleDiv>
          <DarkGreenStar></DarkGreenStar>
          <BlueStar></BlueStar>
          <LeftLine></LeftLine>
          <LeftLine1></LeftLine1>
          <RightLine></RightLine>
          <RightLine1></RightLine1> */}
          <Popups />
          {/* <Polling /> */}
          {/* <TopLevelModals /> */}
          <Web3ReactManager>
            <Switch>
              <Route exact strict path="/swap" component={Swap} />
              {/* <Route exact strict path="/claim" component={OpenClaimAddressModalAndRedirectToSwap} /> */}
              <Route exact strict path="/swap/:outputCurrency" component={RedirectToSwap} />
              <Route exact strict path="/send" component={RedirectPathToSwapOnly} />
              <Route exact strict path="/find" component={PoolFinder} />
              <Route exact strict path="/pool" component={Pool} />
              {/* <Route exact strict path="/kwik" component={Earn} /> */}
              {/* <Route exact strict path="/vote" component={Vote} /> */}
              <Route exact strict path="/votepage" component={VoteComingSoon} />
              <Route exact strict path="/create" component={RedirectToAddLiquidity} />
              <Route exact path="/add" component={AddLiquidity} />
              <Route exact path="/add/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/add/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              <Route exact path="/create" component={AddLiquidity} />
              <Route exact path="/create/:currencyIdA" component={RedirectOldAddLiquidityPathStructure} />
              <Route exact path="/create/:currencyIdA/:currencyIdB" component={RedirectDuplicateTokenIds} />
              {/* <Route exact strict path="/remove/v/:address" component={RemoveVExchange} /> */}
              <Route exact strict path="/remove/:tokens" component={RedirectOldRemoveLiquidityPathStructure} />
              <Route exact strict path="/remove/:currencyIdA/:currencyIdB" component={RemoveLiquidity} />
              {/* <Route exact strict path="/migrate/v" component={MigrateV} /> */}
              {/* <Route exact strict path="/migrate/v/:address" component={MigrateVExchange} /> */}
              {/* <Route exact strict path="/kwik/:currencyIdA/:currencyIdB" component={Manage} /> */}
              {/* <Route exact strict path="/vote/:id" component={VotePage} /> */}
              <Route component={RedirectPathToSwapOnly} />
            </Switch>
          </Web3ReactManager>
          <Marginer />
        </BodyWrapper>
      </AppWrapper>
    </Suspense>
  );
}
