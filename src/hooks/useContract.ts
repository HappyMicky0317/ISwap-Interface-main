import { Contract } from '@ethersproject/contracts';
// import { abi as KWIK_ABI } from '@loveswap7/governance/build/Love.json';
import MERKLE_DISTRIBUTOR_ABI from '../constants/abis/merkle.json';
import { ChainId, WETH } from '@intercroneswap/swap-sdk';
import { abi as IloveswapV1PairABI } from '@loveswap7/v1-core/build/ILoveswapV1Pair.json';
import { useMemo } from 'react';
import { MERKLE_DISTRIBUTOR_ADDRESS } from '../constants';
import {
  ARGENT_WALLET_DETECTOR_ABI,
  ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS,
} from '../constants/abis/argent-wallet-detector';
import ENS_PUBLIC_RESOLVER_ABI from '../constants/abis/ens-public-resolver.json';
import ENS_ABI from '../constants/abis/ens-registrar.json';
import { ERC20_BYTES32_ABI } from '../constants/abis/erc20';
import ERC20_ABI from '../constants/abis/erc20.json';
import { MIGRATOR_ABI, MIGRATOR_ADDRESS } from '../constants/abis/migrator';
import KWIKHAWK_ABI from '../constants/abis/kwikhawk.json';
import WETH_ABI from '../constants/abis/weth.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from '../constants/multicall';
import { V_EXCHANGE_ABI, V_FACTORY_ABI, V_FACTORY_ADDRESSES } from '../constants/v';
import { getContract } from '../utils';
import { useActiveWeb3React } from './index';

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useVFactoryContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && V_FACTORY_ADDRESSES[chainId], V_FACTORY_ABI, false);
}

export function useV1MigratorContract(): Contract | null {
  return useContract(MIGRATOR_ADDRESS, MIGRATOR_ABI, true);
}

export function useVExchangeContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, V_EXCHANGE_ABI, withSignerIfPossible);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? WETH[chainId].address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useArgentWalletDetectorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET ? ARGENT_WALLET_DETECTOR_MAINNET_ADDRESS : undefined,
    ARGENT_WALLET_DETECTOR_ABI,
    false,
  );
}

export function useENSRegistrarContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  let address: string | undefined;
  if (chainId) {
    switch (chainId) {
      // TODO(tron): shasta TNS ?
      case ChainId.MAINNET:
        address = '0x99fb68F0672E3E16AbB071342eF03355dfcb1797';
        break;
      // TODO
      case ChainId.NILE:
        address = '0xD2577ec90C6Fb23EC208B27609867E30D69bDc89';
        break;
    }
  }
  return useContract(address, ENS_ABI, withSignerIfPossible);
}

export function useENSResolverContract(address: string | undefined, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, ENS_PUBLIC_RESOLVER_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, IloveswapV1PairABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false);
}

export function useMerkleDistributorContract(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? MERKLE_DISTRIBUTOR_ADDRESS[chainId] : undefined, MERKLE_DISTRIBUTOR_ABI, true);
}

// export function useKwikContract(): Contract | null {
//   const { chainId } = useActiveWeb3React();
//   return useContract(chainId ? KWIK[chainId].address : undefined, KWIK_ABI, true);
// }

export function useSocksController(): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(
    chainId === ChainId.MAINNET ? '0x65770b5283117639760beA3F867b69b3697a91dd' : undefined,
    KWIKHAWK_ABI,
    false,
  );
}
