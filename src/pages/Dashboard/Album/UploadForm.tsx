import React, { useState } from 'react';

interface UploadFormProps {
  album: string;
  onUpload: (file: File | null, albumName: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ album, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [albumName, setAlbumName] = useState<string>('');
  const [hashtags, setHashtags] = useState<string>('');
  const [members, setMembers] = useState<number[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
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
            value={members.map((member) => String(member))}
            onChange={(e) =>
              setMembers(
                Array.from(e.target.selectedOptions, (option) =>
                  Number(option.value)
                )
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
