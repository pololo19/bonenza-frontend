import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { Star1 } from 'iconsax-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey, LANGUAGE_DATA } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { changeViewInFiat } from '@/base/redux/reducers/common.reducer';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeMultiLanguageTab,
} from '@/base/redux/reducers/modal.reducer';
import { setLocalFiat } from '@/base/redux/reducers/wallet.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import { CurrencyType } from '@/base/types/wallet';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';

type ModalFiatProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export enum MultiLanguageTabEnum {
  LANGUAGE = 'LANGUAGE',
  FIAT = 'FIAT',
}

export default function ModalMultiLanguage({ show, onClose }: ModalFiatProps) {
  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const { multiLanguageTab, activeFiat, isLogin, viewInFiat, fiatSymbols, localFiat } = useSelector(
    (state: AppState) => ({
      multiLanguageTab: state.modal.multiLanguageTab,
      fiatArray: state.common.fiatArray,
      // localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
      viewInFiat: state.common.viewInFiat,
      isLogin: state.auth.isLogin,

      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation('');

  const handleChangeLang = (item: any) => {
    i18n.changeLanguage(item.key);
    CookiesStorage.setCookieData(CookieKey.lang, item.key);

    if (router.pathname !== '/game') {
      // change currency based on language
      dispatch(changeViewInFiat(true));
      // dispatch(changeLocaleFiat(item));
      CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
    }
  };

  const handleChangeLocaleFiat = (item: CurrencyType) => {
    if (isLogin) {
      // let newItem: FiatType = item.currency === 'USD' ? { ...item, currencyOld: activeFiat?.currency } : item;
      dispatch(changeViewInFiat(true));

      console.log(item, '-----76');
      dispatch(setLocalFiat(item));
      // dispatch(changeActiveFiat(item));
      // CookiesStorage.setCookieData(CookieKey.localeFiat, String(item?.currency));
      // CookiesStorage.setCookieData(CookieKey.activeFiat, String(item?.currency));
    } else {
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
    }
  };

  console.log(localFiat, '-----85');

  return (
    <>
      {isLoading && <Loader />}
      <CommonModal
        show={show}
        onClose={onClose}
        header={
          <div className="flex w-full">
            <div
              onClick={() => dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.LANGUAGE))}
              className={cn(
                'min-w-[150px] text-black dark:text-[#C2C2C2] flex-1 flex items-center justify-center border-b-2 border-solid border-[#272C33] pb-[10px] pt-[25px]',
                {
                  'bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F] text-black dark:text-white font-[700]':
                    multiLanguageTab === MultiLanguageTabEnum.LANGUAGE,
                },
              )}
              role="button"
            >
              <div className="sm:text-[16px] text-[14px]">{t('language:language')}</div>
            </div>
            <div
              onClick={() => dispatch(changeMultiLanguageTab(MultiLanguageTabEnum.FIAT))}
              className={cn(
                'min-w-[150px] text-black dark:text-[#C2C2C2] flex-1 flex items-center justify-center border-b-2 border-solid border-[#272C33] pb-[10px] pt-[25px]',
                {
                  'bg-gradient-to-t from-[#F61B4F]/20 border-[#F61B4F] text-black dark:text-white font-[700]':
                    multiLanguageTab === MultiLanguageTabEnum.FIAT,
                  'sm:flex hidden': !isLogin,
                },
              )}
              role="button"
            >
              <div className="sm:text-[16px] text-[14px]">{t('language:viewInFiat')}</div>
            </div>
          </div>
        }
      >
        <div className="overflow-y-auto dark:text-white text-black">
          <div>
            <div className="p-5 py-5 border overflow-y-auto">
              <div
                className={`grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2 ${
                  multiLanguageTab === MultiLanguageTabEnum.LANGUAGE ? 'block' : 'hidden'
                }`}
              >
                {LANGUAGE_DATA.map((item, key) => (
                  <button
                    key={key}
                    className={`sm:py-[15px] py-[10px] rounded-md text-left ps-5 dark:hover:text-white text-[14px] dark:text-white text-black ${
                      item.key === i18n.language
                        ? 'bg-primary'
                        : 'hover:bg-gray-200 hover:text-black dark:hover:bg-gray-600'
                    }`}
                    onClick={() => {
                      handleChangeLang(item);
                      onClose();
                    }}
                  >
                    {item.language}
                  </button>
                ))}
              </div>
              <div
                className={`${
                  !isLogin && multiLanguageTab === MultiLanguageTabEnum.FIAT ? 'hidden sm:grid' : ''
                } grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-2 ${
                  multiLanguageTab === MultiLanguageTabEnum.FIAT ? 'block' : 'hidden'
                }`}
              >
                <>
                  <div
                    role="button"
                    className={cn(
                      'sm:py-[12px] py-[10px] rounded-md text-left px-5 flex items-center justify-between dark:hover:text-white w-full text-[14px]',
                      {
                        'bg-primary': !viewInFiat,
                        'hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-black': viewInFiat,
                      },
                    )}
                    onClick={() => {
                      dispatch(changeViewInFiat(false));
                      dispatch(setLocalFiat(null));
                      onClose();
                    }}
                  >
                    <div className="flex gap-3 items-center w-full">
                      <div className="w-[30px] h-[30px] rounded-full bg-gray-300 flex items-center justify-center">
                        <Star1 size={15} className="text-gray-700" />
                      </div>
                      <div>{t('language:none')}</div>
                    </div>
                  </div>
                </>
                <div className="md:col-span-3 sm:col-span-2 col-span-1"></div>
                {fiatSymbols.map((item, key) => (
                  <div
                    key={key}
                    role="button"
                    className={cn(
                      'sm:py-[12px] py-[10px] rounded-md text-left px-5 flex items-center justify-between dark:hover:text-white w-full text-[14px]',
                      {
                        'bg-primary': viewInFiat && item.id === localFiat?.id,
                        'hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-black': true,
                      },
                    )}
                    onClick={() => {
                      handleChangeLocaleFiat(item);
                      onClose();
                    }}
                  >
                    <div className="flex gap-3 items-center w-full">
                      <Image height={30} width={30} src={item.logo} alt="" />
                      <div>{item.name}</div>
                      <div
                        className={cn('text-[12px] truncate w-full dark:text-[#C2C2C2] text-gray-500', {
                          '!text-gray-200': viewInFiat && item.id === localFiat?.id,
                        })}
                      >
                        {item.alias}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
