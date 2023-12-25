import MainUser from "@/components/layout/main-user";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import PageWithLayoutType from "@/types/layout";
import { PageInfo } from "@/types/pagination";
import { PageTransaction, TransactionView } from "@/types/transaction";
import { displayDateTime, displayMoney } from "@/utils/formater";
import { useMutation, useQuery } from "@tanstack/react-query";
import Head from "next/head";
import Link from "next/link";
import router from "next/router";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";



type Props = {
}

const Index: NextPage<Props> = () => {
  const company: CompanyView = JSON.parse(localStorage.getItem('company'));

  const [transaction, setTransaction] = useState<TransactionView[]>([]);

  const [accordion, setAccordion] = useState<number[]>([]);

  const { data, isLoading: isLoadingInit } = useQuery(['init'], () => Api.get('/init'));

  const toggleAccordion = (key) => {
    if (accordion.includes(key)) {
      setAccordion(accordion.filter((item) => item !== key));
    } else {
      setAccordion([...accordion, key]);
    }
  }

  const [pageInfoTransaction, setPageInfoTransaction] = useState<PageInfo>({
    pageSize: 0,
    pageCount: 0,
    totalData: 0,
    page: 0,
  });

  const [pageRequestTransaction, setPageRequestTransaction] = useState<PageTransaction>({
    limit: 1000,
    page: 1,
    sortField: 'create_dt',
    sortOrder: 'desc',
    companyId: company.id,
    name: '',
  });

  const { isLoading: isLoadingTransaction, data: dataTransaction, refetch: refetchTransaction } = useQuery(['transaction', pageRequestTransaction], ({ queryKey }) => Api.get('/transaction/page', queryKey[1]), {});

  useEffect(() => {
    if (dataTransaction && dataTransaction.status) {
      setTransaction(dataTransaction.payload.list);
      setPageInfoTransaction({
        pageCount: dataTransaction.payload.totalPage,
        pageSize: dataTransaction.payload.dataPerPage,
        totalData: dataTransaction.payload.totalData,
        page: dataTransaction.payload.page,
      });
    }
  }, [dataTransaction]);

  useEffect(() => {
    if (data && data.status) {
      localStorage.setItem("user", JSON.stringify(data.payload.user))
      localStorage.setItem("company", JSON.stringify(data.payload.company || {}))
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>{'Transaction'}</title>
      </Head>
      <div className='p-4'>
        <div className='bg-white mb-4 p-4 rounded shadow'>
          <div className='text-xl flex items-center justify-between'>
            <div className='hidden md:flex items-center'>
              <div className='mr-4'>{'Transaction'}</div>
            </div>
            <div className='flex items-center md:hidden'>
              <div className='mr-4'>{'Transaction'}</div>
            </div>
            <div className='flex items-center text-base'>
              <Link href={{ pathname: '/transaction/new' }} className='flex items-center hover:bg-gray-100 rounded -m-2 p-2'>
                <div className='flex justify-center items-center rounded h-6 w-6'>
                  <IoAddOutline size={'1.2em'} />
                </div>
                <div className='ml-2 hidden md:block'>Add Transaction</div>
              </Link>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          {transaction.map((data, key) => {
            return (
              <div key={key} className='bg-white rounded shadow'>
                <div className='p-4'>
                  <div className="flex justify-between items-center">
                    <div className=''>{data.name}</div>
                    {data.isDebit ? (
                      <div className="">{displayMoney(data.price)}</div>
                    ) : (
                      <div className="text-rose-500">{displayMoney(data.price * -1)}</div>
                    )}
                  </div>
                  <div className='text-sm'>{displayDateTime(data.createDt)}</div>
                </div>
              </div>
            )
          })}
        </div>
        {/* <div className='bg-white mb-4 p-4 rounded shadow whitespace-pre-wrap'>
          {JSON.stringify(company, null, 4)}
        </div> */}
      </div >
    </>
  )

}

(Index as PageWithLayoutType).layout = MainUser;

export default Index;