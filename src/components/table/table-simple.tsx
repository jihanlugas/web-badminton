import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';
import { CgPushChevronRight, CgPushChevronLeft, CgChevronRight, CgChevronLeft } from 'react-icons/cg';
import { PageInfo, PageRequest } from '@/types/pagination';

type Props = {
  columns: any[],
  data: any[],
  isLoading: boolean,
}




const TableSimple: React.FC<Props> = ({ columns, data, isLoading }) => {

  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, []);

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

  // const instance = useReactTable(
  //   {
  //     columns: columnsMemo,
  //     data: dataMemo,
  //     // manualPagination: true,
  //   },
  //   getCoreRowModel: getCoreRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  //   getSortedRowModel: getSortedRowModel(),
  // );

  const instance = useReactTable({
    columns: columnsMemo,
    data: dataMemo,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(), //order doesn't matter anymore!
  });

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    state,
  } = instance;

  return (
    <>
      <table className='w-full table-auto text-sm' {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, key) => (
            <tr key={key} className='border-b border-t text-left' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, key) => {
                return (
                  <th key={key} className='py-4 px-2 font-normal text-gray-800 whitespace-nowrap' {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {isLoading ? (
            <>
              {Array.apply(null, Array(10)).map((data, key) => (
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
      </table>
    </>
  );
};

export default TableSimple;