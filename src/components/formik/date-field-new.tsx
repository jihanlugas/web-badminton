import { NextPage } from 'next';
import moment from 'moment';
import { FastField, ErrorMessage } from 'formik';
import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
  label?: string
  name: string
}

const DateField: NextPage<Props> = ({ label, name, ...props }) => {

  return (
    <>
      <div className=''>
        {label && (
          <div className={'mb-1'}>
            <span>{label}</span>
            {props.required && <span className={'text-rose-600'}>{'*'}</span>}
          </div>
        )}
        <FastField
          className={'w-full h-10 px-2 select-all'}
          type={'datetime-local'}
          name={name}
          {...props}
        />
        {/* <input
          type="datetime-local"
          name=""
          id=""
        /> */}
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