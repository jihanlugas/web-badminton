import ButtonSubmit from "@/components/formik/button-submit";
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { ListData } from "@/types/data";
import { FinishGame, GameDetail, GameView } from "@/types/game";
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
  gamedetail: GameDetail
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

const schema = Yup.object().shape({
  gameId: Yup.string().required("Required field"),
  transactions: Yup.array().of(
    Yup.object().shape({
      companyId: Yup.string().required("Required field"),
      name: Yup.string().required("Required field"),
      isDebit: Yup.boolean(),
      price: Yup.number().required("Required field"),
    })
  )
});

const Finish: NextPage<Props> = ({ gamedetail }) => {

  const { game, gamematches, gamematchteams, gamematchteamplayers, gamematchscores, gameplayers } = gamedetail;

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));
  const router = useRouter();

  const [accordionPlayer, setAccordionPlayer] = useState<string[]>([]);
  const [accordionGamematch, setAccordionGamematch] = useState<string[]>([]);

  const initFormikValue: FinishGame = {
    gameId: game.id,
    transactions: [
      {
        companyId: company.id,
        name: 'Iuran Game',
        isDebit: true,
        price: 0,
      },
      {
        companyId: company.id,
        name: 'Bola',
        isDebit: false,
        price: 0,
      },

    ]
  }

  const toggleAccordionPlayer = (key) => {
    if (accordionPlayer.includes(key)) {
      setAccordionPlayer(accordionPlayer.filter((item) => item !== key));
    } else {
      setAccordionPlayer([...accordionPlayer, key]);
    }
  }

  const toggleAccordionGamematch = (key) => {
    if (accordionGamematch.includes(key)) {
      setAccordionGamematch(accordionGamematch.filter((item) => item !== key));
    } else {
      setAccordionGamematch([...accordionGamematch, key]);
    }
  }

  const handleSubmit = (values: FormikValues) => {
    console.log('handleSubmit ', values)
    // mutateSubmit(values, {
    //   onSuccess: (res) => {
    //     if (res) {
    //       if (res.status) {
    //         notif.success(res.message);
    //         refetchGameplayer();
    //         setEdit('')
    //       } else if (!res.success) {
    //         notif.error(res.message);
    //       }
    //     }
    //   },
    //   onError: (res) => {
    //     notif.error('Please cek you connection');
    //   },
    // });
  };

  var totalPaid = 0
  var total = 0

  return (
    <>
      <Head>
        <title>{'Game - ' + game.name}</title>
      </Head>
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
              <Link href={{ pathname: '/game/[gameId]', query: { gameId: game.id } }}>
                <div className='mr-4 hover:text-primary-500'>{game.name}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'Finish Game'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={{ pathname: '/game/[gameId]', query: { gameId: game.id } }}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{'Finish Game'}</div>
            </div>
          </div>
        </div>

        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className={'w-full max-w-xl'}>
            <div className='text-lg'>Game</div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Name'}</div>
              <div>{game.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Description'}</div>
              <div>{game.description}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Normal Game Price'}</div>
              <div>{displayMoney(game.normalGamePrice)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Rubber Game Price'}</div>
              <div>{displayMoney(game.rubberGamePrice)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Ball Price'}</div>
              <div>{displayMoney(game.ballPrice)}</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>{'Game Date'}</div>
              <div>{displayDateTime(game.gameDt)}</div>
            </div>
          </div>
        </div>

        <div className='bg-white mb-4 rounded shadow'>
          <div className={'w-full max-w-xl'}>
            <div className="p-4">
              <div className='text-lg'>Game match</div>
            </div>
            {gamematches.map((data, key) => {
              return (
                <div key={key} className="mb-2 shadow">
                  <button className='w-full flex justify-between rounded items-center px-4 py-2' onClick={() => toggleAccordionGamematch(data.id)}>
                    <div className='text-left flex justify-between items-center'>
                      <div className=''>{data.name}</div>
                    </div>
                    <div className="flex items-center">
                      <div className='flex justify-center items-center h-8 w-8'>
                        <MdOutlineKeyboardArrowRight className={`rotate-0 duration-300 ${accordionGamematch.includes(data.id) && 'rotate-90'}`} size={'1.5em'} />
                      </div>
                    </div>
                  </button>
                  <div className={`duration-300 overflow-hidden ${accordionGamematch.includes(data.id) ? 'max-h-60 ' : 'max-h-0 '}`}>
                    <div className='px-4 pb-4'>
                      <div className="grid grid-cols-5 gap-4 mb-2">
                        <div className="col-span-3">
                          <div className="">
                            {gamematchteamplayers.filter((player) => player.gamematchteamId === data.leftTeamId).map((player, key) => {
                              return (
                                <div key={key} className="flex items-center">{player.playerName}</div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-between">
                          <div className="grid grid-cols-3 gap-4">
                            {gamematchscores.filter((gms) => gms.gamematchId === data.id).map((gms, key) => {
                              return (
                                <div key={key} className="flex items-center">{gms.leftTeamScore}</div>
                              )
                            })}
                          </div>
                          <div className="font-bold flex items-center">{data.leftTeamPoint}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-5 gap-4 mb-2">
                        <div className="col-span-3">
                          <div className="">
                            {gamematchteamplayers.filter((player) => player.gamematchteamId === data.rightTeamId).map((player, key) => {
                              return (
                                <div key={key} className="flex items-center">{player.playerName}</div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-between">
                          <div className="grid grid-cols-3 gap-4">
                            {gamematchscores.filter((gms) => gms.gamematchId === data.id).map((gms, key) => {
                              return (
                                <div key={key} className="flex items-center">{gms.rightTeamScore}</div>
                              )
                            })}
                          </div>
                          <div className="font-bold flex items-center">{data.rightTeamPoint}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className='bg-white mb-4 rounded shadow'>
          <div className={'w-full max-w-xl'}>
            <div className="p-4">
              <div className='text-lg'>Players</div>
            </div>
            {gameplayers.map((data, key) => {
              total = total + (data.normalGame * game.normalGamePrice + data.rubberGame * game.rubberGamePrice + data.ball * game.ballPrice)
              if (data.isPay) {
                totalPaid = totalPaid + (data.normalGame * game.normalGamePrice + data.rubberGame * game.rubberGamePrice + data.ball * game.ballPrice)
              }
              return (
                <div key={key} className="mb-2 shadow">
                  <button className='w-full flex justify-between rounded items-center px-4 py-2' onClick={() => toggleAccordionPlayer(data.id)}>
                    <div className='text-left flex justify-between items-center'>
                      <div className=''>{data.playerName}</div>
                    </div>
                    <div className="flex items-center">
                      {data.isPay ? (
                        <div className="text-xs bg-primary-500 text-gray-50 px-2 py-1 rounded-full">PAID</div>
                      ) : (
                        <div className="text-xs bg-rose-500 text-gray-50 px-2 py-1 rounded-full">UNPAID</div>
                      )}
                      <div className='flex justify-center items-center h-8 w-8'>
                        <MdOutlineKeyboardArrowRight className={`rotate-0 duration-300 ${accordionPlayer.includes(data.id) && 'rotate-90'}`} size={'1.5em'} />
                      </div>
                    </div>
                  </button>
                  <div className={`duration-300 overflow-hidden ${accordionPlayer.includes(data.id) ? 'max-h-60 ' : 'max-h-0 '}`}>
                    <div className='px-4 pb-4'>
                      <div className="text-sm">
                        <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                          <div className="col-span-2">Normal Game</div>
                          <div className="col-span-1 flex justify-between items-center">
                            <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.normalGame}</div>
                            <div className="">{displayMoney(data.normalGame * game.normalGamePrice)}</div>
                          </div>
                        </div>
                        <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                          <div className="col-span-2">Rubber Game</div>
                          <div className="col-span-1 flex justify-between items-center">
                            <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.rubberGame}</div>
                            <div className="">{displayMoney(data.rubberGame * game.rubberGamePrice)}</div>
                          </div>
                        </div>
                        <div className="mb-4 grid grid-cols-3 gap-2 h-6">
                          <div className="col-span-2">Ball</div>
                          <div className="col-span-1 flex justify-between items-center">
                            <div className="bg-gray-300 h-6 w-6 rounded-full flex justify-center items-center mr-4 font-bold shadow">{data.ball}</div>
                            <div className="">{displayMoney(data.ball * game.ballPrice)}</div>
                          </div>
                        </div>
                        <div className="mb-4 flex justify-between items-center h-6">
                          <div>Total</div>
                          <div className="flex justify-between items-center">
                            <div className="font-bold">{displayMoney(data.normalGame * game.normalGamePrice + data.rubberGame * game.rubberGamePrice + data.ball * game.ballPrice)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="text-base">
                    <div>{data.playerName}</div>
                  </div>
                  <div className=" grid grid-cols-4 gap-2 text-sm">
                    <div>{data.normalGame}</div>
                    <div>{data.rubberGame}</div>
                    <div>{data.ball}</div>
                    <div>{displayMoney(game.normalGamePrice * data.normalGame + game.rubberGamePrice * data.rubberGame + game.ballPrice * data.ball)}</div>
                  </div> */}
                </div>
              )
            })}
            <div className="p-4 text-right font-bold">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 text-right">Paid  :</div>
                <div>{displayMoney(totalPaid)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 text-right">Unpaid  :</div>
                <div>{displayMoney(total - totalPaid)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 text-right">Expected Total  :</div>
                <div>{displayMoney(total)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className={'w-full max-w-xl'}>
            <div className='text-lg'>Transaction</div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values)}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <Form>
                    <div className={'w-full max-w-xl'}>
                      <div className="mb-4">
                        <TextField
                          label={'Gor Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Gor Name'}
                          required
                        />
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
        {/* <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
            {JSON.stringify(gameplayers, null, 4)}
          </div>
        </div>

        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
            {JSON.stringify(gamedetail, null, 4)}
          </div>
        </div> */}

      </div>
    </>
  )
}

(Finish as PageWithLayoutType).layout = MainUser;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { gameId } = context.query;
  const gamedetail = await Api.get('/game/' + gameId + '/detail').then(res => res);

  if (gamedetail.status) {
    return {
      props: {
        gamedetail: gamedetail.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Finish;