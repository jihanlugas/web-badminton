import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  SortingState,
} from '@tanstack/react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CgPushChevronRight, CgPushChevronLeft, CgChevronRight, CgChevronLeft } from 'react-icons/cg';
import { FaSortAmountDownAlt, FaSortAmountDown } from 'react-icons/fa';
import { PageInfo, PageRequest } from '@/types/pagination';

type Props = {
  columns: any[],
  data: any[],
  pageRequest: PageRequest & any,
  setPageRequest: Dispatch<SetStateAction<PageRequest & any>>,
  pageInfo: PageInfo,
  isLoading: boolean,
}

const Table: React.FC<Props> = ({ columns, data, setPageRequest, pageRequest, pageInfo, isLoading }) => {

  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, []);

  // const [sorting, setSorting] = React.useState<SortingState>([])

  const refRows = useRef<HTMLDivElement>();
  const [rowsBar, setRowsBar] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (rowsBar && refRows.current && !refRows.current.contains(e.target)) {
        setRowsBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [rowsBar]);

  const table = useReactTable({
    columns: columnsMemo,
    data: dataMemo,
    // state: {
    //   sorting,
    // },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    // getSortedRowModel: getSortedRowModel(),
  });

  const handleChangeLimit = (limit: number) => {
    setPageRequest({ ...pageRequest, limit, page: 1 });
    setRowsBar(!rowsBar);
  };

  const handleSort = (sortField) => {

    if (pageRequest.sortField !== sortField) {
      setPageRequest({
        ...pageRequest,
        sortField,
        sortOrder: "asc",
        page: 1,
      });
    } else {
      if ((pageRequest.sortOrder === 'asc')) {
        setPageRequest({
          ...pageRequest,
          sortField,
          sortOrder: "desc",
          page: 1,
        });
      } else if ((pageRequest.sortOrder === 'desc')) {
        setPageRequest({
          ...pageRequest,
          sortField: null,
          sortOrder: null,
          page: 1,
        });
      }
    }
  }

  console.log('table ', table)

  return (
    <>
      <table className='w-full table-auto text-sm'>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className='border-b border-t text-left'>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} className='py-2 px-2 font-normal text-gray-800 whitespace-nowrap' colSpan={header.colSpan}>
                    {!header.isPlaceholder && (
                      <>{header.column.getCanSort() ? (

                        <div
                          className='cursor-pointer select-none flex justify-between py-2'
                          onClick={() => handleSort(header.id)}
                        >
                          <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                          {header.id === pageRequest.sortField ? (
                            <>
                              {pageRequest.sortOrder === 'asc' ? (
                                <div><FaSortAmountDownAlt size={'1.0rem'} className={'text-primary-600'} /></div>
                              ) : (
                                <div><FaSortAmountDown size={'1.0rem'} className={'text-primary-600'} /></div>
                              )}
                            </>
                          ) : (
                            <div><FaSortAmountDownAlt size={'1.0rem'} className={'text-gray-400'} /></div>
                          )}
                        </div>
                      ) : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
                      )}
                      </>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {isLoading ? (
            <>
              {Array.apply(null, Array(pageRequest.limit)).map((data, key) => (
                <React.Fragment key={key}>
                  {table.getHeaderGroups().map((headerGroup, key) => (
                    <tr key={key} className='border-b text-left'>
                      {headerGroup.headers.map((column, key) => (
                        <td key={key} className='py-4 px-2 font-normal whitespace-nowrap animate-pulse'>
                          <div className='h-3 w-full bg-slate-200 rounded-full'></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className='border-b text-left'>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className='py-2 px-2 font-normal whitespace-nowrap'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </>
          )}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
      {/* <table className='w-full table-auto text-sm' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr key={key} className='border-b border-t text-left' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, key) => (
                <th key={key} className='py-4 px-2 font-normal text-gray-800 whitespace-nowrap' {...column.getHeaderProps()}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {isLoading ? (
            <>
              {Array.apply(null, Array(pageRequest.limit)).map((data, key) => (
                <React.Fragment key={key}>
                  {headerGroups.map((headerGroup, key) => (
                    <tr key={key} className='border-b text-left' {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, key) => (
                        <td key={key} className='py-4 px-2 font-normal whitespace-nowrap animate-pulse' {...column.getHeaderProps()}>
                          <div className='h-3 w-full bg-slate-200 rounded-full'></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </>
          ) : (
            <>
              {rows.map((row, key) => {
                prepareRow(row);
                return (
                  <tr key={key} className='border-b duration-300 align-top hover:bg-gray-100' {...row.getRowProps()}>
                    {row.cells.map((cell, key) => {
                      return (
                        <td className='p-2' key={key} {...cell.getCellProps()} >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </>
          )}
        </tbody>
      </table> */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center p-2'>
          <div className='mr-2'>{'Page ' + pageInfo.page}</div>
        </div>
        <div className='flex items-center justify-end p-2'>
          <div className='relative mx-4' ref={refRows}>
            <div className='flex items-center'>
              <div className='mr-2'>{'Rows per page: '}</div>
              <button className='w-10 flex justify-center hover:bg-gray-100' onClick={() => setRowsBar(!rowsBar)}>
                {pageRequest.limit}
              </button>
            </div>
            <div className={`absolute -top-8 right-0 mt-2 w-12 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none py-2 duration-300 ease-in-out ${!rowsBar && 'scale-0 shadow-none ring-0'}`}>
              <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(10)}>{'10'}</button>
              <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(25)}>{'25'}</button>
              <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(50)}>{'50'}</button>
              <button className='w-full flex justify-center items-center h-8 hover:bg-gray-100' onClick={() => handleChangeLimit(100)}>{'100'}</button>
            </div>
          </div>
          <div className='w-32 flex justify-center mx-4'>
            <span className='mx-1'>{'Data'}</span>
            <span>{pageInfo.totalData > 0 ? ((pageInfo.page - 1) * pageInfo.pageSize) + 1 : 0}</span>
            <span className='mx-1'>{'-'}</span>
            <span>{pageInfo.page * pageInfo.pageSize < pageInfo.totalData ? pageInfo.page * pageInfo.pageSize : pageInfo.totalData}</span>
            <span className='mx-1'>{'of'}</span>
            <span>{pageInfo.totalData}</span>
          </div>
          <div className='flex items-center ml-4'>
            <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: 1 })}>
              <CgPushChevronLeft size={'1.5rem'} className={''} />
            </button>
            <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page <= 1} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page - 1 })}>
              <CgChevronLeft size={'1.5rem'} className={''} />
            </button>
            <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageRequest.page + 1 })}>
              <CgChevronRight size={'1.5rem'} className={''} />
            </button>
            <button className='h-10 w-10 flex justify-center items-center rounded-full mx-1 duration-300 hover:bg-gray-100 disabled:text-gray-400' disabled={pageRequest.page >= pageInfo.pageCount} onClick={() => setPageRequest({ ...pageRequest, page: pageInfo.pageCount })}>
              <CgPushChevronRight size={'1.5rem'} className={''} />
            </button>
          </div>
        </div>
      </div>

    </>
  );
};

export default Table;