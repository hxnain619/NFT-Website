import React, { useState } from "react";
import classes from "./Dropdown.module.css";
import dropdownIcon from "../../../assets/icon-dropdown.svg";
import attributeFilterIcon from "../../../assets/icon-attribute-filter.svg";

const Dropdown = ({ children, title, isAttribute,isAbsolute }) => {
  const [dropdown, toggleDropdown] = useState(false);

  return (
    <div className={`${isAttribute && classes.borders} && ${classes.container} ${isAbsolute && classes.containerOutline} ${isAbsolute && classes.hidden}`}>
      <div onClick={() => toggleDropdown(!dropdown)} className={`${isAbsolute && classes.customHeading} && ${classes.heading}`}>
        <div className={classes.textWrapper}>
          {isAttribute ? <img src={attributeFilterIcon} alt="" /> : ""} <div>{title}</div>
        </div>
        <img className={`${classes.dropdownIcon} ${dropdown && classes.active}`} src={dropdownIcon} alt="" />
      </div>
      <div className={`${classes.content} ${dropdown && classes.active} ${isAbsolute && classes.absolute}`}>{children}</div>
    </div>
  );
};

export default Dropdown;
