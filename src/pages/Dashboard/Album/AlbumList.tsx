import React from 'react';

interface Album {
  id: number;
  title: string;
}

interface Props {
  albums: Album[];
}

const AlbumList: React.FC<Props> = ({ albums }) => {
  return (
    <div>
      <h2>Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.id}>{album.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default AlbumList;
