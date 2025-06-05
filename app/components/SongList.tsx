import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Play } from 'lucide-react';

type Song = {
  id: number;
  name: string;
  artist: string;
};

export default function SongList({
  songs,
  currIndex,
  setCurrIndex,
  setIsPlaying,
  isPlaying,
}: {
  songs: Song[];
  currIndex: number;
  setCurrIndex: (idx: number) => void;
  setIsPlaying: (playing: boolean) => void;
  isPlaying: boolean;
}) {
  return (
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
  );
}
