import { useAccounts, useSubstrate } from 'chocolate/substrate-lib/SubstrateContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AccountSelector from '../../AccountSelector';
import WalletPurple from '../../assets/wallet-purple.svg';
import './index.css';

/**
 * @description - A modal that either shows wallet info - account
 * selected and balances - rankpoints and regular, or it shows connect depending on wallet connection.
 */
const WalletModal: React.FC<{ connected?: boolean }> = function (props) {
  const { connected } = props;
  const { keyringState } = useSubstrate();
  const [run, setRun] = useState(false);
  const { dispatch, loadAccounts } = useAccounts();
  const state = useSubstrate();

  useEffect(() => {
    if (run) {
      let doRun = async () => {
        return loadAccounts(state, dispatch);
      };

      doRun().then(() => {
        alert(keyringState);
        setRun(false);
      });
    }
  }, [run]);
  let content;
  // do the keyring stuff here too.
  if (keyringState === 'LOADING') content = <p>Loading... </p>;
  else if (keyringState === 'ERROR') content = <p>Something went wrong, please refresh the page</p>;
  else if (!connected) {
    content = (
      <>
        <p>Your wallet is not connected, do connect</p>
        <button onClick={() => setRun(true)}>Connect wallet</button>
      </>
    );
  } else {
    content = (
      <AccountSelector/>
    );
    return content;
  }

  return <div>{content}</div>;
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
  }, [connected]);

  if (connected || keyringState === 'READY') {
    return <WalletModal connected></WalletModal>;
  } else {
    return <WalletModal></WalletModal>;
  }
};

function Navlinks() {
  return (
    <nav className='nav-links'>
      <ul className='nav-links_ul'>
        <li className='nav-link'><Link to='/about'>About</Link></li>
        <li className='nav-link'><Link to='/team'>Team</Link></li>
        <li className='nav-link'><Link to='/projects'>Projects</Link></li>
        <li className='nav-link'><Link to='/choc'>CHOC Token</Link></li>
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
    setOpen(prev => !prev);
    if (!open) {
      return setModal(<HandleWallet />);
    } else {
      return setModal(<></>);
    }
  };
  // clean returns
  return (
    <section className='wallet'>
      <button className='wallet_btn' onClick={handleModal}>
        <img src={WalletPurple} alt='Wallet' className='wallet-icon' />
      </button>
      {/* Position absolute, start at leftmost part */}
      <Modal />
    </section>
  );
}
function Menu() {
  return (
    <header>
      <Navlinks />
      <Wallet />
    </header>
  );
}

export default Menu;
