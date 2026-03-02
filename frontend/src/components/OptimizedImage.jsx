import React, { useState } from 'react';

const OptimizedImage = ({ src, blur, alt, className, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative overflow-hidden w-full h-full">
      {/* Blur placeholder - shows immediately */}
      {blur && (
        <img
          src={blur}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
          aria-hidden="true"
        />
      )}
      
      {/* Actual image */}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
