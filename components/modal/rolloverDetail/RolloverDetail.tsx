import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { TIME_DATE_SUBMIT_FORMAT } from '@/base/constants/common';
import {
  currencyFormat,
  exchangeByLocaleFiat,
  formatDate,
  getColorByStatus,
  handleLocaleSymbol,
} from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalDetailTransactionProps = {
  onClose: () => void;
  show: boolean;
  transaction?: any;
  titleModal?: String;
  type?: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDetailsRollover({ show, onClose, transaction }: ModalDetailTransactionProps) {
  const { t } = useTranslation('');

  const { localeFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      viewInFiat: state.common.viewInFiat,
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
          <div className="relative sm:px-[30px] px-[20px] py-[20px] dark:bg-[#161D26] bg-[#f5f6fa]">
            <div className="text-[16px] dark:text-white text-black font-[600]">
              {String(t('transaction:rolloverDetails'))}
            </div>
          </div>
        }
      >
        <div className=" min-h-[516px] overflow-auto h-full bg-cover p-4 dark:bg-[#25262B] bg-white">
          <div className="flex flex-col items-center py-5 gap-2">
            <Image height={40} width={40} src={`/img/fiats/${transaction?.symbol}.png`} alt="" />
            <div
              className={cn('text-[22px]', {
                'text-red-500': transaction.type.name === 'Withdraw',
                'text-color-primary': Number(transaction?.amount) >= 0,
                'text-[#FD6E0B]': Number(transaction?.amount) < 0,
              })}
            >
              <span>
                {transaction.type.name === 'Withdraw' && <span>- {currencyFormat(transaction?.amount, 6)}</span>}
                {transaction.type.name !== 'Withdraw' && (
                  <span>
                    {Number(transaction?.amount) >= 0 ? '+' : ''} {currencyFormat(transaction?.amount, 6)}
                  </span>
                )}
              </span>
              <span className="font-semibold dark:text-white text-black ml-1">{transaction?.symbol}</span>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-4 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:status'))}</span>
              <div className="flex gap-2 items-center">
                <div className={`w-[5px] h-[5px] rounded-full ${getColorByStatus(transaction.status)}`}></div>
                <div className="dark:text-white text-black text-[12px] break-keep	">
                  {replaceStatus(transaction.status)?.charAt(0).toUpperCase() +
                    replaceStatus(transaction.status)?.slice(1)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-[#31373D] dark:text-[#98A7B5]">
              <span className="">{String(t('transaction:type'))}</span>
              <div className="flex gap-2 items-center">
                <span className="text-black dark:text-white">{transaction.type}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:createdOn'))}</span>
              <span className="text-black dark:text-white">
                {formatDate(new Date(transaction.time), TIME_DATE_SUBMIT_FORMAT)}
              </span>
            </div>
            <div className="h-[1px] w-full dark:bg-[#98A7B5] bg-[#f5f6fa]" />
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:rolloverTimes'))}</span>
              <span className="text-black dark:text-white">{transaction.rolloverTimes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:totalWagerRequired'))}</span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                    {currencyFormat(
                      exchangeByLocaleFiat(
                        transaction?.symbol,
                        String(localeFiat?.currency),
                        transaction?.totalWagerRequired,
                      ),
                      2,
                    )}
                  </>
                ) : (
                  `$${currencyFormat(Number(transaction.totalWagerRequired), 2)}`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:wagerComplete'))}</span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                    {currencyFormat(
                      exchangeByLocaleFiat(
                        transaction?.symbol,
                        String(localeFiat?.currency),
                        transaction?.wagerComplete,
                      ),
                      2,
                    )}
                  </>
                ) : (
                  `$${currencyFormat(Number(transaction.wagerComplete), 2)}`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">
                {String(t('transaction:pendingWagerRequired'))}
              </span>
              <span className="text-black dark:text-white">
                {viewInFiat ? (
                  <>
                    {handleLocaleSymbol(String(localeFiat?.currency))}{' '}
                    {currencyFormat(
                      exchangeByLocaleFiat(
                        transaction?.symbol,
                        String(localeFiat?.currency),
                        transaction.totalWagerRequired - transaction.wagerComplete,
                      ),
                      2,
                    )}
                  </>
                ) : (
                  `$${currencyFormat(Number(transaction.totalWagerRequired - transaction.wagerComplete), 2)}`
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5]">{String(t('transaction:withdrawableFunds'))}</span>
              <span className="text-black dark:text-white">
                {currencyFormat(Number(transaction.withdrawableFunds), 2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#31373D] dark:text-[#98A7B5] underline cursor-pointer">
                {String(t('transaction:cancelBonus'))}
              </span>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
