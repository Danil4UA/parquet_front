"use client";

import React from 'react';
import './ImageLoader.css';

const ImageLoader = () => {
  return (
    <div className="image-loader-container">
      <div className="image-loader-bar">
        <div className="image-loader-progress"></div>
      </div>
    </div>
  );
};

export default ImageLoader;