import DateTime, { DatetimepickerProps } from 'react-datetime';
import { NextPage } from 'next';
import moment from 'moment';
import { Field, ErrorMessage } from 'formik';

interface Props extends DatetimepickerProps {
  label?: string
  name: string
  required?: boolean;
}

const DateField: NextPage<Props> = ({ label, name, required, ...props }) => {
  const handleChange = (form, field, value) => {
    form.setFieldValue(field.name, new Date(value))
  }
  return (
    <>
      <div className=''>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        <Field name={name} className={'w-full border-2 rounded'}>
          {({ field, form }) => {
            return (
              <DateTime
                className={'datetime w-full'}
                value={new Date(field.value)}
                onChange={(value) => handleChange(form, field, value)}
                dateFormat={'DD MMM YYYY'}
                timeFormat={'HH:mm'}
                {...props}
              />
            )
          }}
        </Field>
        <ErrorMessage name={name}>
          {(msg) => {
            return (
              <div className={'text-rose-600 text-sm normal-case'}>{msg}</div>
            );
          }}
        </ErrorMessage>
      </div>
    </>
  )
}

export default DateField;