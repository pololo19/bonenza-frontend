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
        panelClass="sm:!max-w-[530px] sm:h-[90vh] sm:min-h-[90vh] sm:my-0 "
        header={
          <>
            <div className="flex flex-col items-start dark:bg-color-header-primary px-[20px] py-[20px] gap-[20px]">
              <div className="text-black dark:text-white md:text-[18px] text-[16px] sm:mb-0 mb-[10px] font-bold">
                {t('layout:deposit')}
              </div>
              <div className="flex w-full">
                <div
                  onClick={() => setDepositTab(DepositTabEnum.CRYPTO)}
                  className={cn(
                    'flex-1 dark:bg-color-header-secondary dark:text-color-text-primary text-color-text-primary flex items-center justify-center py-[10px]',
                    {
                      'dark:!bg-color-active-secondary dark:!text-white rounded-[3px]':
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
                    'flex-1 dark:bg-color-header-secondary dark:text-color-text-primary text-color-text-primary flex items-center justify-center py-[10px]',
                    {
                      'dark:!bg-color-active-secondary dark:!text-white rounded-[3px]':
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
                    'flex-1 dark:bg-color-header-secondary dark:text-color-text-primary text-color-text-primary flex items-center justify-center py-[10px]',
                    {
                      'dark:!bg-color-active-secondary dark:!text-white rounded-[3px]':
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
