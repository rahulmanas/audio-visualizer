import { useEffect, useRef, useState } from "react";
import DisplayTrack from "./DisplayTrack";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import { useAudio } from "../../hooks/useAudio";

export default function AudioVisualizer() {
  const [file, setFile] = useState(null);
  const {
    canvasRef,
    audioRef,
    source,
    analyzer,
    handleAudioPlay,
    timeProgress,
    setTimeProgress,
  } = useAudio();
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (file) {
      handleAudioPlay();
    }
  }, [file]);

  return (
    <div className="App">
      <div>
        <input
          type="file"
          onChange={({ target: { files } }) => {
            files[0] && setFile(files[0]);
          }}
        />
      </div>
      {file && (
        <>
          <DisplayTrack
            {...{
              currentTrack: window.URL.createObjectURL(file),
              audioRef,
              duration,
              setDuration,
              canvasRef,
              file,
            }}
          />

          <Controls
            {...{
              audioRef,
              duration,
              setTimeProgress,
              timeProgress,
              source,
              analyzer,
            }}
          />

          {/* <ProgressBar
            {...{ progressBarRef, audioRef, timeProgress, duration }}
          /> */}

          {/* <audio
            ref={audioRef}
            onPlay={handleAudioPlay}
            src={window.URL.createObjectURL(file)}
            controls
          /> */}
        </>
      )}
      {/* <canvas ref={canvasRef} width={500} height={200} /> */}
    </div>
  );
}
