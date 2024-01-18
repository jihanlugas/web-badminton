import Modal from '@/components/modal/modal';
import { GameView } from '@/types/game';
import { CreateBulkGameplayer } from '@/types/gameplayer';
import { FieldArray, Form, Formik, FormikHelpers, FormikValues } from 'formik';
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

type Props = {
  show: boolean;
  onClickOverlay: Function;
  game: GameView
}

const schema = Yup.object().shape({
  gameId: Yup.string().required('Required field'),
  listPlayerId: Yup.array().of(
    Yup.string()
  ),
});

const ModalAddGameplayer: NextPage<Props> = ({ show, onClickOverlay, game }) => {

  const [player, setPlayer] = useState<PlayerView[]>([])

  const initFormikValue: CreateBulkGameplayer = {
    gameId: game.id,
    listPlayerId: [],
  }

  const [pageRequestPlayer, setPageRequestPlayer] = useState<PagePlayer>({
    limit: 1000,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: game.companyId,
    name: '',
    address: '',
    createName: '',
    email: '',
    gender: '',
    noHp: '',
    gameId: game.id,
  });

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/gameplayer/bulk', val));

  const { isLoading: isLoadingPlayer, data: dataPlayer, refetch: refetchPlayer } = useQuery(['player', pageRequestPlayer], ({ queryKey }) => Api.get('/player/page', queryKey[1]), {});

  const handleSubmit = (values: FormikValues, formikHelpers: FormikHelpers<CreateBulkGameplayer>) => {
    if (values.listPlayerId.length === 0) {
      notif.error('Please select player');
      return
    }
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            formikHelpers.resetForm()
            refetchPlayer()
            onClickOverlay(true)
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
    if (dataPlayer && dataPlayer.status) {
      setPlayer(dataPlayer.payload.list);
    }
  }, [dataPlayer]);

  useEffect(() => {
    if (show) {
      refetchPlayer()
    }
  }, [show]);


  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Add Game Player
          </div>
          <div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, formikHelpers) => handleSubmit(values, formikHelpers)}
            >
              {({ values, errors, touched, setValues, setFieldValue }) => {
                return (
                  <Form encType='multipart/form-data'>
                    {isLoadingPlayer ? (
                      <>
                        <div className='flex justify-center items-center h-40'>
                          <AiOutlineLoading3Quarters className={'animate-spin'} size={'3.5em'} />
                        </div>
                      </>
                    ) : (
                      <>
                        <FieldArray
                          name={'listPlayerId'}
                          render={arrayHelpers => (
                            <>
                              <div className='mb-4'>
                                <div className='mb-4'>List Player</div>
                                {show && player.length > 0 ? (
                                  <>
                                    <div className='max-h-[36rem] overflow-y-scroll mb-4'>
                                      <div className='grid grid-cols-2 gap-2'>
                                        {player.map((player, key) => (
                                          <div key={key} className=''>
                                            <CheckboxField
                                              name={`listPlayerId`}
                                              label={player.name}
                                              value={player.id}
                                              showError={false}
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className='flex justify-center items-center h-40'>
                                      <div>No data player</div>
                                    </div>
                                  </>
                                )}
                                {/* {touched.listPlayerId && errors.listPlayerId && (
                                  <div className='text-rose-500'>{errors.listPlayerId}</div>
                                )} */}
                              </div>
                            </>
                          )}
                        />
                      </>
                    )}
                    <div className='flex'>
                      <div className={'w-full'}>
                        <ButtonSubmit
                          label={'Add'}
                          disabled={isLoadingPlayer || isLoading}
                          loading={isLoadingPlayer || isLoading}
                        />
                      </div>
                    </div>
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div>
                    <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(errors, null, 4)}
                    </div> */}
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

export default ModalAddGameplayer;