import { AddressZero } from '@ethersproject/constants';
import {
  BigintIsh,
  Currency,
  CurrencyAmount,
  currencyEquals,
  ETHER,
  JSBI,
  Pair,
  Percent,
  Route,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WETH,
} from '@intercroneswap/swap-sdk';
import { useMemo } from 'react';
import { useActiveWeb3React } from '../hooks';
import { useAllTokens } from '../hooks/Tokens';
import { useVFactoryContract } from '../hooks/useContract';
import { Version } from '../hooks/useToggledVersion';
import { NEVER_RELOAD, useSingleCallResult, useSingleContractMultipleData } from '../state/multicall/hooks';
import { useETHBalances, useTokenBalance, useTokenBalances } from '../state/wallet/hooks';

export function useVExchangeAddress(tokenAddress?: string): string | undefined {
  const contract = useVFactoryContract();

  const inputs = useMemo(() => [tokenAddress], [tokenAddress]);
  return useSingleCallResult(contract, 'getExchange', inputs)?.result?.[0];
}

export class MockVPair extends Pair {
  constructor(etherAmount: BigintIsh, tokenAmount: TokenAmount) {
    super(tokenAmount, new TokenAmount(WETH[tokenAmount.token.chainId], etherAmount));
  }
}

function useMockVPair(inputCurrency?: Currency): MockVPair | undefined {
  const token = inputCurrency instanceof Token ? inputCurrency : undefined;

  const isWETH = Boolean(token && token.equals(WETH[token.chainId]));
  const vPairAddress = useVExchangeAddress(isWETH ? undefined : token?.address);
  const tokenBalance = useTokenBalance(vPairAddress, token);
  const ETHBalance = useETHBalances([vPairAddress])[vPairAddress ?? ''];

  return useMemo(
    () =>
      token && tokenBalance && ETHBalance && inputCurrency ? new MockVPair(ETHBalance.raw, tokenBalance) : undefined,
    [ETHBalance, inputCurrency, token, tokenBalance],
  );
}

// returns all v exchange addresses in the user's token list
export function useAllTokenVExchanges(): { [exchangeAddress: string]: Token } {
  const allTokens = useAllTokens();
  const factory = useVFactoryContract();
  const args = useMemo(() => Object.keys(allTokens).map((tokenAddress) => [tokenAddress]), [allTokens]);

  const data = useSingleContractMultipleData(factory, 'getExchange', args, NEVER_RELOAD);

  return useMemo(
    () =>
      data?.reduce<{ [exchangeAddress: string]: Token }>((memo, { result }, ix) => {
        if (result?.[0] && result[0] !== AddressZero) {
          memo[result[0]] = allTokens[args[ix][0]];
        }
        return memo;
      }, {}) ?? {},
    [allTokens, args, data],
  );
}

// returns whether any of the tokens in the user's token list have liquidity on v
export function useUserHasLiquidityInAllTokens(): boolean | undefined {
  const { account, chainId } = useActiveWeb3React();

  const exchanges = useAllTokenVExchanges();

  const vExchangeLiquidityTokens = useMemo(
    () => (chainId ? Object.keys(exchanges).map((address) => new Token(chainId, address, 18, 'KWIK', 'ISwap')) : []),
    [chainId, exchanges],
  );

  const balances = useTokenBalances(account ?? undefined, vExchangeLiquidityTokens);

  return useMemo(
    () =>
      Object.keys(balances).some((tokenAddress) => {
        const b = balances[tokenAddress]?.raw;
        return b && JSBI.greaterThan(b, JSBI.BigInt(0));
      }),
    [balances],
  );
}

/**
 * Returns the trade to execute on V to go between input and output token
 */
export function useVTrade(
  isExactIn?: boolean,
  inputCurrency?: Currency,
  outputCurrency?: Currency,
  exactAmount?: CurrencyAmount,
): Trade | undefined {
  // get the mock v pairs
  const inputPair = useMockVPair(inputCurrency);
  const outputPair = useMockVPair(outputCurrency);

  const inputIsETH = inputCurrency === ETHER;
  const outputIsETH = outputCurrency === ETHER;

  // construct a direct or through ETH v route
  let pairs: Pair[] = [];
  if (inputIsETH && outputPair) {
    pairs = [outputPair];
  } else if (outputIsETH && inputPair) {
    pairs = [inputPair];
  }
  // if neither are ETH, it's token-to-token (if they both exist)
  else if (inputPair && outputPair) {
    pairs = [inputPair, outputPair];
  }

  const route = inputCurrency && pairs && pairs.length > 0 && new Route(pairs, inputCurrency, outputCurrency);
  let vTrade: Trade | undefined;
  try {
    vTrade =
      route && exactAmount
        ? new Trade(route, exactAmount, isExactIn ? TradeType.EXACT_INPUT : TradeType.EXACT_OUTPUT)
        : undefined;
  } catch (error) {
    console.debug('Failed to create V trade', error);
  }
  return vTrade;
}

export function getTradeVersion(trade?: Trade): Version | undefined {
  const isV = trade?.route?.pairs?.some((pair) => pair instanceof MockVPair);
  if (isV) return Version.v;
  if (isV === false) return Version.v1;
  return undefined;
}

// returns the v exchange against which a trade should be executed
export function useVTradeExchangeAddress(trade: Trade | undefined): string | undefined {
  const tokenAddress: string | undefined = useMemo(() => {
    if (!trade) return undefined;
    const isV = getTradeVersion(trade) === Version.v;
    if (!isV) return undefined;
    return trade.inputAmount instanceof TokenAmount
      ? trade.inputAmount.token.address
      : trade.outputAmount instanceof TokenAmount
      ? trade.outputAmount.token.address
      : undefined;
  }, [trade]);
  return useVExchangeAddress(tokenAddress);
}

const ZERO_PERCENT = new Percent('0');
const ONE_HUNDRED_PERCENT = new Percent('1');

// returns whether tradeB is better than tradeA by at least a threshold percentage amount
export function isTradeBetter(
  tradeA: Trade | undefined,
  tradeB: Trade | undefined,
  minimumDelta: Percent = ZERO_PERCENT,
): boolean | undefined {
  if (tradeA && !tradeB) return false;
  if (tradeB && !tradeA) return true;
  if (!tradeA || !tradeB) return undefined;

  if (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !currencyEquals(tradeB.outputAmount.currency, tradeB.outputAmount.currency)
  ) {
    throw new Error('Trades are not comparable');
  }

  if (minimumDelta.equalTo(ZERO_PERCENT)) {
    return tradeA.executionPrice.lessThan(tradeB.executionPrice);
  } else {
    return tradeA.executionPrice.raw.multiply(minimumDelta.add(ONE_HUNDRED_PERCENT)).lessThan(tradeB.executionPrice);
  }
}
