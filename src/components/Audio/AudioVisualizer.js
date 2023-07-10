import React, { useState, useRef, useEffect } from "react";
import DisplayTrack from "./DisplayTrack";
import ProgressBar from "./ProgressBar";
import { useAudio } from "../../hooks/useAudio";
import FileInput from "./FileInput";

const AudioVisualizer = () => {
  const {
    isPlaying,
    audioRef,
    canvasRef,
    fileName,
    handlePlayPause,
    currentTime,
    duration,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleSeek,
  } = useAudio();

  return (
    <div style={{ margin: "auto", padding: "20px" }}>
      <div>
        <FileInput />

        <div style={{ marginTop: "40px" }}>
          <DisplayTrack
            audioRef={audioRef}
            handleTimeUpdate={handleTimeUpdate}
            handleLoadedMetadata={handleLoadedMetadata}
            canvasRef={canvasRef}
            name={fileName}
            handlePlayPause={handlePlayPause}
            isPlaying={isPlaying}
          />
        </div>

        <ProgressBar
          duration={duration}
          currentTime={currentTime}
          handleSeek={handleSeek}
        />
      </div>
    </div>
  );
};

export default AudioVisualizer;
