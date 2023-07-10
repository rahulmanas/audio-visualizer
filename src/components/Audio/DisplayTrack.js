const DisplayTrack = ({
  audioRef,
  handleTimeUpdate,
  handleLoadedMetadata,
  canvasRef,
  name,
  handlePlayPause,
  isPlaying,
}) => {
  return (
    <div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      {audioRef && audioRef.current && (
        <div className="audio-info">
          <div className="audio-image">
            <canvas ref={canvasRef} />
          </div>
          <div className="text">
            <p className="title">{name}</p>
            {/* <p className="time">Duration: {formatTime(duration)}</p> */}
          </div>
          <button onClick={handlePlayPause} className="button-submit">
            {isPlaying ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
};
export default DisplayTrack;
