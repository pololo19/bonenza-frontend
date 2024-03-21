import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactLoading from 'react-loading';
import { toast } from 'react-toastify';

import { api_bonusClaim } from '@/api/bonus';
import { api_getClaims } from '@/api/wallet';
import { TOAST_ENUM } from '@/base/constants/common';
import { getBalance, setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { useAppDispatch } from '@/base/redux/store';

import CommonModal from '../commonModal/commonModal';

type ModalSpinClaimProps = {
  onClose: () => void;
  show: boolean;
  amount: number;
  symbol: string;
  symbolLogo: string;
  spinType: string;
  bonusId: string;
  claimable: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalSpinClaim({ amount, symbol, symbolLogo, spinType, bonusId, claimable, show, onClose }: ModalSpinClaimProps) {
  const { t } = useTranslation('');
  const dispatch = useAppDispatch();
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  
  const onClickClaim = async() => {
    if(claimable) {
      try {
        setIsClaiming(true);
        await api_bonusClaim(bonusId, spinType + '_spin');

        const _resBonus = await api_getClaims();
        const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

        dispatch(getBalance());
        dispatch(setLockedAmount(tempLockedAmount));
        toast.success(t('success:bonusClaimed'), { containerId: TOAST_ENUM.COMMON }); 
      } catch (error: any) {
        toast.error(error.response.data.error || t('errors:internalServer'), { containerId: TOAST_ENUM.COMMON });
      } finally {
        setIsClaiming(false);
      }
    }
    onClose();
  }
  return (
    <>
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded max-w-full sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center overflow-y-auto relative px-5 py-8">
          <Image
            width={400}
            height={600}
            src={`/img/spin/${spinType}-popup.png`}
            alt=""
            className="w-[80%] m-auto"
          />
          <div className="flex items-center text-3xl text-[#FFE600] font-bold mt-8">
            {`+ ${amount} ${symbol}`}
            <Image
              width={25}
              height={25}
              className="ml-2 w-[40px]"
              src={symbolLogo}
              alt=""
            />
          </div>
          {claimable && 
            <div
              className="bg-gradient-btn-play w-full min-h-[50px] text-center mt-5 rounded-large hover:cursor-pointer flex justify-center items-center"
              onClick={onClickClaim}
            >
              {isClaiming
                ? <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-8 !h-8" />
                : <div>{t(`bonus:spinClaim`)}</div>
              }
            </div>
          }
        </div>
      </CommonModal>
    </>
  );
}
