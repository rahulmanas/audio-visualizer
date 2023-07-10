import React from "react";
import { formatTime } from "../../utils/util";

export default function ProgressBar({ duration, currentTime, handleSeek }) {
  return (
    <div className="" style={{ marginTop: "40px" }}>
      <div className="progress">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
        />
      </div>
      <p className="time" style={{ marginTop: "20px", textAlign: "center" }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </p>
    </div>
  );
}
