import { DialogProps, TransitionRootProps } from '@headlessui/react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { ArrowLeft2, Edit2 } from 'iconsax-react';
import Image from 'next/image';
import Link from 'next/link';
import { ElementType, useCallback, useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { api_getProfile } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { API_AVATAR, ROUTER } from '@/base/constants/common';
import { convertUserInfo, currencyFormat, exchangeByLocaleFiat, handleLocaleSymbol } from '@/base/libs/utils';
import { changeIsShowInformation, changeIsShowUpdateInformation } from '@/base/redux/reducers/modal.reducer';
import { AppState } from '@/base/redux/store';
import { GameDetail, UserDetail } from '@/base/types/common';
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

const groupMedal = [
  { img: '/img/medal-1.png' },
  { img: '/img/medal-2.png' },
  { img: '/img/medal-3.png' },
  { img: '/img/medal-4.png' },
  { img: '/img/medal-5.png' },
  { img: '/img/medal-6.png' },
  { img: '/img/medal-7.png' },
  { img: '/img/medal-1.png' },
  { img: '/img/medal-2.png' },
];

export default function ModalProfile({ show, onClose }: ModalProfileProps) {
  const { t } = useTranslation('');
  const { localeFiat, userId, viewInFiat, userData } = useSelector(
    (state: AppState) => ({
      localeFiat: state.common.localeFiat,
      viewInFiat: state.common.viewInFiat,
      userId: state.auth.user.userId,
      userData: state.user,
    }),
    shallowEqual,
  );

  const dispatch = useDispatch();

  const [user, setUser] = useState<UserDetail>();
  const [listGame, setListGame] = useState<GameDetail[]>([]);
  const [isStatistic, setIsStatistic] = useState<boolean>(false);
  const [isMedalsDetail, setIsMedalDetail] = useState<boolean>(false);
  const [vipData, setVipData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetListGame = async (selectedUserId: string) => {
    try {
      // const res = await api.get('game/get-top-3-favorites', {
      //   params: {
      //     userId: selectedUserId || userId,
      //   },
      // });
      setListGame([]);
    } catch (error) {
      setListGame([]);
    } finally {
    }
  };

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
      setUser({ ...convertUserInfo(res.data) });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const selectedUserId = userData.userId;
    handleGetListGame(selectedUserId);
    getUserProfile(selectedUserId);
    getVipListByRank();
  }, [userData]);

  const returnHeader = useCallback(() => {
    return (
      <>
        <div className="relative px-[12px] pt-[20px] pb-[10px] bg-[#f5f6fa] dark:bg-[#161D26]">
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
                    src={`/img/${vipData?.vipCurrent?.medal}.png`}
                    width={50}
                    height={52}
                    alt=""
                    className=""
                  />
                  <div className="absolute flex flex-col items-center left-0 top-[40%] w-full h-full">
                    <p className="text-[6px] uppercase leading-[1]">{vipData?.vipCurrent?.type}</p>
                    <p className="text-[10px] font-semibold">V{vipData?.vipCurrent?.level}</p>
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
                  <div className="text-[12px] text-[#939699]">
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
          <div className="flex flex-col gap-[6px] overflow-y-auto px-[12px] pt-[4px] pb-[17px] bg-[#f5f6fa] dark:bg-[#161D26]">
            <div className="dark:bg-[#12181F] bg-white rounded-[10px] px-5 py-5 h-[300px]">
              <div className="text-[0.875rem] text-[#31373d] dark:text-white">{t('profile:statistics')}</div>
              <div className="flex justify-center mt-4">
                <Image width={200} height={200} src="/img/noStatistic.png" alt="hidden statistic" />
              </div>
              <div className="text-[10px] text-[#939699] flex justify-center">{t('profile:statisticsHidden')}</div>
            </div>
            <div className="text-[#939699] text-[10px] w-full text-center mt-[10px]">
              {t('profile:joinedOn')} 6/23/2023
            </div>
          </div>
        </>
      );
    }
    return (
      <>
        <div
          className={`flex flex-col gap-[6px] overflow-y-auto px-[12px] pt-[4px] pb-[17px] h-full bg-[#f5f6fa] dark:bg-[#161D26] ${
            isMedalsDetail && '!p-0'
          }`}
        >
          {!isStatistic && !isMedalsDetail && (
            <div className="flex flex-col gap-2">
              <div className="rounded-[5px] bg-white dark:bg-[#12181F] px-[12px] pt-[16px] pb-[12px]">
                <div className="flex items-center justify-between" onClick={() => setIsMedalDetail(true)}>
                  <div className="flex gap-[5px] text-black dark:text-white text-[0.875rem] items-center">
                    <div>{t('profile:medal')}</div>
                    <div>0</div>
                  </div>
                  <div className="flex items-center gap-[5px] cursor-pointer">
                    <div className="text-[#20D4EB] text-[0.875rem]">{t('profile:details')}</div>
                    <ChevronRightIcon width={14} className="text-[#20D4EB]" />
                  </div>
                </div>
                <div className="mt-[12px] flex gap-[14px] items-center flex-nowrap overflow-auto scrollbar cursor-pointer pb-[5px]">
                  {groupMedal.map((item, index) => (
                    <Image src={item.img} alt="" width={44} height={662} key={index} className="opacity-[0.5]" />
                  ))}
                </div>
              </div>
              <div className="bg-white dark:bg-[#12181F] py-[15px] px-[12px] rounded-[5px]">
                <div className="flex items-center justify-between">
                  <div className="text-black dark:text-white text-[0.875rem]">{t('profile:statistics')}</div>
                  <div
                    className="flex items-center gap-[5px] cursor-pointer"
                    onClick={() => {
                      setIsStatistic(true);
                    }}
                  >
                    <div className="text-[#20D4EB] text-[0.875rem]">{t('profile:details')}</div>
                    <ChevronRightIcon width={14} className="text-[#20D4EB]" />
                  </div>
                </div>
                <div className="flex items-center flex-row gap-2 sm:gap-[15px] sm:justify-between mt-5">
                  <div className="bg-[#f5f6fa] dark:bg-[#1A1C1F] rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-win.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-[#939699]">{t('profile:totalWins')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user?.winCount || 0}</div>
                  </div>
                  <div className="bg-[#f5f6fa] dark:bg-[#1A1C1F] rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-bets.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-[#939699]">{t('profile:totalBets')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black">{user?.betCount || 0}</div>
                  </div>
                  <div className="bg-[#f5f6fa] dark:bg-[#1A1C1F] rounded-[10px] flex flex-col justify-center items-center gap-[8px] pt-[16px] pb-[12px] h-[80px] w-full sm:w-[30%]">
                    <div className="flex gap-[5px] items-center">
                      <Image
                        src="/img/icon/total-wagered.png"
                        width={12}
                        height={12}
                        className="w-[12px] h-[12px]"
                        alt=""
                      />
                      <div className="text-[0.75rem] text-[#939699]">{t('profile:totalWagered')}</div>
                    </div>
                    <div className="text-[14px] sm:text-[1rem] dark:text-white text-black truncate max-w-full px-1">
                      {viewInFiat ? (
                        <>
                          {handleLocaleSymbol(String(localeFiat?.currency))}
                          {currencyFormat(
                            exchangeByLocaleFiat('USD', String(localeFiat?.currency), user?.totalWager),
                            2,
                          )}
                        </>
                      ) : (
                        <>
                          {handleLocaleSymbol('USD')}
                          {currencyFormat(Number(user?.totalWager), 2)}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="dark:bg-[#12181F] bg-white rounded-[10px] px-5 py-5">
                <div className="text-[0.875rem] text-[#31373d] dark:text-white">{t('profile:top3FavoriteGames')}</div>
                {!!listGame.length && (
                  <div className="flex flex-col gap-[5px] mt-[15px]">
                    {listGame.map((item, index) => (
                      <div className="flex items-center justify-between" key={index}>
                        <Link href={ROUTER.GameDetail(item.identifier || '')}>
                          <div className="flex items-center gap-[10px]" onClick={onClose}>
                            <Image
                              height={60}
                              width={60}
                              src={`https://cdn.softswiss.net/i/s4/${item.provider}/${item.identifier2}.png`}
                              alt=""
                              className="object-cover max-h-auto rounded-[5px]"
                            />
                            <div className="text-[12px] text-[#939699]">{item.title}</div>
                          </div>
                        </Link>
                        <div className="text-[10px] text-[#939699] text-right">
                          <div>{t('profile:wagered')}</div>
                          <div>{`${handleLocaleSymbol(String(localeFiat?.currency))} ${currencyFormat(
                            exchangeByLocaleFiat(item.currency, String(localeFiat?.currency), Number(item.wagered)),
                            2,
                          )}`}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!listGame.length && (
                  <div className="flex justify-center relative">
                    <Image src="/img/empty.png" width={90} height={90} className="w-[200px] h-[200px]" alt="" />
                    <p className="absolute dark:text-[#98a7b5] text-[#31373d] text-[12px] sm:text-[14px] bottom-0 text-center">
                      {t('table:noData')}
                    </p>
                  </div>
                )}
              </div>
              <div className="dark:bg-[#12181F] bg-white rounded-[10px] px-5 py-5">
                <div className="text-[0.875rem] text-[#31373d] dark:text-white">{t('profile:wagerContest')}</div>
                <WagerContest userData={user} />
              </div>
              <div className="text-[#939699] text-[10px] w-full text-center mt-[10px]">
                {t('profile:joinedOn')} 10/05/2023
              </div>
            </div>
          )}
          {isStatistic && <Statistic userData={user} />}
          {isMedalsDetail && <MasterMedals />}
        </div>
      </>
    );
  }, [user, userId, isStatistic, isMedalsDetail, viewInFiat, listGame, isLoading]);

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
