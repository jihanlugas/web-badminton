import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import notif from "@/utils/notif";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Formik, FormikValues } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps, NextPage } from "next/types";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import * as Yup from 'yup';
import TextField from '@/components/formik/text-field';
import TextAreaField from '@/components/formik/text-area-field';
import ButtonSubmit from '@/components/formik/button-submit';
import DateField from "@/components/formik/date-field";
import DateFieldNew from "@/components/formik/date-field-new";
import PasswordField from "@/components/formik/password-field";
import DropdownField from "@/components/formik/dropdown-field";
import { GENDER } from "@/utils/constant";
import CheckboxField from "@/components/formik/checkbox-field";
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import { useEffect, useRef, useState } from "react";
import { ListData } from "@/types/data";
import { useDebounce } from "@/utils/hook";
import { CompanyView } from "@/types/company";
import { PageGor } from "@/types/gor";
import { CreateGame } from "@/types/game";

type Props = {
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

const New: NextPage<Props> = () => {
  const router = useRouter();

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));

  const [searchGor, setSearchGor] = useState<string>('');
  const debounceSearchGor = useDebounce(searchGor, 300)
  const [listDataGor, setListDataGor] = useState<ListData[]>([]);

  const [pageRequestGor, setPageRequestGor] = useState<PageGor>({
    limit: 100,
    page: 1,
    sortField: null,
    sortOrder: null,
    companyId: company.id,
    name: '',
    createName: '',
    description: '',
    address: '',
  });

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/game', val));

  const { isLoading: isLoadingGor, data: dataGor, refetch: refetchGor } = useQuery(['gor', pageRequestGor], ({ queryKey }) => Api.get('/gor/page', queryKey[1]), {});

  const initFormikValue: CreateGame = {
    companyId: company.id,
    gorId: '',
    name: '',
    description: '',
    normalGamePrice: 0,
    rubberGamePrice: 0,
    ballPrice: 0,
    gameDt: new Date(new Date().setHours(20, 0, 0, 0)),
  };

  useEffect(() => {
    setPageRequestGor({ ...pageRequestGor, name: debounceSearchGor })
  }, [debounceSearchGor])

  const handleChangeGor = (e, setFieldValue) => {
    if (e) {
      const selected = dataGor.payload.list.find((data) => data.id === e.target.value)
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
            router.push({ pathname: '/game' });
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
        <title>{process.env.APP_NAME + ' - Game New'}</title>
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
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/game'}>
                <div className='mr-4 hover:text-primary-500'>
                  <BsChevronLeft className={''} size={'1.2rem'} />
                </div>
              </Link>
              <div className='mr-4'>{'New'}</div>
            </div>
          </div>
        </div>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='mb-4'>
            <div className='text-xl'>Create Game</div>
          </div>
          <div className='mb-4'>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {({ values, errors, touched, setFieldValue }) => {
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
                      {/* <div className="mb-4">
                        <DateFieldNew
                          label={'Game Date'}
                          name={'gameDt'}
                          placeholder="dd-mm-yyyy"
                          required
                        />
                      </div> */}
                      {/* <div className="mb-4">
                        <SearchDropdownField
                          label={'Gor'}
                          name={'gorId'}
                          options={listDataGor}
                          onInputChange={search => { setSearchGor(search) }}
                          onChange={e => handleChangeGor(e, setFieldValue)}
                          required
                        />
                      </div> */}
                      <div className="mb-4">
                        <DropdownField
                          label={'Gor'}
                          name={'gorId'}
                          placeholder="Select Gor"
                          placeholderValue={''}
                          items={listDataGor}
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
                      {/* <div className="mb-4">
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(values, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(errors, null, 4)}
                        </div>
                        <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                          {JSON.stringify(touched, null, 4)}
                        </div>
                      </div> */}
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </>
  )
}


(New as PageWithLayoutType).layout = MainUser;

export default New;