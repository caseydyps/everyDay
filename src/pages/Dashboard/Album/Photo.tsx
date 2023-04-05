import React from 'react';

const Photo = ({ photo, members = [], hashtags = [] }) => {
  return (
    <div>
      <img src={photo.url} alt={photo.caption} />
      <p>{photo.caption}</p>
      {members.length > 0 && (
        <div>
          <span>Members:</span>
          {members.map((member) => (
            <span key={member.id}>{member.name}</span>
          ))}
        </div>
      )}
      {hashtags.length > 0 && (
        <div>
          <span>Hashtags:</span>
          {hashtags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Photo;
