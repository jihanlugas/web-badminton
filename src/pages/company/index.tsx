import moment from 'moment';
import { PropsWithChildren, useContext, useEffect, useState } from 'react';
import DateField from '@/components/formik/date-field';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import Main from '@/components/layout/main';
import Head from 'next/head';
import { NextPage } from 'next/types';
import { PageInfo, PageRequest } from '@/types/pagination';
import Link from 'next/link';
import { MdOutlineFilterList } from 'react-icons/md';
import { VscTrash } from 'react-icons/vsc';
import { Cell, ColumnDef } from '@tanstack/react-table';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BiFilterAlt, BiLayerPlus } from 'react-icons/bi';
import { RiPencilLine } from 'react-icons/ri';
import { IoAddOutline } from 'react-icons/io5';
import Table from '@/components/table/table';
import { Company } from '@/types/company';
import ModalFilterCompany from '@/components/modal/modal-filter-company';
import { useRouter } from 'next/router';
import { displayMoney, displayNumber } from '@/utils/formater';
import ModalDelete from '@/components/modal/modal-delete';
import notif from '@/utils/notif';

type Props = {

}

type FilterProps = {
  name: string
  description: string
  createName: string
}

const Index: NextPage<Props> = () => {

  const router = useRouter();

  const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
  const [showModalFilter, setShowModalFilter] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>('');
  const [company, setCompany] = useState<Company[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequest, setPageRequest] = useState<PageRequest & FilterProps>({
    limit: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    name: '',
    description: '',
    createName: '',
  });

  const column: ColumnDef<Company>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Name"}
            </div>
          </>
        );
      },
      cell: (props) => {
        return (
          <Link href={{ pathname: '/company/[companyId]', query: { companyId: props.row.original.id } }} >
            <div className='w-full duration-300 hover:text-primary-500'>
              {props.getValue() as string}
            </div>
          </Link>
        )
      },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Description "}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'balance',
      accessorKey: 'balance',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Balance"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{displayMoney(Number(props.getValue()))}</div>,
    },
    {
      id: 'total_gor',
      accessorKey: 'totalGor',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Total Gor"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{displayNumber(Number(props.getValue()))}</div>,
    },
    {
      id: 'total_player',
      accessorKey: 'totalPlayer',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Total Player"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{displayNumber(Number(props.getValue()))}</div>,
    },
    {
      id: 'create_name',
      accessorKey: 'createName',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Created By"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
      // enableSorting: false,
    },
    {
      id: 'id',
      header: 'Action',
      cell: (props) => {
        return (
          <>
            <div className='flex justify-end items-center'>
              <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit' onClick={() => { router.push({ pathname: '/company/[companyId]/edit', query: { companyId: props.row.original.id } }) }}>
                <RiPencilLine className='' size={'1.2rem'} />
              </button>
              <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toogleDelete(props.row.original.id)}>
                <VscTrash className='' size={'1.2rem'} />
              </button>
            </div>
          </>
        );
      },

    }
  ];

  const { isLoading, data, refetch } = useQuery(['company', pageRequest], ({ queryKey }) => Api.get('/company/page', queryKey[1]), {});

  const { mutate: mutateDelete, isLoading: isLoadingDelete } = useMutation((id: string) => Api.delete('/company/' + id));

  useEffect(() => {
    if (data && data.status) {
      setCompany(data.payload.list);
      setPageInfo({
        pageCount: data.payload.totalPage,
        pageSize: data.payload.dataPerPage,
        totalData: data.payload.totalData,
        page: data.payload.page,
      });
    }
  }, [data]);

  const toogleFilter = () => {
    setShowModalFilter(!showModalFilter)
  };

  const toogleDelete = (id = '') => {
    setDeleteId(id);
    setShowModalDelete(!showModalDelete);
  };

  const handleDelete = () => {
    mutateDelete(deleteId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeleteId('');
            toogleDelete('');
            refetch();
          } else if (!res.status) {
            notif.error(res.message);
          }
        }

      },
      onError: (res) => {
        notif.error('Please cek you connection');
      },
    });
  };

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Company'}</title>
      </Head>
      <ModalFilterCompany
        onClickOverlay={toogleFilter}
        show={showModalFilter}
        pageRequest={pageRequest}
        setPageRequest={setPageRequest}
      />
      <ModalDelete
        onClickOverlay={toogleDelete}
        show={showModalDelete}
        onDelete={handleDelete}
        isLoading={isLoadingDelete}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this company will also be deleted</div>
        </div>
      </ModalDelete>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            Company
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-2'>
              <div>
                <div className='text-xl'>{ }</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => toogleFilter()}>
                    <BiFilterAlt className='' size={'1.2em'} />
                  </button>
                </div>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => router.push('/company/new')}>
                    <IoAddOutline className='' size={'1.2em'} />
                  </button>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={column}
                data={company}
                setPageRequest={setPageRequest}
                pageRequest={pageRequest}
                pageInfo={pageInfo}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = Main;

export default Index;