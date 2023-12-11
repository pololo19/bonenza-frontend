import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { ElementType, Fragment, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

type ModalDepositBonusRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDepositBonusRules({ show, onClose }: ModalDepositBonusRulesProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const { localeFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
    }),
    shallowEqual,
  );

  const depositBonus = [
    {
      id: 1,
      title: t('bonus:1stDeposit'),
      img: '/img/deposit_rules1.png',
      percent: '180%',
      depositAmount: 10,
      upto: '20,000',
    },
    {
      id: 2,
      title: t('bonus:2ndDeposit'),
      img: '/img/deposit_rules2.png',
      percent: '240%',
      depositAmount: 50,
      upto: '40,000',
    },
    {
      id: 3,
      title: t('bonus:3rdDeposit'),
      img: '/img/deposit_rules3.png',
      percent: '300%',
      depositAmount: 100,
      upto: '60,000',
    },
    {
      id: 4,
      title: t('bonus:4thDeposit'),
      img: '/img/deposit_rules4.png',
      percent: '360%',
      depositAmount: 200,
      upto: '100,000',
    },
  ];

  return (
    <>
      <Transition.Root show={show} as={Fragment}>
        <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div className="flex min-h-full items-center justify-center p-0 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden text-[#98a7b5] dark:bg-[#1e2024] bg-white text-[14px] sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[90vh] relative transform rounded-[15px] text-left shadow-xl transition-all my-0 w-full !p-0">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-[#17181b] bg-[#f5f6fa] items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">{t('bonus:depositBonusRules')}</div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon width={15} className="text-[#9FA5AC] group-hover:text-white w-[1.5rem] h-[1.5rem]" />
                    </div>
                  </Dialog.Title>
                  <div className="flex-col flex gap-[10px] h-[calc(100%-60px)] p-[20px] pt-0 pb-[30px] justify-between overflow-auto">
                    <div className="pt-[20px]">
                      <div className="mt-2 text-[14px]">{t('bonus:depositBonusRulesContent')}</div>
                      <div className="text-[#98A7B5] grid grid-cols-2 gap-4 text-[14px] font-bold mb-2 mt-5">
                        {depositBonus.map((item) => (
                          <div key={item.id} className="bg-[#2D3035] rounded-[10px] relative">
                            <div className="relative text-white dark:text-black">
                              <Image
                                src={item.img}
                                className="w-full h-auto object-cover"
                                width={100}
                                height={100}
                                alt=""
                              />
                              <div className="absolute font-bold text-[14px] sm:text-[16px] max-[600px]:top-[10px] top-[16px] left-0 w-full text-center">
                                {item.title}
                              </div>
                            </div>
                            <div className="absolute w-full text-white dark:text-black top-1/2 -translate-y-2/4">
                              <p className="text-[24px] sm:text-[32px] font-bold text-center">{item.percent}</p>
                              <p className="text-[16px] sm:text-[18px] font-bold text-center">{t('bonus:Bonus')}</p>
                            </div>
                            <div className="p-[10px] max-[400px]:text-[12px] sm:text-[14px]">
                              <div className="flex item-center justify-between dark:text-[#98a7b5] text-[#31373d]">
                                <p>{t('bonus:minimum')}</p>
                                <p className="dark:text-white text-black font-semibold">
                                  {handleLocaleSymbol(localeFiat?.currency || 'USD')}
                                </p>
                              </div>
                              <div className="flex item-center justify-between dark:text-[#98a7b5] text-[#31373d]">
                                <p>{t('bonus:deposit')}</p>
                                <p className="dark:text-white text-black font-semibold">
                                  {localeFiat
                                    ? ` ${currencyFormat(
                                        exchangeByLocaleFiat('USD', String(localeFiat?.currency), item.depositAmount),
                                        0,
                                      )}`
                                    : item.depositAmount}
                                </p>
                              </div>
                              <div className="flex item-center justify-between dark:text-[#98a7b5] text-[#31373d]">
                                <p>{t('bonus:getUpTo')}</p>
                                <p className="dark:text-white text-black font-semibold">{item.upto} USDT</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
