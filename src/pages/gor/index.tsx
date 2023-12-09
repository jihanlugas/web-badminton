import MainAdmin from '@/components/layout/main-admin';
import ModalDelete from "@/components/modal/modal-delete"
import ModalFilterGor from "@/components/modal/modal-filter-gor"
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
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import { FaRegMap } from 'react-icons/fa6';
import { IoBaseballSharp } from 'react-icons/io5';
import Image from 'next/image'
import { CompanyView } from '@/types/company';
import { GorView, PageGor } from '@/types/gor';
import { PageInfo } from '@/types/pagination';

type Props = {
  company: Company
}

type FilterPropsGor = {
  companyId: string
  name: string
  description: string
  address: string
  createName: string
}

const Index: NextPage<Props> = () => {

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [gor, setGor] = useState<GorView[]>([]);
  const [showModalFilterGor, setShowModalFilterGor] = useState<boolean>(false);
  const [showModalDeleteGor, setShowModalDeleteGor] = useState<boolean>(false);
  const [deleteGorId, setDeleteGorId] = useState<string>('');
  const [accordion, setAccordion] = useState<number[]>([]);

  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }


  const [pageInfoGor, setPageInfoGor] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestGor, setPageRequestGor] = useState<PageGor>({
    limit: 1000,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: company.id,
    name: '',
    description: '',
    address: '',
    createName: '',
  });

  const { isLoading: isLoadingGor, data: dataGor, refetch: refetchGor } = useQuery(['gor', pageRequestGor], ({ queryKey }) => Api.get('/gor/page', queryKey[1]), {});

  const { mutate: mutateDeleteGor, isLoading: isLoadingDeleteGor } = useMutation((id: string) => Api.delete('/gor/' + id));

  const toggleFilterGor = () => {
    setShowModalFilterGor(!showModalFilterGor)
  };
  const toggleDeleteGor = (id = '') => {
    setDeleteGorId(id);
    setShowModalDeleteGor(!showModalDeleteGor);
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
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <div className='mr-4'>{'Gor'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <div className='mr-4'>{'Gor'}</div>
            </div>
            <div className='flex items-center text-base'>
              <Link href={{ pathname: '/gor/new' }} className='flex items-center hover:bg-gray-100 rounded -m-2 p-2'>
                <div className='flex justify-center items-center rounded h-8 w-8'>
                  <IoAddOutline size={'1.2em'} />
                </div>
                <div className='ml-2 hidden md:block'>Add Gor</div>
              </Link>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {gor.map((data, key) => {
            return (
              <div key={key} className='bg-white rounded shadow'>
                <div className='block md:hidden'>
                  <button className='w-full flex justify-between rounded items-center p-4' onClick={() => toggleAccordion(key)}>
                    <div className='text-left'>
                      <div className='text-lg'>{data.name}</div>
                      <div className={`text-sm ${!accordion.includes(key) && 'w-64 truncate '}`}>{data.description}</div>
                    </div>
                    <div className='flex justify-center items-center h-8 w-8'>
                      <MdOutlineKeyboardArrowRight className={`rotate-0 duration-300 ${accordion.includes(key) && 'rotate-90'}`} size={'1.5em'} />
                    </div>
                  </button>
                  <div className={`duration-300 overflow-hidden ${accordion.includes(key) ? 'max-h-60 ' : 'max-h-0 '}`}>
                    <div className='px-4 pb-4'>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><FaRegMap className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.address}</div>
                      </div>
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
                        <Link href={{ pathname: '/gor/[gorId]/edit', query: { gorId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
                          <RiPencilLine className='' size={'1.2rem'} />
                        </Link>
                        <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeleteGor(data.id)}>
                          <VscTrash className='' size={'1.2rem'} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='hidden md:block'>
                  <div className='w-full flex justify-between rounded items-center p-4'>
                    <div className='text-left'>
                      <div className='text-lg'>{data.name}</div>
                      <div className={'text-sm'}>{data.description}</div>
                    </div>
                  </div>
                  <div className={'duration-300 overflow-hidden'}>
                    <div className='px-4 pb-4'>
                      <div className='flex'>
                        <div className='h-6 w-6 flex-none flex justify-center items-center mr-2'><FaRegMap className='' size={'1.1rem'} /></div>
                        <div className='flex-grow '>{data.address}</div>
                      </div>
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
                        <Link href={{ pathname: '/gor/[gorId]/edit', query: { gorId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
                          <RiPencilLine className='' size={'1.2rem'} />
                        </Link>
                        <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeleteGor(data.id)}>
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
        {/* <div className='bg-white mb-4 p-4 rounded shadow whitespace-pre-wrap'>
          {JSON.stringify(company, null, 4)}
        </div> */}
      </div >
    </>
  )
}

(Index as PageWithLayoutType).layout = MainUser;

export default Index;