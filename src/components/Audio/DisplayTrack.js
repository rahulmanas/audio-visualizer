import { useAudio } from "../../hooks/useAudio";

const DisplayTrack = ({
  audioRef,
  handleTimeUpdate,
  handleLoadedMetadata,
  canvasRef,
  name,
  handlePlayPause,
  isPlaying,
}) => {
  const { handleChangeVisualizer } = useAudio();

  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      {audioRef && audioRef.current && (
        <div className="audio-info">
          {name && (
            <div className="audio-image">
              <canvas ref={canvasRef} />
            </div>
          )}
          <div className="text">
            <p className="title">{name}</p>
            {/* <p className="time">Duration: {formatTime(duration)}</p> */}
          </div>
          {name && (
            <button onClick={handlePlayPause} className="button-submit">
              {isPlaying ? "Pause" : "Play"}
            </button>
          )}
          {name && (
            <button onClick={handleChangeVisualizer} className="button-submit">
              Switch Visualizer
            </button>
          )}
        </div>
      )}
    </div>
  );
};
export default DisplayTrack;
