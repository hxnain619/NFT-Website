/* eslint-disable react/no-array-index-key */
import React from "react";
import classes from "./footer.module.css";
import logoDarkIcon from "../../assets/images/logo-dark.svg";
import { footerLinks, socialLinks } from "./footer-script";

const Footer = () => (
  <div id="hide-footer">
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.top}>
          <div className={classes.wrapper}>
            <div className={classes.topLeft}>
              <a href="/">
                <img src={logoDarkIcon} alt="" />
              </a>
              <div className={classes.socialIcons}>
                {socialLinks.map((social, idx) => (
                  <a key={idx} className={classes.icon} href={social.link} target="_blank" rel="noopener noreferrer">
                    <img src={social.icon} alt={`Minority Programmers ${social.name}`} />
                  </a>
                ))}
              </div>
            </div>
            <div className={classes.topRight}>
              {footerLinks.map((link, idx) => (
                <div key={link.id} className={classes.links}>
                  <div className={classes.title}>{link.title}</div>
                  {idx === 0 ? (
                    link.content.map((linkE) => (
                      <a href={linkE.link} key={linkE.id}>
                        {linkE.name}
                      </a>
                    ))
                  ) : (
                    <div className={classes.gridlinks}>
                      {link.content.map((linkE) => (
                        <a className={classes.griditem} href={linkE.link} key={linkE.id}>
                          {linkE.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.bottom}>
          <div className={classes.wrapper}>
            <div>
              <div className={classes.termsAndPolicy}>Copyright © 2022 NFTreasure Platform. All rights reserved</div>
              {/* <div className={classes.termsAndPolicy}>
                2022 Genadrop |
                <a
                  href="https://docs.google.com/document/d/16tRGt3sCIauMNDCwq5A99zYUxwU8S5bpGhI0eaJzwAw/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Policy |
                </a>
                <a
                  href="https://docs.google.com/document/d/1Ofbw5j9l3MnOFSa2cALcnJJI6iQz86SdiNmQAp1f6AE/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms of Use |
                </a>
                <div className={classes.orgs}>
                  Powered by
                  {orgs.map((org) => (
                    <a key={org.link} href={org.link} target="_blank" rel="noopener noreferrer">
                      <img key={org.name} src={org.icon} alt="" />
                    </a>
                  ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
