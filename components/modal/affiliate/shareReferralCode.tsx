import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { ElementType, useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ROUTER } from '@/base/constants/common';
import { AppState } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalShareReferralCodeProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalShareReferralCode({ show, onClose }: ModalShareReferralCodeProps) {
  const { referralCode } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
    }),
    shallowEqual,
  );

  const linkReferral = useMemo(() => {
    return ROUTER.REFERRAL_CODE(String(referralCode));
  }, [referralCode]);

  const { t } = useTranslation('');

  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center sm:p-[50px] p-[20px] gap-[30px]">
          <div className="text-[16px] font-semibold text-center">{t('affiliate:shareReferralLink')}</div>
          <div className="flex flex-wrap items-center justify-center gap-x-[15px] gap-y-[15px]">
            <Link
              href={`http://www.facebook.com/sharer/sharer.php?u=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-fb.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?url=${linkReferral}&title=rreferralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-tw.png'} width={40} height={40} />
            </Link>
            <Link href={`https://t.me/share?url=${linkReferral}&title=rreferralCode&text=referralCode`} target="_blank">
              <Image role="button" alt="" src={'/img/share-tl.png'} width={40} height={40} />
            </Link>
            <Link
              href={`http://vk.com/share.php?url=${linkReferral}&title=rreferralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-vk.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://lineit.line.me/share/ui?url=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-line.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://web.skype.com/share?url=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-sk.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&amp;st.shareUrl=url=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-ok.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-in.png'} width={40} height={40} />
            </Link>
            <Link
              href={`https://api.whatsapp.com/send?url=${linkReferral}&title=referralCode&text=referralCode`}
              target="_blank"
            >
              <Image role="button" alt="" src={'/img/share-ws.png'} width={40} height={40} />
            </Link>
          </div>
        </div>
      </CommonModal>
    </>
  );
}
