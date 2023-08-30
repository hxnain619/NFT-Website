import React from "react";
import classes from "./Attribute.module.css";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";

const Attribute = ({ attribute, removeAttribute, id, changeAttribute, index, iscat }) => (
  <div className={classes.container}>
    <input
      name="trait_type"
      type="text"
      value={attribute.trait_type}
      onChange={(event) => changeAttribute({ event, id })}
      // placeholder="eg. eyes"
    />
    <input
      name="value"
      type="text"
      value={attribute.value}
      className={classes.inputPlaceholder}
      onChange={(event) => changeAttribute({ event, id })}
      // placeholder="eg. green"
    />
    <button
      className={iscat || index === "0" ? classes._0 : ""}
      type="button"
      onClick={() => (iscat || index === "0" ? "" : removeAttribute(id))}
    >
      <CloseIcon className={classes.closeIcon} />
    </button>
  </div>
);

export default Attribute;
