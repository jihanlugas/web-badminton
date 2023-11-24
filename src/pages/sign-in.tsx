import { useContext, useEffect, useRef } from 'react';
import ButtonSubmit from '@/components/formik/button-submit';
import TextField from '@/components/formik/text-field';
import PasswordField from '@/components/formik/password-field';
import { Form, Formik, FormikValues } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { Api } from '@/lib/api';
import notif from '@/utils/notif';
import PageWithLayoutType from '@/types/layout';
import Main from '@/components/layout/main';

type Props = {

}

let schema = Yup.object().shape({
  username: Yup.string().required("Required field"),
  passwd: Yup.string().required("Required field"),
});

const SingIn: NextPage<Props> = () => {

  const router = useRouter();

  const initFormikValue = {
    username: '',
    passwd: '',
  };

  const { data, mutate, isLoading } = useMutation((val: FormikValues) => Api.post('/sign-in', val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutate(values, {
      onSuccess: (res: any) => {
        if (res) {
          if (res.status) {
            localStorage.setItem('token', res.payload.token)
            if (router.query.redirect) {
              router.push(router.query.redirect as string);
            } else {
              router.push('/');
            }
          } else {
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
      }
    });
  };


  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Login'}</title>
        <meta name="theme-color" content={'#FAF5FF'} />
      </Head>
      <div className={'h-screen w-screen flex justify-center items-center'}>
        <div className={'px-4 w-full max-w-md'}>
          <div className={'w-full bg-white rounded-lg shadow p-4 mb-2'}>
            <div className={'flex justify-center mb-4'}>
              <span className={'text-xl'}>{'Login ' + process.env.APP_NAME}</span>
            </div>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {() => {
                return (
                  <Form>
                    <div className={''}>
                      <div className="mb-4">
                        <TextField
                          label={'Username Atau Email'}
                          name={'username'}
                          type={'text'}
                          placeholder={'Username Atau Email'}
                          autoFocus
                        />
                      </div>
                      <div className="mb-4">
                        <PasswordField
                          label={'Password'}
                          name={'passwd'}
                          placeholder={'Password'}
                        />
                      </div>
                      <div className={''}>
                        <ButtonSubmit
                          label={'Login'}
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
          {/* <div className={'flex'}>
            <div className={'mr-1'}>
              {'Don\'t have an account yet?'}
            </div>
            <Link href={'/sign-up'} passHref>
              <a className={'text-primary-500'}>
                <div>Register Now</div>
              </a>
            </Link>
          </div> */}
        </div>
      </div>

    </>
  );
};

(SingIn as PageWithLayoutType).layout = Main;

export default SingIn;