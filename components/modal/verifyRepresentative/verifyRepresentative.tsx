import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef } from 'react';
import Image from 'next/image';

import { useTranslation } from '@/base/config/i18next';
type ModalVerifyRepresentativeProp = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalVerifyRepresentative({ show, onClose }: ModalVerifyRepresentativeProp) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');

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
            <div className="flex min-h-full items-center justify-center sm:p-4 text-center items-center p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden dark:text-[#98a7b5] text-[#31373d] dark:bg-[#1e2024] bg-white text-[14px] w-full sm:max-w-[464px] h-screen sm:h-[720px] flex flex-col relative transform max-sm:rounded-none sm:rounded-[15px] text-left shadow-xl transition-all w-full p-[20px] sm:max-h-[80vh]">
                  <Dialog.Title as="div" className="relative mb-2 flex justify-between">
                    <div className="flex flex-1 justify-center items-center pt-5">
                      <div className="flex items-center gap-[10px] pr-[20px] border-r border-solid border-[#31383d80]">
                        <Image src="/img/logo-mobile.png" width={24} height={24} alt="" />
                        <p className="text-[16px] dark:text-white text-black font-bold mb-2 uppercase">Bonenza</p>
                      </div>
                      <p className="dark:text-white text-black font-semibold pl-5">
                        {t('footer:official')} <br />
                        {t('footer:mediaAuthenticator')}
                      </p>
                    </div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon
                        width={15}
                        className="text-[#9FA5AC] group-hover:text-black dark:group-hover:dark:text-white text-black w-[1.5rem] h-[1.5rem]"
                      />
                    </div>
                  </Dialog.Title>
                  <div className="dark:text-[#98a7b5] text-[#37313d]">
                    <div className="flex justify-center my-[32px]">
                      <CheckBadgeIcon width={48} height={48} className="text-[#f59e0b]" />
                    </div>
                    <div className="uppercase text-[18px] sm:text-[22px] font-bold flex justify-center mb-3">
                      <span>Bonenza </span> &nbsp; {t('footer:agentsAuthenticator')}
                    </div>
                    <div className="text-center mx-4">{t('footer:preventFraud')}</div>
                    <div className="text-center mt-[50px]">{t('footer:pleaseType')}</div>
                    <div
                      className={`h-[56px] rounded relative dark:bg-[#25272b] bg-[#f5f6fa] flex justify-between items-center mt-5 relative`}
                    >
                      <input
                        type="text"
                        className="px-4 h-full dark:bg-[#25272b] bg-[#f5f6fa] flex-1 dark:text-white text-black outline-0 border-0"
                        placeholder="Please enter Telegram/Discord ID"
                      />
                      <button className="h-[48px] rounded absoulte right-[4px] top-[4px] flex justify-center items-center w-[88px] hover:opacity-0.9 bg-[#f59e0b]">
                        <MagnifyingGlassIcon width={20} height={20} className="dark:text-white text-black" />
                      </button>
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
