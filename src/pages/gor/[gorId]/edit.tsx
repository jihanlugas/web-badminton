import ButtonSubmit from "@/components/formik/button-submit";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { GorView, UpdateGor } from "@/types/gor"
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

type Props = {
  gor: GorView
}

const schema = Yup.object().shape({
  companyId: Yup.string().required("Required field"),
  name: Yup.string().required("Required field"),
  description: Yup.string(),
  address: Yup.string(),
  normalGamePrice: Yup.number().required("Required field"),
  rubberGamePrice: Yup.number().required("Required field"),
  ballPrice: Yup.number().required("Required field"),
});


const Edit: NextPage<Props> = ({ gor }) => {
  const router = useRouter();

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.put('/gor/' + gor.id, val));

  const initFormikValue: UpdateGor = {
    companyId: gor.companyId,
    name: gor.name,
    description: gor.description,
    address: gor.address,
    normalGamePrice: gor.normalGamePrice,
    rubberGamePrice: gor.rubberGamePrice,
    ballPrice: gor.ballPrice,
  };

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push({ pathname: '/gor'});
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
        <title>{'Gor - ' + gor.name}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/gor'}>
                <div className='mr-4 hover:text-primary-500'>{'Gor'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <Link href={{ pathname: '/gor/[gorId]', query: { gorId: gor.id } }}>
                <div className='mr-4 hover:text-primary-500'>{gor.name}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'Edit'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/gor'}>
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
            <div className='text-xl'>Edit Gor</div>
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
  );
}

(Edit as PageWithLayoutType).layout = MainUser;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, gorId } = context.query;
  const gor = await Api.get('/gor/' + gorId).then(res => res);

  if (gor.status) {
    return {
      props: {
        gor: gor.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Edit;