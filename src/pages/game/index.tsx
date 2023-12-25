import MainAdmin from '@/components/layout/main-admin';
import ModalDelete from "@/components/modal/modal-delete"
// import ModalFilterGame from "@/components/modal/modal-filter-game"
import Table from "@/components/table/table"
import { Api } from "@/lib/api"
import PageWithLayoutType from "@/types/layout"
import { displayActive, displayDateTime, displayMoney, displayNumber, displayPhoneNumber } from "@/utils/formater"
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
import MainUser from '@/components/layout/main-user';
import { MdOutlineDashboard, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaRegMap } from 'react-icons/fa6';
import { IoBaseballSharp } from 'react-icons/io5';
import Image from 'next/image'
import { GrSchedule } from 'react-icons/gr';
import { CompanyView } from '@/types/company';
import { GameView, PageGame } from '@/types/game';
import { PageInfo, Paging } from '@/types/pagination';

type Props = {
}

type FilterPropsGame = {
  companyId: string
  gorId: string
  name: string
  description: string
  createName: string
}

const Index: NextPage<Props> = () => {

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [game, setGame] = useState<GameView[]>([]);
  const [showModalFilterGame, setShowModalFilterGame] = useState<boolean>(false);
  const [showModalDeleteGame, setShowModalDeleteGame] = useState<boolean>(false);
  const [deleteGameId, setDeleteGameId] = useState<string>('');
  const [accordion, setAccordion] = useState<number[]>([]);

  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }


  const [pageInfoGame, setPageInfoGame] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestGame, setPageRequestGame] = useState<PageGame>({
    limit: 1000,
    page: 1,
    sortField: 'create_dt',
    sortOrder: 'desc',
    companyId: company.id,
    gorId: '',
    name: '',
    description: '',
  });

  const { isLoading: isLoadingGame, data: dataGame, refetch: refetchGame } = useQuery(['game', pageRequestGame], ({ queryKey }) => Api.get('/game/page', queryKey[1]), {});

  const { mutate: mutateDeleteGame, isLoading: isLoadingDeleteGame } = useMutation((id: string) => Api.delete('/game/' + id));

  const toggleFilterGame = () => {
    setShowModalFilterGame(!showModalFilterGame)
  };
  const toggleDeleteGame = (id = '') => {
    setDeleteGameId(id);
    setShowModalDeleteGame(!showModalDeleteGame);
  };

  const handleDeleteGame = () => {
    mutateDeleteGame(deleteGameId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeleteGameId('');
            toggleDeleteGame('');
            refetchGame();
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

  useEffect(() => {
    if (dataGame && dataGame.status) {
      setGame(dataGame.payload.list);
      setPageInfoGame({
        pageCount: dataGame.payload.totalPage,
        pageSize: dataGame.payload.dataPerPage,
        totalData: dataGame.payload.totalData,
        page: dataGame.payload.page,
      });
    }
  }, [dataGame]);

  return (
    <>
      <Head>
        <title>{'Game'}</title>
      </Head>
      {/* <ModalFilterGame
        onClickOverlay={toggleFilterGame}
        show={showModalFilterGame}
        pageRequest={pageRequestGame}
        setPageRequest={setPageRequestGame}
      /> */}
      <ModalDelete
        onClickOverlay={toggleDeleteGame}
        show={showModalDeleteGame}
        onDelete={handleDeleteGame}
        isLoading={isLoadingDeleteGame}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to this game will also be deleted</div>
        </div>
      </ModalDelete>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <div className='mr-4'>{'Game'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <div className='mr-4'>{'Game'}</div>
            </div>
            <div className='flex items-center text-base'>
              <Link href={{ pathname: '/game/new' }} className='flex items-center hover:bg-gray-100 rounded -m-2 p-2'>
                <div className='flex justify-center items-center rounded h-6 w-6'>
                  <IoAddOutline size={'1.2em'} />
                </div>
                <div className='ml-2 hidden md:block'>Add Game</div>
              </Link>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {game.map((data, key) => {
            return (
              <div key={key} className='bg-white rounded shadow'>
                <div className='block md:hidden'>
                  <button className='w-full flex justify-between rounded items-center p-4' onClick={() => toggleAccordion(key)}>
                    <div className='text-left'>
                      <div className='text-lg'>{data.name}</div>
                      <div className={`text-sm ${!accordion.includes(key) && 'w-64 truncate '}`}>{displayDateTime(data.gameDt, 'dddd, DD MMM YYYY HH:mm')}</div>
                    </div>
                    <div className='flex items-center'>
                      {data.isFinish && (
                        <div className='text-xs flex justify-center items-center text-gray-50 bg-primary-500 px-2 py-1 rounded-full font-bold'>DONE</div>
                      )}
                      <div className='flex justify-center items-center h-8 w-8'>
                        <MdOutlineKeyboardArrowRight className={`rotate-0 duration-300 ${accordion.includes(key) && 'rotate-90'}`} size={'1.5em'} />
                      </div>
                    </div>
                  </button>
                  <div className={`duration-300 overflow-hidden ${accordion.includes(key) ? 'max-h-60 ' : 'max-h-0 '}`}>
                    <div className='px-4 pb-4'>
                      {data.description && (
                        <div className='flex mb-2'>
                          <div className='flex-grow '>{data.description}</div>
                        </div>
                      )}
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>2</div>
                        <div className='flex-grow '>{displayMoney(data.normalGamePrice)}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>3</div>
                        <div className='flex-grow '>{displayMoney(data.rubberGamePrice)}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>
                          <Image
                            src="/badminton-svgrepo-com.svg"
                            alt="Badminton shuttlecock"
                            className=""
                            width={16}
                            height={16}
                            priority
                          />
                        </div>
                        <div className='flex-grow '>{displayMoney(data.ballPrice)}</div>
                      </div>
                      <div className='flex justify-end items-center'>
                        <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-rose-500' title='delete' onClick={() => toggleDeleteGame(data.id)}>
                          <VscTrash className='' size={'1.2rem'} />
                        </button>
                        <Link href={{ pathname: '/game/[gameId]/edit', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-amber-500' title='edit'>
                          <RiPencilLine className='' size={'1.2rem'} />
                        </Link>
                        <Link href={{ pathname: '/game/[gameId]', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-primary-500' title='Game Details'>
                          <MdOutlineDashboard className='' size={'1.2rem'} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='hidden md:block'>
                  <div className='w-full flex justify-between rounded items-center p-4'>
                    <div className='text-left'>
                      <div className='text-lg'>{data.name}</div>
                      <div className={'text-sm'}>{displayDateTime(data.gameDt, 'dddd DD MMM YYYY HH:mm')}</div>
                    </div>
                    {data.isFinish && (
                      <div className='text-xs flex justify-center items-center text-gray-50 bg-primary-500 px-2 py-1 rounded-full font-bold'>DONE</div>
                    )}
                  </div>
                  <div className={'duration-300 overflow-hidden'}>
                    <div className='px-4 pb-4'>
                      {data.description && (
                        <div className='flex mb-2'>
                          <div className='flex-grow '>{data.description}</div>
                        </div>
                      )}
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>2</div>
                        <div className='flex-grow '>{displayMoney(data.normalGamePrice)}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>3</div>
                        <div className='flex-grow '>{displayMoney(data.rubberGamePrice)}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'>
                          <Image
                            src="/badminton-svgrepo-com.svg"
                            alt="Badminton shuttlecock"
                            className=""
                            width={16}
                            height={16}
                            priority
                          />
                        </div>
                        <div className='flex-grow '>{displayMoney(data.ballPrice)}</div>
                      </div>
                      <div className='flex justify-end items-center'>
                        {!data.isFinish && (
                          <>
                            <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-rose-500' title='delete' onClick={() => toggleDeleteGame(data.id)}>
                              <VscTrash className='' size={'1.2rem'} />
                            </button>
                            <Link href={{ pathname: '/game/[gameId]/edit', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-amber-500' title='edit'>
                              <RiPencilLine className='' size={'1.2rem'} />
                            </Link>
                          </>
                        )}
                        <Link href={{ pathname: '/game/[gameId]', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow text-primary-500' title='Game Details'>
                          <MdOutlineDashboard className='' size={'1.2rem'} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {/* <div className='bg-white mb-4 p-4 rounded shadow whitespace-pre-wrap'>
          {JSON.stringify(company, null, 4)}
        </div> */}
      </div >
    </>
  )
}

(Index as PageWithLayoutType).layout = MainUser;

export default Index;