'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaVolumeUp,
} from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

import Image from 'next/image';

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
  const [listOfSongs] = useState<Song[]>(songs);
  const [currIndex, setCurrIndex] = useState<number>(-1); // No song selected by default
  const [volume, setVolume] = useState(0.5); // Set initial volume to 50%
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  }, [isPlaying, currIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const currSong = currIndex >= 0 ? listOfSongs[currIndex] : undefined;

  const togglePlay = () => setIsPlaying((p) => !p);

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

  const playPrev = () => {
    setCurrIndex((i) => (i > 0 ? i - 1 : listOfSongs.length - 1));
    setIsPlaying(true);
  };

  const playNext = () => {
    setCurrIndex((i) => (i < listOfSongs.length - 1 ? i + 1 : 0));
    setIsPlaying(true);
  };

  // --- Neutral style additions ---
  // Glassy, blurred, animated neutral gradient background
  const bgGradient = currSong?.art
    ? 'linear-gradient(120deg, #e5e7eb 0%, #a1a1aa 100%)'
    : 'linear-gradient(120deg, #f4f4f5 0%, #a1a1aa 100%)';

  // Animated gradient overlay (neutral tones)
  const animatedGradient =
    'before:content-[""] before:absolute before:inset-0 before:rounded-3xl before:bg-[conic-gradient(var(--tw-gradient-stops))] before:from-zinc-300/30 before:via-zinc-400/20 before:to-zinc-500/30 before:blur-2xl before:animate-spin-slow before:z-0';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center transition-colors duration-700"
      style={{
        background: bgGradient,
      }}
    >
      <div
        className={`relative w-full max-w-2xl mx-auto rounded-3xl shadow-2xl p-10 flex flex-col gap-10 border border-white/20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-2xl overflow-hidden ${animatedGradient}`}
        style={{
          boxShadow:
            '0 8px 32px 0 rgba(161,161,170,0.18), 0 1.5px 8px 0 rgba(113,113,122,0.10)',
        }}
      >
        {/* Volume Control - Top Right */}
        <div className="absolute top-8 right-8 flex items-center gap-2 z-20">
          <FaVolumeUp className="text-zinc-400 dark:text-zinc-300" />
          <Slider
            value={[volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0])}
            className="w-32"
          />
          <span className="text-xs w-8 text-zinc-500 dark:text-zinc-300">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Album Art & Song Info */}
        <div className="flex items-center gap-8 z-10">
          <div className="w-32 h-32 bg-zinc-200 dark:bg-zinc-800 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border-4 border-white/30 ring-4 ring-zinc-300/10">
            {currSong?.art ? (
              <Image
                src={currSong.art}
                alt={currSong.name}
                width={128}
                height={128}
                className="w-full h-full object-cover scale-105 transition-transform duration-500"
                style={{ filter: 'drop-shadow(0 4px 24px #a1a1aa44)' }}
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400">
                No Art
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2">
            <span className="font-extrabold text-3xl text-zinc-900 dark:text-white drop-shadow-lg tracking-tight">
              {currSong?.name || 'No Song'}
            </span>
            <span className="text-zinc-600 dark:text-zinc-300 text-lg font-medium">
              {currSong?.artist || ''}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-widest">
              {currSong?.genre || ''}
            </span>
          </div>
        </div>

        {/* Audio Element */}
        <audio
          src={currSong?.url}
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={playNext}
          // Optionally, add a key to force remount when currSong changes
          key={currSong?.id || 'no-song'}
        />

        {/* Controls */}
        <div className="flex flex-col gap-6 z-10">
          <div className="flex items-center justify-center gap-10">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPrev}
              disabled={listOfSongs.length === 0 || currIndex === -1}
              className="rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow"
            >
              <FaStepBackward className="text-2xl text-zinc-500 dark:text-zinc-300" />
            </Button>
            <Button
              variant="default"
              size="icon"
              onClick={togglePlay}
              disabled={!currSong}
              className="rounded-full bg-gradient-to-br from-zinc-400 via-zinc-500 to-zinc-600 shadow-2xl hover:scale-110 transition border-4 border-white/30"
              style={{
                width: 72,
                height: 72,
                boxShadow:
                  '0 4px 32px 0 rgba(161,161,170,0.18), 0 1.5px 8px 0 rgba(113,113,122,0.10)',
              }}
            >
              {isPlaying ? (
                <FaPause className="text-3xl text-white drop-shadow" />
              ) : (
                <FaPlay className="text-3xl text-white drop-shadow" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playNext}
              disabled={listOfSongs.length === 0 || currIndex === -1}
              className="rounded-full bg-white/60 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition shadow"
            >
              <FaStepForward className="text-2xl text-zinc-500 dark:text-zinc-300" />
            </Button>
          </div>
          {/* Progress Bar */}
          <div className="flex items-center gap-4">
            <span className="text-xs w-12 text-right text-zinc-500 dark:text-zinc-300 font-mono">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={duration || 1}
              step={1}
              onValueChange={(value) => handleSliderChange(value[0])}
              className="flex-1 accent-zinc-500"
            />
            <span className="text-xs w-12 text-zinc-500 dark:text-zinc-300 font-mono">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Song List */}
        <div className="flex flex-col gap-1 mt-2 z-10">
          {listOfSongs.map((song, idx) => (
            <div
              key={song.id}
              className={`flex items-center justify-between px-4 py-2 rounded-xl cursor-pointer transition font-medium ${
                idx === currIndex
                  ? 'bg-gradient-to-r from-zinc-400/90 via-zinc-500/80 to-zinc-600/90 text-white shadow-lg scale-[1.03]'
                  : 'hover:bg-zinc-200/70 dark:hover:bg-zinc-800/70 text-zinc-800 dark:text-zinc-200'
              }`}
              style={{
                backdropFilter: idx === currIndex ? 'blur(2px)' : undefined,
                border: idx === currIndex ? '2px solid #fff3' : undefined,
              }}
              onClick={() => {
                setCurrIndex(idx);
                setIsPlaying(true);
              }}
            >
              <div className="flex flex-col flex-1 min-w-0">
                <span
                  className={`truncate font-semibold text-base leading-tight ${
                    idx === currIndex
                      ? 'text-white'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {song.name}
                </span>
                <span
                  className={`truncate text-xs uppercase tracking-wider ${
                    idx === currIndex
                      ? 'text-zinc-200/80'
                      : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {song.artist}
                </span>
              </div>
              {idx === currIndex && isPlaying && (
                <FaPlay className="text-white drop-shadow ml-2" />
              )}
            </div>
          ))}
        </div>

        {/* Subtle floating neutral blobs for extra flair */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 bg-zinc-300/30 rounded-full blur-3xl animate-pulse-slow z-0" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-zinc-400/30 rounded-full blur-3xl animate-pulse-slower z-0" />
      </div>
    </div>
  );
}
