import MainAdmin from '@/components/layout/main-admin';
import ModalDelete from "@/components/modal/modal-delete"
import ModalFilterGor from "@/components/modal/modal-filter-gor"
import ModalFilterPlayer from "@/components/modal/modal-filter-player"
import Table from "@/components/table/table"
import { Api } from "@/lib/api"
import PageWithLayoutType from "@/types/layout"
import { displayActive, displayMoney, displayNumber, displayPhoneNumber } from "@/utils/formater"
import { useMutation, useQuery } from "@tanstack/react-query"
import { ColumnDef } from "@tanstack/react-table"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { GetServerSideProps, NextPage } from "next/types"
import { useEffect, useState } from "react"
import { BiFilterAlt } from "react-icons/bi"
import { BsChevronLeft, BsChevronRight } from "react-icons/bs"
import { IoAddOutline } from "react-icons/io5"
import { RiPencilLine } from "react-icons/ri"
import { VscTrash } from "react-icons/vsc"
import notif from '@/utils/notif';
import { CompanyView } from '@/types/company';
import { GorView, PageGor } from '@/types/gor';
import { PagePlayer, PlayerView } from '@/types/player';
import { PageInfo } from '@/types/pagination';

type Props = {
  company: CompanyView
}

const Index: NextPage<Props> = ({ company }) => {

  const router = useRouter();

  const [gor, setGor] = useState<GorView[]>([]);
  const [showModalFilterGor, setShowModalFilterGor] = useState<boolean>(false);
  const [showModalDeleteGor, setShowModalDeleteGor] = useState<boolean>(false);
  const [deleteGorId, setDeleteGorId] = useState<string>('');

  const [player, setPlayer] = useState<PlayerView[]>([]);
  const [showModalFilterPlayer, setShowModalFilterPlayer] = useState<boolean>(false);
  const [showModalDeletePlayer, setShowModalDeletePlayer] = useState<boolean>(false);
  const [deletePlayerId, setDeletePlayerId] = useState<string>('');


  const [pageInfoGor, setPageInfoGor] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });


  const [pageInfoPlayer, setPageInfoPlayer] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestGor, setPageRequestGor] = useState<PageGor>({
    limit: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: company.id,
    name: '',
    description: '',
    address: '',
    createName: '',
  });

  const [pageRequestPlayer, setPageRequestPlayer] = useState<PagePlayer>({
    limit: 10,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: company.id,
    name: '',
    email: '',
    noHp: '',
    address: '',
    gender: '',
    createName: '',
  });

  const { isLoading: isLoadingGor, data: dataGor, refetch: refetchGor } = useQuery(['gor', pageRequestGor], ({ queryKey }) => Api.get('/gor/page', queryKey[1]), {});
  const { isLoading: isLoadingPlayer, data: dataPlayer, refetch: refetchPlayer } = useQuery(['player', pageRequestPlayer], ({ queryKey }) => Api.get('/player/page', queryKey[1]), {});

  const { mutate: mutateDeleteGor, isLoading: isLoadingDeleteGor } = useMutation((id: string) => Api.delete('/gor/' + id));
  const { mutate: mutateDeletePlayer, isLoading: isLoadingDeletePlayer } = useMutation((id: string) => Api.delete('/player/' + id));

  const toggleFilterGor = () => {
    setShowModalFilterGor(!showModalFilterGor)
  };
  const toggleDeleteGor = (id = '') => {
    setDeleteGorId(id);
    setShowModalDeleteGor(!showModalDeleteGor);
  };

  const toggleFilterPlayer = () => {
    setShowModalFilterPlayer(!showModalFilterPlayer)
  };
  const toggleDeletePlayer = (id = '') => {
    setDeletePlayerId(id);
    setShowModalDeletePlayer(!showModalDeletePlayer);
  };

  const handleDeleteGor = () => {
    mutateDeleteGor(deleteGorId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeleteGorId('');
            toggleDeleteGor('');
            refetchGor();
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

  const handleDeletePlayer = () => {
    mutateDeletePlayer(deletePlayerId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeletePlayerId('');
            toggleDeletePlayer('');
            refetchPlayer();
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

  const columnGor: ColumnDef<GorView>[] = [
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
          <Link href={{ pathname: '/admin/company/[companyId]/gor/[gorId]', query: { companyId: company.id, gorId: props.row.original.id  } }} >
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
      id: 'address',
      accessorKey: 'address',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Address"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'normal_game_price',
      accessorKey: 'normalGamePrice',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Normal Game Price"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{'Rp ' + displayNumber(Number(props.getValue()))}</div>,
    },
    {
      id: 'rubber_game_price',
      accessorKey: 'rubberGamePrice',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Rubber Game Price"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{'Rp ' + displayNumber(Number(props.getValue()))}</div>,
    },
    {
      id: 'ball_price',
      accessorKey: 'ballPrice',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Ball Price"}
            </div>
          </>
        );
      },
      cell: props => <div className='text-right'>{'Rp ' + displayNumber(Number(props.getValue()))}</div>,
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
              <Link href={{ pathname: '/admin/company/[companyId]/gor/[gorId]/edit', query: { companyId: company.id, gorId: props.row.original.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit' >
                <RiPencilLine className='' size={'1.2rem'} />
              </Link>
              <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeleteGor(props.row.original.id)}>
                <VscTrash className='' size={'1.2rem'} />
              </button>
            </div>
          </>
        );
      },

    }
  ];

  const columnPlayer: ColumnDef<PlayerView>[] = [
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
          <Link href={{ pathname: '/admin/company/[companyId]/player/[playerId]', query: { companyId: company.id, playerId: props.row.original.id  } }} >
            <div className='w-full duration-300 hover:text-primary-500'>
              {props.getValue() as string}
            </div>
          </Link>
        )
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Email"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'no_hp',
      accessorKey: 'noHp',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"No. Handphone"}
            </div>
          </>
        );
      },
      cell: props => displayPhoneNumber(props.getValue() as string),
    },
    {
      id: 'address',
      accessorKey: 'address',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Address"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'gender',
      accessorKey: 'gender',
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Gender"}
            </div>
          </>
        );
      },
      cell: props => props.getValue(),
    },
    {
      id: 'isActive',
      accessorKey: 'isActive',
      enableSorting: false,
      header: (props) => {
        return (
          <>
            <div className='whitespace-nowrap'>
              {"Active"}
            </div>
          </>
        );
      },
      cell: props => displayActive(props.getValue() as boolean),
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
              <Link href={{ pathname: '/admin/company/[companyId]/player/[playerId]/edit', query: { companyId: company.id, playerId: props.row.original.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit' >
                <RiPencilLine className='' size={'1.2rem'} />
              </Link>
              <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeletePlayer(props.row.original.id)}>
                <VscTrash className='' size={'1.2rem'} />
              </button>
            </div>
          </>
        );
      },

    }
  ];

  useEffect(() => {
    if (dataGor && dataGor.status) {
      setGor(dataGor.payload.list);
      setPageInfoGor({
        pageCount: dataGor.payload.totalPage,
        pageSize: dataGor.payload.dataPerPage,
        totalData: dataGor.payload.totalData,
        page: dataGor.payload.page,
      });
    }
  }, [dataGor]);

  useEffect(() => {
    if (dataPlayer && dataPlayer.status) {
      setPlayer(dataPlayer.payload.list);
      setPageInfoPlayer({
        pageCount: dataPlayer.payload.totalPage,
        pageSize: dataPlayer.payload.dataPerPage,
        totalData: dataPlayer.payload.totalData,
        page: dataPlayer.payload.page,
      });
    }
  }, [dataPlayer]);

  return (
    <>
      <Head>
        <title>{'Company - ' + company.name}</title>
      </Head>
      <ModalFilterGor
        onClickOverlay={toggleFilterGor}
        show={showModalFilterGor}
        pageRequest={pageRequestGor}
        setPageRequest={setPageRequestGor}
      />
      <ModalFilterPlayer
        onClickOverlay={toggleFilterPlayer}
        show={showModalFilterPlayer}
        pageRequest={pageRequestPlayer}
        setPageRequest={setPageRequestPlayer}
      />
      <ModalDelete
        onClickOverlay={toggleDeleteGor}
        show={showModalDeleteGor}
        onDelete={handleDeleteGor}
        isLoading={isLoadingDeleteGor}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this gor will also be deleted</div>
        </div>
      </ModalDelete>
      <ModalDelete
        onClickOverlay={toggleDeletePlayer}
        show={showModalDeletePlayer}
        onDelete={handleDeletePlayer}
        isLoading={isLoadingDeletePlayer}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this player will also be deleted</div>
        </div>
      </ModalDelete>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/admin/company'}>
                <div className='mr-4 hover:text-primary-500'>{'Company'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4 hover:text-primary-500'>{company.name}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/admin/company'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{company.name}</div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className="text-lg">{company.name}</div>
          <div className="text-sm mb-2 ">{company.description}</div>
          <div className="text-lg font-bold">{displayMoney(company.balance)}</div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-2'>
              <div>
                <div className='text-xl'>{'Gor'}</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => toggleFilterGor()}>
                    <BiFilterAlt className='' size={'1.2em'} />
                  </button>
                </div>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => router.push({ pathname: '/admin/company/[companyId]/gor/new', query: { companyId: company.id } })}>
                    <IoAddOutline className='' size={'1.2em'} />
                  </button>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={columnGor}
                data={gor}
                setPageRequest={setPageRequestGor}
                pageRequest={pageRequestGor}
                pageInfo={pageInfoGor}
                isLoading={isLoadingGor}
              />
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='w-full rounded-sm'>
            <div className='flex justify-between items-center px-2 mb-2'>
              <div>
                <div className='text-xl'>{'Player'}</div>
              </div>
              <div className='flex'>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => toggleFilterPlayer()}>
                    <BiFilterAlt className='' size={'1.2em'} />
                  </button>
                </div>
                <div className='ml-2'>
                  <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => router.push({ pathname: '/admin/company/[companyId]/player/new', query: { companyId: company.id } })}>
                    <IoAddOutline className='' size={'1.2em'} />
                  </button>
                </div>
              </div>
            </div>
            <div className=''>
              <Table
                columns={columnPlayer}
                data={player}
                setPageRequest={setPageRequestPlayer}
                pageRequest={pageRequestPlayer}
                pageInfo={pageInfoPlayer}
                isLoading={isLoadingPlayer}
              />
            </div>
          </div>
        </div>
        {/* <div className='bg-white mb-4 p-4 rounded shadow whitespace-pre-wrap'>
          {JSON.stringify(company, null, 4)}
        </div> */}
      </div >
    </>
  )
}

(Index as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId } = context.query;
  const company = await Api.get('/company/' + companyId).then(res => res);

  if (company.status) {
    return {
      props: {
        company: company.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Index;