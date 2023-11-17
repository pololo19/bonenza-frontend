import { ElementType, Fragment, useRef } from 'react';
import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/base/config/i18next';
import RolloverPageAuth from '@/base/pages/rollover/index.page';

type RolloverProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalRollover({ show, onClose }: RolloverProps) {
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
          <div className="flex min-h-full items-center justify-center sm:p-4 text-center items-center m-auto p-0 sm:w-[90%] max-w-[900px]">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
              enterTo="opacity-100 translate-y-0 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 scale-100"
              leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
            >
              <Dialog.Panel className="text-[#98a7b5] text-[12px] sm:text-[14px] w-full h-[100vh] sm:h-fit flex flex-col relative transform rounded-[15px] text-left shadow-xl transition-all m-0 sm:my-8 w-full p-0 max-h-full sm:max-h-[80vh]">
                <Dialog.Title
                  as="div"
                  className="relative flex justify-between items-center px-[20px] py-14px dark:bg-[#1c1c20] bg-[#f5f6fa]"
                >
                  <div className="flex gap-4 items-center justify-between w-full h-[32px]">
                    <div className="dark:text-white text-black text-[14px] sm:text-[16px]">Rollover Overview</div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon width={15} className="text-[#9FA5AC] group-hover:text-white w-[1.5rem] h-[1.5rem]" />
                    </div>
                  </div>
                </Dialog.Title>
                <div className="max-sm:flex-1 flex flex-col dark:bg-[#31343D] bg-[#f5f6f7] max-h-[calc(100%-60px)] overflow-y-auto">
                  <RolloverPageAuth />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
