import React from 'react';
import VideoSection from './VideoSection';
import ImageGallery from './ImageGallery';
import CurrencyRates from './CurrencyRates';
import TextSection from './TextSection';

const PageLayout = () => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: '1fr 1fr',
      gap: '20px',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <VideoSection />
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <ImageGallery />
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <CurrencyRates />
      </div>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <TextSection />
      </div>
    </div>
  );
};

export default PageLayout;