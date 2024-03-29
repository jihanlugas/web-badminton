import MainAdmin from '@/components/layout/main-admin';
import { Api } from "@/lib/api";
import PageWithLayoutType from "@/types/layout";
import Head from "next/head";
import Link from "next/link";
import { GetServerSideProps, NextPage } from "next/types";
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'
import notif from '@/utils/notif';
import { useRouter } from "next/router";
import * as Yup from 'yup';
import { Form, Formik, FormikValues } from "formik";
import TextField from "@/components/formik/text-field";
import TextAreaField from "@/components/formik/text-area-field";
import ButtonSubmit from "@/components/formik/button-submit";
import { useMutation } from "@tanstack/react-query";
import { CompanyView, UpdateCompany } from '@/types/company';

type Props = {
  company: CompanyView
}

const schema = Yup.object().shape({
  name: Yup.string().label('name').required("Required field"),
  description: Yup.string().label('description'),
  balance: Yup.number().label('balance').required("Required field"),
});

const Edit: NextPage<Props> = ({ company }) => {


  const router = useRouter();

  const initFormikValue: UpdateCompany = {
    name: company.name,
    description: company.description,
    balance: company.balance,
  };

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.put('/company/' + company.id, val));

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push('/admin/company');
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
        <title>{'Company - ' + company.name}</title>
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
              <div className='mr-4'>{'Edit'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={{ pathname: '/admin/company/[companyId]', query: { companyId: company.id } }}>
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
            <div className='text-xl'>Edit Company</div>
          </div>
          <div className='mb-4'>
            <Formik
              initialValues={initFormikValue}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values, { setErrors }) => handleSubmit(values, setErrors)}
            >
              {({ values, errors }) => {
                return (
                  <Form encType='multipart/form-data'>
                    <div className={'w-full max-w-xl'}>

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
                      <div className={'mb-4'}>
                        <ButtonSubmit
                          label={'Save'}
                          disabled={isLoading}
                          loading={isLoading}
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
      </div>
    </>
  )
}

(Edit as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId } = context.query;
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

export default Edit;