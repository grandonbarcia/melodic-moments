import { getListOfSongs } from './actions/actions';
import AudioPlayer from './components/AudioPlayer';

export default async function Home() {
  const songs = await getListOfSongs();
  
  return (
    <main className="container">
      <AudioPlayer songs={songs} />
    </main>
  );
}
