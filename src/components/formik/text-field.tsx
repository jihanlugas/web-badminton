import { FastField, ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
	type: string;
}

const TextField: NextPage<Props> = ({ name, type, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{props.label && (
				<div className={'mb-1'}>
					<span>{props.label}</span>
					{props.required && <span className={'text-red-600'}>{'*'}</span>}
				</div>
			)}
			<FastField
				className={'w-full border-2 rounded h-10 px-2 select-all focus:border-primary-500'}
				type={type}
				name={name}
				onWheel={event => event.currentTarget.blur()}
				{...props}
			/>
			<ErrorMessage name={name}>
				{(msg) => {
					return (
						<div className={'text-red-600 text-sm normal-case'}>{msg}</div>
					);
				}}
			</ErrorMessage>
		</div>
	);
};

export default TextField;