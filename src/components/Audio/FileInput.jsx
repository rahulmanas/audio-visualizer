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

  function handleFile(files) {
    alert("Number of files: " + files.length);
  }

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
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
