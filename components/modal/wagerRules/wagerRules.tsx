import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useMemo, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { formatDate } from '@/base/libs/utils';
import CommonModal from '../commonModal/commonModal';

type ModalWagerRulesProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalWagerRules({ show, onClose }: ModalWagerRulesProps) {
  const cancelButtonRef = useRef(null);
  const { t } = useTranslation('');
  const startTime = useMemo(() => {
    let date = new Date();
    return formatDate(date, 'LL/dd/yyyy');
  }, []);

  const endTime = useMemo(() => {
    let currentDate = new Date();
    let nextDate = currentDate.setDate(currentDate.getDate() + 1);
    return formatDate(nextDate, 'LL/dd/yyyy');
  }, []);

  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass={`max-w-full sm:max-w-[420px] sm:max-h-[90vh] h-full sm:!h-[700px] bg-gradient-card-modal py-5 px-6`}
    >
      <>
        <div className="text-[16px] dark:text-white text-black font-extrabold">{t('vipClub:rules')}</div>
        <div className="flex-col flex gap-[10px] justify-between overflow-y-auto">
          <div className="pt-[20px]">
            <div className="text-white text-[16px] font-semibold">{t('vipClub:rulesDailyWageringContest')}</div>
            <div className="">
              {startTime} ~ {endTime}
            </div>
            <div className="mt-4 text-[14px]">
              {new Array(7).fill(0).map((_, index) => (
                <div className="pb-1 flex justify-start gap-2">
                  <div className="min-w-[12px]">{`${index + 1}.`}</div>
                  <div>{t(`vipClub:rulesDailyWageringContest${index + 1}`)}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 mb-6">
              🌟🌟 {t('vipClub:luckAndFun')} 🌟🌟
              <br />
            </div>
            <div className="text-white text-[16px] font-semibold mb-2">{t('vipClub:prizeCalculationFormula')}</div>
            <div className="text-[14px]">
              {t('vipClub:prizePool1')}
              <br />
              {t('vipClub:prizePool2')}
              <br />
              {t('vipClub:prizePool3')}
              <br />
              {t('vipClub:prizePool4')}
              <br />
              {t('vipClub:prizePool5')}
              <br />
              {t('vipClub:prizePool6')}
              <br />
              {t('vipClub:prizePool7')}
              <br />
              {t('vipClub:prizePool8')}
              <br />
              {t('vipClub:prizePool9')}
              <br />
              {t('vipClub:prizePool10')}
              <br />
            </div>
          </div>
        </div>
      </>
    </CommonModal>
  );
}
