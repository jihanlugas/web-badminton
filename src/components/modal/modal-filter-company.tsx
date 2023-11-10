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
  name: string
  description: string
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
  description: Yup.string().nullable().label('Deskripsi'),
  createName: Yup.string().nullable().label('Create By'),
});

const ModalFilterCompany: React.FC<Props> = ({ show, onClickOverlay, pageRequest, setPageRequest }) => {
  const handleSubmit = (values: FormikValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      name: values.name,
      description: values.description,
      createName: values.createName,
    };
    setPageRequest(newReq);
    // onClickOverlay(JSON.stringify(pageRequest) !== JSON.stringify(newReq));
    onClickOverlay();
  };

  const handleReset = (setValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      name: '',
      description: '',
      createName: '',
    };
    setPageRequest(newReq);
    setValues(newReq)
    onClickOverlay();
    // onClickOverlay(JSON.stringify(pageRequest) !== JSON.stringify(newReq));

  }

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4'}>
            Filter Pemilu
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
                        <TextAreaField
                          label={'Deskripsi'}
                          name={'description'}
                          type={'text'}
                          placeholder={'Deskripsi'}
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

                      {/* <div className="mb-4">
                        <DropdownField
                          label={'Status pemilu'}
                          name={'electionStatus'}
                          placeholder={'Pilih status pemilu'}
                          items={Object.values(ELECTION_STATUS)}
                        />
                      </div>
                      <div className="mb-4">
                        <DropdownField
                          label={'Tipe pemilu'}
                          name={'electionType'}
                          placeholder={'Pilih tipe pemilu'}
                          items={Object.values(ELECTION_TYPE)}
                        />
                      </div> */}
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

export default ModalFilterCompany;