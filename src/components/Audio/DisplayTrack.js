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
  const { handleChangeVisualizer, handlePlaybackSpeedChange, playbackSpeed } =
    useAudio();

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
          <div style={{ textAlign: "left" }}>
            <div className="text">
              <p className="title">{name}</p>
              {/* <p className="time">Duration: {formatTime(duration)}</p> */}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {name && (
                <div style={{ marginTop: "20px" }}>
                  <button onClick={handlePlayPause} className="button-submit">
                    {isPlaying ? "Pause" : "Play"}
                  </button>
                </div>
              )}
              {name && (
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={handleChangeVisualizer}
                    className="button-submit"
                  >
                    Switch Visualizer
                  </button>
                </div>
              )}
            </div>
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="speed">Playback Speed: </label>
              <input
                type="range"
                id="speed"
                min="0.5"
                max="2"
                step="0.1"
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DisplayTrack;
