import { DialogProps, TransitionRootProps } from '@headlessui/react';
import cn from 'classnames';
import Image from 'next/image';
import { ElementType, useCallback, useEffect, useRef, useState } from 'react';

import { useTranslation } from '@/base/config/i18next';

import CommonModal from '../commonModal/commonModal';
import styles from './index.module.scss';
import ModalLuckySpinClaim from './luckySpinClaim';

type ModalSpinProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

// const speed = 2; // deg per millisecond
const duration = 5000; // milli second

const spinItems = [
  { amount: 1, currency: 'USDT', zeroNum: 5 },
  { amount: 3, currency: 'USDT', zeroNum: 5 },
  { amount: 5, currency: 'USDT', zeroNum: 4 },
  { amount: 10, currency: 'USDT', zeroNum: 4 },
  { amount: 20, currency: 'USDT', zeroNum: 4 },
  { amount: 50, currency: 'USDT', zeroNum: 4 },
  { amount: 100, currency: 'USDT', zeroNum: 3 },
  { amount: 200, currency: 'USDT', zeroNum: 3 },
  { amount: 1000, currency: 'MATIC', zeroNum: 2 },
  { amount: 2000, currency: 'MATIC', zeroNum: 2 },
  { amount: 1, currency: 'BNB', zeroNum: 5 },
  { amount: 1.5, currency: 'BNB', zeroNum: 5 },
  { amount: 0.3, currency: 'ETH', zeroNum: 5 },
  { amount: 0.6, currency: 'ETH', zeroNum: 5 },
  { amount: 0.9, currency: 'ETH', zeroNum: 5 },
  { amount: 1.2, currency: 'ETH', zeroNum: 5 },
];
export default function ModalSpin({ show, onClose }: ModalSpinProps) {
  const { t } = useTranslation('');
  const [rotate, setRotate] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isLuckySpin, setIsLuckySpin] = useState(false);

  const timeOut = useRef<any>(null);

  const spinPlay = useCallback(() => {
    let dd = 0;
    const random = Math.random();
    if (random > 0.3) {
      dd = 22.5;
    }
    if (random > 0.6) {
      dd = 0;
    }
    if (random > 0.9) {
      dd = 45;
    }
    // const dd = Math.random() > 0.5 ? 22.5 : 45;
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
      setIsLuckySpin(true);
    }, duration);
  }, []);

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
      <CommonModal show={show} onClose={onClose} panelClass="sm:rounded max-w-full sm:max-w-[400px]">
        <div className="flex flex-col items-center justify-center overflow-y-auto relative">
          <div className="spin-wrap flex flex-col items-center justify-center p-[25px] overflow-y-auto relative">
            <div
              className="flex items-center justify-center w-full relative origin-center"
              style={{ transform: `rotate(${rotate}deg)` }}
            >
              <Image width={781} height={781} className="w-full" src={'/img/spin-wheel.png'} alt="" />
              {spinItems.map((item, index) => (
                <div
                  key={index}
                  className="absolute flex gap-[5px] items-center top-[50%] left-[50%] text-[14px] leading-[20px] -mt-[8px] ml-[60px]"
                  style={{ transform: `rotate(${22.5 * index}deg)`, transformOrigin: '-60px center' }}
                >
                  <span className="font-bold">{item.amount.toFixed(item.zeroNum)}</span>
                  <Image
                    width={14}
                    height={14}
                    className="w-[16px] h-[16px]"
                    src={`/img/fiats/${item.currency}.png`}
                    alt=""
                  />
                </div>
              ))}
            </div>
            <div className="absolute w-[28%] z-[6] cursor-pointer">
              <div
                className={cn(styles.spin, 'relative overflow-hidden rounded-full', {
                  'cursor-not-allowed': isRotating,
                })}
                onClick={spinPlay}
              >
                <Image
                  width={230}
                  height={233}
                  className={cn('w-full h-auto object-cover')}
                  alt=""
                  src="/img/lucky-spin-button.png"
                />
              </div>
            </div>
            <div
              className="absolute top-[50%] left-[50%] -mt-[39px] ml-[44px] z-[5] w-[145px]"
              style={{ transform: 'rotate(0deg)', transformOrigin: 'left center' }}
            >
              <Image width={353} height={193} src={'/img/select-spin.png'} alt="" />
            </div>
          </div>

          <div className="-mt-[90px] z-[2] mx-[10px] mb-[10px]">
            <Image width={856} height={402} className="w-full" alt="" src={'/img/lucky-spin-ribbon.png'} />
          </div>
        </div>
      </CommonModal>

      <ModalLuckySpinClaim show={isLuckySpin} onClose={() => setIsLuckySpin(false)} claim={1000} />
    </>
  );
}
