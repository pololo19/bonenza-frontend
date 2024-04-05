import { Dialog, DialogProps, Transition, TransitionRootProps } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ElementType, Fragment, useMemo, useRef } from 'react';

import { useTranslation } from '@/base/config/i18next';
import { formatDate } from '@/base/libs/utils';

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
            <div className="flex min-h-full items-center justify-center p-0 sm:p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 translate-y-0 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-4 translate-y-0 scale-95"
              >
                <Dialog.Panel className="!overflow-hidden !p-0 !pb-[30px] text-[#98a7b5] dark:bg-[#1e2024] bg-white text-[14px] sm:max-w-[464px] h-screen sm:h-[720px] sm:max-h-[80vh] relative transform rounded-[15px] text-left shadow-xl transition-all my-0 w-full">
                  <Dialog.Title
                    as="div"
                    className="relative h-[60px] px-[20px] flex justify-between dark:bg-[#17181b] bg-[#f5f6fa] items-center"
                  >
                    <div className="text-[16px] dark:text-white text-black">{t('vipClub:rules')}</div>
                    <div className="group rounded-md" role="button" onClick={onClose}>
                      <XMarkIcon width={15} className="text-[#9FA5AC] group-hover:text-white w-[1.5rem] h-[1.5rem]" />
                    </div>
                  </Dialog.Title>
                  <div className="flex-col flex gap-[10px] h-[calc(100%-60px)] px-[20px] justify-between overflow-auto">
                    <div className="pt-[20px]">
                      <div className="text-[#98A7B5] text-[16px] font-bold">
                        {t('vipClub:rulesDailyWageringContest')}
                      </div>
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
                      <div className="text-[#98A7B5] text-[16px] font-bold mb-2">
                        {t('vipClub:prizeCalculationFormula')}
                      </div>
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
