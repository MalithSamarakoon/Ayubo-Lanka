import React from 'react'
import Hero from '../Component/Hero'
import LatestCollection from '../Component/LatestCollection';
import BestSeller from '../Component/BestSeller';
import OurPrivacy from '../Component/OurPolicy';
import OurPolicy from '../Component/OurPolicy';
import NewsLetterBox from '../Component/NewsLetterBox';
import Quize from '../Component/Quize';


const Home = () => {
  return (
    <div>
      <Hero />
      <Quize/>
      <LatestCollection/>
      <BestSeller/>
   <OurPolicy />
   <NewsLetterBox />
    </div>
  );
}

export default Home
