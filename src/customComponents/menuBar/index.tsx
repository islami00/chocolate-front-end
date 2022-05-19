import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { Navlinks } from './Navlinks';
import { Wallet } from '../../modules/Auth/components/Wallet';
import { useIsMounted } from '../../common/hooks/useIsMounted';
import './index.css';
import './wallet.css';

const Menu: React.FC<{
  setBack: React.Dispatch<React.SetStateAction<boolean>>;
}> = function (props): JSX.Element {
  const { setBack } = props;
  const location = useLocation();
  const isMounted = useIsMounted();
  const match = matchPath(location.pathname, '/');
  useEffect(() => {
    if (match && isMounted) setBack(true);
    else if (!match && isMounted) setBack(false);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);
  return (
    <header className='top-nav'>
      <Navlinks />
      <Wallet />
    </header>
  );
};
export default Menu;
