import styled from 'styled-components';
import { useLastTruthy } from '../../hooks/useLast';
import AdvancedPriceDetails from './AdvancedPriceDetails';
import { AdvancedSwapDetails, AdvancedSwapDetailsProps } from './AdvancedSwapDetails';

const AdvancedDetailsFooter = styled.div<{ show: boolean }>`
  // padding-top: calc(16px + 2rem);
  // padding-top: 20px;
  padding-bottom: 20px;
  // margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  // border-bottom-left-radius: 20px;
  // border-bottom-right-radius: 20px;
  border-radius: 16px;
  color: ${({ theme }) => theme.text2};
  // background-color: ${({ theme }) => theme.bg1};
  z-index: -1;
  width: 100%;
  max-width: 560px;
  transform: ${({ show }) => (show ? 'translateY(0px)' : 'translateY(1000px)')};
  transition: transform 300ms ease-in-out;
`;

export default function AdvancedSwapDetailsDropdown({ trade, ...rest }: AdvancedSwapDetailsProps) {
  const lastTrade = useLastTruthy(trade);

  return (
    <AdvancedDetailsFooter show={Boolean(trade)}>
      <AdvancedPriceDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
      <AdvancedSwapDetails {...rest} trade={trade ?? lastTrade ?? undefined} />
    </AdvancedDetailsFooter>
  );
}
