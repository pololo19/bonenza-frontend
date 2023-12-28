import { Switch } from '@headlessui/react';
import { ReactElement, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { updateSetting } from '@/base/redux/reducers/auth.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import { UserSettingPrivacyType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';

import styles from '../../balance/index.module.scss';

const PrivacyPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { settings } = useSelector(
    (state: AppState) => ({
      settings: state.auth.user.privacySetting,
    }),
    shallowEqual,
  );

  const { t } = useTranslation('');
  const dispatch = useAppDispatch();

  const handleUpdateSetting = async (setting: UserSettingPrivacyType) => {
    dispatch(updateSetting(setting));
  };

  return (
    <div className={`${styles.cardContent}`}>
      {isLoading && <Loader />}
      <div className="w-full h-1/3 p-2 sm:p-0 md:mt-0 text-white">
        <div className="flex justify-between items-center border-b border-solid gap-[40px] border-[#3D4049] pb-[8px]">
          <label className="text-left cursor-pointer" htmlFor="hideGamingData">
            <div className="dark:text-[#C2C2C2] text-[#5f6975cc] text-[12px] sm:text-[14px]">
              {t('setting:hideMyGamingDataOnProfile')}
            </div>
            <div className="text-[#53575C] text-[10px]">{t('setting:evenIfHidden')}</div>
          </label>
          <Switch
            id="hideGamingData"
            checked={settings.settingHideGamingData}
            onChange={(value) => handleUpdateSetting({ ...settings, settingHideGamingData: value })}
            className={`${
              settings.settingHideGamingData
                ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]'
                : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] min-w-[44px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingHideGamingData
                  ? 'translate-x-5 bg-[#0DFDE4]'
                  : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid items-center gap-[40px] border-[#3D4049] py-[8px]">
          <label className="text-left cursor-pointer" htmlFor="hideUserName">
            <div className="dark:text-[#C2C2C2] text-[#5f6975cc] text-[12px] sm:text-[14px]">
              {t('setting:hideMyUsernameFromPublicLists')}
            </div>
            <div className="text-[#53575C] text-[10px]">{t('setting:noOneCanViewYourProfile')}</div>
          </label>
          <Switch
            id="hideUserName"
            checked={settings.settingHideUserName}
            onChange={(value) => handleUpdateSetting({ ...settings, settingHideUserName: value })}
            className={`${
              settings.settingHideUserName ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]' : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] min-w-[44px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingHideUserName ? 'translate-x-5 bg-[#0DFDE4]' : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
        <div className="flex justify-between border-b border-solid gap-[40px] border-[#3D4049] py-[8px]">
          <label
            className="dark:text-[#C2C2C2] text-[#5f6975cc] text-[12px] sm:text-[14px] cursor-pointer"
            htmlFor="refuseTip"
          >
            {t('setting:refuseTipFromStrangers')}
          </label>
          <Switch
            id="refuseTip"
            checked={settings.settingRefuseTipFromStrangers}
            onChange={(value) => handleUpdateSetting({ ...settings, settingRefuseTipFromStrangers: value })}
            className={`${
              settings.settingRefuseTipFromStrangers
                ? 'dark:bg-[#0DFDE4]/30 bg-[#3bc11733]'
                : 'dark:bg-[#272C33] bg-[#5f697566]'
            } relative inline-flex h-[24px] min-w-[44px] w-[44px] items-center rounded-full`}
          >
            <span
              className={`${
                settings.settingRefuseTipFromStrangers
                  ? 'translate-x-5 bg-[#0DFDE4]'
                  : 'translate-x-1 dark:bg-[#31343D] bg-white'
              } inline-block h-[20px] w-[20px] transform rounded-full transition`}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
};

const PrivacyPageAuth = withAuth(PrivacyPage);

PrivacyPageAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default PrivacyPageAuth;
