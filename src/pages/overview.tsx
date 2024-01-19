import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import { Store } from 'react-notifications-component';
import MainUser from '@/components/layout/main-user';
import Notif from '@/utils/notif';

const Index = () => {
  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Badminton'}</title>
      </Head>
      <div className='p-4'>
        Home
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainUser;

export default Index;