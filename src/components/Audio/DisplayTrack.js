import { useState } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { useAudio } from "../../hooks/useAudio";

const DisplayTrack = ({
  currentTrack,
  audioRef,
  duration,
  setDuration,
  canvasRef,
  file,
}) => {
  const { handleAudioPlay } = useAudio();
  const onLoadedMetadata = () => {
    const seconds = audioRef.current.duration;
    setDuration(seconds);
  };

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return "00:00";
  };

  return (
    <div>
      <audio
        src={currentTrack}
        ref={audioRef}
        onPlay={handleAudioPlay}
        onLoadedMetadata={onLoadedMetadata}
      />
      <div className="audio-info">
        <div className="audio-image">
          <canvas ref={canvasRef} width={500} height={200} />
        </div>
        <div className="text">
          <p className="title">{file?.name}</p>
          <p className="time">Duration: {formatTime(duration)}</p>
        </div>
      </div>
    </div>
  );
};
export default DisplayTrack;
