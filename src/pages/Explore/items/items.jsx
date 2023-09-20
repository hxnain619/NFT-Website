/* eslint-disable react/react-in-jsx-scope */
import { useContext } from "react";
import SearchBar from "../../../components/Marketplace/Search-bar/searchBar.component";
import classes from "../Explore.module.css";
import './Items.css'
import Filter from "../Filter/Filter";
import Menu from "../Menu/Menu";
import Dropdown from "../Dropdown/Dropdown";
import RadioButton from "../Radio-Button/RadioButton";
import { ReactComponent as CloseIcon } from "../../../assets/icon-close.svg";
import { GenContext } from "../../../gen-state/gen.context";

const Items = ({ handleSetState, state, collectionName }) => {
  const { toggleFilter, attributes, filter, filterToDelete, FilteredCollection, headerHeight, loadedChain } = state;
  const sortFilter = ["Newest", "Oldest", "Highest price", "Lowest price", "a - z", "z - a"];
  const handleFilter = (_filter) => {
    handleSetState({ filter: { ...filter, ..._filter } });
  };
  const handleSort = (sort) => {
    handleSetState({ filter: { ...filter, sortby: sort } });
  };

  const { algoCollections } = useContext(GenContext);

  return (
    <>
    <div className="searchSortWrapper">
     <div className={classes.searchContainer}>
          <SearchBar onSearch={(value) => handleSetState({ filter: { ...filter, searchValue: value } })} />
        </div>
        <Dropdown title="Sort by" isAbsolute >
              {sortFilter.map((sort, idx) => (
                <div key={idx} className="collectionSort">
                  <RadioButton onClick={() => handleSort(sort)} active={sort === filter.sortby} />
                  <div>{sort}</div>
                </div>
              ))}
        </Dropdown>
    </div>
       


    <div className={classes.displayWrapper}>
      
      <Filter
        handleFilter={handleFilter}
        filterToDelete={filterToDelete}
        attributes={attributes}
        toggleFilter={toggleFilter}
        handleExploreSetState={(prop) => handleSetState({ ...prop })}
      />
      <main className={classes.main}>
       

        <div className={classes.filterDisplay}>
          {filter?.attributes &&
            filter.attributes.map((f) => (
              <div key={Date.now()} className={classes.filteredItem}>
                <span>{f.trait_type}</span>:<span>{f.value}</span>
                <CloseIcon onClick={() => handleSetState({ filterToDelete: f })} className={classes.closeIcon} />
              </div>
            ))}
          {filter?.attributes && filter.attributes.length ? (
            <div onClick={() => handleSetState({ filterToDelete: [] })} className={classes.clearFilter}>
              clear all
            </div>
          ) : null}
        </div>
        <Menu
          headerHeight={headerHeight}
          NFTCollection={FilteredCollection}
          loadedChain={loadedChain}
          //chain={algoCollections[collectionName.trimEnd()]?.chain}
          toggleFilter={toggleFilter}
        />
      </main>
    </div>
    </>

  );
};

export default Items;
