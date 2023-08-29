import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import ConnectWallet from "../wallet/wallet";
import classes from "./Navbar.module.css";
import logo from "../../assets/Genadro-logo.svg";
import logoDarkIcon from "../../assets/images/logo-dark.svg";
import drop from "../../assets/drop.svg";
import { ReactComponent as CloseIcon } from "../../assets/icon-close.svg";
import hamburgerIcon from "../../assets/icon-hamburger.svg";
import Search from "../Search/Search";
import { NAVIGATION_LIST } from "../../constant/navigation";
import { NavLink, useNavigate } from "react-router-dom";
import { setActiveNavLink } from "../../utils";
// import "./style.scss";

const Navbar = () => {
  const [state, setState] = useState({
    dropdown: false,
  });

  const { dropdown } = state;
  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };
  const { pathname } = useLocation();
  const history = useHistory();

  useEffect(() => {
    window.sessionStorage.showWelcomeScreen = true;
  }, []);

  return (
    <header className={classes.header}>
      <div className={classes.wrapper}>
        <div className={classes.logo}>
          <img src={logoDarkIcon} alt="" onClick={() => history.push("/")} />
        </div>
        <div className={classes.topMenu}>
          <nav className={classes.topNav}>
            {NAVIGATION_LIST?.map((link) => {
              // if (link?.path === '/game' && !token?.selected) return null

              return (
                <NavLink
                  className={`${classes.navItem} ${pathname == link.path ? classes.active : ""}`}
                  to={link.path}
                  key={link.label}
                >
                  {link.label}
                  <div className={classes.navDecorator} />
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className={classes.walletAuthContainer}>
          <div className={classes.wallet}>
            <ConnectWallet setToggleNav={(states) => handleSetState({ dropdown: states })} />
          </div>
        </div>
        {/* {dropdown ? (
          <CloseIcon onClick={() => handleSetState({ dropdown: !dropdown })} className={classes.closeIcon} />
        ) : (
          <img
            onClick={() => handleSetState({ dropdown: !dropdown })}
            className={classes.iconOpen}
            src={hamburgerIcon}
            alt=""
          />
        )} */}
        {/* <div className="header__controls">
            <div className="header__balance--container">
              {!!user?.wallet_id && <div className="header__balance">{`${balanceAvax} AVAX`}</div>}
              <button
                className={`${user?.wallet_id ? "connected" : ""} button`}
                onMouseEnter={onShowAccount}
                onMouseLeave={onHideAccount}
                onClick={!user?.wallet_id ? openConnectWalletModal : null}
              >
                {!!user?.wallet_id ? titleWalletAddress : "Connect wallet"}
                {!!user && (
                  <img src={!!user?.avatar ? user?.avatar : avatarPlaceholder} className={"header__avatar"} alt={""} />
                )}
              </button>
            </div>
          </div> */}
      </div>

      {/* {handleWalletConnectModal.isActive && (
        <WalletConnectModal
          isOpen={handleWalletConnectModal.isActive}
          onClose={handleWalletConnectModal.close}
          connectMetamask={onConnectWallet}
          connectWalletConnect={handleWalletConnect}
        />
      )} */}
    </header>
  );
};

export default Navbar;
