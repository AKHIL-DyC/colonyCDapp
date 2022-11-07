import React, {
  createContext,
  useState,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';
import { gql } from '@apollo/client';

import { Wallet, User } from '~types';
import { getCurrentUser } from '~gql';

import { getContext, ContextModule } from './index';

export const AppContext = createContext<{
  wallet?: Wallet;
  user?: User;
  userLoading?: boolean;
  updateWallet?: () => void;
}>({});

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  let initialWallet;
  let initialUser;

  /*
   * Wallet
   */
  try {
    initialWallet = getContext(ContextModule.Wallet);
  } catch (error) {
    // silent
    // It means that it was not set in context yet
  }

  const [wallet, setWallet] = useState(initialWallet);
  const [user, setUser] = useState(initialUser);
  const [userLoading, setUserLoading] = useState(false);

  const updateUser = useCallback((address) => {
    if (address) {
      try {
        setUserLoading(true);
        const apolloClient = getContext(ContextModule.ApolloClient);
        const query = apolloClient.query({
          query: gql(getCurrentUser),
          variables: { address },
        });
        query.then(({ data }) => {
          const [currentUser] = data?.getUserByAddress.items || [];
          if (currentUser) {
            setUser(currentUser);
          }
          setUserLoading(false);
        });
      } catch (error) {
        console.error(error);
        setUserLoading(false);
      }
    }
  }, []);

  const updateWallet = useCallback((): void => {
    try {
      const updatedWallet = getContext(ContextModule.Wallet);
      setWallet(updatedWallet);
      // Update the user as soon as the wallet address changes
      if (updatedWallet?.address !== wallet?.address) {
        updateUser(updatedWallet?.address);
      }
    } catch (error) {
      if (wallet) {
        // It means that the user logged out
        setWallet(undefined);
        setUser(undefined);
      }
      // It means that it was not set in context yet
    }
  }, [updateUser, wallet]);

  const appContext = useMemo<{
    wallet?: Wallet;
    user?: User;
    userLoading?: boolean;
    updateWallet: () => void;
  }>(
    () => ({ wallet, user, userLoading, updateWallet }),
    [updateWallet, user, userLoading, wallet],
  );

  return (
    <AppContext.Provider value={appContext}>{children}</AppContext.Provider>
  );
};
