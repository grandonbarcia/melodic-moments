import { Toggle } from '@/components/ui/toggle';
import {
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

type Song = {
  id: number;
  created_at: string;
  artist: string;
  genre: string;
  art: string;
  name: string;
  url: string;
};

interface PlayerControlsProps {
  isPlaying: boolean;
  repeat: boolean;
  setRepeat: (value: boolean) => void;
  shuffle: boolean;
  setShuffle: (value: boolean) => void;
  playPrev: () => void;
  playNext: () => void;
  togglePlay: () => void;
  currSong: Song | undefined; // Replace 'any' with your song type if available
  currIndex: number;
  songs: Song[]; // Replace 'any' with your song type if available
  currentTime: number;
  duration: number;
  handleSliderChange: (value: number) => void;
  formatTime: (value: number) => string;
}

export default function PlayerControls({
  isPlaying,
  repeat,
  setRepeat,
  shuffle,
  setShuffle,
  playPrev,
  playNext,
  togglePlay,
  currSong,
  currIndex,
  songs,
  currentTime,
  duration,
  handleSliderChange,
  formatTime,
}: PlayerControlsProps) {
  return (
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
  );
}
