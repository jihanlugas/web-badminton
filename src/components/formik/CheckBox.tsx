import { FastField, ErrorMessage } from 'formik';
import { NextPage } from 'next';

interface Props {
	label?: string;
	name: string;
	id?: string;
	// props?: any;
}

const CheckBox: React.FC<Props & React.HTMLProps<HTMLInputElement>> = ({ label, name, id = '', ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			<div className='flex items-center'>
				<FastField
					className={'mr-2 accent-primary-500 py-2'}
					type={'checkbox'}
					name={name}
					id={id}
					{...props}
				/>
				{label && (
					<label htmlFor={id} className={'select-none w-full py-2'} >{label}</label>
				)}
			</div>
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

export default CheckBox;