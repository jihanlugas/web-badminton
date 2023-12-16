import Modal from '@/components/modal/modal';
import { NextPage } from 'next';

type Props = {
  show: boolean;
  onClickOverlay: Function;
  onDelete: Function;
  isLoading?: boolean;
  children: React.ReactNode;
}

const ModalDelete: NextPage<Props> = ({ show, onClickOverlay, onDelete, isLoading = false, children }) => {

  return (
    <>
      <Modal show={show} onClickOverlay={onClickOverlay} layout={'sm:max-w-lg'}>
        <div className="p-4">
          <div className={'text-xl mb-4 border-b pb-4'}>
            <span>Delete</span>
          </div>
          <div className={'mb-4'}>
            {children}
          </div>
          <div className={'flex justify-end'}>
            <button className='px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:cursor-not-allowed duration-300 rounded-md mr-4 ' onClick={() => onClickOverlay()} disabled={isLoading}>
              Cancel
            </button>
            <button className='px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed duration-300 rounded-md text-gray-50 font-semibold' onClick={() => onDelete()} disabled={isLoading}>
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalDelete;