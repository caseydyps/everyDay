// import React from 'react';

// type Member = {
//   id: string;
//   name: string;
// };

// type PhotoProps = {
//   photo: {
//     url: string;
//     caption: string;
//   };
//   members?: Member[];
//   hashtags?: string[];
// };

// const Photo = ({ photo, members = [], hashtags = [] }: PhotoProps) => {
//   console.log(photo);
//   return (
//     <div>
//       <img src={photo.url} alt={photo.caption} />
//       <p>{photo.caption}</p>
//       {members.length > 0 && (
//         <div>
//           <span>Members:</span>
//           {members.map((member) => (
//             <span key={member.id}>{member.name}</span>
//           ))}
//         </div>
//       )}
//       {hashtags.length > 0 && (
//         <div>
//           <span>Hashtags:</span>
//           {hashtags.map((tag) => (
//             <span key={tag}>{tag}</span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Photo;
export {}; 