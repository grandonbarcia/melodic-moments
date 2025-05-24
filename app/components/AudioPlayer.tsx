'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Toggle } from '@/components/ui/toggle';
import { Repeat, Shuffle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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

  const currSong = currIndex >= 0 ? songs[currIndex] : undefined;

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
    setCurrIndex((i) => (i > 0 ? i - 1 : songs.length - 1));
    setIsPlaying(true);
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

  // Modified playNext to handle shuffle and repeat
  const playNext = () => {
    if (repeat) {
      // Repeat: play the current song from the beginning
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setIsPlaying(true);
    } else if (shuffle) {
      // Shuffle: pick a random song (not the current)
      const nextIdx = getRandomSongIndex(currIndex, songs.length);
      setCurrIndex(nextIdx);
      setIsPlaying(true);
    } else {
      // Normal: go to next song or loop to start
      setCurrIndex((i) => (i < songs.length - 1 ? i + 1 : 0));
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-muted/60">
      <Card className="w-full max-w-2xl rounded-3xl shadow-2xl border bg-background/90 backdrop-blur-lg">
        <CardContent className="p-8 flex flex-col gap-8 relative">
          {/* Volume Control - Top Right */}
          <div className="absolute top-8 right-8 flex items-center gap-3 z-10">
            <Volume2 className="text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={1}
              step={0.01}
              onValueChange={(value) => setVolume(value[0])}
              className="w-32"
              aria-label="Volume"
            />
            <span className="text-xs w-8 text-muted-foreground">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Top: Song Info */}
          <div className="flex items-center gap-6">
            <Avatar className="w-28 h-28 rounded-xl shadow-lg border">
              {currSong?.art ? (
                <AvatarImage src={currSong.art} alt={currSong.name} />
              ) : (
                <AvatarFallback className="text-muted-foreground text-2xl">
                  🎵
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="font-bold text-2xl truncate">
                {currSong?.name || 'No Song'}
              </span>
              <span className="text-muted-foreground text-lg truncate">
                {currSong?.artist || ''}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
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
            key={currSong?.id || 'no-song'}
          />

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center gap-8">
              <Toggle
                pressed={repeat}
                onPressedChange={setRepeat}
                aria-label="Toggle repeat"
              >
                <Repeat
                  className={repeat ? 'text-primary' : 'text-muted-foreground'}
                />
              </Toggle>
              <Button
                variant="ghost"
                size="icon"
                onClick={playPrev}
                disabled={songs.length === 0 || currIndex === -1}
                aria-label="Previous"
              >
                <SkipBack className="w-7 h-7" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={togglePlay}
                disabled={!currSong}
                className="rounded-full shadow-lg"
                style={{ width: 64, height: 64 }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8" />
                ) : (
                  <Play className="w-8 h-8" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={playNext}
                disabled={songs.length === 0 || currIndex === -1}
                aria-label="Next"
              >
                <SkipForward className="w-7 h-7" />
              </Button>
              <Toggle
                pressed={shuffle}
                onPressedChange={setShuffle}
                aria-label="Toggle shuffle"
              >
                <Shuffle
                  className={shuffle ? 'text-primary' : 'text-muted-foreground'}
                />
              </Toggle>
            </div>
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs w-12 text-right text-muted-foreground font-mono">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration || 1}
                step={1}
                onValueChange={(value) => handleSliderChange(value[0])}
                className="flex-1"
              />
              <span className="text-xs w-12 text-muted-foreground font-mono">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Player Controls - Repeat & Shuffle */}

          {/* Song List */}
          <ScrollArea className="h-80 w-full rounded-lg hover:shadow-lg bg-muted/30 mt-2 p-2">
            <div className="flex flex-col gap-1 p-2">
              {songs.map((song, idx) => (
                <div key={song.id}>
                  <div
                    className={`flex items-center justify-center w-full min-w-0 px-3 py-4 rounded-lg cursor-pointer transition ${
                      idx === currIndex
                        ? 'bg-accent text-accent-foreground font-semibold'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                    onClick={() => {
                      setCurrIndex(idx);
                      setIsPlaying(true);
                    }}
                  >
                    <div className="flex flex-col flex-1 min-w-0">
                      <span
                        className={`truncate font-semibold text-base leading-tight ${
                          idx === currIndex
                            ? 'text-accent-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {song.name}
                      </span>
                      <span
                        className={`truncate text-xs uppercase tracking-wider ${
                          idx === currIndex
                            ? 'text-accent-foreground/80'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {song.artist}
                      </span>
                    </div>
                    {idx === currIndex && isPlaying && (
                      <Play className="w-4 h-4 text-primary ml-2 flex-shrink-0" />
                    )}
                  </div>
                  {idx < songs.length - 1 && <Separator className="my-1" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
