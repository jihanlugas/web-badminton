import { ListData } from '@/types/data';
import { Field, ErrorMessage } from 'formik';
import { NextPage } from 'next';
import React from 'react';
import Select from 'react-select';

// declare module 'react-select/dist/declarations/src/Select' {
// 	export interface Props<
// 		Option,
// 		IsMulti extends boolean,
// 		Group extends GroupBase<Option>
// 	> {
// 		myCustomProp: string;
// 	}
// }

// interface item {
// 	label: string;
// 	value: string | number;
// }

const DropDown = ({ field, form, options, required, disable, isLoading, placeholder, onChange, onInputChange, ...props }) => {

	const handleChange = (option) => {
		if (option) {
			form.setFieldValue(field.name, option.value)
		} else {
			if (typeof field.value === 'number') {
				form.setFieldValue(field.name, 0)
			} else {
				form.setFieldValue(field.name, '')
			}
		}
	}

	const handleOnBlur = () => {
		form.setFieldTouched(field.name, true)
	}

	return (
		<Select
			name={field.name}
			options={options}
			placeholder={placeholder}
			isLoading={isLoading}
			onChange={onChange ? onChange : handleChange}
			value={options && options.find(option => option.value === field.value)}
			filterOption={null}
			onInputChange={onInputChange}
			isDisabled={disable}
			required={required}
			id={'long-value-select'}
			instanceId={'long-value-select'}
			isClearable={true}
			className={''}
			onBlur={handleOnBlur}
			{...props}
			classNames={{
				// valueContainer: (state) =>
				// 	state.isFocused ? 'border-red-400' : 'border-green-400',
				// menu: (state) =>
				// 	state.isFocused ? 'border-red-400' : 'border-green-400',

				container: (state) =>
					state.isFocused ? 'border-2 border-primary-400 rounded' : 'border-2 border-gray-400 rounded',
				// menuList: (state) =>
				// 	'bg-blue-500',
				// menu: (state) =>
				// 	'bg-red-500',
				option: (state) =>
					'bg-red-500',

			}}
			styles={{
				container: (baseStyles, state) => ({
					...baseStyles,
					// borderWidth: 0,
					boxShadow: 'none',
				}),
				control: (baseStyles, state) => ({
					...baseStyles,
					borderWidth: 0,
					boxShadow: 'none',
					// height: 0
					// borderColor: state.isFocused ? 'green' : 'red',
				}),
			}}

		/>
	)
}


interface Props {
	label?: string;
	name: string;
	options: ListData[];
	isLoading?: boolean;
	placeholder?: string;
	placeholderValue?: string | number;
	onChange?: (any) => void;
	onInputChange?: (any) => void;
}

const SearchDropdownField: NextPage<Props & React.HTMLProps<HTMLSelectElement>> = ({ label, name, options, isLoading = false, placeholder = 'Select ...', placeholderValue = '', onChange, onInputChange, ...props }) => {

	return (
		<div className={'flex flex-col w-full'}>
			{label && (
				<div className={'mb-1'}>
					<span>{label}</span>
					{props.required && <span className={'text-red-600'}>{'*'}</span>}
				</div>
			)}
			<Field
				name={name}
				options={options}
				placeholder={placeholder}
				onChange={onChange}
				onInputChange={onInputChange}
				component={DropDown}
				isLoading={isLoading}
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
	)
}

export default SearchDropdownField;