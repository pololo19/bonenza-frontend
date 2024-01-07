import AdminLayout from '@/components/layouts/admin.layout';
import AdminTableComponent from '@/components/table/adminTable';
import { Switch } from '@headlessui/react';
import { ColumnDef } from '@tanstack/react-table';
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import cn from 'classnames';
import { BasicFormRef, ReferralCodeDetail } from '@/base/types/common';
import api from '@/api/api';
import { DATE_TIME_SUBMIT_FORMAT_WITH_SECOND, ROUTER, TOAST_ENUM } from '@/base/constants/common';
import { formatDate } from '@/base/libs/utils';
import { toast } from 'react-toastify';
import { Copy, Profile2User, Trash, User } from 'iconsax-react';
import CommonModal from '@/components/modal/commonModal/commonModal';
import ReferralCodeDetailForm from '@/components/form/referralCodeDetailForm';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

function AdminRewardsPage() {
  const [isSendMessage, setIsSendMessage] = useState<boolean>(false);
  const [isLoadingTable, setIsLoadingTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<ReferralCodeDetail[]>([]);
  const [isShowCreateCode, setIsShowCreateCode] = useState<boolean>(false);
  const formDataRef = useRef<BasicFormRef>(null);
  const { t } = useTranslation('');

  const handleListReferralCode = async () => {
    try {
      setIsLoadingTable(true);
      const res = await api.get('affiliate/get-list-referral-code');
      setTableData(res.data.data);
    } catch (error) {
      setTableData([]);
    } finally {
      setIsLoadingTable(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    try {
      setIsLoadingTable(true);
      const res = await api.delete(`affiliate/delete-referral-code/${id}`);
      await handleListReferralCode();
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  };

  const copy = (text: string) => {
    toast.success('Copied', { containerId: TOAST_ENUM.COMMON });
    navigator.clipboard.writeText(text);
  };

  const columns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'referralCode',
        header: () => <div className="text-left">Code</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.referralCode}</div>
            <Copy
              variant="Bold"
              className="hover:text-amber-500"
              size={20}
              onClick={() => copy(row.original.referralCode)}
            />
          </div>
        ),
      },
      {
        accessorKey: 'referralCode',
        header: () => <div className="text-left">Link</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{ROUTER.REFERRAL_CODE(row.original.referralCode)}</div>
            <Copy
              variant="Bold"
              className="hover:text-amber-500"
              size={20}
              onClick={() => copy(ROUTER.REFERRAL_CODE(row.original.referralCode))}
            />
          </div>
        ),
      },
      {
        accessorKey: 'commissionRate',
        header: () => <div className="text-left">{t('mycasino:commissionRate')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{Number(row.original.commissionRate).toFixed(2)}%</div>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: () => <div className="text-left">{t('mycasino:dateCreated')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">
              {formatDate(new Date(row.original.createdAt), DATE_TIME_SUBMIT_FORMAT_WITH_SECOND)}
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'totalMemberRegister',
        header: () => <div className="text-left">{t('mycasino:registeredFriendsNumber')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalMemberRegister}</div>
          </div>
        ),
      },
      {
        accessorKey: 'totalCommissionRewards',
        header: () => <div className="text-left">{t('mycasino:totalCommission')}</div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-start text-[#6f6f6f] gap-[5px] truncate')}>
            <div className="font-bold truncate">{row.original.totalCommissionRewards}</div>
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: () => <div className="text-left"></div>,
        cell: ({ row }) => (
          <div className={cn('flex items-center justify-end text-[#6f6f6f] gap-[10px] truncate')}>
            <Link href={ROUTER.AdminFriends}>
              <Profile2User variant="Bold" size={20} />
            </Link>
            <Trash
              variant="Bold"
              size={20}
              onClick={() => handleDeleteCode(row.original.id)}
              className="hover:text-amber-500"
            />
          </div>
        ),
      },
    ];
  }, []);

  const onSubmit = async (data: ReferralCodeDetail) => {
    try {
      setIsLoadingTable(true);
      setIsShowCreateCode(false);
      const res = await api.post('affiliate/create-referral-code', {
        referralCode: data.referralCode,
      });
      await handleListReferralCode();
    } catch (error) {
    } finally {
      setIsLoadingTable(false);
    }
  };

  const emitData = () => {
    formDataRef.current?.emitData?.();
  };

  useEffect(() => {
    handleListReferralCode();
  }, []);

  return (
    <div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4">
        <div className="min-h-[120px] flex items-center gap-[20px]">
          {tableData.length <= 20 && (
            <button className="bg-color-primary px-6 py-2 rounded-md" onClick={() => setIsShowCreateCode(true)}>
              {t('mycasino:createNewCode')}
            </button>
          )}
          <span className="text-[18px] font-[500]">
            {tableData.length}/20 {t('mycasino:Create')}
          </span>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <div className="min-h-[120px] flex items-center gap-[20px]">
          <div className="flex flex-col items-center gap-1">
            <Switch
              checked={isSendMessage}
              onChange={setIsSendMessage}
              className={`${
                isSendMessage ? 'bg-amber-400' : 'dark:bg-gray-400 bg-gray-200'
              } relative inline-flex h-8 w-14 items-center rounded-full`}
            >
              <span
                className={`${
                  isSendMessage ? 'translate-x-7' : 'translate-x-1'
                } inline-block h-6 w-6 transform rounded-full transition bg-white`}
              />
            </Switch>
            <div>{isSendMessage ? 'ON' : 'OFF'}</div>
          </div>
          <div className="text-center max-w-[200px] text-[12px]">{t('mycasino:sendWelcome')}</div>
          <textarea
            rows={3}
            className="flex-1 bg-white border border-solid border-gray-200 rounded p-2"
            defaultValue={
              'Welcome on board! BONENZA.COM is a world-leading online crypto casino. I’m sure you will have great fun here. Feel free to contact me anytime if you need help. 😃'
            }
          />
          <button className="bg-color-primary px-6 py-2 rounded-md">{t('mycasino:save')}</button>
        </div>
      </div>
      <div className="bg-white rounded border border-solid border-gray-200 p-4 mt-4">
        <AdminTableComponent
          containerClassName="w-full"
          isLoading={isLoadingTable}
          data={tableData}
          columns={columns}
        />
      </div>
      {isShowCreateCode && (
        <CommonModal
          panelClass="dark:!bg-white !bg-white p-4"
          isShowCloseButton={false}
          show={isShowCreateCode}
          onClose={() => setIsShowCreateCode(false)}
          header={<div className="text-black">{t('mycasino:createNewCode')}</div>}
        >
          <div>
            <ReferralCodeDetailForm ref={formDataRef} onSubmit={onSubmit} />
            <div className="flex items-center justify-center gap-5 mt-4">
              <div
                className="bg-color-primary text-white px-4 py-2 rounded-[4px] text-[20px]"
                role="button"
                onClick={emitData}
              >
                {t('mycasino:Created')}
              </div>
            </div>
          </div>
        </CommonModal>
      )}
    </div>
  );
}

AdminRewardsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminRewardsPage;
