import React from "react";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  return (
    <Link to={`/movies/${movie._id}`} className="w-56 h-96 rounded overflow-hidden shadow-lg m-4">
      <img
        className="w-56 h-72 object-cover"
        src={`${movie.posterUrl}`}
        alt={movie.title}
      />
      <div className="px-4 py-2">
        <div className="font-bold text-lg mb-1">{movie.title}</div>
        <p className="text-gray-700 text-sm">{movie.genre_id.name}</p>
      </div>
    </Link>
  );
}

export default MovieCard;
