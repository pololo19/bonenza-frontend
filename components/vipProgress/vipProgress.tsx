import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { api_getVipProgress } from '@/api/vip';
import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

const VipProgressComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState({
    xp: 0,
    level: 0,
    name: '',
    remainingXp: 0,
    nextLevel: 0,
    nextName: '',
    nextXp: 0,
    nextLevelBonus: 0,
  });
  const { t } = useTranslation('');

  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const handleGetVipProgress = async () => {
    try {
      setIsLoading(true);
      const res = await api_getVipProgress();
      setCurrentLevel({
        xp: res.data?.currentXp ?? 0,
        level: res.data?.currentVipLevel ?? 0,
        name: res.data?.currentVipName ?? '',
        remainingXp: res.data?.remainingXp ?? 0,
        nextLevel: res.data?.nextVipLevel ?? 0,
        nextName: res.data?.nextVipName ?? '',
        nextXp: res.data?.nextVipXp ?? 0,
        nextLevelBonus: Number(res.data?.nextLevelBonus ?? 0),
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const percent = useMemo(() => {
    return Math.ceil((currentLevel.xp / (currentLevel.xp + currentLevel.remainingXp)) * 100) || 0;
  }, [currentLevel]);

  useEffect(() => {
    if (!isLogin) return;
    handleGetVipProgress();
  }, [isLogin]);

  return (
    <>
      {isLoading && <Loader />}
      <div className="flex flex-col relative sm:py-[16px] sm:px-[25px] bg-transparent sm:bg-color-card-bg-default sm:min-w-[400px] rounded-[3px]">
        <div className="dark:text-white text-black font-[600] sm:text-[20px] text-[14px]">
          {t('homePage:yourVipProgress')}
        </div>
        <div className="text-[12px] dark:text-gray-400 text-[#31373d] mt-[10px] pb-[10px] border-solid border-b-[1px] border-color-border-primary">
          <div>{percent}%</div>
          <div className="w-full rounded-[5px] h-[10px] sm:h-[13px] bg-color-progress-primary my-[5px]">
            <div className="h-full bg-color-primary rounded-[5px]" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="flex justify-between">
            <div className="dark:text-color-text-primary text-[#31373d]">{currentLevel.name}</div>
            <div className="text-amber-400">{currentLevel.nextName}</div>
          </div>
        </div>
        <div className="flex gap-[4px] mt-[10px]">
          <div className="p-[4px] border border-solid rounded-full border-color-border-primary">
            <Image width={30} height={30} src="/img/reward.png" className="w-[20px] h-[20px]" alt="" />
          </div>
          <div className="dark:text-color-text-primary text-black text-[14px] flex items-center">
            {t('bonus:nextLevelBonus')}
          </div>
          <div className="dark:text-color-secondary text-black text-[14px] flex items-center">
            {`${currentLevel.nextLevelBonus.toFixed(2)} USDT`}
          </div>
        </div>
      </div>
    </>
  );
};

export default VipProgressComponent;
