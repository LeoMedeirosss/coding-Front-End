import React from 'react';

const ImageGallery = () => {
  const images = [
    'https://picsum.photos/200/200?random=1',
    'https://picsum.photos/200/200?random=2',
    'https://picsum.photos/200/200?random=3',
    'https://picsum.photos/200/200?random=4'
  ];

  return (
    <div style={{ height: '100%' }}>
      <h2>Galeria de Imagens</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '10px',
        height: 'calc(100% - 40px)'
      }}>
        {images.map((img, index) => (
          <img 
            key={index}
            src={img}
            alt={`Imagem ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '5px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;