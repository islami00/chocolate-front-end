/* eslint-disable import/no-unresolved */
import 'semantic-ui-css/semantic.min.css';
import { AppLayout } from './Layouts/app/AppLayout';
import { AppProvider } from './Layouts/app/AppProvider';
// styles
import './styles/index.css';

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
