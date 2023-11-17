import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import { ElementType, Fragment, useRef } from 'react';

import { TOAST_ENUM } from '@/base/constants/common';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ToastContainer } from 'react-toastify';

type CommonModalProps = {
  onClose: () => void;
  show: boolean;
  children?: JSX.Element;
  header?: JSX.Element;
  panelClass?: string;
  isShowCloseButton?: boolean;
  position?: string;
  isStatic?: boolean;
  dialogProps?: DialogProps<ElementType>;
  transitionRootProps?: DialogProps<ElementType>;
} & TransitionRootProps<ElementType>;

export default function CommonModal({
  show,
  onClose,
  children,
  header,
  panelClass,
  position,
  isShowCloseButton = true,
  dialogProps,
  isStatic,
  transitionRootProps,
}: CommonModalProps) {
  const cancelButtonRef = useRef(null);

  return (
    <>
      <Transition.Root {...transitionRootProps} show={show} as={Fragment}>
        <Dialog
          {...dialogProps}
          as="div"
          className="relative z-50"
          initialFocus={cancelButtonRef}
          onClose={isStatic ? () => {} : onClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[#000000aa] transition-opacity" />
          </Transition.Child>
          <div className="fixed inset-0 z-10">
            <div
              className={cn(
                'flex min-h-full sm:items-center items-start justify-center sm:p-4 text-center p-0',
                position,
              )}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel
                  className={cn(
                    'text-black dark:text-white flex flex-col relative transform sm:rounded-[15px] bg-white dark:bg-[#24262B] text-left shadow-xl transition-all sm:my-8 w-full max-w-[799px] sm:max-h-[90vh] max-h-[100vh] sm:h-auto h-screen',
                    panelClass,
                  )}
                >
                  <Dialog.Title as="div" className="relative">
                    {header}
                    {isShowCloseButton && (
                      <div
                        className="absolute bg-red-500 hover:opacity-70 dark:hover:bg-[#39B1C0] sm:top-[20px] top-[10px] sm:right-[20px] right-[10px] dark:sm:bg-[#20D4EB] rounded-md p-1 z-[10]"
                        role="button"
                        onClick={onClose}
                      >
                        <XMarkIcon width={20} className=" text-white dark:text-black" />
                      </div>
                    )}
                  </Dialog.Title>
                  {children}
                  <ToastContainer
                    autoClose={5000}
                    enableMultiContainer
                    containerId={TOAST_ENUM.MODAL}
                    className="z-index-toast !text-[12px]"
                    position="bottom-left"
                    theme="dark"
                    hideProgressBar={true}
                    icon={() => null}
                    closeButton={() => null}
                    toastClassName={'min-h-[40px]'}
                    bodyClassName={'!p-0 text-gray-200'}
                    draggableDirection={'x'}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
