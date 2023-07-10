import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const AudioPlayerContext = createContext({});

export function useAudio() {
  return useContext(AudioPlayerContext);
}

export const AudioProvider = ({ children }) => {
  let animationController;
  const audioRef = useRef();
  const canvasRef = useRef();
  const source = useRef();
  const analyzer = useRef();
  const [timeProgress, setTimeProgress] = useState(0);

  const handleAudioPlay = () => {
    console.log("handling audio play");
    let audioContext = new AudioContext();
    if (!source.current) {
      source.current = audioContext.createMediaElementSource(audioRef.current);
      analyzer.current = audioContext.createAnalyser();
      source.current.connect(analyzer.current);
      analyzer.current.connect(audioContext.destination);
    }
    visualizeData();
  };

  const visualizeData = () => {
    animationController = window.requestAnimationFrame(visualizeData);
    if (audioRef.current.paused) {
      return cancelAnimationFrame(animationController);
    }
    const songData = new Uint8Array(140);
    analyzer.current.getByteFrequencyData(songData);
    const bar_width = 3;
    let start = 0;
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let i = 0; i < songData.length; i++) {
      // compute x coordinate where we would draw
      start = i * 4;
      //create a gradient for the  whole canvas
      let gradient = ctx.createLinearGradient(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      gradient.addColorStop(0.2, "#2392f5");
      gradient.addColorStop(0.5, "#fe0095");
      gradient.addColorStop(1.0, "purple");
      ctx.fillStyle = gradient;
      ctx.fillRect(start, canvasRef.current.height, bar_width, -songData[i]);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        handleAudioPlay,
        visualizeData,
        audioRef,
        canvasRef,
        source,
        analyzer,
        timeProgress,
        setTimeProgress,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
