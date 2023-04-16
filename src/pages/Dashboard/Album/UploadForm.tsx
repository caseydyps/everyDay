// import React, { useState } from 'react';

// interface UploadFormProps {
//   album: string;
//   onUpload: (file: File | null, albumName: string) => void;
// }

// const UploadForm: React.FC<UploadFormProps> = ({ albums, onUpload }) => {
//   const [file, setFile] = useState<File | null>(null);
//   const [albumName, setAlbumName] = useState<string>('');
//   const [hashtags, setHashtags] = useState<string>('');
//   const [members, setMembers] = useState<number[]>([]);

//   const [newAlbumName, setNewAlbumName] = useState('');
//   const [selectedAlbumId, setSelectedAlbumId] = useState('');

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(file, albumName);
//     onUpload(file, albumName);
//     console.log('here');
//   };

//   const memberList = [
//     { id: 1, name: 'Casey' },
//     { id: 2, name: 'Nina' },
//     { id: 3, name: 'Baozi' },
//   ];

//   const handleUpload = async () => {
//     if (!file) {
//       console.error('No file selected!');
//       return;
//     }

//     try {
//       // Generate a unique ID for the new photo
//       const newId = Date.now();
//       // Create a new photo object with the file information and ID
//       const newPhoto = {
//         id: newId,
//         title: file.name,
//         url: '', // Leave URL blank for now
//         members: members,
//         hashtags: hashtags.split(',').map((tag) => tag.trim()),
//       };

//       let updatedAlbums;

//       if (albumName) {
//         // Check if album with the given name already exists
//         console.log('hi');
//         const existingAlbum = albums.find((album) => album.title === albumName);

//         if (existingAlbum) {
//           // Add the new photo to the existing album's photos array
//           existingAlbum.photos.push(newPhoto);
//           // Create a new array of albums with the updated album
//           updatedAlbums = albums.map((album) =>
//             album.id === existingAlbum.id ? existingAlbum : album
//           );
//         } else {
//           // Create a new album with the new album name and the new photo
//           const newAlbum = {
//             id: Date.now(),
//             title: albumName,
//             photos: [newPhoto],
//           };
//           // Add the new album to the array of albums
//           updatedAlbums = [...albums, newAlbum];
//         }
//       } else if (selectedAlbumId) {
//         // Add the new photo to the selected album's photos array
//         const updatedAlbum = albums.find(
//           (album) => album.id === Number(selectedAlbumId)
//         );
//         updatedAlbum.photos.push(newPhoto);
//         // Create a new array of albums with the updated album
//         updatedAlbums = albums.map((album) =>
//           album.id === Number(selectedAlbumId) ? updatedAlbum : album
//         );
//       } else {
//         console.error('No album selected or new album name entered!');
//         return;
//       }

//       // Upload the file to Firebase Storage
//       const storageRef = ref(storage, `photos/${newId}`);
//       await uploadBytes(storageRef, file);

//       // Get the download URL of the uploaded file
//       const downloadURL = await getDownloadURL(storageRef);

//       // Update the URL of the new photo with the download URL
//       newPhoto.url = downloadURL;

//       // Update the state with the new array of albums
//       setAlbums(updatedAlbums);
//       localStorage.setItem('albums', JSON.stringify(updatedAlbums));

//       // Reset the form
//       setFile(null);
//       setAlbumName('');
//       setHashtags('');
//       setMembers([]);

//       console.log(
//         'Photo uploaded to Firebase Storage and URL saved to Firestore!'
//       );
//     } catch (error) {
//       console.error('Error uploading photo to Firebase: ', error);
//     }
//   };

//   const handleNewAlbumNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setNewAlbumName(e.target.value);
//   };

//   const handleAlbumSelectionChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     setSelectedAlbumId(e.target.value);
//   };

//   return (
//     <div>
//       <h3>Add a Photo</h3>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Choose a photo:
//           <input
//             type="file"
//             onChange={(e) => {
//               const files = e.target.files;
//               if (!files) return;
//               for (let i = 0; i < files.length; i++) {
//                 handleUpload(files[i]);
//               }
//             }}
//             multiple
//           />
//           {/* <input
//             type="file"
//             multiple
//             onChange={(e) => handleUpload(e.target.files)}
//           /> */}
//         </label>
//         <br />
//         <label>
//           AlbumName:
//           <input
//             type="text"
//             value={albumName}
//             onChange={(e) => setAlbumName(e.target.value)}
//           />
//         </label>
//         <label>
//           Hashtags (separate with commas):
//           <input
//             type="text"
//             value={hashtags}
//             onChange={(e) => setHashtags(e.target.value)}
//           />
//         </label>
//         <label>
//           Members:
//           <select
//             multiple
//             value={members.map((member) => String(member))}
//             onChange={(e) =>
//               setMembers(
//                 Array.from(e.target.selectedOptions, (option) =>
//                   Number(option.value)
//                 )
//               )
//             }
//           >
//             {memberList.map((member) => (
//               <option key={member.id} value={member.id}>
//                 {member.name}
//               </option>
//             ))}
//           </select>
//         </label>
//         <div>
//           <label htmlFor="album-select">Select album:</label>
//           <select
//             id="album-select"
//             value={selectedAlbumId}
//             onChange={(e) => setSelectedAlbumId(e.target.value)}
//           >
//             <option value="">None</option>
//             {albums.map((album) => (
//               <option key={album.id} value={album.id}>
//                 {album.title}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div>
//           <label htmlFor="new-album-name">New album name:</label>
//           <input
//             type="text"
//             id="new-album-name"
//             value={newAlbumName}
//             onChange={(e) => {
//               setNewAlbumName(e.target.value);
//               setSelectedAlbumId(e.target.value);
//             }}
//           />
//         </div>
//         <br />
//         <button type="submit">Upload</button>
//       </form>
//     </div>
//   );
// };

// export default UploadForm;
export {};
