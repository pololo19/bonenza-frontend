import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ElementType } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { copyClipBoard, currencyFormat1 } from '@/base/libs/utils';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalReferAndEarn({ show, onClose }: ModalProfileProps) {
  const exchangeRate = useExchange();
  const { t } = useTranslation('');
  const router = useRouter();

  const { viewInFiat, localFiat, referralCode } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      referralCode: state.auth.user.referralCode,
    }),
    shallowEqual,
  );

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[530px]"
        header={
          <div className="relative sm:px-[30px] px-[20px] text-left pt-[20px] text-title pb-[10px] bg-color-light-bg-primary dark:bg-color-header-primary text-black dark:text-white font-bold">
            {t('referAndEarn:referAFriend')}
          </div>
        }
      >
        <div className="flex flex-col gap-[12px] overflow-y-auto sm:px-[30px] px-[20px] py-[40px]">
          <div className="bg-[#f5f6fa] dark:bg-[#12181F] p-5 rounded-[10px] flex justify-center justify-around">
            <div>
              <Image height={418} width={140} className="w-[140px] h-[418]" src="/img/Img.png" alt="" />
            </div>
            <div>
              <div className="text-[18px] text-black dark:text-white font-bold">
                {t('referAndEarn:referAFriendAndGet')}
              </div>
              <div className="flex sm:flex-row flex-col text-[30px]">
                <div className="text-color-secondary font-bold">
                  {viewInFiat ? currencyFormat1(1000 * exchangeRate, 2, localFiat?.name) : currencyFormat1(1000, 2)}{' '}
                </div>
                <div className="text-color-primary font-bold">+15 %</div>
              </div>
              <div className="text-black dark:text-white font-bold uppercase text-18px] mb-[20px]">
                {t('referAndEarn:commission')}
              </div>
              <div className="text-color-primary text-[14px]">{t('referAndEarn:inviteFriendsEarnMoney')}</div>
            </div>
          </div>
          <div className="px-2 py-2">
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  router.push('/affiliate');
                  onClose();
                }}
              >
                <div className="text-[14px] text-color-primary mr-[5px]">{t('referAndEarn:learnMore')}</div>
              </div>
            </div>
          </div>
          <div className="px-5 text-[14px] text-black dark:text-[#C2C2C2]">
            {t('referAndEarn:shareYourReferralLink')}
          </div>
          <div className="bg-[#f5f6fa] dark:bg-[#12181F] text-black dark:text-white rounded-default px-5 py-5 h-[70px] flex justify-between items-center cursor-pointer">
            <div className="max-sm:text-[14px]">{ROUTER.REFERRAL_CODE(referralCode)}</div>
            <div className="flex w-[74px] h-[38px] bg-color-primary rounded-default justify-center items-center">
              <div className="mr-[3px]">
                <Image height={18} width={18} className="w-[18px] h-[18px]" src="/img/simcard-2.png" alt="" />
              </div>
              <div
                className="text-[12px] text-[#ffffff]"
                onClick={() => copyClipBoard(ROUTER.REFERRAL_CODE(referralCode))}
              >
                {' '}
                {t('referAndEarn:copy')}
              </div>
            </div>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
