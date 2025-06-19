import { Link } from "react-router-dom";

function BoardCard({ board, onDelete, imgUrl }) {
  return (
    <div className="board-tile">
      <img
        src={imgUrl}
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
