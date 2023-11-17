import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { CodeResponse, useGoogleLogin } from '@react-oauth/google';
import { useWeb3React } from '@web3-react/core';
import Image from 'next/image';
import { ElementType, useEffect, useMemo, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { LOGIN_REGISTRATION_METHOD, TOAST_ENUM } from '@/base/constants/common';
import { blockExplorer, chainId, metamask, rpcUrls, walletConnect } from '@/base/constants/contracts';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { convertUserInfo, getMessageMetamask } from '@/base/libs/utils';
import { saveUserInfo } from '@/base/redux/reducers/auth.reducer';
import { RootState } from '@/base/types/root-state';

import { changeIsShowAuthenticationModal } from '@/base/redux/reducers/modal.reducer';
import Loader from '@/components/common/preloader/loader';

declare let window: any;

type LoginWalletProps = {
  onClose?: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function LoginWallet({ onClose }: LoginWalletProps) {
  const { library, account, activate: activateNetwork, deactivate } = useWeb3React();
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { isLogin, wallet } = useSelector(
    (state: RootState) => ({
      isLogin: state.auth.isLogin,
      wallet: state.auth.wallet,
    }),
    shallowEqual,
  );

  const googleLogin = async (codeResponse: Omit<CodeResponse, 'error' | 'error_description' | 'error_uri'>) => {
    try {
      setIsLoading(true);
      const resToken = await api.post('auth/save-info-login-google', {
        code: codeResponse.code,
      });
      CookiesStorage.setAccessToken(resToken.data.data.accessToken);
      const resUser = await api.get('auth/get-user-info');
      if (!resUser.data.data.isDeposit) {
        await api.post('deposit/create-deposit-address');
      }
      dispatch(
        saveUserInfo({
          isLogin: true,
          ...convertUserInfo(resUser.data.data),
        }),
      );
      onClose();
    } catch (error: any) {
      if (error?.response?.data?.msg === 'Email was taken') {
        toast.error(String(t('authentication:emailTaken')), { containerId: TOAST_ENUM.MODAL });
      } else {
        toast.error(String(t('authentication:loginGoogleFailed')), { containerId: TOAST_ENUM.MODAL });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: googleLogin,
    flow: 'auth-code',
  });

  const handleTelegram = async () => {
    try {
      setIsLoading(true);
      window.Telegram.Login.auth({ bot_id: process.env.TELEGRAM_BOT_ID, request_access: true }, async (data: any) => {
        if (!data) {
          setIsLoading(false);
          return;
        }
        const resToken = await api.post('auth/save-info-login-telegram', data);
        CookiesStorage.setAccessToken(resToken.data.data.accessToken);
        const resUser = await api.get('auth/get-user-info');
        if (!resUser.data.data.isDeposit) {
          await api.post('deposit/create-deposit-address');
        }
        dispatch(
          saveUserInfo({
            isLogin: true,
            ...convertUserInfo(resUser.data.data),
          }),
        );
        dispatch(changeIsShowAuthenticationModal(false));
      });
    } catch (error) {
      toast.error(String(t('authentication:loginTelegramFailed')), { containerId: TOAST_ENUM.MODAL });
    } finally {
      setIsLoading(false);
    }
  };

  const switchNetwork = async () => {
    const provider = await metamask.getProvider();
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(chainId).toString(16)}`,
          },
        ],
      });
      await activateNetwork(metamask);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(chainId).toString(16)}`,
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'Binance Coin',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: rpcUrls,
                blockExplorerUrls: [blockExplorer],
              },
            ],
          });
          await activateNetwork(metamask);
        } catch (error) {}
      }
    }
  };

  const switchNetworkTrustWallet = async () => {
    const provider = await walletConnect.getProvider();
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: `0x${Number(chainId).toString(16)}`,
          },
        ],
      });
      await activateNetwork(walletConnect);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${Number(chainId).toString(16)}`,
                chainName: 'Binance Smart Chain Mainnet',
                nativeCurrency: {
                  name: 'Binance Coin',
                  symbol: 'BNB',
                  decimals: 18,
                },
                rpcUrls: rpcUrls,
                blockExplorerUrls: [blockExplorer],
              },
            ],
          });
          await activateNetwork(walletConnect);
        } catch (error) {}
      }
    }
  };

  const handleConnectMetamask = async () => {
    setIsLoading(true);
    await activateNetwork(metamask, async (error) => {
      if (error.toString().includes('No Ethereum provider')) {
        window.open('https://metamask.app.link/dapp/bonenza.com');
        return;
      }
      if (window.ethereum && window?.ethereum?.networkVersion != chainId) {
        await switchNetwork();
        return;
      }
    });
    setIsLoading(false);
  };

  const handleConnectWalletConnect = async () => {
    setIsLoading(true);
    await activateNetwork(walletConnect, async (error) => {
      if (error.toString().includes('No Ethereum provider')) {
        window.open(`https://link.trustwallet.com/open_url?coin_id=${chainId}&url=https://bonenza.com`);
        return;
      }
      if (window?.ethereum && window?.ethereum?.networkVersion != chainId) {
        switchNetworkTrustWallet();
        return;
      }
    });
    setIsLoading(false);
  };

  const handleConnectTrustWallet = async () => {
    setIsLoading(true);
    await activateNetwork(metamask, async (error) => {
      if (error.toString().includes('No Ethereum provider')) {
        window.open(`https://link.trustwallet.com/open_url?coin_id=${chainId}&url=https://bonenza.com`);
        return;
      }
      if (window?.ethereum && window?.ethereum?.networkVersion != chainId) {
        switchNetwork();
        return;
      }
    });
    setIsLoading(false);
  };

  const handleClickMethod = async (item: { image: string; name: string; href: string }) => {
    if (item.name === 'MetaMask') {
      await handleConnectMetamask();
    } else if (item.name === 'TrustWallet') {
      await handleConnectTrustWallet();
    } else if (item.name === 'WalletConnect') {
      await handleConnectWalletConnect();
    }
  };

  const signMessage = async () => {
    try {
      let message = getMessageMetamask(String(account));
      if (!library) return;
      let signature;
      try {
        signature = await library.provider.request({
          method: 'personal_sign',
          params: [message, account],
        });
      } catch (error) {
        deactivate();
        return;
      }
      const resToken = await api.post('auth', {
        publicAddress: account,
        signature: signature,
      });
      CookiesStorage.setAccessToken(resToken.data.data.accessToken);
      const resUser = await api.get('auth/get-user-info');
      if (!resUser.data.data.isDeposit) {
        await api.post('deposit/create-deposit-address');
      }
      dispatch(
        saveUserInfo({
          isLogin: true,
          ...convertUserInfo(resUser.data.data),
        }),
      );
      onClose();
    } catch (error) {
      toast.error(String(t('authentication:loginWalletFailed')), { containerId: TOAST_ENUM.MODAL });
      deactivate();
    }
  };

  const handleChangeAccount = async () => {
    try {
      setIsLoading(true);
      if (!account) return;
      if (isLogin) return;
      if (account === wallet) return;
      await signMessage();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const prevCountRef = useRef<any>();

  useEffect(() => {
    if (prevCountRef?.current === account) return;
    handleChangeAccount();
    prevCountRef.current = account;
  }, [account, isLogin]);

  const listWalletConnector = useMemo(() => {
    let listConnector = LOGIN_REGISTRATION_METHOD;

    if (!window.trustwallet && !isMobile) {
      listConnector = listConnector.filter((e) => e.name !== 'TrustWallet');
    } else if (window.trustwallet) {
      listConnector = listConnector.filter((e) => e.name !== 'MetaMask');
    } else if (!window.ethereum?.isMetaMask) {
      listConnector = listConnector.filter((e) => e.name !== 'TrustWallet');
    } else if (!window.trustwallet && !window.ethereum?.isMetaMask) {
      listConnector = LOGIN_REGISTRATION_METHOD;
    }
    return listConnector;
  }, [isMobile]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="w-full text-center text-black dark:text-white text-[14px] font-[600]">
        <span className="">{t('authentication:orContinueWith')}</span>
        <div className="flex flex-row items-center justify-center gap-[10px] mt-[15px]">
          <div
            className="bg-white dark:bg-[#12181F] hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-[20px]"
            onClick={() => handleGoogleLogin()}
          >
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/google.svg'} alt="" className="inline w-[30px]" />
            </button>
          </div>
          <div
            className="bg-white dark:bg-[#12181F] hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-[20px]"
            onClick={handleTelegram}
          >
            <button className="px-2 py-2 w-full text-white">
              <Image height={30} width={30} src={'/img/telegram.svg'} alt="" className="inline w-[30px]" />
            </button>
          </div>
          {listWalletConnector.map((item, index) => (
            <div
              onClick={() => handleClickMethod(item)}
              key={index}
              className="bg-white dark:bg-[#12181F] hover:bg-gray-200 dark:hover:bg-gray-700 p-0.5 font-semibold rounded-[20px]"
            >
              <button className="px-2 py-2 w-full text-white">
                <Image height={30} width={30} src={item.image} alt="" className="inline w-[30px]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
