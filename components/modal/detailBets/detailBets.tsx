import { DialogProps, TransitionRootProps } from '@headlessui/react';
import Image from 'next/image';
import { ElementType, useEffect, useState } from 'react';
import { ArrowRight2, Headphone, ShieldTick, Simcard2 } from 'iconsax-react';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { shallowEqual, useSelector } from 'react-redux';

import api from '@/api/api';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TIME_SUBMIT_FORMAT_WITH_MARKER, TOAST_ENUM } from '@/base/constants/common';
import { currencyFormat, exchangeByLocaleFiat, formatDate, handleLocaleSymbol } from '@/base/libs/utils';
import { BetDetail } from '@/base/types/common';
import { RootState } from '@/base/types/root-state';
import Loader from '@/components/common/preloader/loader';
import CommonModal from '../commonModal/commonModal';
import { changeIsShowInformation } from '@/base/redux/reducers/modal.reducer';
import { useDispatch } from 'react-redux';

type ModalDetailBetsProps = {
  onClose: () => void;
  show: boolean;
  betId?: number;
  isPublicProfile?: boolean;
  titleModal?: String;
} & TransitionRootProps<ElementType> &
  DialogProps<ElementType>;

export default function ModalDetailBets({ show, onClose, betId, titleModal, isPublicProfile }: ModalDetailBetsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [betDetail, setBetDetail] = useState<BetDetail>();
  const { t } = useTranslation('');
  const dispatch = useDispatch();

  const { localeFiat, userId } = useSelector(
    (state: RootState) => ({
      localeFiat: state.common.localeFiat,
      userId: state.auth.userId,
    }),
    shallowEqual,
  );

  const handleGetBetDetail = async () => {
    try {
      setIsLoading(true);
      const res = await api.post('game/my-bet-detail', { betId: betId });
      setBetDetail(res.data?.[0]);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (betId) handleGetBetDetail();
  }, [betId]);

  const openModalProfileUser = (data?: BetDetail) => {
    const userData = {
      username: data?.player,
      avatar: data?.playerAvatar,
      userId: data?.playerId,
    };
    localStorage.setItem('userData', JSON.stringify(userData));
    dispatch(changeIsShowInformation(true));
  };

  return (
    <>
      {isLoading && <Loader />}
      <CommonModal
        show={show}
        onClose={onClose}
        panelClass="sm:!max-w-[400px]"
        header={
          <div className="relative sm:px-[30px] px-[20px] py-[20px] dark:bg-[#161D26] bg-[#f5f6fa]">
            <div className="text-[16px] dark:text-white text-black font-[600]">{titleModal || 'Details'}</div>
          </div>
        }
      >
        <div className="dark:bg-[url('/img/bg-detail-bets.png')] bg-[url('/img/img-detail-bets-light.png')] bg-no-repeat bg-contain  min-h-[516px] h-full bg-cover pt-[16px] px-[16px]">
          <div className="dark:bg-[url('/img/img-detail-bets.png')] bg-[length:100%_100%] pt-[8px] pb-[12px]">
            <div className="px-[16px]">
              <div className="flex items-center justify-between">
                <div />
                <div className="text-center">
                  <div className="font-bold dark:text-white text-black text-[12px]">{t('gameTable:profit')}</div>
                  <div className="flex items-center gap-[6px] font-bold">
                    <Image height={20} width={20} src={`/img/fiats/${betDetail?.currency}.png`} alt="" />
                    <div
                      className={`text-[22px] ${Number(betDetail?.profit) >= 0 ? 'text-[#0DFDE4]' : 'text-[#FD6E0B]'}`}
                    >
                      {Number(betDetail?.profit) >= 0 ? '+' : ''}
                      {handleLocaleSymbol(String(localeFiat?.currency))}
                      {currencyFormat(
                        exchangeByLocaleFiat(betDetail?.currency, String(localeFiat?.currency), betDetail?.profit),
                        4,
                      )}
                    </div>
                    <div className="text-[13px] text-black dark:text-white">
                      {handleLocaleSymbol(String(betDetail?.currency))}
                    </div>
                  </div>
                </div>
                <Image src={'/img/icon/icon-share.png'} width={15} height={15} alt="" />
              </div>
              <div className="h-[1px] bg-white dark:bg-[#3E4349] mt-[10px]" />
            </div>
            <div className="mt-[8px] flex items-center justify-around mb-[44px]">
              <div>
                <div className="text-[10px] text-[#31373d] dark:text-[#939699]">{t('gameTable:betAmount')}</div>
                <div className="flex items-center gap-[3px]">
                  <Image height={15} width={15} src={`/img/fiats/${betDetail?.currency}.png`} alt="" />

                  <div className="text-[12px] dark:text-white text-black">
                    {handleLocaleSymbol(String(localeFiat?.currency))}
                    {currencyFormat(
                      exchangeByLocaleFiat(betDetail?.currency, String(localeFiat?.currency), betDetail?.betAmount),
                      4,
                    )}
                  </div>
                </div>
              </div>
              <div className="w-[1px] h-[41px] dark:bg-[#3E4349] bg-white" />
              <div className="text-center">
                <div className="text-[10px] dark:text-[#939699] text-[#f5f6fa]">{t('gameTable:payout')}</div>
                <div className="text-[12px] dark:text-white text-black">
                  {betDetail?.payoutRate || betDetail?.payout}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[8px] pl-[16px]">
              {betDetail?.playerId !== userId && isPublicProfile ? (
                <Image height={44} width={44} className="rounded-full" src="/img/avatar-hidden.png" alt="" />
              ) : (
                <Image
                  height={44}
                  className="rounded-full"
                  width={44}
                  src={String(process.env.API_AVATAR) + betDetail?.playerAvatar}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = '/img/avatar-1.png';
                  }}
                />
              )}
              <div>
                <div className="flex items-center gap-[3px] mb-[5px]">
                  <div
                    className={`${
                      betDetail?.playerId !== userId && isPublicProfile
                        ? 'pointer-events-none'
                        : 'hover:underline cursor-pointer'
                    } text-[12px] dark:text-white text-black`}
                    onClick={() => openModalProfileUser(betDetail)}
                  >
                    {betDetail?.playerId !== userId && isPublicProfile ? t('homePage:hidden') : betDetail?.player}
                  </div>
                  <div className="text-[12px] dark:text-[#939699] text-[#31373d]">
                    On {formatDate(new Date(betDetail?.time ?? new Date()), TIME_SUBMIT_FORMAT_WITH_MARKER)}
                  </div>
                </div>
                <div className="flex items-center gap-[3px]">
                  <div className="text-[12px]">{t('gameTable:betID')}:</div>
                  <ShieldTick className="w-[16px] h-[16px] text-[#0DFDE4]" />
                  <div className="text-[12px] dark:text-white text-black">{betDetail?.betId}</div>
                  <Simcard2
                    role="button"
                    onClick={() => copy(String(betDetail?.betId))}
                    className="w-[16px] h-[16px] text-[#FD6E0B]"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 dark:bg-[#282A30] bg-[#f5f6fa] rounded-[5px] py-[9px] px-[10px] flex items-center justify-between mx-[6px]">
              <div className="flex items-center gap-[7px]">
                <Image
                  width={38}
                  height={38}
                  src={`https://cdn.softswiss.net/i/s4/${betDetail?.provider}/${betDetail?.identifier2}.png`}
                  alt=""
                  className="object-cover max-h-auto rounded-[5px]"
                  onError={(e) => {
                    e.currentTarget.src = '/img/recommended-game-3.png';
                  }}
                />
                <div>
                  <div className="text-[12px] dark:text-white text-black">{betDetail?.title}</div>
                  <div className="text-[12px] dark:text-[#939699] text-[#31373d] mt-[7px]">{betDetail?.provider}</div>
                </div>
              </div>
              <Link
                className="flex items-center group dark:text-[#939699] text-[#31373d] dark:hover:text-white hover:text-black"
                role="button"
                href={ROUTER.GameDetail(String(betDetail?.identifier))}
                onClick={() => {
                  onClose();
                }}
              >
                <div className="text-[12px]">{t('gameTable:playNow')}</div>
                <ArrowRight2 className="w-[12px] h-[12px]" />
              </Link>
            </div>
            {titleModal ? (
              <div className="mt-5 dark:bg-[#282A30] bg-[#f5f6fa] cursor-pointer rounded-[5px] group py-[9px] px-[10px] flex items-center justify-between mx-[6px] dark:text-[#939699] text-[#31373d] dark:hover:text-white hover:text-black">
                <p className="text-[12px] dark:text-[#939699] text-[#31373d]">{t('gameTable:gameDetails')}</p>
                <ArrowRight2 className="w-[12px] h-[12px]" />
              </div>
            ) : (
              <div className="flex items-center mt-5 mx-[6px]">
                <div className="text-[11px] dark:text-[#939699] text-[#31373d] max-w-[230px]">
                  {t('gameTable:anyIssues')}
                </div>
                <div className="flex items-center gap-[5px]">
                  <Headphone className="w-[14px] h-[14px] text-[#0DFDE4]" />
                  <div className="text-[11px] dark:text-[#939699] text-[#31373d]">{t('gameTable:liveSupport')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CommonModal>
    </>
  );
}
