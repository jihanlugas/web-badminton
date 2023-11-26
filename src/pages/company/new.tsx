import MainAuth from '@/components/layout/main-auth';
import { Api } from '@/lib/api';
import { CompanyCreate } from '@/types/company';
import PageWithLayoutType from '@/types/layout';
import { useMutation } from '@tanstack/react-query';
import { Form, Formik, FormikValues } from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import * as Yup from 'yup';
import notif from '@/utils/notif';
import TextField from '@/components/formik/text-field';
import TextAreaField from '@/components/formik/text-area-field';
import ButtonSubmit from '@/components/formik/button-submit';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'


type Props = {
}

const schema = Yup.object().shape({
  fullname: Yup.string().required("Required field"),
  email: Yup.string().email().required("Required field"),
  noHp: Yup.string().required("Required field"),
  username: Yup.string().min(6).required("Required field"),
  passwd: Yup.string().min(6).required("Required field"),
  name: Yup.string().required("Required field"),
  description: Yup.string().label('description'),
  balance: Yup.number().required("Required field"),
});

const New: NextPage<Props> = () => {
  const router = useRouter();

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/company', val));

  const initFormikValue: CompanyCreate = {
    fullname: '',
    email: '',
    noHp: '',
    username: '',
    passwd: '',
    name: '',
    description: '',
    balance: 0,
  };

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push('/company');
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

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Company New'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/company'}>
                <div className='mr-4 hover:text-primary-500'>{'Company'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/company'}>
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
            <div className='text-xl'>Create Company</div>
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
                          label={'Fullname'}
                          name={'fullname'}
                          type={'text'}
                          placeholder={'Fullname'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'text'}
                          placeholder={'Email'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'No. Handphone'}
                          name={'noHp'}
                          type={'text'}
                          placeholder={'No. Handphone'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'username'}
                          name={'username'}
                          type={'text'}
                          placeholder={'username'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'User Password'}
                          name={'passwd'}
                          type={'password'}
                          placeholder={'User Password'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Company Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Company Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Company Description'}
                          name={'description'}
                          type={'text'}
                          placeholder={'Company Description'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Balance'}
                          name={'balance'}
                          type={'number'}
                          placeholder={'Balance'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Create'}
                          disabled={isLoading}
                          loading={isLoading}
                        />
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
  )
}



(New as PageWithLayoutType).layout = MainAuth;

export default New;