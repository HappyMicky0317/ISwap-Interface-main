import { Interface } from '@ethersproject/abi';
import { ChainId } from '@intercroneswap/swap-sdk';
import V_EXCHANGE_ABI from './v_exchange.json';
import V_FACTORY_ABI from './v_factory.json';

const V_FACTORY_ADDRESSES: { [chainId in ChainId]: string } = {
  // TODO: TRON: mainnet factory address
  [ChainId.MAINNET]: '0x0bdCBA8Ca6bAfcEc522F20eEF0CcE9BA603F3e43',
  [ChainId.NILE]: '0x64d5aF91C3A4aE5dB503dA8be25b5E47ad2D944e',
  [ChainId.SHASTA]: '0x735d2b61c97839d4dca5f39cdd2f49b92c3298ae',
};

const V_FACTORY_INTERFACE = new Interface(V_FACTORY_ABI);
const V_EXCHANGE_INTERFACE = new Interface(V_EXCHANGE_ABI);

export { V_FACTORY_ADDRESSES, V_FACTORY_INTERFACE, V_FACTORY_ABI, V_EXCHANGE_INTERFACE, V_EXCHANGE_ABI };
