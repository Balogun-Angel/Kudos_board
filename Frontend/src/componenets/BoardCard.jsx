import { Link } from "react-router-dom";

function BoardCard({ board, onDelete }) {
  return (
    <div className="board-tile">
      <img
        src={`https://source.unsplash.com/400x200/?${board.category}`}
        alt={board.title}
        className="board-img"
      />
      <h3>{board.title}</h3>
      <p>{board.category}</p>

      <div className="board-actions">
        <Link to={`/board/${board.id}`}>
          <button>View Board</button>
        </Link>
        <button onClick={() => onDelete(board.id)}>Delete</button>
      </div>
    </div>
  );
}

export default BoardCard;
