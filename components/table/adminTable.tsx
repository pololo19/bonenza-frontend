import {
  ColumnDef,
  OnChangeFn,
  Row,
  RowSelectionState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import cn from 'classnames';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useTranslation } from '@/base/config/i18next';
import { ObjectLiteral } from '@/base/types/common';

import styles from './adminTable.module.scss';
import { useTheme } from 'next-themes';

export type AdminTableComponentPropsType = {
  columns: ColumnDef<any>[];
  data: ObjectLiteral[];
  isLoading?: boolean;
  selectRows?: {
    rowSelectionIndex: RowSelectionState;
    setRowSelectionIndex: OnChangeFn<RowSelectionState>;
    setRowSelection: (arg: ObjectLiteral[]) => void;
  };
  containerClassName?: string;
  tableClassName?: string;
  noDataText?: string;
  headerVarian?: 'danger';
  renderRowClass?: (context: Row<ObjectLiteral>) => string;
  onRowClick?: (row: Row<any>) => void;
};

const AdminTableComponent: React.FC<AdminTableComponentPropsType> = ({
  columns,
  data,
  isLoading,
  selectRows,
  containerClassName,
  tableClassName,
  noDataText,
  headerVarian,
  renderRowClass,
  onRowClick,
}) => {
  const { t } = useTranslation(['errorCommon', 'notices']);
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const { getHeaderGroups, getRowModel, getSelectedRowModel } = useReactTable({
    defaultColumn: {
      minSize: 0,
      size: 0,
    },
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection: selectRows?.rowSelectionIndex || {},
    },
    onRowSelectionChange: selectRows?.setRowSelectionIndex,
  });

  useEffect(() => {
    if (selectRows?.rowSelectionIndex) {
      selectRows?.setRowSelection?.(getSelectedRowModel()?.rows?.map((ele) => ele.original));
    }
  }, [selectRows?.rowSelectionIndex]);

  return (
    <div className={cn('table-responsive relative', containerClassName, styles.tableWrapper)}>
      <table className={cn('table mb-0 min-h-[100px] w-full h-full', tableClassName, styles.table)}>
        <thead className={cn(styles.tableHeader, 'bg-black')}>
          {getHeaderGroups()?.map((headerGroup) => (
            <tr key={headerGroup.id} className="relative z-0">
              {headerGroup.headers.map((header, index) => {
                return (
                  <th
                    key={header.id}
                    className={cn(
                      headerVarian ? styles[headerVarian] : '',
                      { '!text-right': index === headerGroup.headers.length - 1 },
                      'whitespace-nowrap text-white font-semibold sm:!text-[14px] !text-[12px] !border-0 text-left',
                    )}
                    {...{
                      style: {
                        width: `${100 / headerGroup.headers.length}%`,
                      },
                    }}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className={cn(isLoading && styles.loader, 'sm:!text-[14px] !text-[12px] bg-[#f7f8fa]')}>
          {!!data.length &&
            getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(renderRowClass?.(row), 'h-0 cursor-pointer border-solid border-b border-b-gray-200')}
                onClick={() => onRowClick?.(row)}
              >
                {row.getVisibleCells?.().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}

          {!data.length && !isLoading && (
            <tr className="">
              <td colSpan={columns.length} className="text-center ">
                <div className="flex flex-col items-center gap-[15px] text-[#53575C]">
                  <Image
                    src={'/img/no-data-light-mode.png'}
                    alt="noData"
                    width={150}
                    height={150}
                  />
                  {noDataText || t('table:noData')}
                </div>
              </td>
            </tr>
          )}
          <tr className=""></tr>
        </tbody>
      </table>
    </div>
  );
};

export default AdminTableComponent;
