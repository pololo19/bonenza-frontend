import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';
import BuyCryptoComponent from '@/components/buyCrypto/buyCrypto';
import DepositCryptoComponent from '@/components/deposit/crypto/depositCrypto';
import DepositFiatComponent from '@/components/deposit/fiat/depositFiat';

import CommonModal from '../commonModal/commonModal';

type ModalDepositProps = {
  onClose: () => void;
  show: boolean;
  children?: JSX.Element;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export enum DepositTabEnum {
  CRYPTO = 'CRYPTO',
  FIAT = 'FIAT',
  BUY_CRYPTO = 'BUY_CRYPTO',
}

export default function ModalDeposit({ show, onClose }: ModalDepositProps) {
  const { t } = useTranslation('');
  const [depositTab, setDepositTab] = useState<DepositTabEnum>(DepositTabEnum.CRYPTO);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px] sm:h-[90vh] sm:min-h-[90vh] sm:my-0"
        header={
          <>
            <div className="flex flex-col items-start">
              <div className="text-black dark:text-white md:text-[18px] text-[16px] px-[20px] sm:mt-[20px] mt-[20px] sm:mb-0 mb-[10px] font-bold">
                {t('layout:deposit')}
              </div>
              <div className="flex w-full">
                <div
                  onClick={() => setDepositTab(DepositTabEnum.CRYPTO)}
                  className={cn(
                    'flex-1 dark:text-[#C2C2C2] text-[#939699] flex-1 flex items-center justify-center border-b-2 border-solid dark:border-[#272C33] border-[#F1F3F7] sm:pt-[15px] py-[10px]',
                    {
                      'bg-gradient-to-t from-color-primary/20 !border-color-primary dark:!text-white !text-[#141414] font-[700]':
                        depositTab === DepositTabEnum.CRYPTO,
                    },
                  )}
                  role="button"
                >
                  <div className="sm:text-[16px] text-[14px]">{t('deposit:crypto')}</div>
                </div>
                <div
                  onClick={() => setDepositTab(DepositTabEnum.FIAT)}
                  className={cn(
                    'flex-1 dark:text-[#C2C2C2] text-[#939699] flex-1 flex items-center justify-center border-b-2 border-solid dark:border-[#272C33] border-[#F1F3F7] sm:pt-[15px] py-[10px]',
                    {
                      'bg-gradient-to-t from-color-primary/20 !border-color-primary dark:!text-white !text-[#141414] font-[700]':
                        depositTab === DepositTabEnum.FIAT,
                    },
                  )}
                  role="button"
                >
                  <div className="sm:text-[16px] text-[14px]">{t('deposit:fiat')}</div>
                </div>
                <div
                  onClick={() => setDepositTab(DepositTabEnum.BUY_CRYPTO)}
                  className={cn(
                    'flex-1 dark:text-[#C2C2C2] text-[#939699] flex-1 flex items-center justify-center border-b-2 border-solid dark:border-[#272C33] border-[#F1F3F7] sm:pt-[15px] py-[10px]',
                    {
                      'bg-gradient-to-t from-color-primary/20 !border-color-primary dark:!text-white !text-[#141414] font-[700]':
                        depositTab === DepositTabEnum.BUY_CRYPTO,
                    },
                  )}
                  role="button"
                >
                  <div className="sm:text-[16px] text-[14px]">{t('deposit:buyCrypto')}</div>
                </div>
              </div>
            </div>
          </>
        }
      >
        <div className="overflow-y-auto sm:p-5 p-3 pb-[80px]">
          {depositTab === DepositTabEnum.CRYPTO && <DepositCryptoComponent />}
          {depositTab === DepositTabEnum.FIAT && <DepositFiatComponent />}
          {depositTab === DepositTabEnum.BUY_CRYPTO && <BuyCryptoComponent />}
        </div>
      </CommonModal>
    </>
  );
}
