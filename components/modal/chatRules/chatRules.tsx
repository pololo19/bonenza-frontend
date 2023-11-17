import { ElementType, Fragment, useRef } from 'react';
import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/base/config/i18next';

type ChatRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalChatRules({ show, onClose }: ChatRulesProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  return (
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
          <div className="flex min-h-full items-center justify-center p-4 text-center items-center p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
            >
              <Dialog.Panel className="text-[#98a7b5] dark:bg-[#1c1c20] text-[12px] sm:text-[14px] max-w-[464px] h-fit flex flex-col relative transform rounded-[15px] bg-gray-800 text-left shadow-xl transition-all my-8 w-full p-[20px] max-h-[80vh]">
                <Dialog.Title as="div" className="relative mb-2 flex justify-between items-center">
                  <div className="flex gap-4 items-center justify-between w-full h-[32px]">
                    <div className="dark:text-white text-black text-[14px] sm:text-[16px]">{t('chat:chatRules')}</div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon width={15} className="text-[#9FA5AC] group-hover:text-white w-[1.5rem] h-[1.5rem]" />
                    </div>
                  </div>
                </Dialog.Title>
                <div className="flex flex-col">
                  <p className="mt-3">{t('chat:chatRules1')}</p>
                  <p className="mt-3">{t('chat:chatRules2')}</p>
                  <p className="mt-3">{t('chat:chatRules3')}</p>
                  <p className="mt-3">{t('chat:chatRules4')}</p>
                  <p className="mt-3">{t('chat:chatRules5')}</p>
                  <p className="mt-3">{t('chat:chatRules6')}</p>
                  <p className="mt-5">{t('chat:chatNote')}</p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
