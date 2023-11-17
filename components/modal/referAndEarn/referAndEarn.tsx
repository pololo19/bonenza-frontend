import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType } from 'react';
import { toast } from 'react-toastify';

import { useTranslation } from '@/base/config/i18next';
import { currencyFormat } from '@/base/libs/utils';
import CommonModal from '../commonModal/commonModal';
import { TOAST_ENUM } from '@/base/constants/common';
import { useRouter } from 'next/router';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalReferAndEarn({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');
  const router = useRouter();

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded"
        header={
          <div className="relative sm:px-[30px] px-[20px] sm:pt-[40px] pt-[20px] pb-[10px] bg-[#f5f6fa] dark:bg-[#161D26] text-black dark:text-white text-center">
            {t('referAndEarn:referAFriend')}
          </div>
        }
      >
        <div className="flex flex-col gap-[12px] overflow-y-auto sm:px-[30px] px-[20px] py-[40px] bg-[#ffffff] dark:bg-[#161D26]">
          <div className="bg-[#f5f6fa] dark:bg-[#12181F] p-5 rounded-[10px] flex justify-center justify-around">
            <div>
              <Image height={418} width={140} className="w-[140px] h-[418]" src="/img/Img.png" alt="" />
            </div>
            <div>
              <div className="text-[18px] text-black dark:text-[#ffffff]">{t('referAndEarn:referAFriendAndGet')}</div>
              <div className="flex">
                <div className="text-[30px] text-red-600">{currencyFormat(Number(25000000), 0)} </div>
                <div className="text-[30px] text-teal-300">+1</div>
              </div>
              <div className="text-black dark:text-[#ffffff] text-18px] mb-[20px]">{t('referAndEarn:commission')}</div>
              <div className="text-amber-500 text-[14px]">{t('referAndEarn:inviteFriendsEarnMoney')}</div>
            </div>
          </div>
          <div className="px-5 py-5">
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center cursor-pointer"
                onClick={() => {
                  router.push('/affiliate');
                  onClose();
                }}
              >
                <div className="text-[14px] text-[#20D4EB] mr-[5px]">{t('referAndEarn:learnMore')}</div>
                <div>
                  <Image height={14} width={14} className="w-[14px] h-[14px]" src="/img/arrow-right.png" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-5 text-[14px] text-black dark:text-[#C2C2C2]">
            {t('referAndEarn:shareYourReferralLink')}
          </div>
          <div className="bg-[#f5f6fa] dark:bg-[#12181F] text-black dark:text-white rounded-[10px] px-5 py-5 h-[70px] flex justify-between items-center">
            <div className="max-sm:text-[14px]">https://bonenza/i-mu8iislo-n/</div>
            <div className="flex w-[74px] h-[38px] bg-[#FD6E0B] rounded-[10px] justify-center items-center">
              <div className="mr-[3px]">
                <Image height={18} width={18} className="w-[18px] h-[18px]" src="/img/simcard-2.png" alt="" />
              </div>
              <div className="text-[12px] text-[#ffffff]" onClick={() => copy('https://bonenza/i-mu8iislo-n/')}>
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
