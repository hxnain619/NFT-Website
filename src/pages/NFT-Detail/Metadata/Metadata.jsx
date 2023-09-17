import { useContext } from "react";
import React, { CopyBlock, dracula } from "react-code-blocks";
import { setNotification } from "../../../gen-state/gen.actions";
import { GenContext } from "../../../gen-state/gen.context";
import classes from "./Metadata.module.css";

const Metadata = ({ nftDetails: properties }) => {
  const { dispatch } = useContext(GenContext);
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Metadata</div>
      <div className={classes.content}>
        <CopyBlock
          language="json"
          text={JSON.stringify(properties, null, 2)}
          showLineNumbers={false}
          theme={{ ...dracula, backgroundColor: "#03071099" }}
          wrapLines
          codeBlock
          onCopy={() => {
            dispatch(setNotification({ message: "Metadata copied", type: "success" }));
          }}
        />
      </div>
    </div>
  );
};

export default Metadata;
