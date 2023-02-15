import { Trade } from '@intercroneswap/swap-sdk';
import { useContext } from 'react';
import { ThemeContext } from 'styled-components';
import { Divider, TYPE } from '../../theme';
import { AutoColumn } from '../Column';
import Row, { RowBetween } from '../Row';

export default function AdvancedPriceDetails({ trade }: { trade?: Trade }) {
  const theme = useContext(ThemeContext);
  const price = trade?.executionPrice;
  const formattedPrice = price?.toSignificant(6);
  const invertedFormattedPrice = price?.invert()?.toSignificant(6);
  return (
    <AutoColumn
      gap="10px"
      style={{ padding: '2rem', marginBottom: '20px', backgroundColor: theme.bg1, borderRadius: '16px' }}
    >
      {Boolean(trade) && (
        <>
          <RowBetween align="center">
            <TYPE.black fontWeight={500} fontSize={18} color={theme.text1}>
              Price
            </TYPE.black>
          </RowBetween>
          <Divider />
          <Row>
            <TYPE.black fontSize={16} color={theme.text1}>
              {formattedPrice}
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.primary3}>
              {price?.quoteCurrency?.symbol}
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.text1}>
              per
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.primary3}>
              {price?.baseCurrency?.symbol}
            </TYPE.black>
          </Row>
          <Row>
            <TYPE.black fontSize={16} color={theme.text1}>
              {invertedFormattedPrice}
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.primary3}>
              {price?.baseCurrency?.symbol}
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.text1}>
              per
            </TYPE.black>
            &nbsp;
            <TYPE.black fontSize={16} color={theme.primary3}>
              {price?.quoteCurrency?.symbol}
            </TYPE.black>
          </Row>
        </>
      )}
    </AutoColumn>
  );
}
