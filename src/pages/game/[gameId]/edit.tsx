import ButtonSubmit from "@/components/formik/button-submit";
import DateField from "@/components/formik/date-field";
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import { Company } from "@/types/company";
import { ListData } from "@/types/data";
import { Game, GameUpdate } from "@/types/game"
import PageWithLayoutType from "@/types/layout";
import { PageRequest } from "@/types/pagination";
import { useDebounce } from "@/utils/hook";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikValues } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next/types";
import { useEffect, useState } from "react";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import * as Yup from 'yup';

type Props = {
  game: Game
}

type FilterPropsGor = {
  companyId: string
  name: string
}

const schema = Yup.object().shape({
  companyId: Yup.string().required("Required field"),
  gorId: Yup.string().required("Required field"),
  name: Yup.string().required("Required field"),
  description: Yup.string(),
  normalGamePrice: Yup.number(),
  rubberGamePrice: Yup.number(),
  ballPrice: Yup.number(),
  gameDt: Yup.date().required("Required field"),
  isFinish: Yup.boolean(),
});


const Edit: NextPage<Props> = ({ game }) => {
  const router = useRouter();

  const company: Company = JSON.parse(localStorage.getItem('company'));

  const initFormikValue: GameUpdate = {
    companyId:game.companyId,
    gorId:game.gorId,
    name:game.name,
    description:game.description,
    normalGamePrice:game.normalGamePrice,
    rubberGamePrice:game.rubberGamePrice,
    ballPrice:game.ballPrice,
    gameDt:game.gameDt,
    isFinish:game.isFinish,
  };

  const [searchGor, setSearchGor] = useState<string>('');
  const debounceSearchGor = useDebounce(searchGor, 300)
  const [listDataGor, setListDataGor] = useState<ListData[]>([]);

  const [pageRequestGor, setPageRequestGor] = useState<PageRequest & FilterPropsGor>({
    limit: 1000,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: company.id,
    name: '',
  });

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.put('/game/' + game.id, val));

  const { isLoading: isLoadingGor, data: dataGor, refetch: refetchGor } = useQuery(['gor', pageRequestGor], ({ queryKey }) => Api.get('/gor/page', queryKey[1]), {});
  useEffect(() => {
    setPageRequestGor({ ...pageRequestGor, name: debounceSearchGor })
  }, [debounceSearchGor])

  const handleChangeGor = (e, setFieldValue) => {
    if (e) {
      const selected = dataGor.payload.list.find((data) => data.id === e.value)
      setFieldValue('gorId', selected ? selected.id : '')
      setFieldValue('normalGamePrice', selected ? selected.normalGamePrice : 0)
      setFieldValue('rubberGamePrice', selected ? selected.rubberGamePrice : 0)
      setFieldValue('ballPrice', selected ? selected.ballPrice : 0)
    } else {
      setFieldValue('gorId', '')
      setFieldValue('normalGamePrice', 0)
      setFieldValue('rubberGamePrice', 0)
      setFieldValue('ballPrice', 0)
    }
  }

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push({ pathname: '/game'});
          } else if (!res.success) {
            if (res.payload && res.payload.listError) {
              setErrors(res.payload.listError);
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
  };

  useEffect(() => {
    if (dataGor?.status) {
      const newArrayOfObj = dataGor.payload.list.map(data => {
        return {
          label: data.name,
          value: data.id
        }
      })
      setListDataGor(newArrayOfObj)
    }
  }, [dataGor])

  return (
    <>
      <Head>
        <title>{'Game - ' + game.name}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
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
              <div className='mr-4'>{'Edit'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/game'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{'Edit'}</div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Edit Game</div>
          </div>
          <div className='mb-4'>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {({ values, errors, setFieldValue }) => {
                return (
                  <Form>
                    <div className={'w-full max-w-xl'}>
                      <div className="mb-4">
                        <TextField
                          label={'Game Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Game Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Game Description'}
                          name={'description'}
                          type={'text'}
                          placeholder={'Game Description'}
                        />
                      </div>
                      <div className="mb-4">
                        <DateField
                          label={'Game Date'}
                          name={'gameDt'}
                          dateFormat={'dddd DD MMM YYYY'}
                          timeFormat={'HH:mm'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <SearchDropdownField
                          label={'Gor'}
                          name={'gorId'}
                          options={listDataGor}
                          onInputChange={search => { setSearchGor(search) }}
                          onChange={e => handleChangeGor(e, setFieldValue)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Normal Game Price'}
                          name={'normalGamePrice'}
                          type={'number'}
                          placeholder={'Normal Game Price'}
                          disabled={true}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Rubber Game Price'}
                          name={'rubberGamePrice'}
                          type={'number'}
                          placeholder={'Rubber Game Price'}
                          disabled={true}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Ball Price'}
                          name={'ballPrice'}
                          type={'number'}
                          placeholder={'Ball Price'}
                          disabled={true}
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Create'}
                          disabled={isLoading}
                          loading={isLoading}
                        />
                      </div>
                      <div className="mb-4">
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}




(Edit as PageWithLayoutType).layout = MainUser;

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

export default Edit;