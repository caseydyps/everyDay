import React, { useState } from 'react';

const UploadForm = ({ album, onUpload }) => {
  const [file, setFile] = useState(null);
  const [albumName, setAlbumName] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload(file, albumName);
  };

  const memberList = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' },
  ];

  return (
    <div>
      <h3>Add a Photo</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Choose a photo:
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        <br />
        <label>
          AlbumName:
          <input
            type="text"
            value={albumName}
            onChange={(e) => setAlbumName(e.target.value)}
          />
        </label>
        <label>
          Hashtags (separate with commas):
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
          />
        </label>
        <label>
          Members:
          <select
            multiple
            value={members}
            onChange={(e) =>
              setMembers(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {memberList.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default UploadForm;
