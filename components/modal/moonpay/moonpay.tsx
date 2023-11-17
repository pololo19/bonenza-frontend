import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { ElementType, Fragment, useRef } from 'react';

type ModalMoonpayProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalMoonpay({ show, onClose }: ModalMoonpayProps) {
  const cancelButtonRef = useRef(null);

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
                <Dialog.Panel className="">
                  <iframe
                    src="https://buy.moonpay.com/?apiKey=pk_live_sjFEnbVGEJYwRmQaYNdDr6DW1fnu1Wd&baseCurrencyCode=usd&currencyCode=USDT&walletAddress=0xaf61209455dd6685E761C7011Cb560f72b4Cf03a&walletAddressTag=&baseCurrencyAmount=30&lockAmount=true&externalTransactionId=580520&externalCustomerId=16988284&signature=L3vcn3tePbZs6OqMKSyJ1Z%2Bv2mIonZBQ3mVUrL3y7Tk%3D"
                    className="w-full h-full min-h-[80vh] min-w-[360px] rounded overflow-auto"
                    allow="accelerometer; autoplay; camera; gyroscope; payment"
                    width="100%"
                    height="100%"
                    title="MoonPay"
                  />
                  {/* {
  enabledPaymentMethods: ['credit_debit_card', 'apple_pay', 'google_pay', 'sepa_bank_transfer'],
  defaultCurrencyCode: 'btc',
  baseCurrencyAmount: 100,
  baseCurrencyCode: 'eur',
  walletAddress: '[customer_wallet]',
  externalCustomerId: '[your_user_id]',
  externalTransactionId: '[your_tx_id]',
  colorCode: '#FF875B',
  language: 'en',
} */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
