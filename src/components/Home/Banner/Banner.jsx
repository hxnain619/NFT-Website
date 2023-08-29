import React from "react";
import { Link } from "react-router-dom";
import classes from "./Banner.module.css";

const Banner = () => {
  // const videoRef = useRef(null);
  // const [showOverlayer, setShowOverlay] = useState(true);

  // const handlePlay = () => {
  //   videoRef.current.play();
  //   setShowOverlay(false);
  // };

  // useEffect(() => {
  //   videoRef.current.addEventListener("ended", () => {
  //     setShowOverlay(true);
  //   });
  // }, []);

  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <div className={classes.features}>
          {"EXPLORE. COLLECT."}
          <br />
          SELL NFTs.
        </div>
        <div
          className={classes.description}
        >{`Whether you are an artist or a brand, NFTREASURE provides you with a platform to easily monetize your creativity and make a statement with your designs`}</div>
        <div className={classes.btnContainer}>
          <Link to="/create">
            <div className={classes.btn_1}>Create</div>
          </Link>
          <Link to="/marketplace">
            <div className={classes.btn_2}>Explore</div>
          </Link>
        </div>
      </div>
      {/* <div className={`${classes.demo} ${showOverlayer && classes.active}`}>
        <video poster={poster} ref={videoRef} preload="auto" src={demo} controls />
        <PlayIcon onClick={handlePlay} className={classes.playIcon} />
      </div> */}
    </div>
  );
};

export default Banner;
