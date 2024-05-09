import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import WagerContestComponent from '@/components/gameTable/wagerContest';

type DailyContestProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDailyContest({ show, onClose }: DailyContestProps) {
  const { t } = useTranslation('');
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      header={
        <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
          <div className="dark:text-white text-black text-[14px] sm:text-[16px]">{t('sidebar:dailyContest')}</div>
        </div>
      }
    >
      <div className="bg-color-modal-bg-secondary overflow-y-auto pt-4 sm:p-5 sm:pt-6 px-3 pb-[80px]">
        <WagerContestComponent />
      </div>
    </CommonModal>
  );
}
