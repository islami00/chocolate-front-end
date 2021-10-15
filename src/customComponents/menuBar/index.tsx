import { useState } from "react";
import WalletPurple from '../../assets/wallet-purple.svg';
import "./index.css";
/**
 * @description calls async load accounts
 * */
const handleConnect = function () {
  alert("Connected!");
};

/**
 * @description - A modal that either shows wallet info - account
 * selected and balances - rankpoints and regular, or it shows connect depending on wallet connection.
 */
const WalletModal: React.FC<{ connected?: boolean }> = function (props) {
  const { connected } = props;
  let content;
  if (!connected) {
    content = (
      <>
        <p>Your wallet is not connected, do connect</p>
        <button onClick={handleConnect}>Connect wallet</button>
      </>
    );
  } else {
    content = (
      <>
        <ul>
          <li>Account selected: </li>
          <li>Balance:</li>
          <li>Rank points: </li>
        </ul>
      </>
    );
  }

  return <div>{content}</div>;
};

/**
 * @description It should check if connected or not.
 * If wallet is connected, show a dropdown that shows accountSelected and balances.
 * If wallet is not collected, show dropdown with connectWallet button.
 *
 */
const handleWallet = function () {
  const connected = false;
  if (connected) {
    return <WalletModal connected></WalletModal>;
  } else {
    return <WalletModal></WalletModal>;
  }
};
function Navlinks() {
  return (
    <nav className='nav-links'>
      <ul className='nav-links_ul'>
        <li className='nav-link'>About</li>
        <li className='nav-link'>Team</li>
        <li className='nav-link'>Projects</li>
        <li className='nav-link'>CHOC Token</li>
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
      return setModal(handleWallet());
    } else {
      return setModal(<></>);
    }
  };
  // clean returns
  return (
    <section className='wallet'>
      <button className='wallet_btn' onClick={handleModal}>
        <img src={WalletPurple} alt="Wallet" className='wallet-icon' />
      </button>
      {/* Position absolute, start at leftmost part */}
      <Modal />
    </section>
  );
}
function Menu() {
  // const walletContext = createContext({connected: false});
  return (
    <header>
      <Navlinks />
      <Wallet />
    </header>
  );
}

export default Menu;
