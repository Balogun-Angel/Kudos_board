// import React, { useState } from "react";

// function CreateCardModal({ onClose, onSubmit }) {
//   const [message, setMessage] = useState("");
//   const [gifUrl, setGifUrl] = useState("");
//   const [author, setAuthor] = useState("");

//   const handleSubmit = () => {
//     if (!message || !gifUrl) {
//       alert("Message and GIF URL are required.");
//       return;
//     }
//     onSubmit({ message, gifUrl, author });
//     onClose(); // Close the modal after submitting
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Create a New Card</h2>

//         <input
//           type="text"
//           placeholder="Enter card description"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter GIF URL"
//           value={gifUrl}
//           onChange={(e) => setGifUrl(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Enter owner (optional)"
//           value={author}
//           onChange={(e) => setAuthor(e.target.value)}
//         />

//         <button onClick={handleSubmit}>Create Card</button>
//         <button onClick={onClose}>Cancel</button>
//       </div>
//     </div>
//   );
// }

// export default CreateCardModal;
