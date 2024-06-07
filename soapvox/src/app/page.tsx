"use client";

import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import Marquee from 'react-marquee-slider';
import times from 'lodash.times';

type TextSegment = {
  start: number;
  end: number;
  text: string;
  character: string;
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const waveformRef = useRef<HTMLDivElement>(null);
  const waveSurfer = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [textSegments, setTextSegments] = useState<TextSegment[]>([
    { start: 0, end: 1, text: 'Hello', character: 'World' },
  ]);
  
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setVideoUrl(url);
      await handleUpload(selectedFile);
    }
  };

  const handleUpload = async (selectedFile: File) => {
    if (!selectedFile) return;
    setIsUploaded(true);
    const formData = new FormData();
    formData.append('video', selectedFile);

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
      const regionsPlugin = RegionsPlugin.create();

      waveSurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#333',
        cursorColor: '#333',
        cursorWidth: 2,
        height: 100,
        plugins: [
          regionsPlugin
        ],
      });

      waveSurfer.current.load(audioUrl);

      waveSurfer.current.on('ready', () => {
        textSegments.forEach(segment => {
          regionsPlugin.addRegion({
            start: segment.start,
            end: segment.end,
            color: 'rgba(0, 123, 255, 0.1)',
            drag: false,
            resize: false,            
          });
        });
      });

      waveSurfer.current.on('audioprocess', () => {
        if (videoRef.current && waveSurfer.current) {
          const currentTime = waveSurfer.current.getCurrentTime();
          videoRef.current.currentTime = currentTime;
          const activeSegment = textSegments.find(
            segment => currentTime >= segment.start && currentTime < segment.end
          );

          if (activeSegment) {
            document.getElementById('scrolling-text')!.textContent = activeSegment.text;
          } else {
            document.getElementById('scrolling-text')!.textContent = '';
          }
        }
      });

      const syncWaveSurferToVideo = () => {
        if (videoRef.current && waveSurfer.current) {
          const currentTime = videoRef.current.currentTime;
          if (!isNaN(currentTime) && videoRef.current.duration) {
            waveSurfer.current.seekTo(currentTime / videoRef.current.duration);
          }
        }
      };

      videoRef.current?.addEventListener('timeupdate', syncWaveSurferToVideo);

      return () => {
        waveSurfer.current?.destroy();
        videoRef.current?.removeEventListener('timeupdate', syncWaveSurferToVideo);
      };
    }
  }, [audioUrl, textSegments]);

  const addTextSegment = () => {
    const newSegment: TextSegment = { start: 0, end: 1, text: "Nouveau texte", character: "Personnage" };
    setTextSegments([...textSegments, newSegment]);
  };

  const updateTextSegment = (index: number, key: keyof TextSegment, value: string | number) => {
    const updatedSegments = [...textSegments];
    updatedSegments[index] = { ...updatedSegments[index], [key]: value };
    setTextSegments(updatedSegments);
  };

  const deleteTextSegment = (index: number) => {
    const updatedSegments = textSegments.filter((_, i) => i !== index);
    setTextSegments(updatedSegments);
  };

  const saveSegments = async () => {
    try {
      const response = await fetch('http://localhost:3001/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ segments: textSegments }),
      });

      if (!response.ok) {
        throw new Error('Failed to save segments');
      }
    } catch (error) {
      console.error('Error saving segments:', error);
    }
  };

  const loadSegments = async () => {
    try {
      const response = await fetch('http://localhost:3001/segments');
      if (response.ok) {
        const data = await response.json();
        setTextSegments(data);
      } else {
        throw new Error('Failed to load segments');
      }
    } catch (error) {
      console.error('Error loading segments:', error);
    }
  };

  useEffect(() => {
    loadSegments();
  }, []);

  return (
    <div className="container">
      {!isUploaded && (
        <>
          <label className="custom-file-upload">
            <input type="file" accept="video/*" onChange={handleFileChange} />
            Choisir un fichier
          </label>
        </>
      )}
      {videoUrl && (
        <div className="video-container">
          <video ref={videoRef} width="800" controls src={videoUrl}></video>
        </div>
      )}
      {audioUrl && (
        <div className="waveform-container">
          <div ref={waveformRef} id="waveform"></div>
        </div>
      )}
      {audioUrl && (
        <div className="scrolling-text-container">
          <div id="scrolling-text" className="scrolling-text"></div>
        </div>
      )}
      <div className="text-segment-editor">
        {textSegments.map((segment, index) => (
          <div key={index} className="text-segment">
            <input type="text" value={segment.text} onChange={(e) => updateTextSegment(index, 'text', e.target.value)} />
            <input type="text" value={segment.character} onChange={(e) => updateTextSegment(index, 'character', e.target.value)} />
            <input type="number" value={segment.start} onChange={(e) => updateTextSegment(index, 'start', parseFloat(e.target.value))} />
            <input type="number" value={segment.end} onChange={(e) => updateTextSegment(index, 'end', parseFloat(e.target.value))} />
            <button onClick={() => deleteTextSegment(index)}>Supprimer</button>
          </div>
        ))}
        <button onClick={addTextSegment}>Ajouter un segment</button>
        <button onClick={saveSegments}>Sauvegarder les segments</button>
      </div>

      {audioUrl && (
        <div className="scrolling-text-container">
            <Marquee 
              velocity={0.1}
              direction="rtl"
              resetAfterTries={200}
              scatterRandomly
              onInit={() => {}}
              onFinish={() => {}}
            >
              {times(10, Number).map(i => (
                <div key={i} className="marquee-text">{textSegments.map(segment => segment.text).join(' ')}</div>
              ))}
            </Marquee>
          </div>
        )}
      </div>
  );
}