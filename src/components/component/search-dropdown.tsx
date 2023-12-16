import Select from 'react-select';

const SearchDropdown = ({ field, form, options, required, disable, isLoading, placeholder, onChange, onInputChange, ...props }) => {

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
				// 	state.isFocused ? 'border-rose-400' : 'border-green-400',
				// menu: (state) =>
				// 	state.isFocused ? 'border-rose-400' : 'border-green-400',

				container: (state) =>
					state.isFocused ? 'border-2 border-primary-400 rounded' : 'border-2 border-gray-400 rounded',
				// menuList: (state) =>
				// 	'bg-blue-500',
				// menu: (state) =>
				// 	'bg-rose-500',
				option: (state) =>
					'bg-rose-500',

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

export default SearchDropdown;