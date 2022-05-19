/* eslint-disable import/no-unresolved */
import { DeveloperConsole } from 'chocolate/substrate-lib/components';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useMatch } from 'react-router-dom';
import MenuBar from '../../customComponents/menuBar';
import { loader, message } from '../../customComponents/utilities';
import { useSubstrate } from '../../substrate-lib';
import { AppRoutes } from './components/AppRoutes';

/* NB: AppLayout==AppShell, so do  all box styling here */
export function AppLayout(): JSX.Element {
  const { apiState, apiError } = useSubstrate();
  const match = useMatch('/');

  if (apiState === 'ERROR') return message(apiError);
  if (apiState !== 'READY') return loader('Connecting to Substrate');
  return (
    <div className={`root-wrap ${match ? 'background' : ''}`}>
      <MenuBar />
      <AppRoutes />
      <Toaster position='bottom-right' />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
      {process.env.NODE_ENV === 'development' && <DeveloperConsole />}
    </div>
  );
  /*  */
}
