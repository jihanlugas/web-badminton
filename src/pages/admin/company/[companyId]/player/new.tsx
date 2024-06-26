import MainAdmin from "@/components/layout/main-admin";
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import notif from "@/utils/notif";
import { useMutation } from "@tanstack/react-query";
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
import DropdownField from "@/components/formik/dropdown-field";
import { GENDER } from "@/utils/constant";
import CheckboxField from "@/components/formik/checkbox-field";
import { CreatePlayer } from "@/types/player";
import { CompanyView } from "@/types/company";

type Props = {
  company: CompanyView
}

const schema = Yup.object().shape({
  companyId: Yup.string().label('name').required("Required field"),
  name: Yup.string().label('name').required("Required field"),
  email: Yup.string().email().label('email'),
  noHp: Yup.string().label('no hp'),
  address: Yup.string().label('address'),
  gender: Yup.string().label('gender'),
  isActive: Yup.boolean().label('active'),
});

const New: NextPage<Props> = ({ company }) => {
  const router = useRouter();

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/player', val));

  const initFormikValue: CreatePlayer = {
    companyId: company.id,
    name: '',
    email: '',
    noHp: '',
    address: '',
    gender: '',
    isActive: true,
  };

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push({ pathname: '/admin/company/[companyId]', query: { companyId: company.id } });
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
        <title>{process.env.APP_NAME + ' - Player New'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/admin/company'}>
                <div className='mr-4 hover:text-primary-500'>{'Company'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <Link href={{ pathname: '/admin/company/[companyId]', query: { companyId: company.id } }}>
                <div className='mr-4 hover:text-primary-500'>{company.name}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={{ pathname: '/admin/company/[companyId]', query: { companyId: company.id } }}>
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
            <div className='text-xl'>Create Player</div>
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
                          label={'Player Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Player Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'email'}
                          placeholder={'Email'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'No. Handphone'}
                          name={'noHp'}
                          type={'text'}
                          placeholder={'No. Handphone'}
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Address'}
                          name={'address'}
                          type={'text'}
                          placeholder={'Address'}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Gender'}
                          name={'gender'}
                          placeholder={'Select Gender'}
                          items={Object.values(GENDER)}
                        />
                      </div>
                      <div className="mb-4">
                        <CheckboxField
                          name={'isActive'}
                          id={'isActive'}
                          label={'Active'}
                        />
                      </div>
                      <div className="mb-4">
                        <ButtonSubmit
                          label={'Save'}
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


(New as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, playerId } = context.query;
  const company = await Api.get('/company/' + companyId).then(res => res);

  if (company.status) {
    return {
      props: {
        company: company.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default New;