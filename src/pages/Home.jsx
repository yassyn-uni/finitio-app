import React from 'react';
import Hero from '../components/hero';
import Pourquoi from '../components/Pourquoi';
import Fonctionnalites from '../components/Fonctionnalites';
import Cta from '../components/Cta';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <Pourquoi />
      <Fonctionnalites />
      <Cta />
    </div>
  );
};

export default Home;
