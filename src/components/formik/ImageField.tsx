import { FastField, ErrorMessage, useField } from 'formik';
import { NextPage } from 'next';
import Image from 'next/image';
import React, { ChangeEvent, ChangeEventHandler, useRef, useState } from 'react';
import { IoAddOutline } from 'react-icons/io5';

interface Props {
  label?: string;
  name: string;
  required?: boolean;
  photoUrl?: string;
}

const ImageField: NextPage<Props & React.HTMLProps<HTMLInputElement>> = ({ label, name, required, photoUrl = '', ...props }) => {
  const [previewImage, setPreviewImage] = useState<string>(photoUrl);
  const [field, meta, helpers] = useField({ name, ...props });
  const handleChange = (event) => {
    if (event.currentTarget.files[0] !== undefined) {
      helpers.setTouched(true);
      helpers.setValue(event.currentTarget.files[0], true);
      setPreviewImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleClickImage = (e) => {
    e.preventDefault();
    inputField.current.click();
  };

  const inputField = useRef<HTMLInputElement>(null);

  return (
    <div className={'flex flex-col w-full'}>
      {label && (
        <div className={''}>
          <span>{label}</span>
          {required && <span className={'text-rose-600'}>{'*'}</span>}
        </div>
      )}
      <input
        className={'hidden'}
        type={'file'}
        name={name}
        onChange={handleChange}
        ref={inputField}
        {...props}
      />
      <button className='w-24 h-24' onClick={handleClickImage}>
        {previewImage !== '' ? (
          <>
            <div className='relative w-24 h-24 border-2 rounded bg-gray-50'>
              <Image src={previewImage} alt={'Preview Image'} layout={'fill'} />
            </div>
          </>
        ) : (
          <>
            <div className='relative w-24 h-24 border-2 rounded bg-gray-50 flex justify-center items-center'>
              <IoAddOutline className='' size={'2.5rem'} />
            </div>
          </>
        )}
      </button>
      <ErrorMessage name={name}>
        {(msg) => {
          return (
            <div className={'text-rose-600 text-sm normal-case'}>{msg}</div>
          );
        }}
      </ErrorMessage>
    </div>
  );
};

export default ImageField;