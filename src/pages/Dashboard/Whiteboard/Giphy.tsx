import { GiphyFetch } from '@giphy/js-fetch-api';
import { GifsResult } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';
import { Carousel } from '@giphy/react-components';
import React, { useState } from 'react';

const giphyFetch = new GiphyFetch('sXpGFDGZs0Dv1mmNFvYaGUvYwKX0PWIh');

function Giphy(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [modalGif, setModalGif] = useState<IGif | null>(null);
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const [selectedGif, setSelectedGif] = useState<IGif | null>(null);

  const handleSearch = (): void => {
    setShowCarousel(true);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchTerm(event.target.value);
    setShowCarousel(false);
  };

  const fetchGifs = async (offset: number): Promise<GifsResult> => {
    const gifs = await giphyFetch.search(searchTerm, { offset, limit: 10 });
    return gifs;
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
            onGifClick={(gif: IGif, e: React.SyntheticEvent<HTMLElement>) =>
              setSelectedGif(gif)
            }
          />
        </>
      )}
    </>
  );
}

export default Giphy;
