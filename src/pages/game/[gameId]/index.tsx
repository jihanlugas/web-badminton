import ButtonSubmit from "@/components/formik/button-submit";
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { ListData } from "@/types/data";
import { GameView } from "@/types/game";
import PageWithLayoutType from "@/types/layout";
import { PageInfo, Paging } from "@/types/pagination";
import { PagePlayer } from "@/types/player";
import { useDebounce } from "@/utils/hook";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikHelpers, FormikValues } from "formik";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode, Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import * as Yup from 'yup';
import notif from "@/utils/notif";
import { CreateGameplayer, GameplayerView, PageGameplayer } from "@/types/gameplayer";
import { MdOutlineDashboard, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { displayDateTime, displayMoney } from "@/utils/formater";
import Image from 'next/image'
import { VscTrash } from "react-icons/vsc";
import ModalDelete from "@/components/modal/modal-delete";
import ModalAddGameplayer from "@/components/modal/modal-add-gameplayer";
import { IoAddOutline } from "react-icons/io5";

type Props = {
  game: GameView
}
type GamePlayerSectionProps = {
  game: GameView
  company: CompanyView
  gameplayer: GameplayerView[]
  toggleDeleteGameplayer: (string) => void
}
type AddPlayerSectionProps = {
  game: GameView
  company: CompanyView
  refetchGameplayer: () => void
}

const schemaAddPlayer = Yup.object().shape({
  gameId: Yup.string(),
  playerId: Yup.string(),
});

const Index: NextPage<Props> = ({ game }) => {

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [gameplayer, setGameplayer] = useState<GameplayerView[]>([]);
  const [showModalAddGameplayer, setShowModalAddGameplayer] = useState<boolean>(false);
  const [showModalDeleteGameplayer, setShowModalDeleteGameplayer] = useState<boolean>(false);
  const refAdd = useRef<HTMLDivElement>();
  const [addBar, setAddBar] = useState(false);
  const [deleteGameplayerId, setDeleteGameplayerId] = useState<string>('');

  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (addBar && refAdd.current && !refAdd.current.contains(e.target)) {
        setAddBar(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);

    return () => {
      // Cleanup the event listener
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [addBar]);

  const [pageInfoGameplayer, setPageInfoGameplayer] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestGameplayer, setPageRequestGameplayer] = useState<PageGameplayer>({
    limit: 1000,
    page: 1,
    sortField: 'create_dt',
    sortOrder: 'asc',
    gameId: game.id,
    playerId: '',
  });

  const { mutate: mutateDeleteGameplayer, isLoading: isLoadingDeleteGameplayer } = useMutation((id: string) => Api.delete('/gameplayer/' + id));

  const { isLoading: isLoadingGameplayer, data: dataGameplayer, refetch: refetchGameplayer } = useQuery(['gameplayer', pageRequestGameplayer], ({ queryKey }) => Api.get('/gameplayer/page', queryKey[1]), {});

  useEffect(() => {
    if (dataGameplayer && dataGameplayer.status) {
      setGameplayer(dataGameplayer.payload.list);
      setPageInfoGameplayer({
        pageCount: dataGameplayer.payload.totalPage,
        pageSize: dataGameplayer.payload.dataPerPage,
        totalData: dataGameplayer.payload.totalData,
        page: dataGameplayer.payload.page,
      });
    }
  }, [dataGameplayer]);

  const toggleDeleteGameplayer = (id = '') => {
    setDeleteGameplayerId(id);
    setShowModalDeleteGameplayer(!showModalDeleteGameplayer);
  };

  const handleDeleteGameplayer = () => {
    mutateDeleteGameplayer(deleteGameplayerId, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            setDeleteGameplayerId('');
            toggleDeleteGameplayer('');
            refetchGameplayer();
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

  const toggleAddGameplayer = (refresh = false) => {
    if (refresh) {
      refetchGameplayer()
    }
    setAddBar(false);
    setShowModalAddGameplayer(!showModalAddGameplayer)
  };

  return (
    <>
      <Head>
        <title>{'Game - ' + game.name}</title>
      </Head>
      <ModalAddGameplayer
        onClickOverlay={toggleAddGameplayer}
        show={showModalAddGameplayer}
        game={game}
      />
      <ModalDelete
        onClickOverlay={toggleDeleteGameplayer}
        show={showModalDeleteGameplayer}
        onDelete={handleDeleteGameplayer}
        isLoading={isLoadingDeleteGameplayer}
      >
        <div>
          <div className='mb-4'>Are you sure ?</div>
          <div className='text-sm mb-4 text-gray-700'>Data related to thiss will also be deleted</div>
        </div>
      </ModalDelete>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <Link href={'/game'}>
                <div className='mr-4 hover:text-primary-500'>{'Game'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{game.name}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/game'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{game.name}</div>
            </div>
            <div className='text-base relative inline-block' ref={refAdd}>
              <button onClick={() => setAddBar(!addBar)} className='flex items-center hover:bg-gray-100 rounded -m-2 p-2'>
                <div className='flex justify-center items-center rounded h-8 w-8'>
                  <IoAddOutline size={'1.2em'} />
                </div>
              </button>

              <div className={`absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none duration-300 ease-in-out ${!addBar && 'scale-0 shadow-none ring-0'}`}>
                <div className="" role="none">
                  {/* <Link href={'/account/change-password'}>
                    <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700'}>{'Change Password'}</div>
                  </Link>
                  <Link href={'/settings'}>
                    <div className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700'}>{'Setting'}</div>
                  </Link> */}
                  
                  <button onClick={() => toggleAddGameplayer(false)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
                    {'Add match'}
                  </button>
                  <hr />
                  <button onClick={() => toggleAddGameplayer(false)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
                    {'Add game player'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Game Detail */}
        {/* <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className="">{game.name}</div>
          <div className="">{game.description}</div>
          <div className="">{game.gorName}</div>
          <div className="">{game.gameDt}</div>
          <div className="">{game.normalGamePrice}</div>
          <div className="">{game.rubberGamePrice}</div>
          <div className="">{game.ballPrice}</div>
        </div> */}

        {/* Add Player Section */}
        {/* <AddPlayerSection
          game={game}
          company={company}
          refetchGameplayer={refetchGameplayer}
        /> */}

        {/* Data Game Player */}
        <GamePlayerSection
          game={game}
          company={company}
          gameplayer={gameplayer}
          toggleDeleteGameplayer={toggleDeleteGameplayer}
        />

      </div>
    </>
  )
}

const GamePlayerSection: NextPage<GamePlayerSectionProps> = ({ game, company, gameplayer, toggleDeleteGameplayer }) => {

  const [accordion, setAccordion] = useState<number[]>([]);
  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }

  return (
    <>
      {gameplayer.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            {gameplayer.map((data, key) => {
              return (
                <div key={key} className='bg-white rounded shadow'>
                  <div className=''>
                    <div className='w-full flex justify-between rounded items-center p-4'>
                      <div className='text-left'>
                        <div className='text-lg'>{data.playerName}</div>
                      </div>
                    </div>
                    <div className={'duration-300 overflow-hidden'}>
                      <div className='px-4 pb-4'>
                        <div className="text-base mb-4">
                          <div>
                            <div>Normal Game</div>
                            <div className="flex justify-between text-sm">
                              <div>{data.normalGame}</div>
                              <div className="font-bold">{displayMoney(data.normalGame * game.normalGamePrice)}</div>
                            </div>
                          </div>
                          <div>
                            <div>Rubber Game</div>
                            <div className="flex justify-between text-sm">
                              <div>{data.rubberGame}</div>
                              <div className="font-bold">{displayMoney(data.rubberGame * game.rubberGamePrice)}</div>
                            </div>
                          </div>
                          <div>
                            <div>Ball</div>
                            <div className="flex justify-between text-sm">
                              <div>{data.ball}</div>
                              <div className="font-bold">{displayMoney(data.ball * game.ballPrice)}</div>
                            </div>
                          </div>
                        </div>
                        <div className='flex justify-end items-center'>
                          <Link href={{ pathname: '/game/[gameId]', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='Game Details'>
                            <MdOutlineDashboard className='' size={'1.2rem'} />
                          </Link>
                          <Link href={{ pathname: '/game/[gameId]/edit', query: { gameId: data.id } }} className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='edit'>
                            <RiPencilLine className='' size={'1.2rem'} />
                          </Link>
                          <button className='ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded' title='delete' onClick={() => toggleDeleteGameplayer(data.id)}>
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
        </>
      ) : (
        <>
          <div className='bg-white rounded shadow'>
            <div className='w-full flex flex-col justify-center items-center rounded px-4 py-12'>
              <div className='text-lg mb-4 font-bold'>No data</div>
              <div className='text-sm'>Add game player first</div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

(Index as PageWithLayoutType).layout = MainUser;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { gameId } = context.query;
  const game = await Api.get('/game/' + gameId).then(res => res);

  if (game.status) {
    return {
      props: {
        game: game.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Index;