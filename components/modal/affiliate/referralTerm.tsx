import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ElementType } from 'react';

import { useTranslation } from '@/base/config/i18next';
import CommonModal from '../commonModal/commonModal';

type ModalReferralTermProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalReferralTerm({ show, onClose }: ModalReferralTermProps) {
  const { t } = useTranslation('');

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:rounded sm:max-w-[400px]"
        header={
          <div className="relative p-[20px] pb-0 bg-[#f5f6fa] dark:bg-[#161D26]">
            <div className="flex items-center text-black dark:text-white gap-[10px]">
              {t('affiliate:referralTermsConditions')}
            </div>
          </div>
        }
      >
        <div className="p-[15px] overflow-y-auto text-[14px] font-[300] text-[#98a7b5]">
          <pre className="whitespace-pre-line">
            <p>{t('referralTerms:supported')}</p>
          </pre>
        </div>
      </CommonModal>
    </>
  );
}
