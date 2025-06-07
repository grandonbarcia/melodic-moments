'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VolumeControl from './VolumeControl';
import SongInfo from './SongInfo';
import AudioElement from './AudioElement';
import PlayerControls from './PlayerControls';
import SongList from './SongList';

type Song = {
  id: number;
  created_at: string;
  artist: string;
  genre: string;
  art: string;
  name: string;
  url: string;
};

function formatTime(sec: number) {
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export default function AudioPlayer({ songs }: { songs: Song[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currIndex, setCurrIndex] = useState<number>(-1);
  const [volume, setVolume] = useState(0.5);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying && audio) {
      audio.play();
    } else if (audio) {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    let audioSrc: MediaElementAudioSourceNode | undefined;
    let analyser: AnalyserNode | undefined;
    const audioCtx = new AudioContext();
    const audio = audioRef.current;
    if (currIndex >= 0 && audio) {
      audio.play();
      audio.crossOrigin = 'anonymous';
      audioSrc = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      audioSrc.connect(analyser);
      analyser.connect(audioCtx.destination);
      analyser.fftSize = 32;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;
      const ctx = canvas ? canvas.getContext('2d') : null;
      const barWidth = (canvas ? canvas.width / 2 : 0) / bufferLength;
      let barHeight;
      let x;

      function animate() {
        x = 0;
        ctx?.clearRect(0, 0, canvas!.width, canvas!.height);
        if (analyser) {
          analyser.getByteFrequencyData(dataArray);
        }
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2; // Scale down for visibility
          ctx!.fillStyle = 'black';
          ctx!.fillRect(
            canvas!.width / 2 - x,
            canvas!.height - barHeight,
            barWidth,
            barHeight
          );
          x += barWidth;
        }
        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i] / 2; // Scale down for visibility
          ctx!.fillStyle = 'black';
          ctx!.fillRect(x, canvas!.height - barHeight, barWidth, barHeight);
          x += barWidth;
        }
        requestAnimationFrame(animate);
      }

      animate();
    }
  }, [currIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currIndex]);

  const currSong = currIndex >= 0 ? songs[currIndex] : undefined;

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) setDuration(audio.duration);
  };

  const handleSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  };

  // Helper to get a random song index (excluding the current)
  function getRandomSongIndex(exclude: number, length: number) {
    if (length <= 1) return exclude;
    let idx;
    do {
      idx = Math.floor(Math.random() * length);
    } while (idx === exclude);
    return idx;
  }

  const playPrev = () => {
    setCurrIndex((i) => (i > 0 ? i - 1 : songs.length - 1));
    setIsPlaying(true);
  };

  const playNext = () => {
    if (repeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(true);
    } else if (shuffle) {
      const nextIdx = getRandomSongIndex(currIndex, songs.length);
      setCurrIndex(nextIdx);
      setIsPlaying(true);
    } else {
      setCurrIndex((i) => (i < songs.length - 1 ? i + 1 : 0));
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-muted/60">
      <Card className="w-full max-w-2xl rounded-3xl shadow-2xl border bg-background/90 backdrop-blur-lg">
        <CardContent className="p-8 flex flex-col gap-8 relative">
          <VolumeControl volume={volume} setVolume={setVolume} />
          <SongInfo currSong={currSong} />
          <canvas ref={canvasRef} className="h-[200] w-full" />
          <AudioElement
            src={currSong?.url}
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={playNext}
            key={currSong?.id || 'no-song'}
          />
          {currSong && (
            <PlayerControls
              isPlaying={isPlaying}
              repeat={repeat}
              setRepeat={setRepeat}
              shuffle={shuffle}
              setShuffle={setShuffle}
              playPrev={playPrev}
              playNext={playNext}
              togglePlay={() => setIsPlaying((p) => !p)}
              currSong={currSong}
              currIndex={currIndex}
              songs={songs}
              currentTime={currentTime}
              duration={duration}
              handleSliderChange={handleSliderChange}
              formatTime={formatTime}
            />
          )}
          <SongList
            songs={songs}
            currIndex={currIndex}
            setCurrIndex={setCurrIndex}
            setIsPlaying={setIsPlaying}
            isPlaying={isPlaying}
          />
        </CardContent>
      </Card>
    </div>
  );
}
