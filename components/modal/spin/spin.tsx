import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { AxiosError } from 'axios';
import cn from 'classnames';
import { ArrowRight2 } from 'iconsax-react';
import Image from 'next/image';
import { ElementType, useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { api_getSpinAvailableCount, api_getSpinData, api_postSpinTry } from '@/api/spin';
import { api_getClaims } from '@/api/wallet';
import { useTranslation } from '@/base/config/i18next';
import { TOAST_ENUM } from '@/base/constants/common';
import {
  changeAuthenticationType,
  changeIsShowAuthenticationModal,
  changeIsShowSpin,
  changeIsShowSpinClaim,
} from '@/base/redux/reducers/modal.reducer';
import { setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { AppState } from '@/base/redux/store';
import { AuthenticationModeEnum } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';
import ModalLatestSpins from './latestSpin';
import ModalSpinClaim from './luckySpinClaim';

type ModalSpinProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

// const speed = 2; // deg per millisecond
const duration = 5000; // milli second

interface SpinItem {
  symbol: string;
  symbolLogo: string;
  amount: number;
  amountUsd: number;
  id: string;
  claimable?: boolean;
}

type SpinDataType = {
  userName: string;
  userAvatar: string;
  amount: number;
  amountUsd: number;
  symbol: string;
  symbolLogo: string;
  type: string;
};

export default function ModalSpin({ show, onClose }: ModalSpinProps) {
  const { t } = useTranslation('');
  const [rotate, setRotate] = useState(0);
  const [isLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [isRotating, setIsRotating] = useState(false);
  const [isShowLatestSpins, setisShowLatestSpins] = useState<boolean>(false);

  const [spinTab, setSpinTab] = useState<'lucky' | 'super' | 'mega'>('lucky');
  const spins: Array<'lucky' | 'super' | 'mega'> = ['lucky', 'super', 'mega'];

  const [spinItems, setSpinItems] = useState<{ lucky: SpinItem[]; super: SpinItem[]; mega: SpinItem[] }>({
    lucky: [],
    super: [],
    mega: [],
  });
  const [currentSpin, setCurrentSpin] = useState<SpinItem>();
  const [spinBonusTotal, setSpinBonusTotal] = useState<number>(0);
  const [latestSpin, setLatestSpin] = useState<SpinDataType>();
  const [spinAvailableCount, setSpinAvailableCount] = useState<number>(0);

  const { isLogin, isShowSpinClaim } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
      isShowSpinClaim: state.modal.isShowSpinClaim,
    }),
    shallowEqual,
  );

  const timeOut = useRef<any>(null);

  const getSpinAvailableCount = async () => {
    try {
      const res = await api_getSpinAvailableCount();
      const tempAvailableCount = res.data?.availableSpinCount || 0;
      setSpinAvailableCount(tempAvailableCount);
    } catch (error) {
      setSpinAvailableCount(0);
    }
  };

  const getSpinData = async () => {
    try {
      const res = await api_getSpinData();
      const tempLuckyData = res.data.data['lucky'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      const tempSuperData = res.data.data['super'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      const tempMegaData = res.data.data['mega'].map((item: any) => ({
        symbol: item.symbol || '',
        symbolLogo: item.symbolLogo || '',
        amount: item.amount || 0,
        amountUsd: item.amountUsd || 0,
        id: item.id || 0,
      }));
      const tempLatestSpin: SpinDataType = {
        amount: res.data.lastSpinner.amount || 0,
        amountUsd: res.data.lastSpinner.amountUsd || 0,
        symbol: res.data.lastSpinner.symbol || '',
        symbolLogo: res.data.lastSpinner.symbolLogo || '',
        type: res.data.lastSpinner.type || '',
        userAvatar: res.data.lastSpinner.userAvatar || '',
        userName: res.data.lastSpinner.userName || '',
      };
      setLatestSpin(tempLatestSpin);
      setSpinBonusTotal(res.data.totalBonusUsd || 0);
      setSpinItems({ lucky: tempLuckyData, super: tempSuperData, mega: tempMegaData });
    } catch (error) {
      setSpinItems({ lucky: [], super: [], mega: [] });
      setSpinBonusTotal(0);
    } finally {
    }
  };

  useEffect(() => {
    if (isLogin) {
      getSpinAvailableCount();
    }
    getSpinData();
  }, [isShowSpinClaim, isLogin, isRotating]);

  const spinPlay = useCallback(async () => {
    if (!isLogin) {
      dispatch(changeIsShowSpin(false));
      dispatch(changeAuthenticationType(AuthenticationModeEnum.SIGN_IN));
      dispatch(changeIsShowAuthenticationModal(true));
      return;
    }
    if (spinAvailableCount === 0 || isRotating) {
      return;
    }
    let dd = 0;
    try {
      const res = await api_postSpinTry(spins.indexOf(spinTab));
      const spinId = (res.data.spinId || 1) - 1;
      const claimable = res.data.availableClaim || false;
      const id = res.data.bonusId || '';
      const spin = spinItems?.[spinTab]?.at(spinId);
      setCurrentSpin({
        symbol: spin?.symbol || '',
        symbolLogo: spin?.symbolLogo || '',
        amount: spin?.amount || 0,
        amountUsd: spin?.amountUsd || 0,
        id: id,
        claimable: claimable || false,
      });
      dd = 22.5 * spinId;
      const _resBonus = await api_getClaims();
      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);

      dispatch(setLockedAmount(tempLockedAmount));
    } catch (error) {
      const status = (error as AxiosError).response?.status || 0;
      toast.error((status || 404) === 400 ? t('bonus:spinNoSpin') : t('bonus:spinWrong'), {
        containerId: TOAST_ENUM.COMMON,
        icon: true,
        autoClose: 3000,
        hideProgressBar: false,
      });
      return;
    }
    const speed = ((360 * 14 - dd) / duration) * 2;
    const acceleration = speed / duration;
    const currentTime = new Date();
    setIsRotating(true);
    let timer = setInterval(() => {
      const time = new Date();
      const dT = time.getTime() - currentTime.getTime();
      const updateRotate = speed * dT - (acceleration * dT * dT) / 2;
      setRotate(updateRotate);
    }, 0);
    timeOut.current = setTimeout(() => {
      setIsRotating(false);
      clearInterval(timer);
      dispatch(changeIsShowSpinClaim(true));
    }, duration);
  }, [isLogin, spinTab, spinItems]);

  useEffect(() => {
    return () => {
      clearTimeout(timeOut.current);
    };
  }, []);

  useEffect(() => {
    setRotate(0);
  }, [show]);

  return (
    <>
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:rounded max-w-full sm:max-w-[400px]"
        header={
          <div className="flex justify-between px-5 pt-8 pb-0 items-center">
            <div className="flex gap-0 relative">
              {spins.map((spin) => (
                <Image
                  key={`${spin}-tab`}
                  width={150}
                  height={151}
                  className={`hover:cursor-pointer w-[65px] h-[65px] z-10 ${
                    spin !== spinTab ? 'grayscale brightness-75' : ''
                  }`}
                  src={`/img/spin/${spin}-spin.png`}
                  alt=""
                  onClick={() => setSpinTab(spin)}
                />
              ))}
              <div
                className={cn('rounded-large z-0 absolute w-[33%] h-[100%] transition-all bg-[#7777]', {
                  'translate-x-[0%]': spinTab === 'lucky',
                  'translate-x-[101%]': spinTab === 'super',
                  'translate-x-[202%]': spinTab === 'mega',
                })}
              />
            </div>
            <Image
              width={150}
              height={151}
              className="object-contain h-[90px]"
              src={`/img/spin/${spinTab}-level.png`}
              alt=""
            />
          </div>
        }
      >
        {isLoading ? (
          <Loader />
        ) : (
          <div className="flex flex-col items-center justify-center overflow-y-auto relative">
            <div className="spin-wrap flex flex-col items-center justify-center p-[25px] overflow-y-auto relative">
              <div className="relative min-w-[350px] min-h-[350px]">
                {spins.map((spin) => (
                  <div
                    key={`${spin}-wheel-div`}
                    className={cn('transition-all ease-in overflow-hidden absolute', {
                      'max-h-0 max-w-0 left-[50%] right-[50%] top-[50%] bottom-[50%] duration-200': spin !== spinTab,
                      'max-h-[500px] max-w-[500px] left-0 right-0 top-0 bottom-0 duration-500': spin === spinTab,
                    })}
                    style={{ transform: `rotate(${rotate}deg)` }}
                  >
                    <div className="flex items-center justify-center w-full h-full relative origin-center">
                      <Image width={781} height={781} className="w-full" src={'/img/spin/spin-wheel.png'} alt="" />
                      {spinItems?.[spinTab].map((item, index) => (
                        <div
                          key={index}
                          className="absolute flex gap-[5px] justify-end items-center top-[50%] left-[50%] right-[25px] text-[14px] leading-[20px] -mt-[10px]"
                          style={{ transform: `rotate(${22.5 * index}deg)`, transformOrigin: 'left' }}
                        >
                          <span className="font-bold">{item.amount.toFixed(4)}</span>
                          <Image width={14} height={14} className="w-[16px] h-[16px]" src={item.symbolLogo} alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute w-[28%] z-[6] cursor-pointer">
                <div
                  className={cn(
                    styles.spin,
                    `${spinAvailableCount > 0 ? styles.spin_button : ''}`,
                    'relative overflow-hidden rounded-full',
                    {
                      'cursor-not-allowed': isRotating || spinAvailableCount === 0,
                    },
                  )}
                  onClick={spinPlay}
                >
                  <Image
                    width={230}
                    height={233}
                    className={cn('w-full h-auto object-cover')}
                    alt=""
                    src={`/img/spin/${spinTab}-spin-button.png`}
                  />
                </div>
              </div>
              <div
                className="absolute top-[50%] left-[50%] -mt-[39px] ml-[44px] z-[5] w-[145px]"
                style={{ transform: 'rotate(0deg)', transformOrigin: 'left center' }}
              >
                <Image width={353} height={193} src={'/img/spin/select-spin.png'} alt="" />
              </div>
            </div>

            <div className="-mt-[90px] z-[2] mx-[10px] mb-[10px]">
              <Image
                width={856}
                height={402}
                className="w-[80%] m-auto"
                alt=""
                src={`/img/spin/${spinTab}-spin-ribbon.png`}
              />
            </div>
            <div className="bg-[#121519] w-[calc(100%-40px)] rounded-large px-5 py-7 mb-5 flex">
              <div className="text-default flex-1 flex flex-col justify-center border-solid border-r-[1px] border-r-[#222]">
                <div className="font-bold uppercase">{t('bonus:spinBonusTotal')}</div>
                <div className="font-bold text-color-primary">
                  {`$ `}
                  {spinBonusTotal}
                </div>
              </div>
              <div
                className="text-default flex-1 flex justify-between gap-2 items-center pl-2 hover:cursor-pointer"
                onClick={() => setisShowLatestSpins(true)}
              >
                <Image
                  height={25}
                  width={25}
                  src={String(process.env.API_AVATAR) + latestSpin?.userAvatar}
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                  alt=""
                  className="object-cover sm:h-[25px] rounded-full h-[16px] sm:w-[25px] w-[16px]"
                />
                <div className="w-full">
                  <div>{latestSpin?.userName || ''}</div>
                  <div className="flex gap-1">
                    <div>
                      {t('statistic:win')}
                      {': '}
                    </div>
                    <div className="text-color-primary font-bold flex gap-1">
                      {latestSpin?.amount || 0}
                      <Image
                        width={25}
                        height={25}
                        className="w-[20px]"
                        src={latestSpin?.symbolLogo || '/img/fiats/USD.png'}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="uppercase">{`${latestSpin?.type || ''} SPIN`}</div>
                </div>
                <ArrowRight2 />
              </div>
            </div>
          </div>
        )}
      </CommonModal>

      <ModalSpinClaim
        show={isShowSpinClaim || false}
        onClose={() => dispatch(changeIsShowSpinClaim(false))}
        amount={currentSpin?.amount || 0}
        symbolLogo={currentSpin?.symbolLogo || ''}
        symbol={currentSpin?.symbol || ''}
        spinType={spinTab}
        claimable={currentSpin?.claimable || false}
        bonusId={currentSpin?.id || ''}
      />
      <ModalLatestSpins show={isShowLatestSpins} onClose={() => setisShowLatestSpins(false)} />
    </>
  );
}
