import { FastField, ErrorMessage } from 'formik';
import { NextPage } from 'next';

interface Props extends React.HTMLProps<HTMLInputElement> {
	name: string;
	showError?: boolean;
}

const CheckboxField: NextPage<Props> = ({ name, showError = true, ...props }) => {
	return (
		<div className={'flex flex-col w-full'}>
			<div className='flex items-center'>
				{props.label && (
					<label className={'select-none w-full py-2 flex items-center'} >
						<FastField
							className={'mr-2 accent-primary-500 py-2 h-5 w-5'}
							type={'checkbox'}
							name={name}
							{...props}
						/>
						<span className='truncate'>{props.label}</span>
					</label>
				)}
			</div>
			{showError && (
				<ErrorMessage name={name}>
					{(msg) => {
						return (
							<div className={'text-red-600 text-sm normal-case'}>{msg}</div>
						);
					}}
				</ErrorMessage>
			)}
		</div>
	);
};

export default CheckboxField;