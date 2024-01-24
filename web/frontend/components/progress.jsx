import React, { useState, useEffect } from 'react';
import { AppProvider, ProgressBar } from '@shopify/polaris';

const ProgressIndicatorExample = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulating progress update (0 to 100)
      setProgress(prevProgress => (prevProgress < 100 ? prevProgress + 10 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppProvider>
      <div style={{ width: '250px', margin: '20px' }}>
        <ProgressBar progress={progress} size="medium" />
      </div>
    </AppProvider>
  );
};

export default ProgressIndicatorExample;
