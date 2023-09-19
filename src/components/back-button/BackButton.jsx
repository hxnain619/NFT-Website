import React from 'react'
import { useHistory, Link } from "react-router-dom";
import { ReactComponent as ArrowBack } from "../../assets/icon-arrow-left.svg";
import classes from "./BackButton.module.css";
const BackButton = () => {
    const history = useHistory();
  return (
    <div className={classes.container}>
        <Link to="#" className={classes.backBtn} onClick={() => history.goBack()}>
          <ArrowBack /> Back
        </Link>
    </div>
  )
}

export default BackButton