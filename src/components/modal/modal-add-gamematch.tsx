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
import { useEffect, useState } from 'react';
import { Api } from '@/lib/api';
import CheckboxField from '@/components/formik/checkbox-field';
import notif from "@/utils/notif";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CreateGamematch } from '@/types/gamematch';
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import { useDebounce } from '@/utils/hook';
import { ListData } from '@/types/data';


type Props = {
  show: boolean;
  onClickOverlay: Function;
  game: GameView
}

const schema = Yup.object().shape({
  companyId: Yup.string().required('Required field'),
  gameId: Yup.string().required('Required field'),
  matchName: Yup.string().required('Required field'),
  leftPoint: Yup.number().min(0).required('Required field'),
  rightPoint: Yup.number().min(0).required('Required field'),
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
      leftScore: Yup.number().min(0).required('Required field'),
      rightScore: Yup.number().min(0).required('Required field'),
    })
  ),
  ball: Yup.number().min(0),
});

const ModalAddGamematch: NextPage<Props> = ({ show, onClickOverlay, game }) => {

  const [searchPlayer, setSearchPlayer] = useState<string>('');
  const debounceSearchPlayer = useDebounce(searchPlayer, 300)
  const [listDataPlayer, setListDataPlayer] = useState<ListData[]>([]);

  const [selected, setSelected] = useState<boolean>(false)

  const initFormikValue: CreateGamematch = {
    companyId: game.companyId,
    gameId: game.id,
    matchName: game.name + ' Match',
    leftPoint: 0,
    rightPoint: 0,
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
        leftScore: 0,
        rightScore: 0,
      },
      {
        leftScore: 0,
        rightScore: 0,
      },
    ],
    ball: 0,
  }

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

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/gameplayermatch', val));

  const { isLoading: isLoadingGameplayer, data: dataGameplayer, refetch: refetchGameplayer } = useQuery(['gameplayer', pageRequestGameplayer], ({ queryKey }) => Api.get('/gameplayer/page', queryKey[1]), {});

  const handleSubmit = (values: FormikValues, formikHelpers: FormikHelpers<CreateGamematch>) => {
    console.log('values ', values)
    // mutateSubmit(values, {
    //   onSuccess: (res) => {
    //     if (res) {
    //       if (res.status) {
    //         notif.success(res.message);
    //         formikHelpers.resetForm()
    //         onClickOverlay(true)
    //       } else if (!res.success) {
    //         if (res.payload && res.payload.listError) {
    //           notif.error(res.message);
    //         } else {
    //           notif.error(res.message);
    //         }
    //       }
    //     }
    //   },
    //   onError: (res) => {
    //     notif.error('Please cek you connection');
    //   },
    // });
  }

  useEffect(() => {
    if (dataGameplayer?.status) {
      const newArrayOfObj = dataGameplayer.payload.list.map(data => {
        return {
          label: data.playerName,
          value: data.id
        }
      })
      setListDataPlayer(newArrayOfObj)
    }
  }, [dataGameplayer])

  useEffect(() => {
    if (show) {
      refetchGameplayer()
    }
  }, [show]);

  const handleChangePlayer = (e, fieldName, setFieldValue) => {
    setFieldValue(fieldName, e ? e.value : '')
  }

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

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Add Game Match
          </div>
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
                    <div className='max-h-[44rem] overflow-y-scroll mb-4'>
                      <div className="mb-4">
                        <TextField
                          label={'Match Name'}
                          name={'matchName'}
                          type={'text'}
                          placeholder={'Match Name'}
                          required
                        />
                      </div>
                      <div className='mb-4 '>
                        <div className='w-full grid grid-cols-2 gap-2'>
                          <button className='w-full h-8 rounded-lg bg-primary-200 hover:bg-primary-300 disabled:bg-primary-400' disabled={!selected} type='button' onClick={() => setSelected(!selected)}>
                            <div>{values.gameMatchTeams[0].name}</div>
                          </button>
                          <button className='w-full h-8 rounded-lg bg-primary-200 hover:bg-primary-300 disabled:bg-primary-400' disabled={selected} type='button' onClick={() => setSelected(!selected)}>
                            <div>{values.gameMatchTeams[1].name}</div>
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
                              required
                            />
                          </div>
                          <div className="mb-4">
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
                          </div>
                        </div>
                        <div className={`${selected ? 'block' : 'hidden'}`}>
                          <div className='mb-4'>
                            <TextField
                              label={'Team Name'}
                              name={'gameMatchTeams[1].name'}
                              type={'text'}
                              placeholder={'Team Name'}
                              required
                            />
                          </div>
                          <div className="mb-4">
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
                                    label={"Rubber"}
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
                                          type={'number'}
                                          placeholder={'Score'}
                                          required
                                        />
                                        <TextField
                                          label={values.gameMatchTeams[1].name}
                                          name={`gameMatchScores[${key}].rightScore`}
                                          type={'number'}
                                          placeholder={'Score'}
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
                      <div className='mb-4'>
                        <div className='grid grid-cols-2 gap-2'>
                          <TextField
                            label={'Point ' + values.gameMatchTeams[0].name}
                            name={'leftPoint'}
                            type={'number'}
                            placeholder={'Point'}
                            required
                          />
                          <TextField
                            label={'Point ' + values.gameMatchTeams[1].name}
                            name={'rightPoint'}
                            type={'number'}
                            placeholder={'Point'}
                            required
                          />
                        </div>
                      </div>
                      <div className='mb-4'>
                        <TextField
                          label={'Total Ball'}
                          name={'ball'}
                          type={'number'}
                          placeholder={'Ball'}
                          required
                        />
                      </div>
                    </div>
                    <div className=''>
                      <ButtonSubmit
                        label={'Create'}
                        disabled={isLoading}
                        loading={isLoading}
                      />
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ModalAddGamematch;