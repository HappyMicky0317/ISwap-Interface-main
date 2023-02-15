// all abis...
import { V_FACTORY_ABI, V_EXCHANGE_ABI } from '../../constants/v';
import ENS_ABI from '../../constants/abis/ens-registrar.json';
import IloveswapV1Router02ABI from '../../constants/abis/router02.json';

import ENS_PUBLIC_RESOLVER_ABI from '../../constants/abis/ens-public-resolver.json';
// import UNISOCKS_ABI from '../../constants/abis/unisocks.json'
import WETH_ABI from '../../constants/abis/weth.json';
import { MIGRATOR_ABI } from '../../constants/abis/migrator';
import ERC20_ABI from '../../constants/abis/erc20.json';
import { MULTICALL_ABI } from '../../constants/multicall';
import { abi as IloveswapV1PairABI } from '@loveswap7/v1-core/build/ILoveswapV1Pair.json';

export const abis = [
  ...ERC20_ABI,
  ...V_FACTORY_ABI,
  ...V_EXCHANGE_ABI,
  ...IloveswapV1Router02ABI,
  // ...IUniswapV2PairABI,
  ...ENS_ABI,
  ...ENS_PUBLIC_RESOLVER_ABI,
  // ...UNISOCKS_ABI,
  ...WETH_ABI,
  ...MIGRATOR_ABI,
  ...MULTICALL_ABI,
  ...IloveswapV1PairABI,
  {
    constant: true,
    inputs: [
      {
        internalType: 'address',
        name: 'tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'tokenB',
        type: 'address',
      },
    ],
    name: 'getPair',
    outputs: [
      {
        internalType: 'address',
        name: 'pair',
        type: 'address',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];
