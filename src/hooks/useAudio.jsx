import randomColor from "randomcolor";
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
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const analyserRef = useRef(null);
  let animationFrameId = useRef(null);
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [colorSet, setColorSet] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    getRandomColor();
  }, []);

  useEffect(() => {
    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, []);

  const handleSeek = (event) => {
    const seekTime = parseFloat(event.target.value);
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const getRandomColor = () => {
    let result = [];
    for (let i = 0; i < 3; i++) {
      const resp = randomColor();
      result.push(resp);
    }
    setColorSet(result);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      animateVisualizer();
    }
    setIsPlaying(!isPlaying);
  };

  const animateVisualizer = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(
        audioRef.current
      );
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const drawVisualizer = () => {
      animationFrameId.current = requestAnimationFrame(drawVisualizer);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      const bar_width = 3;
      let start = 0;

      for (let i = 0; i < bufferLength; i++) {
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
        ctx.fillRect(start, canvasRef.current.height, bar_width, -dataArray[i]);
      }
    };

    drawVisualizer();
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        getRandomColor,
        setColorSet,
        audioRef,
        fileName,
        setFileName,
        isPlaying,
        setIsPlaying,
        animateVisualizer,
        canvasRef,
        handlePlayPause,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleSeek,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
