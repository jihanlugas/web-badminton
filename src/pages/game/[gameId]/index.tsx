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
import { BsChevronDown, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import * as Yup from 'yup';
import notif from "@/utils/notif";
import { CreateGameplayer, GameplayerView, PageGameplayer, UpdateGameplayer } from "@/types/gameplayer";
import { MdAdd, MdClose, MdOutlineDashboard, MdOutlineKeyboardArrowRight, MdRemove, MdSave } from "react-icons/md";
import { RiPencilLine } from "react-icons/ri";
import { displayDateTime, displayMoney } from "@/utils/formater";
import Image from 'next/image'
import { VscTrash } from "react-icons/vsc";
import ModalDelete from "@/components/modal/modal-delete";
import ModalAddGameplayer from "@/components/modal/modal-add-gameplayer";
import { IoAdd, IoAddOutline, IoRemove } from "react-icons/io5";
import TextField from "@/components/formik/text-field";
import CheckboxField from "@/components/formik/checkbox-field";
import ModalAddGamematch from "@/components/modal/modal-add-gamematch";

type Props = {
  game: GameView
}
type GamePlayerSectionProps = {
  game: GameView
  company: CompanyView
  gameplayer: GameplayerView[]
  toggleDeleteGameplayer: (string) => void
  refetchGameplayer: () => void
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
  const [showModalAddGamematch, setShowModalAddGamematch] = useState<boolean>(false);
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
    gameName: '',
    playerName: '',
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

  const toggleAddGamematch = (refresh = false) => {
    if (refresh) {
      refetchGameplayer()
    }
    setAddBar(false);
    setShowModalAddGamematch(!showModalAddGamematch)
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
      <ModalAddGamematch
        onClickOverlay={toggleAddGamematch}
        show={showModalAddGamematch}
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
                <div className='flex justify-center items-center rounded h-6 w-6'>
                  <BsChevronDown size={'1.2em'} />
                </div>
              </button>

              <div className={`absolute right-0 mt-2 w-56 rounded-md overflow-hidden origin-top-right shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none duration-300 ease-in-out ${!addBar && 'scale-0 shadow-none ring-0'}`}>
                <div className="" role="none">
                  <button onClick={() => toggleAddGamematch(false)} className={'block px-4 py-3 text-gray-600 text-sm capitalize duration-300 hover:bg-primary-100 hover:text-gray-700 w-full text-left'}>
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

        {/* Data Game Player */}
        <GamePlayerSection
          game={game}
          company={company}
          gameplayer={gameplayer}
          toggleDeleteGameplayer={toggleDeleteGameplayer}
          refetchGameplayer={refetchGameplayer}
        />

      </div>
    </>
  )
}

const GamePlayerSection: NextPage<GamePlayerSectionProps> = ({ game, company, gameplayer, toggleDeleteGameplayer, refetchGameplayer }) => {
  const schema = Yup.object().shape({
    gameId: Yup.string().required("Required field"),
    playerId: Yup.string().required("Required field"),
    normalGame: Yup.number(),
    rubberGame: Yup.number(),
    ball: Yup.number(),
    isPay: Yup.boolean(),
  });

  const [accordion, setAccordion] = useState<number[]>([]);
  const [edit, setEdit] = useState<string>('');
  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.put('/gameplayer/' + val.id, val));


  const handleSubmit = (values: FormikValues) => {
    console.log('handleSubmit ', values)
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            refetchGameplayer();
            setEdit('')
          } else if (!res.success) {
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
      {gameplayer.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            {gameplayer.map((data, key) => {
              const initFormikValue: UpdateGameplayer & { id: string } = {
                id: data.id,
                gameId: data.gameId,
                playerId: data.playerId,
                normalGame: data.normalGame,
                rubberGame: data.rubberGame,
                ball: data.ball,
                isPay: data.isPay,
              }
              return (
                <div key={key} className='bg-white rounded shadow'>
                  {edit.includes(data.id) ? (
                    <>
                      <Formik
                        initialValues={initFormikValue}
                        validationSchema={schema}
                        enableReinitialize={true}
                        onSubmit={(values, { setErrors }) => handleSubmit(values)}
                      >
                        {({ values, errors, setFieldValue }) => {
                          return (
                            <Form>
                              <div className={''}>
                                <div className='w-full flex justify-between rounded items-center p-4'>
                                  <div className='text-left'>
                                    <div className='text-lg'>{data.playerName}</div>
                                  </div>
                                </div>
                                <div className='w-full px-4 pb-4 text-base'>
                                  <div className="mb-4 flex justify-between items-center">
                                    <div>Normal Game</div>
                                    <div className="flex items-center">
                                      <button type={'button'} className={'text-gray-50 bg-rose-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center'} onClick={() => setFieldValue('normalGame', values.normalGame - 1)} disabled={values.normalGame === 0}>
                                        <MdRemove className='' size={'1rem'} />
                                      </button>
                                      <div className="mx-4 font-bold">{values.normalGame}</div>
                                      <button type={'button'} className={'text-gray-50 bg-primary-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center'} onClick={() => setFieldValue('normalGame', values.normalGame + 1)}>
                                        <MdAdd className='' size={'1rem'} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mb-4 flex justify-between items-center">
                                    <div>Rubber Game</div>
                                    <div className="flex items-center">
                                      <button type={'button'} className={'text-gray-50 bg-rose-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center'} onClick={() => setFieldValue('rubberGame', values.rubberGame - 1)} disabled={values.rubberGame === 0}>
                                        <MdRemove className='' size={'1rem'} />
                                      </button>
                                      <div className="mx-4 font-bold">{values.rubberGame}</div>
                                      <button type={'button'} className={'text-gray-50 bg-primary-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center'} onClick={() => setFieldValue('rubberGame', values.rubberGame + 1)}>
                                        <MdAdd className='' size={'1rem'} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mb-4 flex justify-between items-center">
                                    <div>Ball</div>
                                    <div className="flex items-center">
                                      <button type={'button'} className={'text-gray-50 bg-rose-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center shad'} onClick={() => setFieldValue('ball', values.ball - 1)} disabled={values.ball === 0}>
                                        <MdRemove className='' size={'1rem'} />
                                      </button>
                                      <div className="mx-4 font-bold">{values.ball}</div>
                                      <button type={'button'} className={'text-gray-50 bg-primary-400 disabled:bg-gray-400 font-bold rounded-full h-6 w-6 flex justify-center items-center'} onClick={() => setFieldValue('ball', values.ball + 1)}>
                                        <MdAdd className='' size={'1rem'} />
                                      </button>
                                    </div>
                                  </div>
                                  <div className="mb-4 h-6">
                                    <CheckboxField
                                      name={'isPay'}
                                      label="Is Pay"
                                    />
                                  </div>
                                  <div className='flex justify-end items-center'>
                                    <button type="button" className='text-rose-500 ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow' title='cancel' onClick={() => setEdit('')}>
                                      <MdClose className='' size={'1.2rem'} />
                                    </button>
                                    <button type={'submit'} className='text-primary-500 ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow' title='save'>
                                      <MdSave className='' size={'1.2rem'} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    </>
                  ) : (
                    <>
                      <div className=''>
                        <div className='w-full flex justify-between rounded items-center p-4'>
                          <div className='text-left'>
                            <div className='text-lg'>{data.playerName}</div>
                          </div>
                          {data.isPay && (
                            <div className="text-xs bg-primary-500 text-gray-50 px-2 py-1 rounded-full">PAID</div>
                          )}
                        </div>
                        <div className='px-4 pb-4'>
                          <div className="text-base">
                            <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                              <div className="col-span-2">Normal Game</div>
                              <div className="col-span-1 flex justify-between items-center text-sm">
                                <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.normalGame}</div>
                                <div className="">{displayMoney(data.normalGame * game.normalGamePrice)}</div>
                              </div>
                            </div>
                            <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                              <div className="col-span-2">Rubber Game</div>
                              <div className="col-span-1 flex justify-between items-center text-sm">
                                <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.rubberGame}</div>
                                <div className="">{displayMoney(data.rubberGame * game.rubberGamePrice)}</div>
                              </div>
                            </div>
                            <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                              <div className="col-span-2">Ball</div>
                              <div className="col-span-1 flex justify-between items-center text-sm">
                                <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.ball}</div>
                                <div className="">{displayMoney(data.ball * game.ballPrice)}</div>
                              </div>
                            </div>
                            <div className="mb-4 flex justify-between items-center h-6">
                              <div>Total</div>
                              <div className="flex justify-between items-center text-sm">
                                <div className="font-bold">{displayMoney(data.normalGame * game.normalGamePrice + data.rubberGame * game.rubberGamePrice + data.ball * game.ballPrice)}</div>
                              </div>
                            </div>
                            <div className='flex justify-end items-center'>
                              <button className='text-rose-500 ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow' title='delete' onClick={() => toggleDeleteGameplayer(data.id)}>
                                <VscTrash className='' size={'1.2rem'} />
                              </button>
                              <button className='text-amber-500 ml-2 h-8 w-8 flex justify-center items-center duration-300 hover:bg-gray-100 rounded shadow' title='delete' onClick={() => setEdit(data.id)}>
                                <RiPencilLine className='' size={'1.2rem'} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
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