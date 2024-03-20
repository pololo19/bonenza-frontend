import CommonModal from '../commonModal/commonModal';
import { ElementType, useCallback, useEffect, useRef, useState } from 'react';
import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';

type ModalLuckySpinClaimProps = {
  onClose: () => void;
  show: boolean;
  claim: number;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalLuckySpinClaim({ claim, show, onClose }: ModalLuckySpinClaimProps) {
  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded max-w-full sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center overflow-y-auto relative">
          <Image width={400} height={600} src={'/img/coins-win.png'} alt="" />
        </div>
      </CommonModal>
    </>
  );
}
