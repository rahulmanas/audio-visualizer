import React from "react";
import { useAudio } from "../../hooks/useAudio";

export default function FileInput() {
  const { setFileName, setIsPlaying, audioRef, animateVisualizer } = useAudio();
  return (
    <div style={{ marginTop: "40px" }}>
      <input
        type="file"
        accept="audio/*"
        onChange={(event) => {
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
    </div>
  );
}
