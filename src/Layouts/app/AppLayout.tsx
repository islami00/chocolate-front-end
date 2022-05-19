/* eslint-disable import/no-unresolved */
import { DeveloperConsole } from 'chocolate/substrate-lib/components';
/* eslint-enable import/no-unresolved */
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from 'react-query/devtools';
import MenuBar from '../../customComponents/menuBar';
import { loader, message } from '../../customComponents/utilities';
import { useSubstrate } from '../../substrate-lib';
import { AppRoutes } from './components/AppRoutes';

/* NB: AppLayout==AppShell, so do  all box styling here */
export function AppLayout(): JSX.Element {
  const { apiState, apiError } = useSubstrate();
  const [back, setBack] = useState(false);

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');

  return (
    <div className={`root-wrap ${back ? 'background' : ''}`}>
      <MenuBar setBack={setBack} />
      <AppRoutes />
      <Toaster position='bottom-right' />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      {process.env.NODE_ENV === 'development' && <DeveloperConsole />}
    </div>
  );
  /*  */
}
