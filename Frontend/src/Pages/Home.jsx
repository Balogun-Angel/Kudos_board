import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardCard from "../componenets/BoardCard";
import CreateBoardForm from "../componenets/CreateBoardForm";

function Home() {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Fetch all boards
  useEffect(() => {
    fetch("http://localhost:3000/boards")
      .then((res) => res.json())
      .then((data) => {
        setBoards(data);
        setFilteredBoards(data);
      });
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = boards;

    if (filter && filter !== "All") {
      if (filter === "Recent") {
        filtered = [...filtered].slice(0, 6);
      } else {
        filtered = filtered.filter((board) => board.category === filter);
      }
    }

    if (search.trim()) {
      filtered = filtered.filter((board) =>
        board.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredBoards(filtered);
  }, [search, filter, boards]);

  // Delete a board
  const handleDeleteBoard = (id) => {
    fetch(`http://localhost:3000/boards/${id}`, {
      method: "DELETE",
    }).then(() => {
      setBoards(boards.filter((board) => board.id !== id));
    });
  };

  // Add a board
  const handleAddBoard = (newBoard) => {
    setBoards([newBoard, ...boards]);
  };

  return (
    <div className="home-page">
      <h1>KUDOBOARD 🎉</h1>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search boards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setSearch("")}>Clear</button>
      </div>

      {/* Filters */}
      <div className="filters">
        {["All", "Recent", "Celebration", "Thank You", "Inspiration"].map(
          (btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className={filter === btn ? "active" : ""}
            >
              {btn}
            </button>
          )
        )}
      </div>

      {/* Create Board Form */}
      <CreateBoardForm onBoardCreated={handleAddBoard} />

      {/* Board Grid */}
      <div className="board-grid">
        {filteredBoards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onDelete={handleDeleteBoard}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
