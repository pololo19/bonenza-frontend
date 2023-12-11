import { useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { AppState } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';

const VipProgressComponent = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLevel, setCurrentLevel] = useState<any>();
  const { t } = useTranslation('');

  const { isLogin } = useSelector(
    (state: AppState) => ({
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const handleGetVipProgress = async () => {
    try {
      // const res = await api.get('user-profile/get-vip');
      // setCurrentLevel(res.data);
    } catch (error) {
    } finally {
    }
  };

  const percent = useMemo(() => {
    return Math.ceil((currentLevel?.totalXp / (currentLevel?.totalXp + currentLevel?.xpNextLevel)) * 100) || 0;
  }, [currentLevel]);

  useEffect(() => {
    if (!isLogin) return;
    handleGetVipProgress();
  }, [isLogin]);

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <div className="dark:text-white text-black font-[600] text-[32px]">{t('homePage:yourVipProgress')}</div>
        <div className="text-[12px] dark:text-gray-400 text-[#31373d] mt-[10px]">
          <div>{percent}%</div>
          <div className="max-w-[400px] w-[300px] rounded-[5px] h-[10px] bg-gray-500 my-[5px]">
            <div className="h-full bg-amber-500 rounded-[5px]" style={{ width: `${percent}%` }}></div>
          </div>
          <div className="flex justify-between">
            <div className="dark:text-[#9ca3af] text-[#31373d]">
              {currentLevel?.vipCurrent?.type} {currentLevel?.vipCurrent?.level}
            </div>
            <div className="text-amber-400">{currentLevel?.nextLevel}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VipProgressComponent;
