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
import InputText from '@/components/input/typing/InputText';
import InputDateRangePicker from '../input/datePicker/inputDateRangePicker';

const fiatDecimals = 8;
const decimals = 6;
type ReferralType = 'commission' | 'reward';

type CommissionRewardType = {
  totalCommissionRewards: number;
  commissionRewardsAvailable: number;
  currencyLogo: string;
  currencyName: string;
  time: string;
  status: boolean;
};

type ReferralRewardType = {
  level: number;
  referralCode: string;
  registrationTime: Date;
  totalEarnedMe: string;
  userName: string;
};

type FilterType = {
  username?: string;
  registrationStartDate?: any;
  registrationEndDate?: any;
};

function RewardsComponent() {
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

  const [rewardsTab, setRewardsTab] = useState<ReferralType>('commission');
  const [isLoading, setIsLoading] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showDetailCommissionsRewards, setShowDetailCommissionsRewards] = useState(false);
  const [showReferralRewardRules, setShowReferralRewardRules] = useState(false);

  const [commissionPage, setCommissionPage] = useState(1);
  const [commissionLimit, setCommissionLimit] = useState(10);
  const [commissionTotalRows, setCommissionTotalRows] = useState(0);

  const [commsionRewardsData, setCommissionRewardsData] = useState<CommissionRewardType[]>([]);
  const [commissionRewardsStatus, setCommissionRewardsStatus] = useState({
    totalAmountUsd: 0,
    receivedAmountUsd: 0,
    availableAmountUsd: 0,
  });

  const [referralPage, setReferralPage] = useState(1);
  const [referralLimit, setReferralLimit] = useState<number>(10);
  const [referralTotalRows, setReferralTotalRows] = useState<number>(0);
  const [referralRewardsData, setReferralRewardsData] = useState<ReferralRewardType[]>([]);

  const [referralRewardsStatus, setReferralRewardsStatus] = useState({
    receivedAmount: 0,
    availableAmount: 0,
  });

  const handleCommissionChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? commissionPage + 1 : action === 'Prev' ? commissionPage - 1 : +action;
    setCommissionPage(newPage);
  };

  const handleCommissionChangeItemPerPage = (itemPerPage: number) => {
    setCommissionLimit(itemPerPage);
    setCommissionPage(1);
  };

  const handleCommissionWithdraw = async () => {
    if (isClaiming) return;
    try {
      setIsClaiming(true);
      const _res = await api_affiliateCommissionRewardsWithdraw();

      const _resBonus = await api_getClaims();

      const tempLockedAmount = Number(_resBonus.data?.lockedAmount ?? 0);
      await getCommissionData();

      dispatch(setLockedAmount(tempLockedAmount));
      toast.success(t('withdraw:withdrawComplete'), {
        toastId: 'reward-commision-notify-success',
        containerId: TOAST_ENUM.COMMON,
      });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { toastId: 'reward-commision-notify-error', containerId: TOAST_ENUM.COMMON });
    } finally {
      setIsClaiming(false);
    }
  };
  const getCommissionData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [_resAffiliateTotal, _resAffiliateHistory] = await Promise.all([
        api_affiliateCommissionRewards(),
        api_affiliateCommissionRewardsHistory(commissionPage, commissionLimit),
      ]);
      const tempCommissionData = _resAffiliateHistory.data?.rewards?.map((reward: any) => ({
        totalCommissionRewards: Number(reward.totalCommissionRewards || 0),
        commissionRewardsAvailable: Number(reward.amount || 0),
        currencyLogo: reward.currencyLogo,
        currencyName: reward.currencyName,
        time: reward.time,
        status: reward.status,
      }));
      setCommissionRewardsStatus({
        totalAmountUsd: Number(_resAffiliateTotal.data?.totalCommissionRewardsAmountUsd || 0),
        receivedAmountUsd: Number(_resAffiliateTotal.data?.totalCommissionRewardsReceivedAmountUsd || 0),
        availableAmountUsd: Number(_resAffiliateTotal.data?.commissionRewardsAvailableAmountUsd || 0),
      });

      setCommissionTotalRows(Number(_resAffiliateHistory.data?.totalCount || 0));
      setCommissionRewardsData(tempCommissionData);
    } catch (error) {
      setCommissionRewardsData([]);
    } finally {
      setIsLoading(false);
    }
  }, [commissionPage, commissionLimit]);

  const schema = yup.object().shape({});

  const { handleSubmit, control } = useForm<FilterType>({
    resolver: yupResolver(schema),
  });

  const handleReferralChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? referralPage + 1 : action === 'Prev' ? referralPage - 1 : +action;
    setReferralPage(newPage);
    getReferralData();
  };

  const handleReferralChangeItemPerPage = (itemPerPage: number) => {
    setReferralLimit(itemPerPage);
    setReferralPage(1);
  };

  const onSubmit = async (data: FilterType) => {
    await getReferralData(data);
  };

  const getReferralData = useCallback(
    async (filter?: FilterType) => {
      try {
        console.log(filter);
        setIsLoading(true);
        const registrationStartDate =
          filter?.registrationStartDate?.length > 0 ? new Date(filter?.registrationStartDate).getTime() : undefined;
        const registrationEndDate =
          filter?.registrationEndDate?.length > 0 ? new Date(filter?.registrationEndDate).getTime() : undefined;
        const _res = await api_affiliateReferralRewards(
          referralPage,
          referralLimit,
          filter?.username,
          registrationStartDate,
          registrationEndDate,
        );
        const tempTableData: ReferralRewardType[] =
          _res.data?.rewards?.map((item: any) => ({
            level: item.vipLevel,
            referralCode: referralCode,
            registrationTime: new Date(item.registeredAt),
            totalEarnedMe: item.earnedMe,
            userName: item.userName,
          })) || [];
        setReferralTotalRows(Number(_res.data?.totalCount || 0));
        setReferralRewardsStatus({
          receivedAmount: Number(_res.data?.totalReferralRewardsReceivedAmountUsd || 0),
          availableAmount: Number(_res.data?.referralRewardsAvailableAmountUsd || 0),
        });
        setReferralRewardsData(tempTableData);
      } catch (error) {
        setReferralRewardsData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [referralPage, referralLimit],
  );

  const handleReferralWithdraw = async () => {
    try {
      const _res = await api_affiliateReferralRewardsWithdrw();
      toast.success(t('withdraw:withdrawComplete'), {
        toastId: 'reward-referral-notify-error',
        containerId: TOAST_ENUM.COMMON,
      });
    } catch (error: any) {
      const errType = error.response?.data?.message ?? '';
      const errMessage = getErrorMesssage1(errType);
      toast.error(t(errMessage), { toastId: 'reward-referral-notify-error', containerId: TOAST_ENUM.COMMON });
    }
  };

  const handleWithdraw = () => {
    if (rewardsTab === 'commission') handleCommissionWithdraw();
    if (rewardsTab === 'reward') handleReferralWithdraw();
  };
  useEffect(() => {
    if (rewardsTab === 'commission') getCommissionData();
    if (rewardsTab === 'reward') getReferralData();
  }, [rewardsTab, commissionPage, commissionLimit, referralPage, referralLimit]);

  const commissionColumns: ColumnDef<CommissionRewardType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'commissionRewardsAvailable',
        header: () => (
          <div className="text-left text-default pl-2 lg:pl-[100px] truncate max-w-[100px] lg:max-w-max">
            {t('mycasino:commissionRewards')}
          </div>
        ),
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate pl-2 lg:pl-[100px]')}>
            <div className="flex gap-1 font-normal truncate">
              {`${
                viewInFiat
                  ? currencyFormat1(
                      row.original.commissionRewardsAvailable * usdtPrice * exchangeRate,
                      decimals,
                      localFiat?.name,
                    )
                  : currencyFormat1(row.original.commissionRewardsAvailable, decimals)
              }`}
              <Image
                height={20}
                width={20}
                src={`/img/fiats/USDT.png`}
                alt=""
                onError={(e) => {
                  e.currentTarget.src = '/img/fiats/USDT.png';
                }}
              />
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommissionRewards',
        header: () => <div className="text-center text-default">{t('historyBonus:time')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-center text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {formatDate(new Date(row.original.time), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-right text-default pr-2 lg:pr-[100px]">{t('mycasino:status')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end text-white gap-[5px] truncate pr-2 lg:pr-[100px]')}>
            <div
              className={cn('font-normal truncate', {
                'text-color-text-green': row.original.status,
                'text-color-secondary': !row.original.status,
              })}
            >
              {row.original.status ? 'Successed' : 'Available'}
            </div>
          </div>
        ),
      },
    ];
  }, [exchangeRate, viewInFiat, localFiat]);

  const referralColumns: ColumnDef<ReferralRewardType>[] = useMemo(() => {
    return [
      {
        accessorKey: 'username',
        header: () => <div className="text-left">{t('mycasino:Username')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.userName}</div>
          </div>
        ),
      },
      {
        accessorKey: 'level',
        header: () => <div className="text-left">{t('mycasino:vipLevel')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">{row.original.level}</div>
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
      {
        accessorKey: 'registrationTime',
        header: () => <div className="text-left">{t('mycasino:registrationTime')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-white gap-[5px] truncate')}>
            <div className="font-normal truncate">
              {formatDate(new Date(row.original.registrationTime), TIME_SUBMIT_FORMAT_WITH_SLASH_MARKER)}
            </div>
          </div>
        ),
      },
    ];
  }, []);
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
              {t('affiliate:availableCommission')}
            </div>
            <div className={`text-title sm:text-[22px] font-bold text-center text-color-text-green`}>
              {viewInFiat ? (
                <>
                  {currencyFormat1(
                    commissionRewardsStatus.availableAmountUsd * exchangeRate,
                    fiatDecimals,
                    localFiat?.name || 'USD',
                  )}
                </>
              ) : (
                <>{currencyFormat1(commissionRewardsStatus.availableAmountUsd, fiatDecimals)}</>
              )}
            </div>
            <div className="flex justify-center text-m_default">
              <span>{t('affiliate:totalReceived')}: </span>
              <span className="ml-1 text-[#FFC700]">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      commissionRewardsStatus.receivedAmountUsd * exchangeRate,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                  </>
                ) : (
                  <>{currencyFormat1(commissionRewardsStatus.receivedAmountUsd, fiatDecimals)}</>
                )}
              </span>
            </div>
          </div>
          <div className="md:py-10">
            <div className="min-w-[150px] text-center text-default sm:text-[16px] font-normal dark:text-[#FFFFFF] text-[#141414]">
              {t('affiliate:availableReferral')}
            </div>
            <div className={`text-title sm:text-[22px] font-bold text-center text-color-text-green`}>
              {viewInFiat ? (
                <>
                  {currencyFormat1(
                    referralRewardsStatus.availableAmount * exchangeRate,
                    fiatDecimals,
                    localFiat?.name || 'USD',
                  )}
                </>
              ) : (
                <>{currencyFormat1(referralRewardsStatus.availableAmount, fiatDecimals)}</>
              )}
            </div>
            <div className="flex justify-center text-m_default">
              <span>{t('affiliate:totalReceived')}: </span>
              <span className="ml-1 text-[#FFC700]">
                {viewInFiat ? (
                  <>
                    {currencyFormat1(
                      referralRewardsStatus.receivedAmount * exchangeRate,
                      fiatDecimals,
                      localFiat?.name || 'USD',
                    )}
                  </>
                ) : (
                  <>{currencyFormat1(referralRewardsStatus.receivedAmount, fiatDecimals)}</>
                )}
              </span>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <div
              className="bg-gradient-btn-play min-w-[170px] px-12 py-3 rounded-default cursor-pointer hover:opacity-80 hover:!text-white"
              onClick={handleWithdraw}
            >
              {isClaiming ? (
                <ReactLoading type="bubbles" color="#FFF" delay={50} className="!w-6 !h-6" />
              ) : (
                t('affiliate:withdraw')
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex">
          <div
            onClick={() => setRewardsTab('commission')}
            className={cn(
              'flex items-center justify-center py-[10px] px-[20px] text-color-text-primary border-l border-solid border-color-primary',
              {
                'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                  rewardsTab === ('commission' as ReferralType),
              },
            )}
            role="button"
          >
            <div className="sm:text-default text-m_default font-semibold">{t('affiliate:commissionReward')}</div>
          </div>
          <div
            onClick={() => setRewardsTab('reward')}
            className={cn(
              'flex items-center justify-center py-[10px] px-[20px] text-color-text-primary border-l border-r border-solid border-color-primary',
              {
                'bg-gradient-to-b from-[#00BAE600] to-[#006880] dark:!text-white !text-black':
                  rewardsTab === ('reward' as ReferralType),
              },
            )}
            role="button"
          >
            <div className="sm:text-default text-m_default font-semibold">{t('affiliate:referralReward')}</div>
          </div>
        </div>
        <div
          className="flex justify-start items-center gap-2 text-color-primary underline cursor-pointer text-m_default"
          onClick={() => {
            if (rewardsTab === 'reward') setShowReferralRewardRules(true);
            else setShowDetailCommissionsRewards(true);
          }}
        >
          <BookSquare variant="Bulk" className="w-6 h-6" />
          {t('mycasino:rule')}
        </div>
      </div>
      {rewardsTab === 'commission' && (
        <div className="w-full rounded-default bg-[#1D2738] mt-5">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 px-8 py-4 text-color-primary">
              <Activity variant="Bulk" className="w-6 h-6" />
              {t('mycasino:history')}
            </div>
            <div className="w-full">
              <AdminTableComponent
                containerClassName="w-full"
                isLoading={isLoading}
                data={commsionRewardsData}
                columns={commissionColumns}
              />
              <Paging
                onPageChange={handleCommissionChangePage}
                itemPerPage={commissionLimit}
                totalItem={commissionTotalRows}
                currentPage={commissionPage}
                setItemPerPage={handleCommissionChangeItemPerPage}
                hiddenPerPage={true}
              />
            </div>
          </div>
        </div>
      )}
      {rewardsTab === 'reward' && (
        <div>
          <div className="p-4 mt-4 bg-[#1D2738] rounded">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-center gap-[20px]">
              <div className="flex flex-col items-start gap-1">
                <label className="text-default font-normal" htmlFor="username">
                  {t('mycasino:Username')}
                </label>
                <InputText
                  control={control}
                  name="username"
                  placeholder="Please input"
                  customClass="min-w-[200px] !bg-color-input-primary !border-none !text-white py-2 px-3"
                />
              </div>

              <div className="flex flex-col items-start gap-1">
                <label className="text-default font-normal" htmlFor="registrationDate">
                  {t('mycasino:registrationDate')}
                </label>
                {/* <AdminInputDateRange
                  control={control}
                  name="registrationDate"
                  customClass="min-w-[350px] !bg-[#181818] !border-none !text-white py-2"
                /> */}
                <InputDateRangePicker
                  control={control}
                  startName="registrationStartDate"
                  endName="registrationEndDate"
                  customClass="flex flex-row !bg-color-input-primary !border-none rounded-default !text-white py-2 px-3"
                  pickerClass="!w-[120px] !bg-transparent"
                />
              </div>
              <div className="flex flex-col items-start gap-1">
                <label className="opacity-0">1</label>
                <button className="px-6 py-2 text-white bg-gradient-btn-play rounded-default" type="submit">
                  {t('mycasino:search')}
                </button>
              </div>
            </form>
          </div>
          <div className="p-4 mt-4 bg-[#1D2738] rounded">
            <AdminTableComponent
              containerClassName="w-full"
              isLoading={isLoading}
              data={referralRewardsData}
              columns={referralColumns}
            />
            <Paging
              onPageChange={handleReferralChangePage}
              itemPerPage={referralLimit}
              totalItem={referralTotalRows}
              currentPage={referralPage}
              setItemPerPage={handleReferralChangeItemPerPage}
              hiddenPerPage={true}
            />
          </div>
        </div>
      )}
      <CommissionReward show={showDetailCommissionsRewards} onClose={() => setShowDetailCommissionsRewards(false)} />
      <ReferralRewardRules show={showReferralRewardRules} onClose={() => setShowReferralRewardRules(false)} />
    </div>
  );
}

export default RewardsComponent;
