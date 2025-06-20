import { useState } from "react";

function Comments({ cardId }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [author, setAuthor] = useState("");

  const fetchComments = async () => {
    const res = await fetch(`http://localhost:3000/comments/${cardId}`);
    const data = await res.json();
    console.log("Fetched comments: ", data);
    setComments(data);
  };

  const submitComment = async () => {
    if (!newComment) return alert("Comment text is required");

    await fetch("http://localhost:3000/comments", {
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
        <div className= "popup-overlay" onClick={() => setShowComments(false)}>
        <div className="comment-modal" onClick={(e) => e.stopPropagation()}>
          <h3>Comments</h3>
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
            {comments.map((c) => (
              <li key={c.id}>
                <strong>{c.author || "Anonymous"}:</strong> {c.text}
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
