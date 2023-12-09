import MainAdmin from "@/components/layout/main-admin";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
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
import { CreateGor } from "@/types/gor";

type Props = {
  company: CompanyView
}

const schema = Yup.object().shape({
  companyId: Yup.string().label('name').required("Required field"),
  name: Yup.string().label('name').required("Required field"),
  description: Yup.string().label('description'),
  address: Yup.string().label('address'),
  normalGamePrice: Yup.number().label('normal game price').required("Required field"),
  rubberGamePrice: Yup.number().label('rubber game price').required("Required field"),
  ballPrice: Yup.number().label('ball price').required("Required field"),
});

const New: NextPage<Props> = ({ company }) => {
  const router = useRouter();

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/gor', val));

  const initFormikValue: CreateGor = {
    companyId: company.id,
    name: '',
    description: '',
    address: '',
    normalGamePrice: 0,
    rubberGamePrice: 0,
    ballPrice: 0,
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
        <title>{process.env.APP_NAME + ' - Gor New'}</title>
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
            <div className='text-xl'>Create Gor</div>
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
                          label={'Gor Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Gor Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextAreaField
                          label={'Gor Description'}
                          name={'description'}
                          type={'text'}
                          placeholder={'Gor Description'}
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
                        <TextField
                          label={'Normal Game Price'}
                          name={'normalGamePrice'}
                          type={'number'}
                          placeholder={'Normal Game Price'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Rubber Game Price'}
                          name={'rubberGamePrice'}
                          type={'number'}
                          placeholder={'Rubber Game Price'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Ball Price'}
                          name={'ballPrice'}
                          type={'number'}
                          placeholder={'Ball Price'}
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


(New as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, gorId } = context.query;
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