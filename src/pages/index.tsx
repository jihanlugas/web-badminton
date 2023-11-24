import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Api } from '@/lib/api';
import PageWithLayoutType from '@/types/layout';
import Head from 'next/head';
import { Store } from 'react-notifications-component';
import MainAuth from '@/components/layout/main-auth';
import Notif from '@/utils/notif';

const Index = () => {

  const testNotif = () => {
    Store.addNotification({
      title: "Wonderful!",
      message: "teodosii@react-notifications-component",
      type: "success",
      insert: "bottom",
      container: "bottom-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true,
        showIcon: true,

      },
    });
  }

  const testSuccess = () => {
    Notif.success('Test success');
  }
  const testError = () => {
    Notif.error('Test error');
  }
  const testInfo = () => {
    Notif.info('Test info');
  }
  const testWarning = () => {
    Notif.warning('Test warning');
  }

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME + ' - Badminton'}</title>
      </Head>
      <div className='p-4'>
        Test
        <div className='p-4' onClick={testSuccess}>
          Success
        </div>
        <div className='p-4' onClick={testError}>
          Error
        </div>
        <div className='p-4' onClick={testInfo}>
          Info
        </div>
        <div className='p-4' onClick={testWarning}>
          Warning
        </div>
      </div>
    </>
  );
};

(Index as PageWithLayoutType).layout = MainAuth;

export default Index;