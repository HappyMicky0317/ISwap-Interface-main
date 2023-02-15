import { CurrencyAmount, JSBI, Token, Trade } from '@intercroneswap/swap-sdk';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ArrowDown } from 'react-feather';
import ReactGA from 'react-ga';
import { Text } from 'rebass';
import styled, { ThemeContext } from 'styled-components';
import AddressInputPanel from '../../components/AddressInputPanel';
import { ButtonError, ButtonPrimary, ButtonConfirmed } from '../../components/Button';
import { GreyCard } from '../../components/Card';
// Card,
import Column, { AutoColumn } from '../../components/Column';
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal';
import CurrencyInputPanel from '../../components/CurrencyInputPanel';
import { SwapPoolTabs } from '../../components/NavigationTabs';
import { AutoRow, RowBetween } from '../../components/Row';
// import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown'
import BetterTradeLink, { DefaultVersionLink } from '../../components/swap/BetterTradeLink';
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee';
import { ArrowWrapper, BottomGrouping, SwapCallbackError, Wrapper } from '../../components/swap/styleds';
// import TradePrice from '../../components/swap/TradePrice';
import TokenWarningModal from '../../components/TokenWarningModal';
import ProgressSteps from '../../components/ProgressSteps';

import { BETTER_TRADE_LINK_THRESHOLD } from '../../constants';
// , INITIAL_ALLOWED_SLIPPAGE
import { getTradeVersion, isTradeBetter } from '../../data/V';
import { useActiveWeb3React } from '../../hooks';
import { useCurrency } from '../../hooks/Tokens';
import { ApprovalState, useApproveCallbackFromTrade } from '../../hooks/useApproveCallback';
import useENSAddress from '../../hooks/useENSAddress';
import { useSwapCallback } from '../../hooks/useSwapCallback';
import useToggledVersion, { DEFAULT_VERSION, Version } from '../../hooks/useToggledVersion';
import useWrapCallback, { WrapType } from '../../hooks/useWrapCallback';
import { useWalletModalToggle } from '../../state/application/hooks';
// useToggleSettingsMenu,
import { Field } from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import { useExpertModeManager, useUserSlippageTolerance } from '../../state/user/hooks';
import { LinkStyledButton, TYPE } from '../../theme';
import { maxAmountSpend } from '../../utils/maxAmountSpend';
import { computeTradePriceBreakdown, warningSeverity } from '../../utils/prices';
import AppBody, { Container } from '../AppBody';
// import { ClickableText } from '../Pool/styleds';
import Loader from '../../components/Loader';
import { ReactComponent as YellowArrowDown } from '../../assets/images/arrow-down-yellow.svg';
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown';
// const BUYTEXT = styled.div`
//   font-weight: 500;
//   font-size: 21px;
//   margin-bottom: 11px;
//   color: ${({ theme }) => theme.text1};
// `
const AppBodyContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const StyledArrowDown = styled(YellowArrowDown)``;

// const BelowAppbody = styled.div`
// margin: 15px 44px;
// border-radius: 40px 116px 0 0;
// box-sizing: border-box;
// background-color: cyan;
// box-shadow: 159px -17px 150px 73px #2d72ffc2, 11px 33px 56px 13px rgb(249 115 65 / 0%);
// // box-shadow:  ${({ theme }) => `-6px 23px 150px 73px ${theme.cardsBoxShadowTopLeftcorner}, -9px 33px 56px 13px ${theme.cardsBoxShadowTopleftCorner1}`};
// // box-shadow: -6px 23px 150px 73px rgb(249,115,65,0.5), -9px 33px 56px 21px rgb(249 115 65 / 0%);

// `
// const BelowAppbody1 = styled.div`
// margin: -28px -34px;
// border-radius: 40px 116px 0 0;
// box-sizing: border-box;
// background-color: cyan;
// box-shadow:  ${({ theme }) => `10px -3px 136px 41px ${theme.cardsBoxShadowTopRightcorner}, -15px 28px 140px 11px ${theme.cardsBoxShadowTopRightCorner1}`}
// // box-shadow: 10px -3px 136px 41px rgb(95,179,71), -15px 28px 140px 11px rgb(95,179,71);
// `
export default function Swap() {
  const loadedUrlParams = useDefaultsFromURLSearch();

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const { account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  // const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const { independentField, typedValue, recipient } = useSwapState();
  const {
    vTrade,
    v1Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();
  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue);
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;
  const { address: recipientAddress } = useENSAddress(recipient);
  const toggledVersion = useToggledVersion();
  const tradesByVersion = {
    [Version.v]: vTrade,
    [Version.v1]: v1Trade,
  };
  const trade = showWrap ? undefined : tradesByVersion[toggledVersion];
  const defaultTrade = showWrap ? undefined : tradesByVersion[DEFAULT_VERSION];

  const betterTradeLinkVersion: Version | undefined =
    toggledVersion === Version.v1 && isTradeBetter(v1Trade, vTrade, BETTER_TRADE_LINK_THRESHOLD)
      ? Version.v
      : toggledVersion === Version.v && isTradeBetter(vTrade, v1Trade)
      ? Version.v1
      : undefined;

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
      };
  // onSwitchTokens
  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers();
  const isValid = !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput],
  );

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean;
    tradeToConfirm: Trade | undefined;
    attemptingTxn: boolean;
    swapErrorMessage: string | undefined;
    txHash: string | undefined;
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };

  const route = trade?.route;
  const userHasSpecifiedInputOutput = Boolean(
    currencies[Field.INPUT] && currencies[Field.OUTPUT] && parsedAmounts[independentField]?.greaterThan(JSBI.BigInt(0)),
  );
  const noRoute = !route;

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromTrade(trade, allowedSlippage);

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  // the callback to execute the swap
  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(trade, allowedSlippage, recipient);

  const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade);

  const handleSwap = useCallback(() => {
    if (priceImpactWithoutFee && !confirmPriceImpactWithoutFee(priceImpactWithoutFee)) {
      return;
    }
    if (!swapCallback) {
      return;
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: undefined });
    swapCallback()
      .then((hash) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, showConfirm, swapErrorMessage: undefined, txHash: hash });

        ReactGA.event({
          category: 'Swap',
          action:
            recipient === null
              ? 'Swap w/o Send'
              : (recipientAddress ?? recipient) === account
              ? 'Swap w/o Send + recipient'
              : 'Swap w/ Send',
          label: [
            trade?.inputAmount?.currency?.symbol,
            trade?.outputAmount?.currency?.symbol,
            getTradeVersion(trade),
          ].join('/'),
        });
      })
      .catch((error) => {
        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          showConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        });
      });
  }, [tradeToConfirm, account, priceImpactWithoutFee, recipient, recipientAddress, showConfirm, swapCallback, trade]);

  // errors
  // const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash });
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash]);
  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: trade, swapErrorMessage, txHash, attemptingTxn, showConfirm });
  }, [attemptingTxn, showConfirm, swapErrorMessage, trade, txHash]);

  const handleInputSelect = useCallback(
    (inputCurrency) => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection],
  );

  const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);

  const handleOutputSelect = useCallback(
    (outputCurrency) => onCurrencySelection(Field.OUTPUT, outputCurrency),
    [onCurrencySelection],
  );

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <Container>
        <AppBody>
          <AppBodyContainer>
            {/* <BelowAppbody></BelowAppbody> */}
            {/* <BelowAppbody1></BelowAppbody1> */}
          </AppBodyContainer>
          <SwapPoolTabs active={'swap'} />
          <Wrapper id="swap-page">
            <ConfirmSwapModal
              isOpen={showConfirm}
              trade={trade}
              originalTrade={tradeToConfirm}
              onAcceptChanges={handleAcceptChanges}
              attemptingTxn={attemptingTxn}
              txHash={txHash}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onConfirm={handleSwap}
              swapErrorMessage={swapErrorMessage}
              onDismiss={handleConfirmDismiss}
            />
            <AutoColumn gap={'md'}>
              <CurrencyInputPanel
                label=""
                // label={independentField === Field.OUTPUT && !showWrap && trade ? 'From (estimated)' : 'From'}
                value={formattedAmounts[Field.INPUT]}
                showMaxButton={!atMaxAmountInput}
                currency={currencies[Field.INPUT]}
                onUserInput={handleTypeInput}
                onMax={handleMaxInput}
                onCurrencySelect={handleInputSelect}
                otherCurrency={currencies[Field.OUTPUT]}
                id="swap-currency-input"
              />
              <AutoColumn justify="space-between">
                <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 0rem' }}>
                  <ArrowWrapper clickable>
                    <StyledArrowDown
                      onClick={() => {
                        setApprovalSubmitted(false); // reset 2 step UI for approvals
                        onSwitchTokens();
                      }}
                    />
                  </ArrowWrapper>
                  {recipient === null && !showWrap && isExpertMode ? (
                    <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                      + Add a send (optional)
                    </LinkStyledButton>
                  ) : null}
                </AutoRow>
              </AutoColumn>
              <CurrencyInputPanel
                value={formattedAmounts[Field.OUTPUT]}
                onUserInput={handleTypeOutput}
                label=""
                // label={independentField === Field.INPUT && !showWrap && trade ? 'To (estimated)' : 'To'}
                showMaxButton={false}
                currency={currencies[Field.OUTPUT]}
                onCurrencySelect={handleOutputSelect}
                otherCurrency={currencies[Field.INPUT]}
                id="swap-currency-output"
              />

              {recipient !== null && !showWrap ? (
                <>
                  <AutoRow justify="space-between" style={{ padding: '0 0rem' }}>
                    <ArrowWrapper clickable={false}>
                      <ArrowDown size="16" color={theme.text2} />
                    </ArrowWrapper>
                    <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                      - Remove send
                    </LinkStyledButton>
                  </AutoRow>
                  <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
                </>
              ) : null}

              {/* {showWrap ? null : (
                <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                  <AutoColumn gap="4px">
                    {Boolean(trade) && (
                      <RowBetween align="center">
                        <Text fontWeight={500} fontSize={14} color={theme.text2}>
                          Price
                        </Text>
                        <TradePrice
                          price={trade?.executionPrice}
                          showInverted={showInverted}
                          setShowInverted={setShowInverted}
                        />
                      </RowBetween>
                    )}
                    {allowedSlippage !== INITIAL_ALLOWED_SLIPPAGE && (
                      <RowBetween align="center">
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          Slippage Tolerance
                        </ClickableText>
                        <ClickableText fontWeight={500} fontSize={14} color={theme.text2} onClick={toggleSettings}>
                          {allowedSlippage / 100}%
                        </ClickableText>
                      </RowBetween>
                    )}
                  </AutoColumn>
                </Card>
              )} */}
            </AutoColumn>
            <BottomGrouping>
              <div style={{ maxWidth: '350px', margin: '0 auto' }}>
                {!account ? (
                  <ButtonPrimary onClick={toggleWalletModal}>Connect Wallet</ButtonPrimary>
                ) : showWrap ? (
                  <ButtonPrimary disabled={Boolean(wrapInputError)} onClick={onWrap}>
                    {wrapInputError ??
                      (wrapType === WrapType.WRAP ? 'Wrap' : wrapType === WrapType.UNWRAP ? 'Unwrap' : null)}
                  </ButtonPrimary>
                ) : noRoute && userHasSpecifiedInputOutput ? (
                  <GreyCard style={{ textAlign: 'center' }}>
                    <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
                  </GreyCard>
                ) : showApproveFlow ? (
                  <RowBetween>
                    <ButtonConfirmed
                      onClick={approveCallback}
                      disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
                      width="48%"
                      altDisabledStyle={approval === ApprovalState.PENDING} // show solid button while waiting
                      confirmed={approval === ApprovalState.APPROVED}
                    >
                      {approval === ApprovalState.PENDING ? (
                        <AutoRow gap="6px" justify="center">
                          Approving <Loader stroke="white" />
                        </AutoRow>
                      ) : approvalSubmitted && approval === ApprovalState.APPROVED ? (
                        'Approved'
                      ) : (
                        'Approve ' + currencies[Field.INPUT]?.symbol
                      )}
                    </ButtonConfirmed>
                    <ButtonError
                      onClick={() => {
                        if (isExpertMode) {
                          handleSwap();
                        } else {
                          setSwapState({
                            tradeToConfirm: trade,
                            attemptingTxn: false,
                            swapErrorMessage: undefined,
                            showConfirm: true,
                            txHash: undefined,
                          });
                        }
                      }}
                      width="48%"
                      id="swap-button"
                      disabled={
                        !isValid || approval !== ApprovalState.APPROVED || (priceImpactSeverity > 3 && !isExpertMode)
                      }
                      error={isValid && priceImpactSeverity > 2}
                    >
                      <Text fontSize={16} fontWeight={500}>
                        {priceImpactSeverity > 3 && !isExpertMode
                          ? `Price Impact High`
                          : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                      </Text>
                    </ButtonError>
                  </RowBetween>
                ) : (
                  <ButtonError
                    onClick={() => {
                      if (isExpertMode) {
                        handleSwap();
                      } else {
                        setSwapState({
                          tradeToConfirm: trade,
                          attemptingTxn: false,
                          swapErrorMessage: undefined,
                          showConfirm: true,
                          txHash: undefined,
                        });
                      }
                    }}
                    id="swap-button"
                    disabled={!isValid || (priceImpactSeverity > 3 && !isExpertMode) || !!swapCallbackError}
                    error={isValid && priceImpactSeverity > 2 && !swapCallbackError}
                  >
                    <Text fontSize={20} fontWeight={500}>
                      {swapInputError
                        ? swapInputError
                        : priceImpactSeverity > 3 && !isExpertMode
                        ? `Price Impact Too High`
                        : `Swap${priceImpactSeverity > 2 ? ' Anyway' : ''}`}
                    </Text>
                  </ButtonError>
                )}
              </div>

              {showApproveFlow && (
                <Column style={{ marginTop: '1rem' }}>
                  <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
                </Column>
              )}
              {isExpertMode && swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
              {betterTradeLinkVersion ? (
                <BetterTradeLink version={betterTradeLinkVersion} />
              ) : toggledVersion !== DEFAULT_VERSION && defaultTrade ? (
                <DefaultVersionLink />
              ) : null}
            </BottomGrouping>
          </Wrapper>
        </AppBody>
        <div>
          <AdvancedSwapDetailsDropdown trade={trade} />
        </div>
      </Container>
    </>
  );
}
