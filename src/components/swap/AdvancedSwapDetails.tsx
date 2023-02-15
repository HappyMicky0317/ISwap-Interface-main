import { Trade, TradeType } from '@intercroneswap/swap-sdk';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
// styled,
import { Field } from '../../state/swap/actions';
import { useUserSlippageTolerance } from '../../state/user/hooks';
import { TYPE } from '../../theme';
// ,ExternalLink
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from '../../utils/prices';
import { AutoColumn } from '../Column';
import QuestionHelper from '../QuestionHelper';
import { RowBetween, RowFixed } from '../Row';
import FormattedPriceImpact from './FormattedPriceImpact';
import { SectionBreak } from './styleds';
import SwapRoute from './SwapRoute';

// const InfoLink = styled(ExternalLink)`
//   width: 100%;
//   border: 1px solid ${({ theme }) => theme.bg3};
//   padding: 6px 6px;
//   border-radius: 8px;
//   text-align: center;
//   font-size: 14px;
//   color: ${({ theme }) => theme.text1};
// `;

function TradeSummary({ trade, allowedSlippage }: { trade: Trade; allowedSlippage: number }) {
  const theme = useContext(ThemeContext);
  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(trade, allowedSlippage);
  const [userSlippageTolerance] = useUserSlippageTolerance();

  return (
    <>
      <AutoColumn gap="10px" style={{ padding: '2rem', backgroundColor: theme.bg1, borderRadius: '16px' }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={16} fontWeight={400} color={theme.text1}>
              {isExactIn ? 'Minimum received' : 'Maximum sold'}
            </TYPE.black>
            {/* <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." /> */}
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme.primary3} fontSize={16}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${trade.outputAmount.currency.symbol}` ??
                  '-'
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${trade.inputAmount.currency.symbol}` ??
                  '-'}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={16} fontWeight={400} color={theme.text1}>
              Price Impact
            </TYPE.black>
            {/* <QuestionHelper text="The difference between the market price and estimated price due to trade size." /> */}
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={16} fontWeight={400} color={theme.text1}>
              Liquidity Provider Fee
            </TYPE.black>
            {/* <QuestionHelper text="A portion of each trade (0.25%) goes to liquidity providers as a protocol incentive." /> */}
          </RowFixed>
          <TYPE.black fontSize={16} color={theme.primary3}>
            {realizedLPFee ? `${realizedLPFee.toSignificant(4)} ${trade.inputAmount.currency.symbol}` : '-'}
          </TYPE.black>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={16} fontWeight={400} color={theme.text1}>
              Slippage tolerance
            </TYPE.black>
          </RowFixed>
          <TYPE.black fontSize={16} color={theme.primary3}>
            {userSlippageTolerance ? userSlippageTolerance / 100 : 'NA'}%
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext);

  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  return (
    <AutoColumn gap="md">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <SectionBreak />
              <AutoColumn style={{ padding: '0 24px' }}>
                <RowFixed>
                  <TYPE.black fontSize={14} fontWeight={400} color={theme.text2}>
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </RowFixed>
                <SwapRoute trade={trade} />
              </AutoColumn>
            </>
          )}
          {/* <AutoColumn style={{ padding: '0 24px' }}>
            <InfoLink
              href={'https://info.ISwap.io/#/pair/' + trade.route.pairs[0].liquidityToken.address}
              target="_blank"
            >
              View pair analytics ↗
            </InfoLink>
          </AutoColumn> */}
        </>
      )}
    </AutoColumn>
  );
}
