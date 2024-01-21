import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import { Store } from 'react-notifications-component';
import MainAdmin from '@/components/layout/main-admin';
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

(Index as PageWithLayoutType).layout = MainAdmin;

export default Index;