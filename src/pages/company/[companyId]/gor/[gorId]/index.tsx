import MainAuth from "@/components/layout/main-auth";
import { Api } from "@/lib/api";
import { Company } from "@/types/company";
import { Gor } from "@/types/gor"
import PageWithLayoutType from "@/types/layout";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";


type Props = {
  company: Company
  gor: Gor
}


const Index: NextPage<Props> = ({ company, gor }) => {
  return (
    <>
      <Head>
        <title>{'Gor - ' + gor.name}</title>
      </Head>
    </>
  );
}




(Index as PageWithLayoutType).layout = MainAuth;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, gorId } = context.query;
  const company = await Api.get('/company/' + companyId).then(res => res);
  const gor = await Api.get('/gor/' + gorId).then(res => res);

  if (company.status && gor.status) {
    return {
      props: {
        company: company.payload,
        gor: gor.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Index;