import { NextPage } from 'next';
import { createContext, useEffect, useState } from 'react';
import { Store } from 'react-notifications-component';

type Props = {
  children: React.ReactNode
}

type notif = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
}

const NotifContext = createContext<{ notif: notif }>({
  notif: {
    success: (msg: string) => { },
    error: (msg: string) => { },
    info: (msg: string) => { },
    warning: (msg: string) => { },
  }
});

export const NotifContextProvider: NextPage<Props> = ({ children }) => {
  const notif = {
    error: (msg: string) => {
      Store.addNotification({
        title: "Error!",
        message: msg,
        type: "danger",
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
    },
    info: (msg: string) => {
      Store.addNotification({
        title: "Info!",
        message: msg,
        type: "info",
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
    },
    success: (msg: string) => {
      Store.addNotification({
        title: "Successful!",
        message: msg,
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
    },
    warning: (msg: string) => {
      Store.addNotification({
        title: "Warning!",
        message: msg,
        type: "warning",
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
    },
  };

  // useEffect(() => {
  //   if (showNotif.show) {
  //     setTimeout(() => {
  //       setShowNotif({ ...showNotif, show: false });
  //     }, 3000);
  //   }
  // }, [showNotif]);

  const context = {
    notif,
  };

  return (
    <NotifContext.Provider value={context}>
      {/* <div className={`fixed w-full duration-500 ease-in-out -mt-20 top-0 z-50 ${showNotif.show && ' translate-y-32'}`}>
        <div className={'px-4 w-full flex justify-center'}>
          <div className={`flex flex-col w-full max-w-2xl py-2 px-4 rounded-lg text-gray-100 ${showNotif.className}`}>
            <div className={'font-bold'}>{showNotif.title}</div>
            <div>{showNotif.msg}</div>
          </div>
        </div>
      </div> */}
      {children}
    </NotifContext.Provider>
  );
};


export default NotifContext;