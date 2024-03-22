import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';

type ChatRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalChatRules({ show, onClose }: ChatRulesProps) {
  const { t } = useTranslation('');
  return (
    <CommonModal
      show={show}
      onClose={onClose}
      header={
        <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
          <div className="dark:text-white text-black text-[14px] sm:text-[16px]">{t('chat:chatRules')}</div>
        </div>
      }
    >
      <div className="overflow-y-auto sm:p-5 sm:pt-6 px-3 pb-[80px]">
        <div className="flex flex-col">
          <p className="mt-3">{t('chat:chatRules1')}</p>
          <p className="mt-3">{t('chat:chatRules2')}</p>
          <p className="mt-3">{t('chat:chatRules3')}</p>
          <p className="mt-3">{t('chat:chatRules4')}</p>
          <p className="mt-3">{t('chat:chatRules5')}</p>
          <p className="mt-3">{t('chat:chatRules6')}</p>
          <p className="mt-5">{t('chat:chatNote')}</p>
        </div>
      </div>
    </CommonModal>
  );
}
