import { ColumnDef } from '@tanstack/react-table';
import cn from 'classnames';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';

import { api_deleteSession, api_getSessions } from '@/api/user';
import { useTranslation } from '@/base/config/i18next';
import { differenceDateInSeconds } from '@/base/libs/utils';
import { SessionType } from '@/base/types/common';
import Loader from '@/components/common/preloader/loader';
import withAuth from '@/components/hoc/withAuth';
import SettingLayout from '@/components/layouts/setting.layout';
import Paging from '@/components/paging/paging';
import TableComponent from '@/components/table';

const SettingSession = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation('');
  const [dataTable, setDataTable] = useState<SessionType[]>([]);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [totalRows, setTotalRows] = useState<number>(0);

  const sessionColumns: ColumnDef<SessionType>[] = useMemo(() => {
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
          <div
            className={cn('flex-1 flex items-center justify-between gap-[10px]', {
              'text-color-primary': row.original.active,
              'dark:text-color-text-primary text-black': !row.original.active,
            })}
          >
            {row.original.active && (
              <div className={cn('w-[8px] h-[8px] rounded-full bg-color-primary blur-[1px]')}></div>
            )}
            <div className="flex-1 text-start">{row.original.active ? 'Online' : 'Offline'}</div>
          </div>
        ),
      },
      {
        accessorKey: 'action',
        header: 'Action',
        maxSize: 80,
        cell: ({ row }) => (
          <div className="text-color-primary" role="button" onClick={() => handleRemoveUserSession(row.original.id)}>
            Remove Device
          </div>
        ),
      },
    ];
  }, []);

  const handleRemoveUserSession = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const res = await api_deleteSession(sessionId);
      getListUserSessions();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePage = (action: string) => {
    let newPage: number;
    newPage = action === 'Next' ? page + 1 : page - 1;
    setPage(newPage);
    getListUserSessions(newPage);
  };

  const handleChangeItemPerPage = (itemPerPage: number) => {
    setLimit(itemPerPage);
    setPage(1);
    getListUserSessions();
  };

  const getListUserSessions = useCallback(
    async (sessionPage: number = page) => {
      try {
        setIsLoading(true);
        setDataTable([]);
        setTotalRows(0);
        const _res = await api_getSessions(sessionPage, limit);
        const tempSessions: SessionType[] = _res.data?.sessions?.map((item: any) => ({
          lastUsedAt: new Date(item.lastUsedAt),
          ipAddress: item.ipAddress ?? '',
          location: item.location ?? '',
          id: item.id ?? '',
          browser: item.browser ?? '',
          active: !!item.active,
        }));
        setPage(Number(_res.data?.page || 0));
        setTotalRows(Number(_res.data?.totalCount || 0));
        setDataTable(tempSessions);
      } catch (error) {
        console.log(error, '---117');
        setDataTable([]);
      } finally {
        setIsLoading(false);
      }
    },
    [page, limit],
  );

  useEffect(() => {
    getListUserSessions();
  }, []);

  return (
    <>
      {isLoading && <Loader />}
      <div className="px-[12px] py-[12px] md:mt-0 sm:mt-[30px] mt-0 flex flex-col items-start relative w-full">
        <div className="font-semibold text-default">{t('setting:sessionsUsedInPast')}</div>
        <TableComponent
          containerClassName="w-full mt-[30px]"
          isLoading={isLoading}
          data={dataTable}
          columns={sessionColumns}
        />
        <Paging
          onPageChange={handleChangePage}
          itemPerPage={limit}
          totalItem={totalRows}
          currentPage={page}
          setItemPerPage={handleChangeItemPerPage}
          hiddenPerPage={true}
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
