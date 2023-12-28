import { Dialog, DialogProps, Disclosure, Transition, TransitionRootProps } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';
import { FiatType } from '@/base/types/common';

type ModalRakeBackDetailProps = {
  cryptoLocked?: FiatType;
  onClose: () => void;
  show: boolean;
  setShowModalRakeBack: () => void;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalRakeBackDetail({
  show,
  onClose,
  cryptoLocked,
  setShowModalRakeBack,
}: ModalRakeBackDetailProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const { localeFiat } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      activeFiat: state.common.activeFiat,
    }),
    shallowEqual,
  );

  const getWagerAmount = (): string => {
    let amount = Number(cryptoLocked?.amountLocked) / (0.01 * 0.2);
    return `${handleLocaleSymbol(String(localeFiat?.currency ?? 'USD'))} ${currencyFormat(
      exchangeByLocaleFiat(cryptoLocked?.currency, String(localeFiat?.currency ?? 'USD'), amount),
      2,
    )}`;
  };

  const handleClickCLose = () => {
    onClose();
    setShowModalRakeBack();
  };

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
            <div className="flex min-h-full justify-center p-0 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden dark:text-[#98a7b5] text-[#31373d] dark:bg-[#1e2024] bg-white text-[14px] sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] relative transform rounded-[15px] text-left shadow-xl transition-all my-0 w-full !p-0">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-[#17181b] bg-[#f5f6fa] items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">USDT {t('deposit:rakeback')}</div>
                    <div className="group rounded-md" role="button" onClick={() => handleClickCLose()}>
                      <XMarkIcon
                        width={15}
                        className="text-[#9FA5AC] group-hover:text-black dark:group-hover:text-white w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                  </Dialog.Title>
                  <div className="dark:text-[#98a7b5] text-[#31373d] flex-col flex gap-[10px] h-[calc(100%-60px)] p-[12px] pt-0 pb-[30px] overflow-auto">
                    <div className="bg-[url('/img/reBackDetail.png')] min-h-[200px] bg-cover h-[200px] w-full bg-no-repeat relative">
                      <div className="flex flex-col items-start justify-center h-full gap-[10px] pl-8">
                        <div className="w-[190px] rounded-[5px] h-[36px] text-[#0dfd41fe] bg-[#42d04238] flex items-center justify-center gap-2">
                          <p className="text-[16px] font-bold">1 USDT ($) = 1 USD ($)</p>
                        </div>
                        <div>
                          <div className="text-[10px] mt-[2px] flex items-center justify-center text-[#98a7b5]">
                            <p className="text-white cursor-pointer text-[12px]">{t('rakeBackDetail:viewContract')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 mb-5 px-2 gap-2 flex flex-col items-center justify-between">
                      <Disclosure defaultOpen>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full  h-[40px] justify-between py-2 px-2 text-left text-sm font-medium dark:bg-[#23252a] bg-[#f5f6fa] hover:dark:bg-[#2b2f33] focus:outline-none">
                              <span className="text-white text-[14px] flex items-center gap-1 font-medium">
                                {t('rakeBackDetail:howUnlockClaim', { currency: cryptoLocked?.currency })}
                              </span>
                              <ChevronUpIcon
                                className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-[#939699]`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-[12px] px-3 py-5 text-sm dark:text-[#98a7b5] text-[#31373d] dark:bg-[#282b2f] bg-[#f5f6fa]">
                              <div className="text-white mb-4">
                                {t('rakeBackDetail:howUnlock', { currency: cryptoLocked?.currency })}
                              </div>
                              <div className="flex flex-col gap-3">
                                <p>{t('rakeBackDetail:howToUnlock1', { currency: cryptoLocked?.currency })}</p>
                                <p>{t('rakeBackDetail:howToUnlock2', { currency: cryptoLocked?.currency })}</p>
                                <p className="bg-[#213620] pl-2 font-extrabold h-7 flex items-center text-white">
                                  {t('rakeBackDetail:howToUnlock3')}
                                </p>
                                {t('rakeBackDetail:howToUnlock4', {
                                  amount: currencyFormat(Number(cryptoLocked?.amountLocked), 2),
                                  currency: cryptoLocked?.currency,
                                  wagerAmount: getWagerAmount(),
                                })}
                                <div className="text-white">
                                  {t('rakeBackDetail:howClaim', { currency: cryptoLocked?.currency })}
                                </div>
                                <p dangerouslySetInnerHTML={{ __html: t('rakeBackDetail:howToClaim1') }}></p>{' '}
                                <p>{t('rakeBackDetail:howToClaim2', { currency: cryptoLocked?.currency })}</p>{' '}
                                <p>{t('rakeBackDetail:howToClaim3', { currency: cryptoLocked?.currency })}</p>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                      <Disclosure defaultOpen>
                        {({ open }) => (
                          <>
                            <Disclosure.Button className="flex w-full h-[40px] justify-between py-2 px-2 text-left text-sm font-medium dark:bg-[#23252a] bg-[#f5f6fa] hover:dark:bg-[#2b2f33] focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                              <span className="text-white text-[14px] flex items-center gap-1 font-medium">
                                {t('rakeBackDetail:aboutCurrency', { currency: cryptoLocked?.currency })}
                              </span>
                              <ChevronUpIcon
                                className={`${open ? '' : 'rotate-180 transform'} h-5 w-5 text-[#939699]`}
                              />
                            </Disclosure.Button>
                            <Disclosure.Panel className="text-[12px] px-3 py-5 text-sm dark:text-[#98a7b5] text-[#31373d] dark:bg-[#282b2f] bg-[#f5f6fa]">
                              <div className="text-white mb-4">
                                {t('rakeBackDetail:canBeExchange', { currency: cryptoLocked?.currency })}
                              </div>
                              <div className="flex flex-col gap-3">
                                <span
                                  dangerouslySetInnerHTML={{
                                    __html: t('rakeBackDetail:canBeExchange1', { currency: cryptoLocked?.currency }),
                                  }}
                                ></span>
                                <p className="text-white mb-4">
                                  {t('rakeBackDetail:whatSpecialAbout', { currency: cryptoLocked?.currency })}
                                </p>
                                <p
                                  dangerouslySetInnerHTML={{
                                    __html: t('rakeBackDetail:whatSpecialAbout1', { currency: cryptoLocked?.currency }),
                                  }}
                                ></p>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
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
