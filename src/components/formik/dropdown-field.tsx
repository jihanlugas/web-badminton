import { ListData } from '@/types/data';
import { Field, ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';

// interface item {
// 	label: string;
// 	value: string | number;
// }

interface Props extends React.HTMLProps<HTMLSelectElement> {
	label?: string;
	items: ListData[];
	name: string;
	required?: boolean;
	placeholder?: string;
	placeholderValue?: string | number;
}


const DropdownField: NextPage<Props> = ({ label, name, items, required, placeholder = '', placeholderValue = '', ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-red-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				className={'w-full border-2 rounded h-10 px-2'}
				name={name}
				as={'select'}
				{...props}
			>
				{placeholder !== '' && (
					<option value={placeholderValue}>{placeholder}</option>
				)}
				{items.map((v, key) => {
					return (
						<option key={key} value={v.value}>{v.label}</option>
					)
				})}
			</Field>
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

export default DropdownField;