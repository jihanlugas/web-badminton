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
	keyValue?: string;
	keyLabel?: string;
}


const DropdownField: NextPage<Props> = ({ label, name, items, required, placeholder = '', placeholderValue = '', keyValue = 'value', keyLabel = 'label', ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={''}>
					<span>{label}</span>
					{required && <span className={'text-rose-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				className={'w-full border-2 rounded h-10 px-2 bg-white'}
				name={name}
				as={'select'}
				{...props}
			>
				{placeholder !== '' && (
					<option value={placeholderValue}>{placeholder}</option>
				)}
				{items.map((v, key) => {
					return (
						<option key={key} value={v[keyValue]}>{v[keyLabel]}</option>
					)
				})}
			</Field>
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

export default DropdownField;