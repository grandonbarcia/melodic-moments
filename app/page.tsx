'use client';
import dynamic from 'next/dynamic';

export default function Home() {
  const AudioPlayer = dynamic(() => import('./components/AudioPlayer'), {
    ssr: false,
  });
  return <AudioPlayer />;
}
