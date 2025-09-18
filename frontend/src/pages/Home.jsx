import React from "react";
import Hero from "../Component/Hero";
import LatestCollection from "../Component/LatestCollection";
import OurPrivacy from "../Component/OurPolicy";
import OurPolicy from "../Component/OurPolicy";
import NewsLetterBox from "../Component/NewsLetterBox";

const Home = () => {
  return (
    <div className="bg-white">
      <Hero />
      <LatestCollection />
      <OurPolicy />
      <NewsLetterBox />
    </div>
  );
};

export default Home;
