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

const Finish: NextPage<Props> = ({ game }) => {

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

        <div className='bg-white rounded shadow'>
          <div className={'w-full max-w-xl'}>
            <div className='p-4'>
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
            <div>
              <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                {JSON.stringify(game, null, 4)}
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

(Finish as PageWithLayoutType).layout = MainUser;

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

export default Finish;