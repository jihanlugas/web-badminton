import ButtonSubmit from "@/components/formik/button-submit";
import TextAreaField from "@/components/formik/text-area-field";
import TextField from "@/components/formik/text-field";
import MainAdmin from "@/components/layout/main-admin";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { PlayerView, UpdatePlayer } from "@/types/player"
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
import CheckboxField from "@/components/formik/checkbox-field";
import DropdownField from "@/components/formik/dropdown-field";
import { GENDER } from "@/utils/constant";

type Props = {
  company: CompanyView
  player: PlayerView
}

const schema = Yup.object().shape({
  companyId: Yup.string().label('company').required("Required field"),
  name: Yup.string().label('name').required("Required field"),
  email: Yup.string().email().label('email'),
  noHp: Yup.string().label('no hp'),
  address: Yup.string().label('address'),
  gender: Yup.string().label('gender'),
  isActive: Yup.boolean().label('active'),
});


const Edit: NextPage<Props> = ({ company, player }) => {
  const router = useRouter();

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.put('/player/' + player.id, val));

  const initFormikValue: UpdatePlayer = {
    companyId: player.companyId,
    name: player.name,
    email: player.email,
    noHp: player.noHp,
    address: player.address,
    gender: player.gender,
    isActive: player.isActive,
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
        <title>{'Player - ' + player.name}</title>
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
                <div className='mr-4 hover:text-primary-500'>{player.name}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'Edit'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/admin/company'}>
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
            <div className='text-xl'>Edit Player</div>
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
  );
}




(Edit as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, playerId } = context.query;
  const company = await Api.get('/company/' + companyId).then(res => res);
  const player = await Api.get('/player/' + playerId).then(res => res);

  if (company.status && player.status) {
    return {
      props: {
        company: company.payload,
        player: player.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Edit;