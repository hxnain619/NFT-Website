import React from "react";
import { Link } from "react-router-dom";
import cards from "./CollectionOptions-script";
import classes from "./CollectionOptions.module.css";
import BackButton from "../../components/back-button/BackButton";

const CollectionOptions = () => {
  return (
    <div className={classes.container}>
      <BackButton />
      <div className={classes.header}>
        <div className={classes.title}>Create</div>
        <div className={classes.description}>Create all types of NFTs, automatically indexed in our marketplace.</div>
      </div>
      <div className={classes.cardDeck}>
        {cards.map((type) => (
          <Link to={type.url} className={classes.typeCard} key={type.title}>
            <div className={classes.icon}>{type.icon}</div>
            <div className={classes.cardTitle}>{type.title}</div>
            <div className={classes.cardDescription}>{type.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CollectionOptions;
