import { TokenAmount, Pair, Currency, ChainId, FACTORY_ADDRESS } from '@intercroneswap/swap-sdk';
import { useMemo, useState } from 'react';
import { abi as IloveswapV1PairABI } from '@loveswap7/v1-core/build/ILoveswapV1Pair.json';
import { Interface } from '@ethersproject/abi';
import { useActiveWeb3React } from '../hooks';

import { useMultipleContractSingleData } from '../state/multicall/hooks';
import { wrappedCurrency } from '../utils/wrappedCurrency';
import tronWeb from 'tronweb';
import { ethAddress } from '@loveswap7/java-tron-provider';
const PAIR_INTERFACE = new Interface(IloveswapV1PairABI);

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}
async function queryPair(
  tokenA: string | undefined,
  tokenB: string | undefined,
  chainId: ChainId | undefined,
): Promise<string | undefined> {
  if (window.tronWeb && chainId) {
    //@ts-ignore
    const factoryContract = await window.tronWeb?.contract().at(ethAddress.toTron(FACTORY_ADDRESS));
    if (tokenA && tokenB && factoryContract) {
      const pairAddress = await factoryContract.getPair(tokenA, tokenB).call();
      if (tronWeb.isAddress(pairAddress)) {
        return ethAddress.fromTron(pairAddress);
      } else {
        return '0x0000000000000000000000000000000000000000';
      }
    }
  }
  return undefined;
}
export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React();
  const [pairAddresses, setPairAddresses] = useState<(string | undefined)[]>([]);
  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  );

  useMemo(() => {
    const callTokens = tokens.map(([tokenA, tokenB]) => {
      return [tokenA?.address, tokenB?.address];
    });

    Promise.all(
      callTokens.map(([tokenA, tokenB]) => {
        return queryPair(tokenA, tokenB, chainId);
      }),
    ).then((res) => {
      setPairAddresses(res);
    });
  }, [JSON.stringify(tokens)]);

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves');

  return useMemo(() => {
    return tokens.map(([tokenA, tokenB], i) => {
      const { result: reserves, loading } = results[i] || {};

      if (loading) return [PairState.LOADING, null];
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null];
      if (!reserves) return [PairState.NOT_EXISTS, null];
      const { reserve0, reserve1 } = reserves;
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, reserve0.toString()),
          new TokenAmount(token1, reserve1.toString()),
          pairAddresses[i],
        ),
      ];
    });
  }, [results, pairAddresses, JSON.stringify(tokens)]);
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0];
}
