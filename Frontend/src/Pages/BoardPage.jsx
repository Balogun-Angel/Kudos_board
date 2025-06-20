import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Comments from "../componenets/Comments";

function BoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [gifUrl, setGifUrl] = useState("");
  const [author, setAuthor] = useState("");
  const [gifSearch, setGifSearch] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY;

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
    fetch(`http://localhost:3000/boards/${id}`)
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

    fetch("http://localhost:3000/cards", {
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
        setMessage("");
        setGifUrl("");
        setAuthor("");
      })
      .catch((err) => {
        console.error("Error creating cards:", err);
      });
  };

  const handleUpvote = (cardId) => {
    fetch(`http://localhost:3000/cards/${cardId}/upvote`, {
      method: "PATCH",
    })
      .then((res) => res.json())
      .then((updated) => {
        setCards(cards.map((card) => (card.id === cardId ? updated : card)));
      });
  };

  const handleTogglePin = async (cardId) => {
    const res = await fetch(`http://localhost:3000/cards/${cardId}/pin`, {
      method: "PATCH",
    });
    const updated = await res.json();

    setCards((prev) => prev.map((c) => (c.id === cardId ? updated : c)));
  };

  const handleDelete = (cardId) => {
    fetch(`http://localhost:3000/cards/${cardId}`, {
      method: "DELETE",
    }).then(() => {
      setCards(cards.filter((card) => card.id !== cardId));
    });
  };

  if (!board) return <p>Loading...</p>;

  return (
    <div className="board-page">
      <img
        src={`https://source.unsplash.com/800x300/?${board.category}`}
        alt="Board Banner"
        className="banner-img"
      />

      <h1>{board.title}</h1>
      <p>
        {board.category} {board.author && `• by ${board.author}`}
      </p>

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

              <Comments cardId={card.id} />
            </div>
          ))}
      </div>

      <div className="add-card-form">
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

      <Link to="/">
        <button style={{ marginTop: "20px" }}>← Back to Home</button>
      </Link>
    </div>
  );
}

export default BoardPage;
