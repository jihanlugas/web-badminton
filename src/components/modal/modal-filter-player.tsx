import TextField from '@/components/formik/text-field';
import Modal from '@/components/modal/modal';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import ButtonSubmit from '@/components/formik/button-submit';
import { PageRequest } from '@/types/pagination';
import { Dispatch, SetStateAction } from 'react';
import TextAreaField from '@/components/formik/text-area-field';
import DropdownField from '@/components/formik/dropdown-field';
import { GrPowerReset } from 'react-icons/gr';

type FilterProps = {
  companyId: string
  name: string
  email: string
  noHp: string
  address: string
  createName: string
}

type Props = {
  show: boolean;
  onClickOverlay: Function;
  pageRequest: PageRequest & FilterProps
  setPageRequest: Dispatch<SetStateAction<PageRequest & FilterProps>>
}

const schema = Yup.object().shape({
  name: Yup.string().nullable().label('Nama'),
  email: Yup.string().nullable().label('Email'),
  noHp: Yup.string().nullable().label('No. Handphone'),
  address: Yup.string().nullable().label('Address'),
  createName: Yup.string().nullable().label('Create By'),
});

const ModalFilterGor: React.FC<Props> = ({ show, onClickOverlay, pageRequest, setPageRequest }) => {
  const handleSubmit = (values: FormikValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      name: values.name,
      email: values.email,
      noHp: values.noHp,
      address: values.address,
      createName: values.createName,
    };
    setPageRequest(newReq);
    onClickOverlay();
  };

  const handleReset = (setValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      name: '',
      email: '',
      noHp: '',
      address: '',
      createName: '',
    };
    setPageRequest(newReq);
    setValues(newReq)
    onClickOverlay();

  }

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Filter Player
          </div>
          <div>
            <Formik
              initialValues={pageRequest}
              validationSchema={schema}
              enableReinitialize={true}
              onSubmit={(values) => handleSubmit(values)}
            >
              {({ values, setValues, setFieldValue }) => {
                return (
                  <Form encType='multipart/form-data'>
                    <div className='grid grid-cols-1 md:grid-cols-1 gap-4 mb-4'>
                      <div className="mb-4">
                        <TextField
                          label={'Nama'}
                          name={'name'}
                          type={'text'}
                          placeholder={'Nama'}

                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Email'}
                          name={'email'}
                          type={'text'}
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
                        <TextField
                          label={'Address'}
                          name={'address'}
                          type={'text'}
                          placeholder={'Address'}

                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label={'Create By'}
                          name={'createName'}
                          type={'text'}
                          placeholder={'Create By'}
                        />
                      </div>
                    </div>
                    <div className='flex'>
                      <div className={'w-full'}>
                        <ButtonSubmit
                          label={'Filter'}
                          disabled={false}
                          loading={false}
                        />
                      </div>
                      <div className='ml-2'>
                        <button className='text-primary-500 h-full px-2 rounded' title='Reset Filter' type='button' onClick={() => handleReset(setValues)}>
                          <GrPowerReset className='text-primary-500' size={'1.5rem'} />
                        </button>
                      </div>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalFilterGor;