import React, { useState, useCallback } from 'react';
import Onboard, { WalletState } from '@web3-onboard/core';
import injectedModule, { ProviderLabel } from '@web3-onboard/injected-wallets';
import ledgerModule from '@web3-onboard/ledger';

import { private_keys as ganachePrivateKeys } from '../../../../amplify/mock-data/colonyNetworkArtifacts/ganache-accounts.json';

import ganacheWalletModule from './ganacheWalletModule';

const injected = injectedModule({
  filter: {
    [ProviderLabel.Detected]: false,
  },
});

const ledger = ledgerModule();

const onboard = Onboard({
  wallets: [
    injected,
    ledger,
    ...(process.env.NODE_ENV === 'development'
      ? Object.keys(ganachePrivateKeys).map((empty, index) =>
          ganacheWalletModule(index),
        )
      : []),
  ],
  chains: [
    {
      id: '0x2889B3',
      token: 'ETH',
      label: 'Ganache',
      rpcUrl: 'http://localhost:8545',
    },
  ],
  accountCenter: {
    desktop: { enabled: false },
    mobile: { enabled: false },
  },
  connect: {
    showSidebar: false,
  },
  notify: {
    desktop: { enabled: false, transactionHandler: () => {} },
    mobile: { enabled: false, transactionHandler: () => {} },
  },
  appMetadata: {
    name: 'Colony CDapp',
    icon: `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg viewBox="0 0 30 30"><path d="M 14.996094 0 A 3.8034866 3.8034866 0 0 0 11.191406 3.8027344 A 3.8034866 3.8034866 0 0 0 14.996094 7.6074219 A 3.8034866 3.8034866 0 0 0 18.798828 3.8027344 A 3.8034866 3.8034866 0 0 0 14.996094 0 z M 8.1484375 1.6445312 L 1.6445312 8.1484375 L 8.1484375 8.1484375 L 8.1484375 1.6445312 z M 21.841797 1.6445312 L 21.841797 8.1484375 L 28.355469 8.1484375 L 21.841797 1.6445312 z M 15.001953 8.9160156 L 8.9179688 15.001953 L 15.001953 21.085938 L 21.087891 15.001953 L 15.001953 8.9160156 z M 3.8027344 11.191406 A 3.8034866 3.8034866 0 0 0 0 14.996094 A 3.8034866 3.8034866 0 0 0 3.8027344 18.798828 A 3.8034866 3.8034866 0 0 0 7.6074219 14.996094 A 3.8034866 3.8034866 0 0 0 3.8027344 11.191406 z M 26.197266 11.191406 A 3.8034866 3.8034866 0 0 0 22.392578 14.996094 A 3.8034866 3.8034866 0 0 0 26.197266 18.798828 A 3.8034866 3.8034866 0 0 0 30 14.996094 A 3.8034866 3.8034866 0 0 0 26.197266 11.191406 z M 1.6445312 21.841797 L 8.1484375 28.355469 L 8.1484375 21.841797 L 1.6445312 21.841797 z M 21.841797 21.841797 L 21.841797 28.355469 L 28.355469 21.841797 L 21.841797 21.841797 z M 14.996094 22.392578 A 3.8034866 3.8034866 0 0 0 11.191406 26.197266 A 3.8034866 3.8034866 0 0 0 14.996094 30 A 3.8034866 3.8034866 0 0 0 18.798828 26.197266 A 3.8034866 3.8034866 0 0 0 14.996094 22.392578 z " style="fill:#00284b;stroke-width:0.95087165" /></svg>`,
    description: `A interation of the Colony Dapp sporting both a fully decentralized operating mode, as well as a mode enhanced by a metadata caching layer`,
  },
});

const WalletTests = () => {
  const [wallet, setWallet] = useState<WalletState>();

  const connect = useCallback(async () => {
    const wallets = await onboard.connectWallet();
    setWallet(wallets[0]);
  }, [setWallet]);

  const disconnect = useCallback(async () => {
    await onboard.disconnectWallet({ label: wallet?.label || 'any' });
    setWallet(undefined);
  }, [setWallet, wallet]);

  return (
    <div>
      {wallet && (
        <>
          <div>
            <p>{wallet.label} wallet connected!</p>
            <p>Address: {wallet.accounts[0].address}</p>
            {wallet.accounts[0].balance && (
              <p>Balance: {wallet.accounts[0].balance.ETH} ETH</p>
            )}
          </div>
          <br />
        </>
      )}
      <button
        type="button"
        onClick={wallet ? () => disconnect() : () => connect()}
      >
        {wallet ? 'disconnect' : 'connect'}
      </button>
    </div>
  );
};

export default WalletTests;
