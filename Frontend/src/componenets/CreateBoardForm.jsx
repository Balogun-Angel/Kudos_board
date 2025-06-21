import { useState } from "react";

function CreateBoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const VITE_KUDOS_BOARD_API_URl=import.meta.env.VITE_KUDOS_BOARD_API_URL;


  const handleCreateBoard = () => {
    if (!title || !category) {
      alert("Board Title and Category are required");
      return;
    }
    setError(" ");

    fetch(`${VITE_KUDOS_BOARD_API_URl}/boards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, category, author }),
    })
      .then((res) => res.json())
      .then((newBoard) => {
        onBoardCreated(newBoard);
        setTitle("");
        setCategory("");
        setAuthor("");
      })
      .catch((err) => {
        setError("Failed to create board. Please try again.");
        console.error(err);
      });
  };

  return (
    <div className="create-board-form">
      <h2>Create a New Board</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          placeholder="Board Title (required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value=""> Select Category</option>
          <option value="Celebration">Celebration</option>
          <option value="Thank You">Thank You</option>
          <option value="Inspiration">Inspiration</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="author">Author:</label>

        <input
          id="author"
          type="text"
          placeholder="Author (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>
      <button className="create-btn" onClick={handleCreateBoard}>
        Create Board
      </button>
    </div>
  );
}

export default CreateBoardForm;
