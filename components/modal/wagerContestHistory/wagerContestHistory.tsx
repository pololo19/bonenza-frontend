import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { Ghost } from 'iconsax-react';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

import { api_wagerContestHistory } from '@/api/game';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { changeIsShowInformation, changeIsShowWagerContestHistory } from '@/base/redux/reducers/modal.reducer';
import { setUserData } from '@/base/redux/reducers/user.reducer';
import { AppState, useAppDispatch } from '@/base/redux/store';
import RankingTableComponent from '@/components/table/rankingTable';

import CommonModal from '../commonModal/commonModal';

type ModalWagerContestHistoryProps = {
  onClose: () => void;
  show: boolean;
};

type WagerContestHistoryItemType = {
  playerId: string;
  playerName: string;
  playerAvatar: string;
  wageredUsd: number;
  prizeUsd: number;
  percent: number;
};

export default function ModalWagerContestHistory({ show, onClose }: ModalWagerContestHistoryProps) {
  const exchangeRate = useExchange();
  const { t } = useTranslation();
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const dispatch = useAppDispatch();
  const [wagerHistory, setWagerHistory] = useState<WagerContestHistoryItemType[]>([]);
  const [wagerData, setWagerData] = useState({
    currentTime: 0,
    endTime: 0,
  });

  const { viewInFiat, localFiat, userId, userName, isLogin } = useSelector(
    (state: AppState) => ({
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
      localFiat: state.wallet.localFiat,
      userId: state.auth.user.userId,
      userName: state.auth.user.userName,
      isLogin: state.auth.isLogin,
    }),
    shallowEqual,
  );

  const getWagerHistory = async () => {
    try {
      setIsLoadingTable(true);
      const _res = await api_wagerContestHistory();
      const tempHistory: WagerContestHistoryItemType[] = _res.data?.contest?.map((item: any) => ({
        playerId: item?.playerId ?? '',
        playerName: item?.playerName ?? '',
        playerAvatar: item?.playerAvatar ?? '',
        wageredUsd: Number(item?.wageredAmountUsd || 0),
        prizeUsd: Number(item?.prizeAmountUsd || 0),
        percent: item?.percentage || 0,
      }));
      setWagerHistory(tempHistory);
      setWagerData({
        currentTime: _res.data?.lastContentStartTime * 1000,
        endTime: _res.data?.lastContentEndTime * 1000,
      });
    } catch (error) {
      setWagerHistory([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleModalUserProfile = (user: any) => {
    dispatch(
      setUserData({
        userId: user.original.playerId,
        userName: user.original.playerName,
        avatar: user.original.playerAvatar,
      }),
    );
    dispatch(changeIsShowWagerContestHistory(false));
    dispatch(changeIsShowInformation(true));
  };

  const columns = useMemo(() => {
    const columnsDefault: ColumnDef<WagerContestHistoryItemType>[] = [
      {
        accessorKey: 'betId',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">#</div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start gap-[5px] truncate sm:px-2 px-[5px]')}>
            {row.index === 0 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/gold.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 1 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/sliver.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index === 2 && (
              <Image
                height={25}
                width={25}
                src="/img/icon/bronze.png"
                alt=""
                className="object-cover sm:h-[25px] h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            {row.index !== 0 && row.index !== 1 && row.index !== 2 && (
              <div className="dark:text-color-text-primary text-color-light-text-primary font-bold truncate">
                {row.index + 1}th
              </div>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'player',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:player')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div
            onClick={() => handleModalUserProfile(row)}
            className={cn(
              'dark:text-white text-color-light-text-primary flex items-center justify-start gap-[10px] truncate sm:px-2 px-[5px]',
              {
                'pointer-events-none cursor-text': row.original?.playerId !== userId && !row.original?.playerName,
              },
            )}
          >
            {row.original?.playerId !== userId && !row.original?.playerName ? (
              <Image
                width={25}
                height={25}
                className="rounded-full grayscale brightness-50 sm:h-[25px] sm:w-[25px] w-[16px]"
                src="/img/avatar-hidden.png"
                alt=""
              />
            ) : (
              <Image
                height={25}
                width={25}
                src={String(process.env.API_AVATAR) + row.original?.playerAvatar}
                onError={(e) => {
                  e.currentTarget.src = '/img/avatar-1.png';
                }}
                alt=""
                className="object-cover sm:h-[25px] rounded-full h-[16px] sm:w-[25px] w-[16px]"
              />
            )}
            <div className="font-bold truncate">
              {row.original?.playerId !== userId && !row.original?.playerName
                ? <div className="flex gap-[3px] items-center"><Ghost width={12} height={12} variant="Bulk" className="w-4 h-4 hidden sm:block " />{t('homePage:hidden')}</div>
                : row.original.playerId === userId
                ? userName
                : row.original.playerName}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'betAmount',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:wagered')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className="text-color-primary truncate sm:px-2 px-[5px] font-bold">
            {viewInFiat
              ? currencyFormat1(row.original.wageredUsd * exchangeRate, 8, localFiat?.name)
              : currencyFormat1(row.original.wageredUsd, 8)}
          </div>
        ),
      },
      {
        accessorKey: 'payout',
        header: () => (
          <div className="dark:text-color-text-primary text-color-light-text-primary sm:px-2 px-[5px]">
            {t('gameTable:prize')}
          </div>
        ),
        minSize: 30,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-color-light-text-primary truncate flex justify-end sm:px-2 px-[5px] font-bold">
            <span className="text-color-primary font-bold">
              {viewInFiat
                ? currencyFormat1(row.original.prizeUsd * exchangeRate, 4, localFiat?.name)
                : currencyFormat1(row.original.prizeUsd, 4)}
            </span>
            <span className="ml-[5px] hidden sm:block font-bold text-color-text-primary/70">{`${row.original.percent}%`}</span>
          </div>
        ),
      },
    ];
    return columnsDefault;
  }, [t, localFiat, exchangeRate]);

  useEffect(() => {
    if (show) {
      getWagerHistory();
    }
  }, [show]);

  return (
    <CommonModal
      show={show}
      onClose={onClose}
      panelClass="rounded"
      header={
        <div className="flex flex-col items-start dark:bg-color-header-primary bg-color-light-bg-primary px-[20px] py-[20px] gap-[20px]">
          <div className="flex justify-between text-[16px] dark:text-white text-black gap-[10px]">
            <p>{t('wagerContest:history')}</p>
            <p className="dark:text-color-text-primary text-color-light-text-primary">
              {formatDate(new Date(wagerData.currentTime), 'LL/dd/yyyy')} ~{' '}
              {formatDate(new Date(wagerData.endTime), 'LL/dd/yyyy')}
            </p>
          </div>
        </div>
      }
    >
      <div className="dark:bg-color-modal-bg-primary bg-white p-3 pb-0">
        <RankingTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={wagerHistory}
          columns={columns}
        />
      </div>
    </CommonModal>
  );
}
