import { FastField, ErrorMessage } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
}

const CheckboxField: NextPage<Props> = ({ name, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			<div className='flex items-center'>
				<FastField
					className={'mr-2 accent-primary-500 py-2 h-5 w-5'}
					type={'checkbox'}
					name={name}
					id={props.id}
					{...props}
				/>
				{props.label && (
					<label htmlFor={props.id} className={'select-none w-full py-2'} >{props.label}</label>
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

export default CheckboxField;