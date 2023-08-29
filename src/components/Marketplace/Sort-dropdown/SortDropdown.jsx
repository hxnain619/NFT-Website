/* eslint-disable react/no-array-index-key */
/* eslint-disable consistent-return */
/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from "react";
import classes from "./SortDropdown.module.css";
import Dropdown from "../../../pages/Explore/Dropdown/Dropdown";
import RadioButton from "../../../pages/Explore/Radio-Button/RadioButton";
import { ReactComponent as SortIcon } from "../../../assets/icon-filter2.svg";
import dropdownIcon from "../../../assets/icon-dropdown.svg";

const SortDropdown = ({ _handleSort, collection }) => {
  const [dropdown, toggleDropdown] = useState(false);
  const [state, setState] = useState({
    toggleSort: false,
    filter: {
      status: "",
      sortby: "",
      minPrice: "",
      maxPrice: "",
    },
    inContainer: false,
  });

  const { filter, toggleSort, inContainer } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const wrapperRef = useRef(null);
  const hanldeClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      handleSetState({ toggleSort: false });
    }
  };

  useEffect(() => {
    if (inContainer) {
      document.addEventListener("click", hanldeClickOutside, true);
      return () => document.removeEventListener("click", hanldeClickOutside, true);
    }
  }, [inContainer]);

  const handleStatus = (value) => {
    handleSetState({ filter: { ...filter, status: value } });
    handleSort({ type: "status", value });
  };

  const handleSort = (value) => {
    handleSetState({ filter: { ...filter, sortby: value } });
    _handleSort(value);
  };

  const handlePriceChange = (e) => {
    let { name, value } = e.target;
    value = Number(value);
    handleSetState({ filter: { ...filter, [name]: value >= 0 ? value : "" } });
  };

  const handleApply = () => {
    if (filter.maxPrice < filter.minPrice) return;
    handleSort({
      type: "range",
      value: { minPrice: filter.minPrice, maxPrice: filter.maxPrice },
    });
    handleSetState({ filter: { ...filter, minPrice: 0, maxPrice: 0 } });
  };

  const handleCancel = () => {
    handleSetState({ filter: { ...filter, minPrice: 0, maxPrice: 0 }, toggleSort: false });
    handleSort({ type: "cancel" });
  };

  const statusSort = ["Listed", "Not Listed"];
  const sortSort = ["Newest", "Oldest", "Highest price", "Lowest price", "a - z", "z - a"];

  return (
    <div className={classes.container} ref={wrapperRef}>
      <div onClick={() => handleSetState({ toggleSort: !toggleSort, inContainer: true })} className={classes.filterBtn}>
        <div style={{ padding: 1 }}>Sort By</div>
        <img className={`${classes.dropdownIcon} ${dropdown && classes.active}`} src={dropdownIcon} alt="" />
      </div>
      <div className={`${classes.wrapper} ${toggleSort && classes.active}`}>
        {/* <div className={classes.filterHeading}>
          <SortIcon />
          <div>Sorts</div>
        </div> */}
        {/* {!collection && (
          <Dropdown title="Status">
            <div className={classes.dropdown}>
              {statusSort.map((status, idx) => (
                <div key={idx} className={classes.status} onClick={() => handleStatus(status)}>
                  <RadioButton active={status === filter.status} />
                  <div>{status}</div>
                </div>
              ))}
            </div>
          </Dropdown>
        )} */}
        <Dropdown title="Sort by">
          <div className={classes.dropdown}>
            {sortSort.map((sort, idx) => (
              <div key={idx} className={classes.sort}>
                <RadioButton onClick={() => handleSort(sort)} active={sort === filter.sortby} />
                <div>{sort}</div>
              </div>
            ))}
          </div>
        </Dropdown>
        {/* <Dropdown title="Price (USD)">
          <div className={classes.priceDropdown}>
            <div className={classes.inputContainer}>
              <div className={classes.label}>Min</div>
              <input type="number" name="minPrice" value={filter.minPrice} onChange={handlePriceChange} />
            </div>
            <div>to</div>
            <div className={classes.inputContainer}>
              <div className={classes.label}>Max</div>
              <input type="number" name="maxPrice" value={filter.maxPrice} onChange={handlePriceChange} />
            </div>
          </div>
          <div className={classes.btnContainer}>
            <div onClick={handleApply} className={`${classes.btn} ${classes.apply}`}>
              Apply
            </div>
            <div onClick={handleCancel} className={`${classes.btn} ${classes.cancel}`}>
              Cancel
            </div>
          </div>
        </Dropdown> */}
      </div>
    </div>
  );
};

export default SortDropdown;
