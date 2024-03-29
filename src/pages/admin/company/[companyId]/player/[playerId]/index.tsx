import MainAdmin from "@/components/layout/main-admin";
import { Api } from "@/lib/api";
import { CompanyView } from "@/types/company";
import { PlayerView } from "@/types/player";
import PageWithLayoutType from "@/types/layout";
import Head from "next/head";
import { GetServerSideProps, NextPage } from "next/types";


type Props = {
  company: CompanyView
  player: PlayerView
}


const Index: NextPage<Props> = ({ company, player }) => {
  return (
    <>
      <Head>
        <title>{'Player - ' + player.name}</title>
      </Head>
    </>
  );
}




(Index as PageWithLayoutType).layout = MainAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { companyId, playerId } = context.query;
  const company = await Api.get('/company/' + companyId).then(res => res);
  const player = await Api.get('/player/' + playerId).then(res => res);

  if (company.status && player.status) {
    return {
      props: {
        company: company.payload,
        player: player.payload,
      }
    };
  } else {
    return {
      notFound: true
    };
  }
};

export default Index;