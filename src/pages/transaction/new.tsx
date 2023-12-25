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
import PasswordField from "@/components/formik/password-field";
import DropdownField from "@/components/formik/dropdown-field";
import { GENDER } from "@/utils/constant";
import CheckboxField from "@/components/formik/checkbox-field";
import SearchDropdownField from "@/components/formik/search-dropdown-field";
import { useEffect, useState } from "react";
import { ListData } from "@/types/data";
import { useDebounce } from "@/utils/hook";
import { CompanyView } from "@/types/company";
import { PageGor } from "@/types/gor";
import { CreateTransaction } from "@/types/transaction";

type Props = {
}



type FilterPropsGor = {
  companyId: string
  name: string
}

const schema = Yup.object().shape({
    companyId: Yup.string().required("Required field"),
    name: Yup.string().required("Required field"),
    isDebit: Yup.boolean(),
    price: Yup.number().required("Required field"),
});

const New: NextPage<Props> = () => {
  const router = useRouter();

  const company: CompanyView = JSON.parse(localStorage.getItem('company'));

  const { mutate: mutateSubmit, isLoading } = useMutation((val: FormikValues) => Api.post('/transaction', val));


  const initFormikValue: CreateTransaction = {
    companyId: company.id,
    name: '',
    isDebit: true,
    price: 0,
  };

  const handleSubmit = (values: FormikValues, setErrors) => {
    mutateSubmit(values, {
      onSuccess: (res) => {
        if (res) {
          if (res.status) {
            notif.success(res.message);
            router.push({ pathname: '/transaction' });
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
        <title>{process.env.APP_NAME + ' - Transaction New'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center'>
            <div className='hidden md:flex items-center'>
              <Link href={'/transaction'}>
                <div className='mr-4 hover:text-primary-500'>{'Transaction'}</div>
              </Link>
              <div className='mr-4'>
                <BsChevronRight className={''} size={'1.2rem'} />
              </div>
              <div className='mr-4'>{'New'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <Link href={'/transaction'}>
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
            <div className='text-xl'>Create Transaction</div>
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
                          label={'Name'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Name'}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Price'}
                          name={'price'}
                          type={'number'}
                          placeholder={''}
                        />
                      </div>
                      <div className="mb-4">
                        <CheckboxField
                          label={'Debit'}
                          name={'isDebit'}
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
  )
}


(New as PageWithLayoutType).layout = MainUser;

export default New;