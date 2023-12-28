import cn from 'classnames';
import { ArrowDown2, Global } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { CookieKey } from '@/base/constants/common';
import { CookiesStorage } from '@/base/libs/storage/cookie';
import { AppState } from '@/base/redux/store';
import { CurrencyType } from '@/base/types/wallet';

import InputSearch from '../input/typing/InputSearch';
import CommonModal from '../modal/commonModal/commonModal';

type SelectFiatProps = {
  onChangeMoonpayFiat?: (value: CurrencyType) => void;
};

const SelectFiat = ({ onChangeMoonpayFiat }: SelectFiatProps) => {
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { fiatSymbols, localFiat } = useSelector(
    (state: AppState) => ({
      fiatSymbols: state.wallet.fiatSymbols,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const [isShowFiatModal, setIsShowFiatModal] = useState<boolean>(false);
  const [activeMoonpayFiat, setActiveMoonpayFiat] = useState<CurrencyType>();
  const [searchInput, setSearchInput] = useState<string>('');

  useEffect(() => {
    if (activeMoonpayFiat) onChangeMoonpayFiat?.(activeMoonpayFiat);
  }, [activeMoonpayFiat]);

  useEffect(() => {
    const localFiatStorage: any = JSON.parse(String(CookiesStorage.getCookieData(CookieKey.localeFiatData)));
    if (localFiatStorage) {
      handleUpdateFiat(localFiatStorage);
    } else {
      if (fiatSymbols) setActiveMoonpayFiat(fiatSymbols[0]);
    }
  }, [fiatSymbols]);

  useEffect(() => {
    if (localFiat) {
      onChangeMoonpayFiat?.(localFiat);
      handleUpdateFiat(localFiat);
    }
  }, [localFiat]);

  const handleUpdateFiat = (crypto: CurrencyType) => {
    setActiveMoonpayFiat(crypto);
    // dispatch(changeActiveFiat(crypto));
    // sessionStorage.setItem(CookieKey.activeFiat, JSON.stringify(crypto));
    // CookiesStorage.setCookieData(CookieKey.activeFiat, String(crypto?.currency));
  };

  const filterListFiat = useMemo(() => {
    return fiatSymbols?.filter((item) => {
      return (
        String(item.name).toLowerCase().includes(searchInput.toLowerCase()) ||
        String(item.alias).toLowerCase().includes(searchInput.toLowerCase())
      );
    });
  }, [fiatSymbols, searchInput]);

  return (
    <>
      <div
        role="button"
        className="flex items-center gap-2 dark:bg-gray-700/50 bg-[#ffffff] py-2 px-2 dark:border border-0 border-solid border-gray-600 rounded"
        onClick={() => setIsShowFiatModal(true)}
      >
        {activeMoonpayFiat ? (
          <div className="flex items-center gap-3">
            <Image height={25} width={25} src={activeMoonpayFiat.logo} alt="" />
            <div className="font-normal dark:text-white text-black sm:text-[14px] text-[12px]">
              {activeMoonpayFiat.name}
            </div>
          </div>
        ) : (
          <Global />
        )}
        <ArrowDown2 className="dark:text-white text-black" />
      </div>

      <CommonModal
        show={isShowFiatModal}
        onClose={() => setIsShowFiatModal(false)}
        header={
          <div className="relative p-[20px] pb-0">
            <div className="flex items-center text-black dark:text-white gap-[10px]">
              <div className="text-[18px] font-[600]">{t('deposit:selectFiat')}</div>
            </div>
          </div>
        }
      >
        <>
          <div className="px-5 py-[10px]">
            <InputSearch value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <div className="p-5 py-5 border overflow-y-auto">
            <div className={`grid grid-cols-1 gap-2`}>
              {filterListFiat?.map((item, key) => (
                <button
                  key={key}
                  className={cn(
                    'flex rounded-md text-left px-5 py-2 hover:bg-gray-200 dark:hover:bg-gray-800 items-center',
                    {
                      'border border-solid border-amber-500': activeMoonpayFiat?.id === item.id,
                    },
                  )}
                  onClick={() => {
                    setActiveMoonpayFiat(item);
                    setIsShowFiatModal(false);
                  }}
                >
                  <div className="flex-1 flex gap-[10px] items-center">
                    <Image height={30} width={30} src={item.logo} alt="" />

                    <div className="font-semibold text-[14px]">{item.name}</div>
                  </div>
                  <div className="text-[#98A7B5] text-[14px]">{item.alias}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      </CommonModal>
    </>
  );
};

export default SelectFiat;
