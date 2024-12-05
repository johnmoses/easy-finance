import Layout from '@/components/layout/auth';
import { apiClient } from "@/clients/axios";
import { NextPage } from 'next';
import React, { useRef, useState } from 'react';
import { log } from '@/utils/logs';
// import { usePageAnalytics } from '@/hooks';

const PasswordChangePage: NextPage = () => {
  const firstRender = useRef(true);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  // usePageAnalytics();

  const handleSubmit = () => {
    apiClient
      .get(`/password-change/${password}`)
      .then(response => {
        if (response.status === 200) {
          setDisabled(true);
          setMessage('Password changed');
          log('Password changed: ' + response.data);
          // goHome();
        }
      })
      .catch(error => {
        setMessage('Could not chnange password this time');
        setDisabled(false);
        log('Failed to change password: ' + error);
      });
  };

  // useEffect(() => {
  //   if (firstRender.current) {
  //     firstRender.current = false;
  //     return;
  //   }
  //   setDisabled(validateForm);
  // }, [password]);

  // const validateForm = () => {
  //   if (
  //     !/^[a-zA-Z0-9]([._](?![._])|[a-zA-Z0-9]){2,18}[a-zA-Z0-9]$/.test(password)
  //   ) {
  //     setMessage(' Invalid password ');
  //     return true;
  //   } else {
  //     setMessage('');
  //     return false;
  //   }
  // };
  return (
    <Layout title="Password Change">
      <form>
        <h1>Change Password</h1>
      </form>
    </Layout>
  );
}

export default PasswordChangePage;
