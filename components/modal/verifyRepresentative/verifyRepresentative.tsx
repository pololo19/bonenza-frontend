import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon, MagnifyingGlassIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef, useState } from 'react';
import cn from 'classnames';
import Image from 'next/image';

import { useTranslation } from '@/base/config/i18next';
import { toast } from 'react-toastify';
import { TOAST_ENUM } from '@/base/constants/common';
import CommonModal from '../commonModal/commonModal';
type ModalVerifyRepresentativeProp = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalVerifyRepresentative({ show, onClose }: ModalVerifyRepresentativeProp) {
  const cancelButtonRef = useRef(null);
  const [representativeID, setRepresentativeID] = useState<string>('');
  const { t } = useTranslation('');

  const checkRepresentative = () => {
    if (representativeID === '') {
      toast.error('Please input representative ID correctly.', {
        toastId: 'emptyRepresentativeID',
        containerId: TOAST_ENUM.COMMON,
        icon: true,
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }
    toast.error(`${representativeID} is NOT the official representative of BONENZA. Do not trust this account..`, {
      toastId: 'incorrectRepresentativeID',
      containerId: TOAST_ENUM.COMMON,
      icon: true,
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:max-w-[464px] max-w-full sm:h-[60vh] sm:min-h-[70vh] sm:my-0"
        header={
          <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
            <Image src="/img/logo.png" width={159} height={32} alt="" />
          </div>
        }
      >
        <div className="overflow-y-auto pt-6 px-3 pb-[80px]">
          <div className="flex justify-center my-[32px]">
            <CheckBadgeIcon width={48} height={48} className="text-color-primary" />
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
              onChange={(e) => setRepresentativeID(e.target.value)}
            />
            <button
              className="h-[48px] rounded-large absoulte right-[4px] top-[4px] flex justify-center items-center w-[88px] hover:opacity-0.9 bg-color-primary"
              onClick={() => {
                checkRepresentative();
              }}
            >
              <MagnifyingGlassIcon width={20} height={20} className="dark:text-white text-black" />
            </button>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
