import Modal from '@/components/modal/modal';
import { GameView } from '@/types/game';
import { CreateBulkGameplayer, PageGameplayer } from '@/types/gameplayer';
import { ArrayHelpers, FieldArray, Form, Formik, FormikHelpers, FormikValues } from 'formik';
import { NextPage } from 'next';
import * as Yup from 'yup';
import TextField from '@/components/formik/text-field';
import ButtonSubmit from '@/components/formik/button-submit';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PagePlayer, PlayerView } from '@/types/player';
import { FormEvent, useEffect, useState } from 'react';
import { Api } from '@/lib/api';
import CheckboxField from '@/components/formik/checkbox-field';
import notif from "@/utils/notif";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CreateMatchPointGamematch, PageGamematch } from '@/types/gamematch';
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import { useDebounce } from '@/utils/hook';
import { ListData } from '@/types/data';
import { PageInfo } from '@/types/pagination';
import DropdownField from '../formik/dropdown-field';


type Props = {
  show: boolean;
  onClickOverlay: Function;
  game: GameView
}

const schema = Yup.object().shape({
  companyId: Yup.string().required('Required field'),
  gameId: Yup.string().required('Required field'),
  matchName: Yup.string(),
  leftPoint: Yup.number().typeError("Must be a number").required('Required field'),
  rightPoint: Yup.number().typeError("Must be a number").required('Required field'),
  gameMatchTeams: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Required field'),
      gameMatchTeamPlayers: Yup.array().of(
        Yup.object().shape({
          playerId: Yup.string().required('Required field'),
        }),
      ),
    }),
  ).min(2, "Please add minimal 2 team"),
  gameMatchScores: Yup.array().of(
    Yup.object().shape({
      leftScore: Yup.number().typeError("Must be a number").min(0).required('Required field'),
      rightScore: Yup.number().typeError("Must be a number").min(0).required('Required field'),
    })
  ),
  ball: Yup.number().typeError("Must be a number").min(0).required('Required field'),
});

const ModalAddGamematchMatchPoint: NextPage<Props> = ({ show, onClickOverlay, game }) => {

  const [searchPlayer, setSearchPlayer] = useState<string>('');
  const debounceSearchPlayer = useDebounce(searchPlayer, 300)
  const [listDataPlayer, setListDataPlayer] = useState<ListData[]>([]);

  const [selected, setSelected] = useState<boolean>(false)

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

  const [pageRequestGamematch, setPageRequestGamematch] = useState<PageGamematch>({
    limit: 1,
    page: 1,
    sortField: 'create_dt',
    sortOrder: 'asc',
    companyId: game.companyId,
    gameId: game.id,
    name: '',
  });

  const [pageGamematchInfo, setPageGamematchInfo] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/gamematch/match-point', val));

  const { isLoading: isLoadingGameplayer, data: dataGameplayer, refetch: refetchGameplayer } = useQuery(['gameplayer', pageRequestGameplayer], ({ queryKey }) => Api.get('/gameplayer/page', queryKey[1]), {});
  const { isLoading: isLoadingGamematch, data: dataGamematch, refetch: refetchGamematch } = useQuery(['gamematch', pageRequestGamematch], ({ queryKey }) => Api.get('/gamematch/page', queryKey[1]), {});

  const handleSubmit = (values: FormikValues, formikHelpers: FormikHelpers<CreateMatchPointGamematch>) => {
    values.matchName = 'Match ' + (pageGamematchInfo.totalData + 1)

    values.leftPoint = Number(values.leftPoint)
    values.rightPoint = Number(values.rightPoint)
    values.ball = Number(values.ball)
    values.gameMatchScores[0].leftScore = Number(values.gameMatchScores[0].leftScore)
    values.gameMatchScores[1].leftScore = Number(values.gameMatchScores[1].leftScore)
    values.gameMatchScores[0].rightScore = Number(values.gameMatchScores[0].rightScore)
    values.gameMatchScores[1].rightScore = Number(values.gameMatchScores[1].rightScore)
    if (values.isRubber) {
      values.gameMatchScores[2].leftScore = Number(values.gameMatchScores[2].leftScore)
      values.gameMatchScores[2].rightScore = Number(values.gameMatchScores[2].rightScore)
    }

    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            formikHelpers.resetForm()
            onClickOverlay(true)
            setSelected(false)
          } else if (!res.success) {
            if (res.payload && res.payload.listError) {
              notif.error(res.message);
            } else {
              notif.error(res.message);
            }
          }
        }
      },
      onError: (res) => {
        notif.error('Please cek you connection');
      },
    });
  }

  useEffect(() => {
    if (dataGameplayer?.status) {
      const newArrayOfObj = dataGameplayer.payload.list.map(data => {
        return {
          label: data.playerName,
          value: data.playerId
        }
      })
      setListDataPlayer(newArrayOfObj)
    }
  }, [dataGameplayer])

  useEffect(() => {
    if (dataGamematch && dataGamematch.status) {
      setPageGamematchInfo({
        pageCount: dataGamematch.payload.totalPage,
        pageSize: dataGamematch.payload.dataPerPage,
        totalData: dataGamematch.payload.totalData,
        page: dataGamematch.payload.page,
      });
    }
  }, [dataGamematch]);

  useEffect(() => {
    if (show) {
      refetchGameplayer()
      refetchGamematch()
    }
  }, [show]);

  // const handleChangePlayer = (e, fieldName, setFieldValue) => {
  //   console.log('e ', e)
  //   setFieldValue(fieldName, e ? e.value : '')
  // }

  const handleCheckRubber = (e, setFieldValue, arrayHelpers: ArrayHelpers) => {
    setFieldValue('isRubber', e.target.checked)
    if (e.target.checked) {
      arrayHelpers.push({
        leftScore: 0,
        rightScore: 0,
      })
    } else {
      arrayHelpers.pop()
    }
  }

  useEffect(() => {
    setPageRequestGameplayer({ ...pageRequestGameplayer, playerName: debounceSearchPlayer })
  }, [debounceSearchPlayer])

  const initFormikValue: CreateMatchPointGamematch = {
    companyId: game.companyId,
    gameId: game.id,
    matchName: '',
    leftPoint: '',
    rightPoint: '',
    isRubber: false,
    gameMatchTeams: [
      {
        name: 'Team A',
        gameMatchTeamPlayers: [
          {
            playerId: '',
          },
          {
            playerId: '',
          },
        ],
      },
      {
        name: 'Team B',
        gameMatchTeamPlayers: [
          {
            playerId: '',
          },
          {
            playerId: '',
          },
        ],
      },
    ],
    gameMatchScores: [
      {
        leftScore: '',
        rightScore: '',
      },
      {
        leftScore: '',
        rightScore: '',
      },
    ],
    ball: 1,
  }

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Add Game Match
          </div>
          {show && (
            <div className=''>
              <Formik
                initialValues={initFormikValue}
                validationSchema={schema}
                enableReinitialize={true}
                onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
              >
                {({ values, errors, touched, setValues, setFieldValue }) => {
                  return (
                    <Form encType='multipart/form-data'>
                      <div className='max-h-[36rem] overflow-y-scroll mb-4'>
                        <div className='mb-4 pt-4'>
                          <div className='w-full grid grid-cols-2 gap-2'>
                            <button className='w-full h-12 border-2 rounded font-bold text-gray-600 border-primary-400 disabled:bg-primary-400 disabled:text-gray-50 relative' disabled={!selected} type='button' onClick={() => setSelected(!selected)}>
                              <div>{values.gameMatchTeams[0].name}</div>
                              {errors?.gameMatchTeams?.[0] && (<div className='bg-red-500 h-2 w-2 rounded-full absolute top-1 right-1'></div>)}
                            </button>
                            <button className='w-full h-12 border-2 rounded font-bold text-gray-600 border-primary-400 disabled:bg-primary-400 disabled:text-gray-50 relative' disabled={selected} type='button' onClick={() => setSelected(!selected)}>
                              <div>{values.gameMatchTeams[1].name}</div>
                              {errors?.gameMatchTeams?.[1] && (<div className='bg-red-500 h-2 w-2 rounded-full absolute top-1 right-1'></div>)}
                            </button>
                          </div>
                        </div>
                        <div className='mb-4'>
                          <div className={`${selected ? 'hidden' : 'block'}`}>
                            <div className='mb-4'>
                              <TextField
                                label={'Team Name'}
                                name={'gameMatchTeams[0].name'}
                                type={'text'}
                                placeholder={'Team Name'}
                                disabled
                                required
                              />
                            </div>
                            {/* <div className="mb-4">
                              <SearchDropdownField
                                label={'Player 1'}
                                name={'gameMatchTeams[0].gameMatchTeamPlayers[0].playerId'}
                                options={listDataPlayer}
                                onInputChange={search => { setSearchPlayer(search) }}
                                onChange={e => handleChangePlayer(e, 'gameMatchTeams[0].gameMatchTeamPlayers[0].playerId', setFieldValue)}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <SearchDropdownField
                                label={'Player 2'}
                                name={'gameMatchTeams[0].gameMatchTeamPlayers[1].playerId'}
                                options={listDataPlayer}
                                onInputChange={search => { setSearchPlayer(search) }}
                                onChange={e => handleChangePlayer(e, 'gameMatchTeams[0].gameMatchTeamPlayers[1].playerId', setFieldValue)}
                                required
                              />
                            </div> */}
                            <div className="mb-4">
                              <DropdownField
                                label={'Player 1'}
                                name={'gameMatchTeams[0].gameMatchTeamPlayers[0].playerId'}
                                placeholder="Select Player"
                                placeholderValue={''}
                                items={listDataPlayer}
                                // onChange={e => handleChangePlayer(e, 'gameMatchTeams[0].gameMatchTeamPlayers[0].playerId', setFieldValue)}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <DropdownField
                                label={'Player 2'}
                                name={'gameMatchTeams[0].gameMatchTeamPlayers[1].playerId'}
                                placeholder="Select Player"
                                placeholderValue={''}
                                items={listDataPlayer}
                                // onChange={e => handleChangePlayer(e, 'gameMatchTeams[0].gameMatchTeamPlayers[1].playerId', setFieldValue)}
                                required
                              />
                            </div>
                          </div>
                          <div className={`${selected ? 'block' : 'hidden'}`}>
                            <div className='mb-4'>
                              <TextField
                                label={'Team Name'}
                                name={'gameMatchTeams[1].name'}
                                type={'text'}
                                placeholder={'Team Name'}
                                disabled
                                required
                              />
                            </div>
                            {/* <div className="mb-4">
                              <SearchDropdownField
                                label={'Player 1'}
                                name={'gameMatchTeams[1].gameMatchTeamPlayers[0].playerId'}
                                options={listDataPlayer}
                                onInputChange={search => { setSearchPlayer(search) }}
                                onChange={e => handleChangePlayer(e, 'gameMatchTeams[1].gameMatchTeamPlayers[0].playerId', setFieldValue)}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <SearchDropdownField
                                label={'Player 2'}
                                name={'gameMatchTeams[1].gameMatchTeamPlayers[1].playerId'}
                                options={listDataPlayer}
                                onInputChange={search => { setSearchPlayer(search) }}
                                onChange={e => handleChangePlayer(e, 'gameMatchTeams[1].gameMatchTeamPlayers[1].playerId', setFieldValue)}
                                required
                              />
                            </div> */}

                            <div className="mb-4">
                              <DropdownField
                                label={'Player 1'}
                                name={'gameMatchTeams[1].gameMatchTeamPlayers[0].playerId'}
                                placeholder="Select Player"
                                placeholderValue={''}
                                items={listDataPlayer}
                                // onChange={e => handleChangePlayer(e, 'gameMatchTeams[1].gameMatchTeamPlayers[0].playerId', setFieldValue)}
                                required
                              />
                            </div>
                            <div className="mb-4">
                              <DropdownField
                                label={'Player 2'}
                                name={'gameMatchTeams[1].gameMatchTeamPlayers[1].playerId'}
                                placeholder="Select Player"
                                placeholderValue={''}
                                items={listDataPlayer}
                                // onChange={e => handleChangePlayer(e, 'gameMatchTeams[1].gameMatchTeamPlayers[1].playerId', setFieldValue)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className='mb-4'>
                          <div className='text-lg'>Score</div>
                          <FieldArray
                            name={'gameMatchScores'}
                            render={arrayHelpers => (
                              <>
                                <div className='mb-4'>
                                  <div className=''>
                                    <CheckboxField
                                      name={`isRubber`}
                                      label={"Rubber Game"}
                                      onChange={(e) => handleCheckRubber(e, setFieldValue, arrayHelpers)}
                                    />
                                  </div>
                                  {values.gameMatchScores.map((item, key) => {
                                    return (
                                      <div key={key} className='mb-4'>
                                        <div>{'Set ' + (key + 1)}</div>
                                        <div className='grid grid-cols-2 gap-2'>
                                          <TextField
                                            label={values.gameMatchTeams[0].name}
                                            name={`gameMatchScores[${key}].leftScore`}
                                            type={'text'}
                                            placeholder={'Score'}
                                            inputMode='numeric'
                                            required
                                          />
                                          <TextField
                                            label={values.gameMatchTeams[1].name}
                                            name={`gameMatchScores[${key}].rightScore`}
                                            type={'text'}
                                            placeholder={'Score'}
                                            inputMode='numeric'
                                            required
                                          />
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </>
                            )}
                          />
                        </div>
                        <div className=''>
                          <div className='text-lg'>Point</div>
                        </div>
                        <div className='mb-4'>
                          <div className='grid grid-cols-2 gap-2'>
                            <TextField
                              label={'Point ' + values.gameMatchTeams[0].name}
                              name={'leftPoint'}
                              type={'text'}
                              inputMode='numeric'
                              placeholder={'Point'}
                              required
                            />
                            <TextField
                              label={'Point ' + values.gameMatchTeams[1].name}
                              name={'rightPoint'}
                              type={'text'}
                              inputMode='numeric'
                              placeholder={'Point'}
                              required
                            />
                          </div>
                        </div>
                        <div className='mb-4'>
                          <TextField
                            label={'Total Ball'}
                            name={'ball'}
                            type={'text'}
                            inputMode='numeric'
                            placeholder={'Ball'}
                            required
                          />
                        </div>
                      </div>
                      <div className=''>
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isLoading}
                          loading={isLoading}
                        />
                      </div>
                      {/* <div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                      </div> */}
                    </Form>
                  );
                }}
              </Formik>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default ModalAddGamematchMatchPoint;