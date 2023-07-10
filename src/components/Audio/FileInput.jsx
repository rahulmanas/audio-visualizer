import React from "react";
import { useAudio } from "../../hooks/useAudio";

export default function FileInput() {
  const { setFileName, setIsPlaying, audioRef, animateVisualizer } = useAudio();

  // drag state
  const [dragActive, setDragActive] = React.useState(false);
  // ref
  const inputRef = React.useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <form
        id="form-file-upload"
        style={{ margin: "auto" }}
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          accept="audio/*"
          onChange={(event) => {
            event.preventDefault();
            const file = event.target.files[0];
            if (file) {
              setFileName(file.name);
              const reader = new FileReader();
              reader.onload = () => {
                audioRef.current.src = reader.result;
                audioRef.current.play();
                setIsPlaying(true);
                animateVisualizer();
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <p>Drag and drop your file here or</p>
            <button
              className="upload-button"
              style={{ textDecoration: "underline" }}
              onClick={onButtonClick}
            >
              Upload a file
            </button>
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) {
                setFileName(file.name);
                const reader = new FileReader();
                reader.onload = () => {
                  audioRef.current.src = reader.result;
                  audioRef.current.play();
                  setIsPlaying(true);
                  animateVisualizer();
                };
                reader.readAsDataURL(file);
              }
            }}
          ></div>
        )}
      </form>
    </div>
  );
}
