import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import FAQ from "../../components/Home/FAQ/FAQ";
import classes from "./home.module.css";
import CreatePane from "../../components/Home/CreatePane/CreatePane";
import ExplorePane from "../../components/Home/ExplorePane/ExplorePane";

import HomeNfts from "../../components/Marketplace/HomeNfts/HomeNfts";

const Home = () => (
  <div className={classes.container}>
    <Banner />
    <CreatePane />
    <ExplorePane />
    {/* <HomeNfts /> */}
    {/* <FAQ /> */}
  </div>
);

export default Home;
