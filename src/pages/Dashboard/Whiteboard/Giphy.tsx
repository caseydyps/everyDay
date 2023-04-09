import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Carousel } from '@giphy/react-components';
import React, { useState } from 'react';

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh');

function Giphy() {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalGif, setModalGif] = useState(null);
  const [showCarousel, setShowCarousel] = useState(false);
  const [selectedGif, setSelectedGif] = useState(null);

  const handleSearch = () => {
    setShowCarousel(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setShowCarousel(false);
  };

  const fetchGifs = (offset: number) => {
    return giphyFetch.search(searchTerm, { offset, limit: 10 });
  };

  return (
    <>
      <div>
        <input type="text" value={searchTerm} onChange={handleInputChange} />
        <button onClick={handleSearch}>Search</button>
      </div>
      {selectedGif && (
        <img src={selectedGif.images.original.url} alt={selectedGif.title} />
      )}

      {showCarousel && (
        <>
          <h4>Search Results for "{searchTerm}"</h4>
          <Carousel
            fetchGifs={fetchGifs}
            gifHeight={200}
            gutter={6}
            onGifClick={(gif) => setSelectedGif(gif)}
          />
        </>
      )}
    </>
  );
}

export default Giphy;
