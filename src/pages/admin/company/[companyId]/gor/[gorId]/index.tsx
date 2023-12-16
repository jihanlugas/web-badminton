import MainAdmin from "@/components/layout/main-admin";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { GorView } from "@/types/gor";
import PageWithLayoutType from "@/types/layout";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";


type Props = {
  company: CompanyView
  gor: GorView
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




(Index as PageWithLayoutType).layout = MainAdmin;

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