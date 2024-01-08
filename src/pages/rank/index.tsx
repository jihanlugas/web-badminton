import MainUser from "@/components/layout/main-user";
import ModalFilterRank from "@/components/modal/modal-filter-rank";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { GameplayerRangking, PageRankingGameplayer } from "@/types/gameplayer";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { displayDate, displayDateTime } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { BiFilterAlt } from "react-icons/bi";
import { FaRegMap, FaTrophy } from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";





type Props = {
  company: CompanyView
}

const Index: NextPage<Props> = () => {

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [rank, setRank] = useState<GameplayerRangking[]>([]);
  const [showModalFilterRank, setShowModalFilterRank] = useState<boolean>(false);
  const [accordion, setAccordion] = useState<number[]>([]);

  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }

  const [pageInfoRank, setPageInfoRank] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestRank, setPageRequestRank] = useState<PageRankingGameplayer>({
    limit: 1000,
    page: 1,
    sortField: null,
    sortOrder: null,
    gender: '',
    gameDt: new Date(),
  });

  const { isLoading: isLoadingRank, data: dataRank, refetch: refetchRank } = useQuery(['gameplayer-rank', pageRequestRank], ({ queryKey }) => Api.get('/gameplayer/page-rank', queryKey[1]), {});


  const toggleFilterRank = () => {
    setShowModalFilterRank(!showModalFilterRank)
  };

  useEffect(() => {
    if (dataRank && dataRank.status) {
      setRank(dataRank.payload.list);
      setPageInfoRank({
        pageCount: dataRank.payload.totalPage,
        pageSize: dataRank.payload.dataPerPage,
        totalData: dataRank.payload.totalData,
        page: dataRank.payload.page,
      });
    }
  }, [dataRank]);

  return (
    <>
      <Head>
        <title>{'Company - ' + company.name}</title>
      </Head>
      <ModalFilterRank
        onClickOverlay={toggleFilterRank}
        show={showModalFilterRank}
        pageRequest={pageRequestRank}
        setPageRequest={setPageRequestRank}
      />
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <div className='mr-4'>{'Ranking'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <div className='mr-4'>{'Ranking'}</div>
            </div>
            <div className='-m-2'>
              <button className='h-10 w-10 ease-in-out flex justify-center items-center rounded duration-300 hover:bg-gray-100' onClick={() => toggleFilterRank()}>
                <BiFilterAlt className='' size={'1.2em'} />
              </button>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow w-full max-w-xl'>
          <div className="text-lg">Filter</div>
          <div className="flex items-center justify-between">
            <div>Date</div>
            <div>{displayDate(pageRequestRank.gameDt, 'MMMM YYYY')}</div>
          </div>
          {pageRequestRank.gender && (
            <div className="flex items-center justify-between">
              <div>Gender</div>
              <div>{pageRequestRank.gender}</div>
            </div>
          )}
        </div>
        <div className={'w-full max-w-xl'}>
          {rank.map((data, key) => {
            return (
              <div key={key} className={`bg-white rounded shadow mb-4 border-l-4 ${data.gender === 'MALE' ? 'border-blue-500' : data.gender === 'FEMALE' && 'border-pink-500'}`}>
                <div className="flex items-center justify-between p-4">
                  <div className="flex w-full justify-between">
                    <div className="flex">
                      <div className="mr-4">
                        {/* {data.rank === 1 ? (
                          <span className="relative flex h-6 w-6 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-50"></span>
                            <FaTrophy className={'text-amber-400'} size={'1.2rem'} />
                          </span>
                        ) : (
                          <div className="h-6 w-6 flex justify-center items-center">{data.rank}</div>
                        )} */}
                        {data.rank === 1 ? (
                          <span className="relative flex h-6 w-6 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-50"></span>
                            <FaTrophy className={'text-amber-400'} size={'1.2rem'} />
                          </span>
                        ) : data.rank === 2 ? (
                          <span className="relative flex h-6 w-6 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-50"></span>
                            <FaTrophy className={'text-slate-400'} size={'1.2rem'} />
                          </span>
                        ) : data.rank === 3 ? (
                          <span className="relative flex h-6 w-6 justify-center items-center">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-800 opacity-50"></span>
                            <FaTrophy className={'text-amber-800'} size={'1.2rem'} />
                          </span>
                        ) : (
                          <div className="h-6 w-6 flex justify-center items-center font-bold">{data.rank}</div>
                        )}
                      </div>
                      <div>{data.playerName}</div>
                    </div>
                    {data.rank === 1 ? (
                      <div className="text-lg font-bold text-amber-400">{data.point}</div>
                    ) : data.rank === 2 ? (
                      <div className="font-bold text-slate-400">{data.point}</div>
                    ) : data.rank === 3 ? (
                      <div className="font-bold text-amber-800">{data.point}</div>
                    ) : (
                      <div className="">{data.point}</div>
                    )}
                  </div>
                  {/* <div className="ml-4 h-6 w-6">
                    {data.rank === 1 && (
                      <span className="relative flex h-6 w-6 justify-center items-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-50"></span>
                        <FaTrophy className={'text-amber-400'} size={'1.2rem'} />
                      </span>
                    )}
                  </div> */}

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