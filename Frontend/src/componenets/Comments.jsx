import { useState } from "react";

function Comments({ card }) {
  const {id: cardId, gifUrl}=card;
  console.log("this cardid is:", cardId);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");
  const VITE_KUDOS_BOARD_API_URl=import.meta.env.VITE_KUDOS_BOARD_API_URL;


  const fetchComments = async () => {
    const res = await fetch(`${VITE_KUDOS_BOARD_API_URl}/comments/${cardId}`);
    const data = await res.json();
    console.log("fetched comment:", data);
    setComments(data);
  };

  const submitComment = async () => {
    if (!newComment) return alert("Comment text is required");

    await fetch(`${VITE_KUDOS_BOARD_API_URl}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newComment, author, cardId }),
    });
    setNewComment("");
    setAuthor("");
    fetchComments();
  };

  return (
    <>
      <button
        onClick={() => {
          setShowComments(true);
          fetchComments();
        }}
      >
        💬 View Comments
      </button>

      {showComments && (
        <div className="modal-overlay" onClick={() => setShowComments(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Comments</h3>
            <img
            src={gifUrl}
            alt="Card Gif"
            style={{
              width:"100%",
              maxHeight:"200px",
              objectFit:"cover",
              marginBottom:"1rem",
              borderRadius:"8px"
            }}
            />
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Your name (optional)"
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Your comment"
            />
            <button onClick={submitComment}>Submit</button>
            <button onClick={() => setShowComments(false)}>Close</button>

            <ul>
              {comments.map((c, i) => (
                <li
                  key={i}
                  style={{
                    backgroundColor: "#f9f9f9",
                    color:"black",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <p>
                    <strong>Author:</strong> {c.author || "Anonymous"}
                  </p>
                  <p>
                    <strong>Message:</strong> {c.text || "(no text)"}
                  </p>
                  {c.gif && (
                    <img src={c.gif} alt="GIF" style={{ maxWidth: "100%" }} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

export default Comments;
