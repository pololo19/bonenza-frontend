import { ColumnDef } from '@tanstack/react-table';
import { ReactElement, useEffect, useMemo, useState } from 'react';

import { api_deleteSession, api_getSessions } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { differenceDateInSeconds } from '@/base/libs/utils';
import { SessionType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';
import TableComponent from '@/components/table';

const SettingSession = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('');
  const [dataTable, setDataTable] = useState<SessionType[]>([]);

  const sessionColumns: ColumnDef<any>[] = useMemo(() => {
    return [
      {
        accessorKey: 'browser',
        header: 'Browser',
        cell: ({ row }) => <div className="dark:text-white text-black">{row.original.browser}</div>,
        minSize: 100,
      },
      {
        accessorKey: 'location',
        header: 'Location',
        minSize: 30,
        cell: ({ row }) => <div className="dark:text-color-text-primary text-black">{row.original.location}</div>,
      },
      {
        accessorKey: 'ip',
        header: 'IP Address',
        cell: ({ row }) => <div className="dark:text-white text-black">{row.original.ipAddress}</div>,
        maxSize: 80,
      },
      {
        accessorKey: 'lastUsed',
        header: 'Last Used',
        maxSize: 30,
        cell: ({ row }) => (
          <div className="dark:text-color-text-primary text-black">
            {Number(differenceDateInSeconds(new Date(), new Date(row.original.lastUsedAt))) > 60 ? 'Offline' : 'Online'}
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Action',
        maxSize: 80,
        cell: ({ row }) => (
          <div className="text-color-primary" role="button" onClick={() => removeUserSession(row.original.id)}>
            Remove Device
          </div>
        ),
      },
    ];
  }, []);

  const removeUserSession = async (sessionId: string) => {
    try {
      console.log(sessionId, '====63');
      setIsLoading(true);
      const res = await api_deleteSession(sessionId);
      handleGetListUserSession();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetListUserSession = async () => {
    try {
      setIsLoading(true);
      const res = await api_getSessions();
      setDataTable(res.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetListUserSession();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="px-[12px] py-[12px] md:mt-0 sm:mt-[30px] mt-0 flex flex-col items-start relative w-full">
        <div className="font-semibold text-[14px]">{t('setting:sessionsUsedInPast')}</div>
        <TableComponent
          containerClassName="w-full mt-[30px]"
          isLoading={isLoading}
          data={dataTable}
          columns={sessionColumns}
        />
      </div>
    </>
  );
};

const SettingSessionAuth = withAuth(SettingSession);

SettingSessionAuth.getLayout = function getLayout(page: ReactElement) {
  return <SettingLayout>{page}</SettingLayout>;
};

export default SettingSessionAuth;
