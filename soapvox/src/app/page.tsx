"use client";

import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<WaveSurfer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  useEffect(() => {
    if (audioUrl && waveformRef.current) {
      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#333',
        cursorColor: '#333',
        height: 128,
      });
      waveSurfer.current.load(audioUrl);

      (waveSurfer.current as any).on('seek', (progress: number) => {
        if (audioRef.current) {
          const duration = audioRef.current.duration;
          if (!isNaN(duration)) {
            audioRef.current.currentTime = progress * duration;
          }
        }
      });

      waveSurfer.current.on('audioprocess', () => {
        if (audioRef.current && waveSurfer.current) {
          const currentTime = audioRef.current.currentTime;
          if (!isNaN(currentTime) && audioRef.current.duration) {
            waveSurfer.current.seekTo(currentTime / audioRef.current.duration);
          }
        }
      });

      const updateWaveSurferTime = () => {
        if (audioRef.current && waveSurfer.current) {
          const currentTime = audioRef.current.currentTime;
          if (!isNaN(currentTime) && audioRef.current.duration) {
            waveSurfer.current.seekTo(currentTime / audioRef.current.duration);
          }
        }
      };

      audioRef.current?.addEventListener('timeupdate', updateWaveSurferTime);

      return () => {
        waveSurfer.current?.destroy();
        audioRef.current?.removeEventListener('timeupdate', updateWaveSurferTime);
      };
    }
  }, [audioUrl]);

  return (
    <div>
      <h1>Audio Visualizer</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {audioUrl && (
        <div>
          <audio ref={audioRef} controls src={audioUrl}></audio>
          <div ref={waveformRef} id="waveform"></div>
        </div>
      )}
    </div>
  );
}

