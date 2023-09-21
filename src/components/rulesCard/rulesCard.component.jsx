/* eslint-disable react/no-array-index-key */
/* eslint-disable no-constant-condition */
import React, { useContext, useEffect, useRef } from "react";
import { ReactComponent as DeleteIcon } from "../../assets/icon-delete.svg";
import { clearRule, deleteRule, promptDeleteRules, setPrompt } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import { handleImage } from "../preview/collection-preview-script";
import classes from "./rulesCard.module.css";

const RulesCard = ({ showRule }) => {
  const { dispatch, layers, rule, promptRules } = useContext(GenContext);
  const canvasRef = useRef(null);

  const handleClearRule = () => {
    dispatch(setPrompt(promptDeleteRules({})));
  };

  const handleDelete = (deletRule) => {
    dispatch(deleteRule(deletRule));
  };

  useEffect(() => {
    if (promptRules) {
      dispatch(clearRule());
      showRule(false);
      dispatch(promptDeleteRules(null));
    }
  }, [promptRules]);

  const imageHandler = async (idx) => {
    const canvas = canvasRef.current;
    await handleImage({ layers, preview: rule[idx], canvas, height: 100, width: 100 });
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        {rule.map((rl, index) => (
          <div key={index} className={classes.conflictCard}>
            <div className={classes.content}>
              {rl.map((r, idx) => (
                <div key={idx} className={classes.innerContent}>
                  <img className={classes.image} src={URL.createObjectURL(r.imageFile)} alt="" />
                  <div className={classes.description}>
                    <div className={classes.title}>{r.layerTitle}</div>
                    <div className={classes.text}>{r.imageName}</div>
                  </div>
                </div>
              ))}
            </div>
            <div onClick={() => handleDelete(rl)} className={classes.deleteRule}>
              Delete Rule
              <DeleteIcon className={classes.closeIcon} />
            </div>
          </div>
        ))}
      </div>
      {true ? (
        <div className={classes.btnContainer}>
          <button type="button" onClick={() => showRule(false)} className={classes.closeBtn}>
            Go back
          </button>
          <button type="button" onClick={handleClearRule} className={classes.deleteBtn}>
            Delete all rules
          </button>
        </div>
      ) : (
        <div className={classes.notification}>you have not set any rule</div>
      )}
    </div>
  );
};

export default RulesCard;
