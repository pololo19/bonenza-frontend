import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { TIME_DATE_SUBMIT_FORMAT } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate, getColorByStatus } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { RolloverType } from '@/base/types/common';

import CommonModal from '../commonModal/commonModal';

type ModalDetailTransactionProps = {
  onClose: () => void;
  show: boolean;
  transaction: RolloverType;
  titleModal?: String;
  type?: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDetailsRollover({ show, onClose, transaction }: ModalDetailTransactionProps) {
  const { t } = useTranslation('');
  const exchange = useExchange();

  const { localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const replaceStatus = (status: string) => {
    return status.split('_').join(' ');
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[400px]"
        header={
          <div className="relative sm:px-[30px] px-[20px] py-[20px] dark:bg-color-header-primary bg-[#f5f6fa]">
            <div className="text-[16px] dark:text-white text-black font-[600]">
              {String(t('transaction:rolloverDetails'))}
            </div>
          </div>
        }
      >
        <div className=" min-h-[516px] overflow-auto h-full bg-cover p-4">
          <div className="flex flex-col items-center py-5 gap-2">
            <Image height={40} width={40} src={transaction.currencyLogo} alt="" />
            <div
              className={cn('text-[22px]', {
                'text-red-500': transaction.type === 'Withdraw',
                'text-color-primary': Number(transaction.amount) >= 0,
                'text-[#FD6E0B]': Number(transaction.amount) < 0,
              })}
            >
              <span>
                {transaction.type === 'Withdraw' && <span>- {currencyFormat1(transaction.amount, 6)}</span>}
                {transaction.type !== 'Withdraw' && (
                  <span>
                    {Number(transaction.amount) >= 0 ? '+' : ''}{' '}
                    {viewInFiat
                      ? currencyFormat1(transaction.amountUsd, 2, localFiat?.name || 'USD')
                      : currencyFormat1(transaction.amount, 8, '', false)}
                  </span>
                )}
              </span>
              <span className="font-semibold dark:text-white text-black ml-1">{transaction.currency}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-4 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">{String(t('transaction:status'))}</span>
              <div className="flex gap-2 items-center">
                <div className={`w-[5px] h-[5px] rounded-full ${getColorByStatus(transaction.status)}`}></div>
                <div className="dark:text-white text-black text-[12px] break-keep	">
                  {replaceStatus(transaction.status)?.charAt(0).toUpperCase() +
                    replaceStatus(transaction.status)?.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[#31373D] dark:text-color-text-primary">
              <span className="">{String(t('transaction:type'))}</span>
              <div className="flex gap-2 items-center">
                <span className="text-black dark:text-white">{transaction.type}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">{String(t('transaction:createdOn'))}</span>
              <span className="text-black dark:text-white">
                {formatDate(new Date(transaction.createdAt), TIME_DATE_SUBMIT_FORMAT)}
              </span>
            </div>
            <div className="h-[1px] w-full dark:bg-[#98A7B5] bg-[#f5f6fa]" />
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">
                {String(t('transaction:rolloverTimes'))}
              </span>
              <span className="text-black dark:text-white">{transaction.times}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">
                {String(t('transaction:totalWagerRequired'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>{currencyFormat1(transaction.amountUsd * exchange, 2, localFiat?.name || 'USD')}</>
                ) : (
                  currencyFormat1(transaction.amount, 4, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">
                {String(t('transaction:wagerComplete'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>{currencyFormat1(transaction.wagerCompletedUsdAmount * exchange, 2, localFiat?.name || 'USD')}</>
                ) : (
                  currencyFormat1(transaction.wagerCompletedAmount, 4, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">
                {String(t('transaction:pendingWagerRequired'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>{currencyFormat1(transaction.pendingWagerRequiredAmount * exchange, 2, localFiat?.name || 'USD')}</>
                ) : (
                  currencyFormat1(transaction.pendingWagerRequiredAmount, 4, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary">
                {String(t('transaction:withdrawableFunds'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(transaction.withdrawableFoundsUsdAmount * exchange, 2, localFiat?.name || 'USD')}
                  </>
                ) : (
                  currencyFormat1(transaction.withdrawableFoundsAmount, 4, '', false)
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-color-text-primary underline cursor-pointer">
                {String(t('transaction:cancelBonus'))}
              </span>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
