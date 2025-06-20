import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../componenets/Comments";


function BoardPage({ darkMode, setDarkMode}) {
  const { id } = useParams();
  const [activeCommentsCardId, SetActiveCommentsCardId] = useState(null);
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
  const VITE_KUDOS_BOARD_API_URl=import.meta.env.VITE_KUDOS_BOARD_API_URL;

  const searchGifs = async () => {
    try {
      const res = await fetch(
        `https://api.giphy.com/v1/gifs/search?q=${gifSearch}&api_key=${GIPHY_API_KEY}&limit=6`
      );
      const data = await res.json();
      setGifResults(data.data);
    } catch (err) {
      console.error("Error fetching GIFs", err);
    }
  };

  const selectGif = (url) => {
    setGifUrl(url);
    setGifResults([]);
  };

  useEffect(() => {
    fetch(`${VITE_KUDOS_BOARD_API_URl}/boards/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBoard(data);
        setCards(data.cards || []);
      });
  }, [id]);

  const handleCreateCard = () => {
    if (!message.trim() || !gifUrl.trim()) {
      alert("Both message and GIF are required to create a card.");
      return;
    }

    fetch(`${VITE_KUDOS_BOARD_API_URl}/cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        gifUrl,
        author,
        boardId: parseInt(id),
      }),
    })
      .then((res) => res.json())
      .then((newCard) => {
        setCards([newCard, ...cards]);
        setShowModal(false);

        setMessage("");
        setGifUrl("");
        setGifSearch("");
        setGifResults("");
        setAuthor("");
      })
      .catch((err) => {
        console.error("Error creating cards:", err);
      });
  };

  const handleUpvote = (cardId) => {
    fetch(`${VITE_KUDOS_BOARD_API_URl}/cards/${cardId}/upvote`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((updated) => {
        setCards(cards.map((card) => (card.id === cardId ? updated : card)));
      });
  };

  const handleTogglePin = async (cardId) => {
    const res = await fetch(`${VITE_KUDOS_BOARD_API_URl}/cards/${cardId}/pin`, {
      method: "PATCH",
    });
    const updated = await res.json();

    setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
  };

  const handleDelete = (cardId) => {
    fetch(`${VITE_KUDOS_BOARD_API_URl}/cards/${cardId}`, {
      method: "DELETE",
    }).then(() => {
      setCards(cards.filter((card) => card.id !== cardId));
    });
  };

  if (!board) return <p>Loading...</p>;

  return (
    <div className="app-container">

      <button onClick={() => setDarkMode(!darkMode)} className=" toggle-theme">
        {darkMode ? "Switch to light Mode" : "Switch to Dark Mode" }
      </button>

      <h1>KUDOBOARD </h1>
      <h2 className = "board-subtitle">{board.title} </h2>
      <p>
        {board.category} {board.author && `• by ${board.author}`}
      </p>

      <button
        onClick={() => setShowModal(true)}
        className="create-card -button"
      >
        {" "}
        Create a Card
      </button>

      <div className="card-grid">
        {cards
          .slice()
          .sort((a, b) => {
            if (a.pinned === b.pinned) {
              return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.pinned ? -1 : 1;
          })
          .map((card) => (
            <div
              key={card.id}
              className={`card ${card.pinned ? "pinned" : ""}`}
            >
              <img src={card.gifUrl} alt="GIF" className="card-gif" />
              <p>
                <strong>{card.message}</strong>
              </p>
              {card.author && <p>{card.author}</p>}
              <p>{card.upvotes} ❤️</p>

              <button onClick={() => handleTogglePin(card.id)}>
                {card.pinned ? "Unpin" : "Pin"}
              </button>

              <button onClick={() => handleUpvote(card.id)}>Upvote</button>
              <button onClick={() => handleDelete(card.id)}>Delete</button>
               <Comments card={card} />
            </div>
          ))}
      </div>
      {activeCommentsCardId && (
        <Comments
        cardId={activeCommentsCardId}
        closeModal={() => SetActiveCommentsCardId(null)}
        />
      )}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setShowModal(false)}
              className=" close-button"
            >
              𝐗
            </button>
            <h3>Create a Card</h3>
            <input
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              placeholder="GIF URL"
              value={gifUrl}
              onChange={(e) => setGifUrl(e.target.value)}
            />

            <input
              type="text"
              placeholder="Search GIFs"
              value={gifSearch}
              onChange={(e) => setGifSearch(e.target.value)}
            />
            <button onClick={searchGifs}>Search GIFs</button>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {gifResults.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height_small.url}
                  alt="GIF"
                  style={{ width: "100px", cursor: "pointer" }}
                  onClick={() => selectGif(gif.images.original.url)}
                />
              ))}
            </div>

            <input
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button onClick={handleCreateCard}>Add Card</button>
          </div>
        </div>
      )}

      <Link to="/">
        <button style={{ marginTop: "20px" }}>← Back to Home</button>
      </Link>

      <footer className="footer">
        <p>&copy; 2025 kudoboard</p>
      </footer>
    </div>
  );
}

export default BoardPage;
