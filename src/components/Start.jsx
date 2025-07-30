import { useRef } from "react";

const Start = ({ setUsername }) => {
  const inputRef = useRef();

  const handleClick = () => {
    if (!inputRef.current.value.trim()) {
      alert("Please enter your name");
      return;
    }

    inputRef.current.value && setUsername(inputRef.current.value);
  };

  return (
    <div className="start">
      <input
        placeholder="Enter your name"
        className="startInput"
        ref={inputRef}
      />
      <button className="startButton" onClick={handleClick}>
        Start
      </button>
    </div>
  );
};

export default Start;
