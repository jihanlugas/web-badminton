import TextField from '@/components/formik/text-field';
import Modal from '@/components/modal/modal';
import { Formik, Form, FormikValues } from 'formik';
import * as Yup from 'yup';
import ButtonSubmit from '@/components/formik/button-submit';
import { Dispatch, SetStateAction } from 'react';
import TextAreaField from '@/components/formik/text-area-field';
import DropdownField from '@/components/formik/dropdown-field';
import { GrPowerReset } from 'react-icons/gr';
import { GENDER } from '@/utils/constant';
import { PagePlayer } from '@/types/player';
import { NextPage } from 'next';
import DateField from '../formik/date-field';
import { PageRankingGameplayer } from '@/types/gameplayer';

type FilterProps = {
  companyId: string
  name: string
  email: string
  noHp: string
  address: string
  gender: string
  createName: string
}

type Props = {
  show: boolean;
  onClickOverlay: Function;
  pageRequest: PageRankingGameplayer
  setPageRequest: Dispatch<SetStateAction<PageRankingGameplayer>>
}

const schema = Yup.object().shape({
  gameDt: Yup.date(),
  gender: Yup.string().nullable().label('Gender'),
});

const ModalFilterRank: NextPage<Props> = ({ show, onClickOverlay, pageRequest, setPageRequest }) => {
  const handleSubmit = (values: FormikValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      name: values.name,
      gameDt: JSON.stringify(values.gameDt).replaceAll('"', ''),
      gender: values.gender,
    };
    setPageRequest(newReq);
    onClickOverlay();
  };

  const handleReset = (setValues) => {
    const newReq = {
      ...pageRequest,
      page: 1,
      gameDt: new Date(),
      gender: '',
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
                        <DateField
                          label={'Game Date'}
                          name={'gameDt'}
                          dateFormat={'MMM YYYY'}
                          timeFormat={false}
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
                    {/* <div className="hidden md:flex mb-4 p-4 whitespace-pre-wrap">
                      {JSON.stringify(values, null, 4)}
                    </div> */}
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

export default ModalFilterRank;