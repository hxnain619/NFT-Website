/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-shadow */
import React, { useContext, useEffect, useState, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ReactComponent as ClearIcon } from "../../assets/icon-close.svg";
import { ReactComponent as SearchIcon } from "../../assets/icon-search.svg";
import { GenContext } from "../../gen-state/gen.context";
import handleSuggestions from "./Search-script";
import classes from "./Search.module.css";

const Search = ({ searchPlaceholder, type }) => {
  const history = useHistory();
  const location = useLocation();
  const { searchContainer } = useContext(GenContext);
  const [state, setState] = useState({
    value: "",
    suggestions: null,
    toggleSearch: false,
    ignoreSearch: false,
  });
  const inputRef = useRef(null); // Ref for the input
  const panelRef = useRef(null); // Ref for the panel

  const handleClickOutside = (event) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target) &&
      panelRef.current &&
      !panelRef.current.contains(event.target)
    ) {
      handleSetState({ toggleSearch: false }); // Hide panel
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { value, toggleSearch, suggestions } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleChange = (e) => {
    handleSetState({ value: e.target.value });
    handleSuggestions({ handleSetState, searchContainer, value: e.target.value, type });
    handleSetState({ toggleSearch: e.target.value !== "" });
  };

  const handleClearSearch = () => {
    handleSetState({ value: "", suggestions: null, toggleSearch: false });
  };

  const suggestionURL = (suggestion) => {
    return suggestion?.type !== "1of1"
      ? `/marketplace/collections/${suggestion?.chain === 4160 ? suggestion?.name : suggestion?.Id}`
      : `/marketplace/1of1/${suggestion?.chain}/${suggestion?.Id}`;
  };

  const handleSearch = (suggestion) => {
    handleSetState({ value: "", suggestions: null, toggleSearch: false });
    history.push(suggestionURL(suggestion));
  };

  const hanldeAllResults = (keyword = value) => {
    const params = new URLSearchParams({
      keyword,
    });
    history.replace({ pathname: "/search", search: params.toString() });
    handleSetState({ toggleSearch: false });
  };

  const handleSearchChange = (e) => {
    handleChange(e);
    hanldeAllResults(e.target.value);
  };

  function getHighlightedText(text, highlight) {
    // Split on highlight term and include term into parts, ignore case
    if (text == null) return <span> </span>;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {" "}
        {parts.map((part, i) => (
          <span key={i} style={part.toLowerCase() === highlight.toLowerCase() ? { background: "#20C1FF30" } : {}}>
            {part}
          </span>
        ))}{" "}
      </span>
    );
  }

  return (
    <div className={`${classes.container}`}>
      {location.pathname === "/search" ? (
        <div className={classes.placeholder}>
          <SearchIcon />
          <input
            className={classes.mobile}
            onChange={handleSearchChange}
            type="text"
            value={value}
            placeholder="Search..."
          />
          <input
            className={classes.desktop}
            onChange={handleSearchChange}
            type="text"
            value={value}
            placeholder={searchPlaceholder}
          />
        </div>
      ) : (
        <div className={classes.searchContainer} ref={inputRef}>
          <div className={classes.placeholder}>
            <SearchIcon />
            <input
              className={classes.mobile}
              type="text"
              value={value}
              onChange={handleChange}
              placeholder="Search..."
            />
            <input
              className={classes.desktop}
              type="text"
              value={value}
              onChange={handleChange}
              placeholder={searchPlaceholder}
            />
            <div className={`${classes.clearInput} ${value.length === 0 && classes.hide}`}>
              <ClearIcon onClick={handleClearSearch} />
            </div>
          </div>

          {toggleSearch === true && (
            <div className={classes.suggestions} ref={panelRef}>
              {suggestions && suggestions.length ? (
                suggestions.map((suggestion) => (
                  <div onClick={() => handleSearch(suggestion)} key={suggestion.Id} className={classes.suggestion}>
                    {suggestion?.ipfs_data?.image_mimetype?.includes("video") ? (
                      <video className={classes.image} src={suggestion.image_url} alt="" />
                    ) : suggestion?.ipfs_data?.image_mimetype?.includes("audio") ? (
                      <audio className={classes.image} src={suggestion.image_url} alt="" />
                    ) : (
                      <img
                        className={classes.image}
                        src={
                          suggestion.image_urls && suggestion.image_urls.length > 0
                            ? suggestion.image_urls[0]
                            : suggestion.image_url
                        }
                        alt=""
                      />
                    )}
                    <div className={classes.content}>
                      <div className={classes.name}>{getHighlightedText(suggestion.name, value)}</div>
                      <div className={classes.description}>
                        {getHighlightedText(suggestion?.description?.slice(0, 40), value)}...
                      </div>
                    </div>
                  </div>
                ))
              ) : suggestions ? (
                <div>Couldn’t find any results.</div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;

/*
<div onClick={handleCloseSearch} className={classes.dropdownContainer}>
  <div
    onMouseLeave={() => handleSetState({ ignoreSearch: false })}
    onMouseEnter={() => handleSetState({ ignoreSearch: true })}
    className={classes.dropdown}
  >
    {toggleSearch && (
      <div className={classes.searchContainer}>
        <input onChange={handleChange} value={value} autoFocus type="text" placeholder={searchPlaceholder} />
        <div className={classes.hint}>
          <div className={classes.result}>
            {!suggestions
              ? "No results"
              : suggestions.length
              ? `Showing ${suggestions.length} results `
              : "No results"}
          </div>
          {"    "}
          {value?.length ? (
            <div className={classes.showAll} onClick={() => hanldeAllResults()}>
              Show All results{" "}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    )}
    <div className={classes.suggestions}>
      {suggestions && suggestions.length ? (
        suggestions.map((suggestion) => (
          <div onClick={() => handleSearch(suggestion)} key={suggestion.Id} className={classes.suggestion}>
            {suggestion?.ipfs_data?.image_mimetype?.includes("video") ? (
              <video className={classes.image} src={suggestion.image_url} alt="" />
            ) : suggestion?.ipfs_data?.image_mimetype?.includes("audio") ? (
              <audio className={classes.image} src={suggestion.image_url} alt="" />
            ) : (
              <img className={classes.image} src={suggestion.image_url} alt="" />
            )}
            <div className={classes.content}>
              <div className={classes.name}>{getHighlightedText(suggestion.name, value)}</div>
              <div className={classes.description}>
                {getHighlightedText(suggestion?.description?.slice(0, 40), value)}...
              </div>
              <div className={classes.type_m}>{suggestion.type}</div>
            </div>
            <div className={classes.type}>{suggestion.type}</div>
            <img className={classes.chain} src={supportedChains[suggestion.chain]?.icon} alt="" />
          </div>
        ))
      ) : suggestions ? (
        <div>Couldn’t find any results.</div>
      ) : null}
    </div>
  </div>
</div>
*/
