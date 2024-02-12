import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import cn from 'classnames';
import { ArrowLeft2, Edit2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ElementType, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getProfile } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, groupMedal, ROUTER } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { convertUserInfo, currencyFormat1, formatDate } from '@/base/libs/utils';
import { changeIsShowInformation, changeIsShowUpdateInformation } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { UserDetail } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';

import CommonModal from '../commonModal/commonModal';
import MasterMedals from './masterMedals/masterMedals';
import Statistic from './statistic/statistic';
import WagerContest from './wager/wager';

type ModalProfileProps = {
  onClose: () => void;
  show: boolean;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

type FavoriteGameType = {
  id: string;
  title: string;
  identifier: string;
  totalWageredAmountUsd: number;
};

export default function ModalProfile({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');
  const { theme } = useTheme();
  const exchangeRate = useExchange();
  const { userId, viewInFiat, userData, localFiat } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      userId: state.auth.user.userId,
      userData: state.user,
      localFiat: state.wallet.localFiat,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [user, setUser] = useState<UserDetail>();
  const [medals, setMedals] = useState<string[]>([]);
  const [listGame, setListGame] = useState<FavoriteGameType[]>([]);

  const [isStatistic, setIsStatistic] = useState<boolean>(false);
  const [isMedalsDetail, setIsMedalDetail] = useState<boolean>(false);

  const [vipData, setVipData] = useState<any>({
    medal: `/img/vip.png`,
    level: 'VIP 1',
    type: 'VIP',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getVipListByRank = async () => {
    setIsLoading(true);
    try {
      // const res = await api.get('user-profile/get-vip');
      // setVipData(res?.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async (selectedUserId: string) => {
    try {
      setIsLoading(true);
      const res = await api_getProfile(selectedUserId || userId);
      const medals = res.data?.medals ?? [];
      const totalWins = res.data?.totalWins ?? 0;
      const totalBets = res.data?.totalBets ?? 0;
      const totalWagered = res.data?.totalWageredAmountUsd ?? 0;

      const tempFavoriteGame =
        res.data?.topThreeFavoriteGames?.map((item: any) => ({
          id: item.id,
          title: item.title,
          identifier: item.identifier,
          totalWageredAmountUsd: item.totalWageredAmountUsd,
        })) ?? [];
      setMedals(medals);
      setListGame(tempFavoriteGame);
      setVipData({
        medal: res.data.medal ?? `/img/vip.png`,
        level: res.data.currentVipName ?? 'VIP 1',
        type: 'VIP',
      });
      setUser({ ...convertUserInfo(res.data), betCount: totalBets, winCount: totalWins, totalWager: totalWagered });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const selectedUserId = userData.userId;
    getUserProfile(selectedUserId);
    getVipListByRank();
  }, [userData]);

  const returnHeader = useCallback(() => {
    return (
      <>
        <div className="relative px-[12px] py-[20px] bg-color-light-bg-primary dark:bg-color-header-primary">
          {!isStatistic && !isMedalsDetail && (
            <div>
              <div className="text-black dark:text-white md:text-[18px] text-[16px] px-[20px] font-bold">
                {t('profile:userInformation')}
              </div>
              <div className="absolute top-0 right-[60px]">
                <div className="relative">
                  <Image
                    onError={(e) => {
                      e.currentTarget.src = `/img/vip.png`;
                    }}
                    src={`/img/${vipData.medal}.png`}
                    width={60}
                    height={52}
                    alt=""
                    className=""
                  />
                  <div className="absolute flex flex-col items-center left-0 top-[40%] w-full h-full">
                    <p className="text-[8px] uppercase leading-[1]">{vipData.type}</p>
                    <p className="text-[10px] font-semibold">{vipData.level}</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex gap-[10px] justify-between mt-[35px]">
                <div
                  role="button"
                  className="py-[6px] px-[10px] rounded-[10px] bg-white dark:bg-[#12181F] dark:hover:bg-gray-600 hover:bg-gray-200 h-fit flex items-center gap-[5px]"
                >
                  <div className="flex w-[14px] h-[14px]">
                    <Image width={14} height={14} src="/img/heart.png" alt="" />
                  </div>
                  <div className="flex text-black dark:text-white">0</div>
                </div>
                <div className="flex flex-col items-center gap-[10px] w-full">
                  <div className="h-[80px] w-[80px] rounded-full overflow-hidden">
                    <Image
                      height={80}
                      width={80}
                      src={String(API_AVATAR) + user?.avatar}
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src = '/img/avatar-1.png';
                      }}
                    />
                  </div>
                  <div className="text-black dark:text-white text-[16px] font-[700]">{user?.userName}</div>
                  <div className="text-[12px] text-color-text-primary">
                    {t('profile:userID')}:{user?.userId}
                  </div>
                </div>
                {user?.userId === userId ? (
                  <div
                    className="sm:px-[15px] sm:py-[10px] text-black dark:text-white dark:hover:text-white p-2 rounded-[10px] bg-white dark:bg-[#12181F] dark:hover:bg-gray-600 hover:bg-gray-200 h-fit text-[14px] "
                    onClick={() => {
                      dispatch(changeIsShowUpdateInformation(true));
                      dispatch(changeIsShowInformation(false));
                    }}
                    role="button"
                  >
                    <Edit2 size={20} />
                  </div>
                ) : (
                  <div className="sm:px-[15px] sm:py-[10px] p-2"></div>
                )}
              </div>
            </div>
          )}
          {isMedalsDetail && (
            <div>
              <div
                className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex items-center gap-[10px] cursor-pointer"
                onClick={() => setIsMedalDetail(false)}
              >
                <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
                <div className="text-[16px]">{t('profile:masterMedals')}</div>
              </div>
            </div>
          )}
          {isStatistic && (
            <div>
              <div
                onClick={() => setIsStatistic(false)}
                className="text-black dark:text-white md:text-[18px] text-[16px] font-bold flex items-center gap-[10px] cursor-pointer"
              >
                <ArrowLeft2 className="w-[16px] text-[#67707B] stroke-4" />
                <div className="text-[16px]">{t('profile:details')}</div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }, [isStatistic, isMedalsDetail, vipData, user]);

  const returnBody = useCallback(() => {
    if (!user) return <Loader />;
    // if selected User is not signIn user and selected user sets hideGamingData
    if (user?.userId !== userId && user?.privacySetting.settingHideGamingData) {
      return (
        <>
          <div className="flex flex-col gap-[6px] overflow-y-auto px-[12px] pt-[4px] pb-[17px] scrollbar">
            <div className="rounded-[10px] px-5 py-5 h-[300px]">
              <div className="text-[12px] text-color-light-text-primary dark:text-white">{t('profile:statistics')}</div>
              <div className="flex justify-center mt-4">
                <Image width={200} height={200} src="/img/noStatistic.png" alt="hidden statistic" />
              </div>
              <div className="text-[10px] text-color-text-primary flex justify-center">
                {t('profile:statisticsHidden')}
              </div>
            </div>
            <div className="text-color-text-primary text-[10px] w-full text-center mt-[10px]">
              {t('profile:joinedOn')} {formatDate(new Date(user?.createdAt ?? ''), 'dd/MM/yyyy')}
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div
          className={`flex flex-col gap-[6px] overflow-y-auto px-[12px] pt-[4px] pb-[17px] h-full dark:bg-color-header-primary bg-color-light-bg-primary scrollbar ${
            isMedalsDetail && '!p-0'
          }`}
        >
          {!isStatistic && !isMedalsDetail && (
            <div className="flex flex-col gap-2">
              <div className="rounded-[5px] dark:bg-color-modal-bg-primary bg-white px-[14px] pt-[16px] pb-[12px]">
                <div className="flex items-center justify-between" onClick={() => setIsMedalDetail(true)}>
                  <div className="flex gap-[5px] text-black dark:text-white text-[12px] items-center">
                    <div>{t('profile:medal')}</div>
                    <div>{medals.length}</div>
                  </div>
                  <div className="flex items-center gap-[5px] cursor-pointer">
                    <div className="text-color-primary text-[12px]">{t('profile:details')}</div>
                    <ChevronRightIcon width={14} className="text-color-primary" />
                  </div>
                </div>
                <div className="mt-[12px] flex gap-[14px] items-center flex-nowrap overflow-auto scrollbar cursor-pointer pb-[5px]">
                  {groupMedal.map((item, index) => (
                    <Image
                      src={item.img}
                      alt=""
                      width={44}
                      onClick={() => setIsMedalDetail(true)}
                      height={662}
                      key={index}
                      className={cn({
                        'opacity-[0.5]': medals.findIndex((medal) => medal === item.key) === -1,
                        'opacity-100': medals.findIndex((medal) => medal === item.key) !== -1,
                      })}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-color-modal-bg-primary py-[12px] px-[14px] rounded-[5px]">
                <div className="flex items-center justify-between">
                  <div className="text-black dark:text-white text-[12px]">{t('profile:statistics')}</div>
                  <div
                    className="flex items-center gap-[5px] cursor-pointer"
                    onClick={() => {
                      setIsStatistic(true);
                    }}
                  >
                    <div className="text-color-primary text-[12px]">{t('profile:details')}</div>
                    <ChevronRightIcon width={14} className="text-color-primary" />
                  </div>
                </div>
                <div className="flex items-center flex-row gap-2 sm:gap-[15px] sm:justify-between mt-5">
                  <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-win.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-color-text-primary">{t('profile:totalWins')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user.winCount}</div>
                  </div>
                  <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-bets.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-color-text-primary">{t('profile:totalBets')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user.betCount}</div>
                  </div>
                  <div className="bg-[#f5f6fa] dark:bg-color-card-body-secondary rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-wagered.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-color-text-primary">{t('profile:totalWagered')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black truncate max-w-full px-1">
                      {viewInFiat ? (
                        <>{currencyFormat1(user.totalWager * exchangeRate, 2, localFiat?.name || 'USD')}</>
                      ) : (
                        <>{currencyFormat1(user.totalWager, 2)}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-color-modal-bg-primary bg-white rounded-[10px] px-5 py-5">
                <div className="text-[12px] text-color-light-text-primary dark:text-white">
                  {t('profile:top3FavoriteGames')}
                </div>
                {!!listGame.length && (
                  <div className="flex flex-col gap-[5px] mt-[15px]">
                    {listGame.map((item, index) => (
                      <div className="flex items-center justify-between" key={index}>
                        <Link href={ROUTER.GameDetail(item.identifier || '')}>
                          <div className="flex items-center gap-[10px]" onClick={onClose}>
                            <Image
                              height={60}
                              width={60}
                              src={`https://cdn.softswiss.net/i/s4/${(item.identifier || '').replace(':', '/')}.png`}
                              alt=""
                              className="object-cover max-h-auto rounded-[5px]"
                            />
                            <div className="text-[12px] text-color-text-primary">{item.title}</div>
                          </div>
                        </Link>
                        <div className="text-[10px] text-color-text-primary text-right">
                          <div>{t('profile:wagered')}</div>
                          <div className="text-white">
                            {viewInFiat
                              ? currencyFormat1(item.totalWageredAmountUsd * exchangeRate, 2, localFiat?.name || 'USD')
                              : currencyFormat1(item.totalWageredAmountUsd, 2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!listGame.length && (
                  <div className="flex justify-center relative">
                    <Image
                      src={theme === 'dark' ? '/img/empty-dark.png' : '/img/empty-light.png'}
                      width={90}
                      height={90}
                      className="w-[200px] h-[200px]"
                      alt=""
                    />
                    <p className="absolute dark:text-color-text-primary text-color-light-text-primary text-[12px] sm:text-[14px] bottom-0 text-center">
                      {t('table:noData')}
                    </p>
                  </div>
                )}
              </div>
              <div className="dark:bg-color-modal-bg-primary bg-white rounded-[10px] px-5 py-5">
                <div className="text-[12px] text-color-light-text-primary dark:text-white">
                  {t('profile:wagerContest')}
                </div>
                <WagerContest userData={user} />
              </div>
              <div className="text-color-text-primary text-[10px] w-full text-center mt-[10px]">
                {t('profile:joinedOn')} {formatDate(new Date(user?.createdAt ?? ''), 'dd/MM/yyyy')}
              </div>
            </div>
          )}
          {isStatistic && <Statistic userData={user} />}
          {isMedalsDetail && <MasterMedals />}
        </div>
      </>
    );
  }, [user, userId, isStatistic, isMedalsDetail, viewInFiat, listGame, isLoading, medals, exchangeRate]);

  return (
    <>
      {isLoading && <Loader />}
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="rounded max-w-full sm:max-w-[464px] h-full max-h-full sm:!h-[720px] sm:max-h-[90vh] !m-0"
        key={String(isStatistic)}
        header={returnHeader()}
      >
        {returnBody()}
      </CommonModal>
    </>
  );
}
