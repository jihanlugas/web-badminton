import MainAdmin from '@/components/layout/main-admin';
import ModalDelete from "@/components/modal/modal-delete"
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
import MainUser from '@/components/layout/main-user';
import { MdOutlineEmail, MdOutlineKeyboardArrowRight, MdPhone } from 'react-icons/md';
import { FaRegMap } from 'react-icons/fa6';
import { getInitialWord } from '@/utils/helper';
import { CompanyView } from '@/types/company';
import { PagePlayer, PlayerView } from '@/types/player';
import { PageInfo } from '@/types/pagination';

type Props = {
  company: CompanyView
}

type FilterPropsPlayer = {
  companyId: string
  name: string
  email: string
  noHp: string
  address: string
  gender: string
  createName: string
}

const Index: NextPage<Props> = () => {

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [player, setPlayer] = useState<PlayerView[]>([]);
  const [showModalFilterPlayer, setShowModalFilterPlayer] = useState<boolean>(false);
  const [showModalDeletePlayer, setShowModalDeletePlayer] = useState<boolean>(false);
  const [deletePlayerId, setDeletePlayerId] = useState<string>(''); const [accordion, setAccordion] = useState<number[]>([]);

  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }


  const [pageInfoPlayer, setPageInfoPlayer] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });
  const [pageRequestPlayer, setPageRequestPlayer] = useState<PagePlayer>({
    limit: 1000,
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

  const { isLoading: isLoadingPlayer, data: dataPlayer, refetch: refetchPlayer } = useQuery(['player', pageRequestPlayer], ({ queryKey }) => Api.get('/player/page', queryKey[1]), {});

  const { mutate: mutateDeletePlayer, isLoading: isLoadingDeletePlayer } = useMutation((id: string) => Api.delete('/player/' + id));

  const toggleFilterPlayer = () => {
    setShowModalFilterPlayer(!showModalFilterPlayer)
  };
  const toggleDeletePlayer = (id = '') => {
    setDeletePlayerId(id);
    setShowModalDeletePlayer(!showModalDeletePlayer);
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
      <ModalFilterPlayer
        onClickOverlay={toggleFilterPlayer}
        show={showModalFilterPlayer}
        pageRequest={pageRequestPlayer}
        setPageRequest={setPageRequestPlayer}
      />
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
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <div className='mr-4'>{'Player'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <div className='mr-4'>{'Player'}</div>
            </div>
            <div className='flex items-center text-base'>
              <Link href={{ pathname: '/player/new' }} className='flex items-center hover:bg-gray-100 rounded -m-2 p-2'>
                <div className='flex justify-center items-center rounded h-8 w-8'>
                  <IoAddOutline size={'1.2em'} />
                </div>
                <div className='ml-2 hidden md:block'>Add Player</div>
              </Link>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {player.map((data, key) => {
            return (
              <div key={key} className='bg-white rounded shadow'>
                <div className='block md:hidden'>
                  <button className='w-full flex justify-between rounded items-center p-4' onClick={() => toggleAccordion(key)}>
                    <div className='text-left flex items-center'>
                      <div className='h-10 w-10 mr-2 bg-gray-700 rounded-full text-gray-100 flex justify-center items-center text-lg'>
                        {getInitialWord(data.name)}
                      </div>
                      <div className='text-lg'>{data.name}</div>
                    </div>
                    <div className='flex justify-center items-center h-8 w-8'>
                      <MdOutlineKeyboardArrowRight className={`rotate-0 duration-300 ${accordion.includes(key) && 'rotate-90'}`} size={'1.5em'} />
                    </div>
                  </button>
                  <div className={`duration-300 overflow-hidden ${accordion.includes(key) ? 'max-h-60 ' : 'max-h-0 '}`}>
                    <div className='px-4 pb-4'>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><FaRegMap className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.address ? data.address : '-'}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><MdOutlineEmail className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.email ? data.email : '-'}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><MdPhone className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.noHp ? displayPhoneNumber(data.noHp) : '-'}</div>
                      </div>
                      <div className='flex justify-end items-center'>
                        <Link href={{ pathname: '/player/[playerId]/edit', query: { playerId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
                          <RiPencilLine className='' size={'1.2rem'} />
                        </Link>
                        <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeletePlayer(data.id)}>
                          <VscTrash className='' size={'1.2rem'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='hidden md:block'>
                  <div className='w-full flex justify-between rounded items-center p-4'>
                    <div className='text-left flex items-center'>
                      <div className='h-10 w-10 mr-2 bg-gray-700 rounded-full text-gray-100 flex justify-center items-center text-lg'>
                        {getInitialWord(data.name)}
                      </div>
                      <div className='text-lg'>{data.name}</div>
                    </div>
                  </div>
                  <div className={'duration-300 overflow-hidden'}>
                    <div className='px-4 pb-4'>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><FaRegMap className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.address ? data.address : '-'}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><MdOutlineEmail className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.email ? data.email : '-'}</div>
                      </div>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><MdPhone className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.noHp ? displayPhoneNumber(data.noHp) : '-'}</div>
                      </div>                      
                      <div className='flex justify-end items-center'>
                        <Link href={{ pathname: '/player/[playerId]/edit', query: { playerId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
                          <RiPencilLine className='' size={'1.2rem'} />
                        </Link>
                        <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeletePlayer(data.id)}>
                          <VscTrash className='' size={'1.2rem'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div >
    </>
  )
}

(Index as PageWithLayoutType).layout = MainUser;

export default Index;