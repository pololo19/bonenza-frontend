import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType } from 'react';
import { useTranslation } from 'react-i18next';

import CommonModal from '../commonModal/commonModal';

type ModalSpinClaimProps = {
  onClose: () => void;
  show: boolean;
  amount: number;
  symbol: string;
  symbolLogo: string;
  spinType: string;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalSpinClaim({ amount, symbol, symbolLogo, spinType, show, onClose }: ModalSpinClaimProps) {
  const { t } = useTranslation('');
  
  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded max-w-full sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center overflow-y-auto relative px-5 py-8">
          <Image
            width={400}
            height={600}
            src={`/img/spin/${spinType}-popup.png`}
            alt=""
            className="w-[80%] m-auto"
          />
          <div className="flex items-center text-3xl text-[#FFE600] font-bold mt-8">
            {`+ ${amount} ${symbol}`}
            <Image
              width={25}
              height={25}
              className="ml-2 w-[40px]"
              src={symbolLogo}
              alt=""
            />
          </div>
          <div
            className="bg-gradient-btn-play w-full py-3 text-center mt-5 rounded-large"
            onClick={() => onClose()}
          >
            {t(`bonus:spinClaim`)}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
