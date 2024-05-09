import 'swiper/css';
import 'swiper/css/grid';

import { Activity, BookSquare } from 'iconsax-react';
import Head from 'next/head';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import {
  api_affiliate,
  api_affiliateCommissionRewards,
  api_affiliateCommissionRewardsHistory,
  api_affiliateCommissionRewardsWithdraw,
  api_affiliateFriends,
  api_affiliateReferralRewards,
  api_affiliateReferralRewardsWithdrw,
} from '@/api/bonus';
import { useTranslation } from '@/base/config/i18next';
import { ROUTER, TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER, TOAST_ENUM } from '@/base/constants/common';
import { useExchange } from '@/base/hooks/useExchange';
import { currencyFormat1, formatDate } from '@/base/libs/utils';
import { AppState, useAppDispatch } from '@/base/redux/store';
import Loader from '@/components/common/preloader/loader';
import CommissionReward from '@/components/modal/affiliate/commissionRewards/commissionRewards';
import ReferralRewardRules from '@/components/modal/affiliate/referralRewardRules/referralRewardRules';
import cn from 'classnames';
import AdminTableComponent from '../table/adminTable';
import Paging from '../paging/paging';
import { ColumnDef } from '@tanstack/react-table';
import { useUSDTPrice } from '@/base/hooks/useUSDTPrice';
import { api_getClaims } from '@/api/wallet';
import { setLockedAmount } from '@/base/redux/reducers/wallet.reducer';
import { toast } from 'react-toastify';
import { getErrorMesssage1 } from '@/base/libs/utils/notificationToast';
import ReactLoading from 'react-loading';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import AdminInputText from '../input/admin/AdminInputText';
import AdminInputDateRange from '../input/admin/AdminInputDateRange';
import AdminSelectBox from '../input/admin/AdminSelectBox';

const fiatDecimals = 4;
type ReferralType = 'code' | 'friend';

type FilterType = {
  username?: string;
  userId?: string;
  registrationDate?: any[];
  wagerDateRange?: any[];
  code?: string;
};

type AffiliateFriendType = {
  referralCode: string;
  registrationDate: Date;
  status: string;
  totalCommission: number;
  totalWager: number;
  userId: number;
  username: string;
};

function ReferralCodeFriendComponent() {
  const exchangeRate = useExchange();
  const usdtPrice = useUSDTPrice();
  const { t, i18n } = useTranslation('');
  const dispatch = useAppDispatch();

  const { referralCode, localFiat, viewInFiat } = useSelector(
    (state: AppState) => ({
      referralCode: state.auth.user.referralCode,
      localFiat: state.wallet.localFiat,
      viewInFiat: state.auth.user.generalSetting.settingViewInFiat,
    }),
    shallowEqual,
  );

  const [codeTab, setCodeTab] = useState<ReferralType>('code');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [totalFriendsCnt, setTotalFriendsCnt] = useState(0);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);

  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsLimit, setFriendsLimit] = useState<number>(10);
  const [friendsTotalRow, setFriendsTotalRow] = useState<number>(0);
  const schema = yup.object().shape({});
  const [friendsTableData, setFriendsTableData] = useState<AffiliateFriendType[]>([]);

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? friendsPage + 1 : action === 'Prev' ? friendsPage - 1 : +action;
    setFriendsPage(newPage);
    getListFriends();
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setFriendsLimit(itemPerPage);
    setFriendsPage(1);
  };

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FilterType) => {
    await getListFriends(data);
  };

  const getListFriends = useCallback(
    async (filter?: FilterType) => {
      try {
        setIsLoadingTable(true);
        const registrationStartDate = filter?.registrationDate
          ? new Date(filter.registrationDate[0]).getTime()
          : undefined;
        const registrationEndDate = filter?.registrationDate
          ? new Date(filter.registrationDate[1]).getTime()
          : undefined;
        const wagerStartDate = filter?.wagerDateRange ? new Date(filter.wagerDateRange[0]).getTime() : undefined;
        const wagerEndDate = filter?.wagerDateRange ? new Date(filter.wagerDateRange[0]).getTime() : undefined;
        const _res = await api_affiliateFriends(
          friendsPage,
          friendsLimit,
          filter?.username,
          filter?.userId,
          registrationStartDate,
          registrationEndDate,
          wagerStartDate,
          wagerEndDate,
        );
        const tempFriendsData =
          _res.data?.friends.map((item: any) => ({
            referralCode: referralCode,
            registrationDate: new Date(item.userRegisteredDate),
            status: '',
            totalCommission: Number(item.totalCommissionRewardsAmountUsd || 0),
            totalWager: Number(item.totalWagerAmountUsd || 0),
            userId: item.userId,
            username: item.userName,
          })) || [];
        setFriendsTotalRow(Number(_res.data?.totalCount || 0));
        setTotalFriendsCnt(Number(_res.data?.totalCount || 0));
        setFriendsTableData(tempFriendsData);
      } catch (error) {
        setFriendsTableData([]);
      } finally {
        setIsLoadingTable(false);
      }
    },
    [friendsPage, referralCode, friendsLimit],
  );

  const friendColumns: ColumnDef<AffiliateFriendType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'username',
        header: () => <div className="text-left">Username</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.username}</div>
          </div>
        ),
      },
      {
        accessorKey: 'userId',
        header: () => <div className="text-left">UserId</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.userId}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalWager',
        header: () => <div className="text-left">{t('mycasino:totalWager')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-color-primary gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalWager * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalWager, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommission',
        header: () => <div className="text-left">{t('mycasino:totalCommissionReward')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {viewInFiat
                ? currencyFormat1(row.original.totalCommission * exchangeRate, fiatDecimals, localFiat?.name)
                : currencyFormat1(row.original.totalCommission, fiatDecimals)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'registrationDate',
        header: () => <div className="text-left">{t('mycasino:registrationDate')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {formatDate(new Date(row.original.registrationDate), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'referralCode',
        header: () => <div className="text-left">{t('mycasino:code')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.referralCode}</div>
          </div>
        ),
      },
    ];
  }, []);

  useEffect(() => {
    if (codeTab === 'friend') getListFriends();
  }, [codeTab, friendsPage, friendsLimit, referralCode]);

  return (
    <div className="">
      {isLoading && <Loader />}
      <Head>
        <title>Affiliate - Bonenza</title>
      </Head>
      <div className="flex flex-col mt-[20px]">
        <div className="grid grid-cols-1 md:grid-cols-3 bg-gradient-card-default rounded-default gap-6 py-5">
          <div className="md:py-10">
            <div className="min-w-[150px] text-center text-default sm:text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414]">
              {t('affiliate:referralCodeCreated')}
            </div>
            <div className={`text-title mt-5 sm:text-[22px] font-bold text-center`}>
              <span className="text-color-text-green font-bold">{0} </span>
              <span className="font-bold">/ 20</span>
            </div>
          </div>
          <div className="md:py-10">
            <div className="min-w-[150px] text-center text-default sm:text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414]">
              {t('affiliate:friends')}
            </div>
            <div className={`text-title mt-5 sm:text-[22px] font-bold text-center text-color-text-green`}>
              {totalFriendsCnt}
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div className="bg-gradient-btn-play min-w-[170px] px-12 py-3 rounded-default cursor-pointer hover:opacity-80 hover:!text-white">
              {isCreating ? (
                <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-6 !h-6" />
              ) : (
                t('affiliate:createCode')
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex">
          <div
            onClick={() => setCodeTab('code')}
            className={cn(
              'flex items-center justify-center py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
              {
                'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                  codeTab === ('code' as ReferralType),
              },
            )}
            role="button"
          >
            <div className="sm:text-default text-m_default font-semibold">{t('affiliate:referralCode')}</div>
          </div>
          <div
            onClick={() => setCodeTab('friend')}
            className={cn(
              'flex items-center justify-center py-[10px] px-[20px] text-color-text-primary border-l border-r border-solid border-color-primary',
              {
                'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                  codeTab === ('friend' as ReferralType),
              },
            )}
            role="button"
          >
            <div className="sm:text-default text-m_default font-semibold">{t('affiliate:friends')}</div>
          </div>
        </div>
      </div>
      {codeTab === 'code' && (
        <div className="w-full rounded-default bg-[#1D2738] mt-5 text-center py-20">
          {t('affiliate:noReferralCode')}
        </div>
      )}
      {codeTab === 'friend' && (
        <div className="mt-5">
          <div className="bg-[#1D2738] rounded p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-[120px] flex flex-wrap items-center gap-[20px]">
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="username">
                  {t('mycasino:Username')}
                </label>
                <AdminInputText
                  control={control}
                  name="username"
                  placeholder="Please input"
                  customClass="min-w-[200px] !bg-[#181818] !border-none !text-white py-2"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="userId">
                  {t('mycasino:UserId')}
                </label>
                <AdminInputText
                  control={control}
                  name="userId"
                  placeholder="Please input"
                  customClass="min-w-[200px] !bg-[#181818] !border-none !text-white py-2"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="registrationDate">
                  {t('mycasino:registrationDate')}
                </label>
                <AdminInputDateRange
                  control={control}
                  name="registrationDate"
                  customClass="min-w-[350px] !bg-[#181818] !border-none !text-white py-2"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="wagerDateRange">
                  {t('mycasino:wagerDateRange')}
                </label>
                <AdminInputDateRange
                  control={control}
                  name="wagerDateRange"
                  customClass="min-w-[350px] !bg-[#181818] !border-none !text-white py-2"
                />
              </div>
              <div className="flex flex-col items-start gap-1 w-full sm:w-auto">
                <label className="!text-default !font-normal" htmlFor="code">
                  {t('mycasino:code')}
                </label>
                <AdminSelectBox
                  control={control}
                  name="code"
                  customClass="sm:min-w-[350px] w-full !bg-color-input-primary !border-none"
                  options={[
                    {
                      value: 'all',
                      label: 'All',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'tom',
                      label: 'Tom',
                    },
                  ]}
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <label className="opacity-0">1</label>
                <button className="bg-gradient-btn-play px-6 py-1 rounded-default text-white" type="submit">
                  {t('mycasino:search')}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-[#1D2738] rounded p-4 mt-4">
            <AdminTableComponent
              containerClassName="w-full"
              isLoading={isLoadingTable}
              data={friendsTableData}
              columns={friendColumns}
            />
            <Paging
              onPageChange={handleChangePage}
              itemPerPage={friendsLimit}
              totalItem={friendsTotalRow}
              currentPage={friendsPage}
              setItemPerPage={handleChangeItemPerPage}
              hiddenPerPage={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralCodeFriendComponent;
