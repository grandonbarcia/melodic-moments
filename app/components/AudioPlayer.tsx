'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useRef, useState } from 'react';

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(Math.floor(audio.currentTime));
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration);
    }
  };

  return (
    <div className="flex flex-col gap-16 relative mx-auto mt-6 max-w-xl">
      <audio
        src="./song.wav"
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      ></audio>
      <div className="flex items-center justify-between">
        <Button>Back 30</Button>
        <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>
        <Button>Forward 30</Button>
      </div>
      <div>
        <Slider value={[currentTime]} max={duration} />
      </div>
    </div>
  );
}
