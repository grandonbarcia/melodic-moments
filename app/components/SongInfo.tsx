import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function SongInfo({ currSong }: { currSong?: any }) {
  return (
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
  );
}
