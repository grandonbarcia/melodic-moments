import { Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

export default function VolumeControl({
  volume,
  setVolume,
}: {
  volume: number;
  setVolume: (v: number) => void;
}) {
  return (
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
  );
}
