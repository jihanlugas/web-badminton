import '../styles/globals.css'
import 'react-notifications-component/dist/theme.css'
import Head from 'next/head';
import { NextPage } from 'next/types';
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageWithLayoutType from '@/types/layout';
import { ReactNotifications } from 'react-notifications-component'
import { NotifContextProvider } from '@/stores/notif-provider';

type AppLayoutProps = {
  Component: PageWithLayoutType
  pageProps: any
}

const MyApp: NextPage<AppLayoutProps> = ({ Component, pageProps }) => {

  const Layout = Component.layout || (({ children }) => <>{children}</>);
  const queryClient = new QueryClient();

  return (
    <>
      <Head>
        <title>{process.env.APP_NAME}</title>
      </Head>
      <ReactNotifications />
      <NotifContextProvider>
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </NotifContextProvider>
    </>
  )
}

export default MyApp;
