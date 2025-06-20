import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BoardCard from "../componenets/BoardCard";
import CreateBoardForm from "../componenets/CreateBoardForm";

function Home({ darkMode, setDarkMode}) {
  const [boards, setBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/boards")
      .then((res) => res.json())
      .then((data) => {
        setBoards(data);
        setFilteredBoards(data);
      });
  }, []);

 
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

  
  const handleDeleteBoard = (id) => {
    fetch(`http://localhost:3000/boards/${id}`, {
      method: "DELETE",
    }).then(() => {
      setBoards(boards.filter((board) => board.id !== id));
    });
  };

  const handleSearch = () => {
    const filtered = boards.filter((board) =>
      board.title.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredBoards(filtered);
  };


  const handleAddBoard = (newBoard) => {
    setBoards([newBoard, ...boards]);
  };

  return (
    <div className="app-container">

       <button onClick={() => setDarkMode(!darkMode)} className=" toggle-theme">
        {darkMode ? "Switch to light Mode" : "Switch to Dark Mode" }
      </button>

      <h1>KUDOBOARD </h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search boards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={() => setSearch("")}>Clear</button>
      </div>
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
      <div className="create-button-container">
        <button onClick={() => setShowModal(true)}>Create a New Board</button>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <CreateBoardForm
              onBoardCreated={(newBoard) => {
                handleAddBoard(newBoard);
                setShowModal(false);
              }}
            />
            <button className="close-modal" onClick={() => setShowModal(false)}>
              ×
            </button>
          </div>
        </div>
      )}

      <div className="board-grid">
        {filteredBoards.map((board) => {
          const randomNumber = Math.floor(Math.random() * 1000);
          const imgUrl = `https://picsum.photos/200/300?random=${randomNumber}`;
          return (
            <BoardCard
              key={board.id}
              board={board}
              onDelete={handleDeleteBoard}
              imgUrl={imgUrl}
            />
          );
        })}
      </div>

      <footer className="footer">
        <p>&copy; 2025 kudoboard</p>
      </footer>
    </div>
  );
}

export default Home;
