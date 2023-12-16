import DateTime, { DatetimepickerProps } from 'react-datetime';
import { NextPage } from 'next';
import moment from 'moment';
import { Field } from 'formik';

interface Props extends DatetimepickerProps {
  label?: string
  name: string
  required?: boolean;
}

const DateField: NextPage<Props> = ({ label, name, required, ...props }) => {
  return (
    <>
      <div className=''>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        {/* <Datetime
          className={'datetime w-full border-2 rounded'}
          dateFormat={'DD MMM YYYY'}
          timeFormat={'HH:mm'}
          {...props}
        /> */}
        <Field name={name} className={'w-full border-2 rounded'}>
          {({ field, form }) => {
            return (
              <DateTime
                className={'datetime w-full'}
                value={new Date(field.value)}
                onChange={(value) => { form.setFieldValue(field.name, value) }}
                dateFormat={'DD MMM YYYY'}
                timeFormat={'HH:mm'}
                {...props}
              />
            )
          }}
        </Field>
      </div>
    </>
  )
}

export default DateField;