import { useState } from "react";

const Start = ({ onStart }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to begin.");
      return;
    }
    setError("");
    onStart(trimmed);
  };

  return (
    <div className="start">
      <h2 className="startTitle">Who Wants to Be a Millionaire?</h2>
      <form onSubmit={handleSubmit} className="startForm">
        <input
          type="text"
          placeholder="Enter your name"
          className="startInput"
          maxLength={20}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          autoFocus
        />
        {error && <p className="startError">{error}</p>}
        <button type="submit" className="startButton">
          Start Game
        </button>
      </form>
    </div>
  );
};

export default Start;
