import { useState } from "react";

function CreateBoardForm({ onBoardCreated }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");

  const handleCreateBoard = () => {
    if (!title || !category) return;

    fetch("http://localhost:3000/boards", {
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
      });
  };

  return (
    <div className="create-board-form">
      <h2>Create a New Board</h2>
      <input
        type="text"
        placeholder="Board Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Author (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button onClick={handleCreateBoard}>Create Board</button>
    </div>
  );
}

export default CreateBoardForm;
