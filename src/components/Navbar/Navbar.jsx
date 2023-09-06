import React, { useEffect, useState } from "react";
import { useLocation, useHistory, NavLink } from "react-router-dom";
import ConnectWallet from "../wallet/wallet";
import classes from "./Navbar.module.css";
import logoDarkIcon from "../../assets/images/logo-dark.svg";
import { NAVIGATION_LIST } from "../../constant/navigation";
import menuIcon from "../../assets/icon-burger.svg";
import MenuButton from "./MenuButton";

// import "./style.scss";

const Navbar = () => {
  const [state, setState] = useState({
    dropdown: false,
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

        <div className={classes.mobileMenu + (mobileMenuOpen ? "" : ` ${classes.invisible}`)}>
          <div className={classes.mobileWalletAuthContainer}>
            <div className={classes.wallet}>
              <ConnectWallet setToggleNav={(states) => handleSetState({ dropdown: states })} />
            </div>
          </div>

          {NAVIGATION_LIST?.map((link) => (
            <a href={link.path}>{link.label}</a>
          ))}
        </div>

        <div className={classes.walletAuthContainer}>
          <div className={classes.wallet}>
            <ConnectWallet setToggleNav={(states) => handleSetState({ dropdown: states })} />
          </div>
        </div>

        <div className={classes.openNavbar} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <MenuButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
