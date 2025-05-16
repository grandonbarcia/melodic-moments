'use client';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { FaPlay } from 'react-icons/fa';
import { FaPause } from 'react-icons/fa';
import { FaForwardStep } from 'react-icons/fa6';
import { FaStepBackward } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';
import getListOfObjects from '../actions/actions';

const API = `https://melodic-moments.s3.us-east-2.amazonaws.com/`;

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [listOfSongs, setListOfSongs] = useState<string[]>([]);
  const [currSong, setCurrSong] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const data = await getListOfObjects();
        const filteredData = data.filter(
          (item): item is string => typeof item === 'string'
        );
        setListOfSongs(filteredData);
        setCurrSong(API + filteredData[0]);
      } catch (error) {
        console.error('Error fetching objects:', error);
      }
    };
    fetchObjects();
  }, []);

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

  useEffect(() => {
    const audio = audioRef.current;
    if (isPlaying) {
      if (audio) {
        audio.play();
      }
    }
  }, [currSong, isPlaying]);

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

  const handleSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setCurrentTime(value);
    }
  };

  return (
    <div className="flex flex-col gap-16 relative mx-auto mt-6 max-w-xl">
      <audio
        src={currSong ?? undefined}
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      ></audio>
      <div className="flex items-center justify-between">
        <Button>
          <FaStepBackward />
        </Button>
        <Button onClick={togglePlay}>
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <Button>
          <FaForwardStep />
        </Button>
      </div>
      <div>
        <Slider
          value={[currentTime]}
          max={duration}
          onValueChange={(value) => handleSliderChange(value[0])}
        />
      </div>
      <div>
        {listOfSongs.map((song, index) => (
          <div key={index} className="flex items-center justify-between">
            <span>{song}</span>
            <Button
              onClick={() => {
                setIsPlaying(true);
                setCurrSong(API + song);
              }}
            >
              Play
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
