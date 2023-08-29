import React from "react";
import Banner from "../../components/Home/Banner/Banner";
import Features from "../../components/Home/Features/Features";
import Review from "../../components/Home/Review/Review";
import FAQ from "../../components/Home/FAQ/FAQ";
import Orgs from "../../components/Home/Orgs/Orgs";
import classes from "./home.module.css";
import CreatePane from "../../components/Home/CreatePane/CreatePane";
import ExplorePane from "../../components/Home/ExplorePane/ExplorePane";
import CameraMint from "../../components/Home/Camera-Mint/CameraMint";
import EarlyAccess from "../../components/Home/early-access/early-access";
// import Plans from "../../components/Home/Plans/Plans";
// import JoinDiscord from "../../components/Home/Join-Discord/JoinDiscord";
import Media from "../../components/Media/Media";
import Partners from "../../components/Partners/Partners";
import Explore from "../Explore/Explore";

import HomeNfts from "../../components/Marketplace/HomeNfts/HomeNfts";
import TopCollections from "../../components/Marketplace/TopCollections/TopCollections";

const Home = () => (
  <div className={classes.container}>
    <Banner />
    {/* <TopCollections /> */}
    {/* <Orgs />
    <EarlyAccess />
    <CameraMint />
    <Features /> */}
    {/* <Plans /> */}
    <CreatePane />
    <ExplorePane />
    <HomeNfts />
    {/* <Review /> */}
    {/* <JoinDiscord /> */}
    {/* <Partners /> */}
    <FAQ />
    {/* <Media /> */}
  </div>
);

export default Home;
