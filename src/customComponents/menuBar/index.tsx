/* eslint-disable import/no-unresolved */
import { useAuthService } from 'chocolate/polkadot-apac-hackathon/common/providers/authProvider';
/* eslint-enable import/no-unresolved */
import { useEffect, useRef, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import AccountSelector from '../../AccountSelector';
import WalletPurple from '../../assets/wallet-purple.svg';
import { useAccounts, useSubstrate } from '../../substrate-lib/SubstrateContext';
import './index.css';
import './wallet.css';

export const useLoadAccounts = (
  run: boolean,
  setRun: React.Dispatch<React.SetStateAction<boolean>>
): void => {
  const { dispatch, loadAccounts } = useAccounts();
  const state = useSubstrate();

  useEffect(() => {
    if (run) {
      // eslint-disable-next-line @typescript-eslint/require-await
      const doRun = () => {
        loadAccounts(state, dispatch);
      };
      doRun();
      return () => setRun(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);
};
/**
 * @description - A modal that either shows wallet info - account
 * selected and balances - rankpoints and regular, or it shows connect depending on wallet connection.
 */
const WalletModal: React.FC<{ connected?: boolean }> = function (props) {
  const { connected } = props;
  const { keyringState } = useSubstrate();
  const [run, setRun] = useState(false);
  useLoadAccounts(run, setRun);
  let content;
  // do the keyring stuff here too.
  if (keyringState === 'LOADING') content = <p>Loading... </p>;
  else if (keyringState === 'ERROR') content = <p>Something went wrong, please refresh the page</p>;
  else if (!connected) {
    content = (
      <>
        <p>Your wallet is not connected, do connect</p>
        <button type='button' onClick={() => setRun(true)}>
          Connect wallet
        </button>
      </>
    );
  } else {
    content = <AccountSelector />;
  }

  return <div className='modal modal_drop modal_drop--right'>{content}</div>;
};

/**
 * @description It should check if connected or not.
 * If wallet is connected, show a dropdown that shows accountSelected and balances.
 * If wallet is not collected, show dropdown with connectWallet button.
 *
 */
const HandleWallet = function () {
  const { keyringState } = useSubstrate();
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (keyringState === 'READY') setConnected(true);
  }, [connected, keyringState]);

  if (connected || keyringState === 'READY') {
    return <WalletModal connected />;
  }
  return <WalletModal />;
};

function Navlinks() {
  const { isAuthenticated } = useAuthService();
  return (
    <nav className='nav-links'>
      <Link to='/' className='nav-link nav-link__home'>
        Chocolate
      </Link>
      <ul className='nav-links-ul'>
        <li>
          <Link className='nav-link' to='/about'>
            About
          </Link>
        </li>
        <li>
          <Link className='nav-link' to='/team'>
            Team
          </Link>
        </li>
        <li>
          <Link className='nav-link' to='/gallery'>
            Projects
          </Link>
        </li>
        <li>
          <Link className='nav-link' to='/choc'>
            CHOC Token
          </Link>
        </li>
        {!isAuthenticated && (
          <li>
            <Link className='nav-link' to='/login'>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
/**
 *
 * @description A wallet that does wallet stuff.
 * CLick to show account details in a modal or tell you to sign-up
 */
function Wallet() {
  // setup modal state
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(<></>);
  const Modal = () => modal;
  // manage modal state
  const handleModal = () => {
    setOpen((prev) => !prev);
    if (!open) {
      return setModal(<HandleWallet />);
    }
    return setModal(<></>);
  };
  // clean returns
  return (
    <section className='wallet'>
      <button type='button' className='wallet_btn' onClick={handleModal}>
        <img src={WalletPurple} alt='Wallet' className='wallet-icon' />
      </button>
      {/* Position absolute, start at leftmost part */}
      <Modal />
    </section>
  );
}

const useIsMounted: () => React.MutableRefObject<boolean> = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  return isMounted;
};
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
