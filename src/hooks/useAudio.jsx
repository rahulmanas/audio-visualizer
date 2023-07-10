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
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const [fileName, setFileName] = useState("");
  const [colorSet, setColorSet] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerType, setVisualizerType] = useState("bars");

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
  const animationFrameId = useRef(null);

  useEffect(() => {
    animateVisualizer();
  }, [visualizerType]);

  const animateVisualizer = () => {
    if (canvasRef && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        sourceNodeRef.current =
          audioContextRef.current.createMediaElementSource(audioRef.current);
        sourceNodeRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const animateBars = () => {
        animationFrameId.current = requestAnimationFrame(animateBars);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];

          ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
          ctx.fillRect(
            x,
            canvas.height - barHeight / 2,
            barWidth,
            barHeight / 2
          );

          x += barWidth + 1;
        }
      };

      const animateWaveform = () => {
        animationFrameId.current = requestAnimationFrame(animateWaveform);
        analyserRef.current.getByteTimeDomainData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(100, 100, 100)";
        ctx.beginPath();
        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      };

      if (visualizerType === "bars") {
        animateBars();
      } else {
        animateWaveform();
      }
    }
  };
  const handleChangeVisualizer = () => {
    const newVisualizerType = visualizerType === "bars" ? "waveform" : "bars";
    setVisualizerType(newVisualizerType);
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
        setVisualizerType,
        handleChangeVisualizer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
