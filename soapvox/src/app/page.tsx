"use client";

import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import Marquee from 'react-marquee-slider';

type TextSegment = {
  id?: number;
  start: number;
  end: number;
  text: string;
  character_name: string;
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
    { start: 0, end: 1, text: 'Hello', character_name: 'Alice' },
  ]);
  const [currentText, setCurrentText] = useState<string>('');
  const [uploadId, setUploadId] = useState<number | null>(null);

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
      const response = await fetch('http://localhost:3001/api/uploads/video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUploadId(data.upload_id); // Stocke l'upload_id retourné
        const url = `http://localhost:3001/api/uploads/audio/${data.upload_id}`;
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
            setCurrentText(activeSegment.text);
          } else {
            setCurrentText('');
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
    const newSegment: TextSegment = { start: 0, end: 1, text: "Nouveau texte", character_name: "Personnage" };
    setTextSegments([...textSegments, newSegment]);
  };

  const updateTextSegment = (index: number, key: keyof TextSegment, value: string | number) => {
    const updatedSegments = [...textSegments];
    updatedSegments[index] = { ...updatedSegments[index], [key]: value };
    setTextSegments(updatedSegments);
  };

  const deleteTextSegment = async (index: number) => {
    const segment = textSegments[index];
    if (segment.id) {
      try {
        const response = await fetch(`http://localhost:3001/api/segments/${segment.id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete segment');
        }
      } catch (error) {
        console.error('Error deleting segment:', error);
        return;
      }
    }
    const updatedSegments = textSegments.filter((_, i) => i !== index);
    setTextSegments(updatedSegments);
  };

  const saveSegments = async () => {
    if (!uploadId) {
      console.error('Upload ID is not set');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ segments: textSegments, upload_id: uploadId }),
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
      const response = await fetch('http://localhost:3001/api/segments');
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
          <Marquee
            velocity={0.1}
            direction="rtl"
            resetAfterTries={200}
            onInit={() => {}}
            onFinish={() => {}}
          >
            {textSegments.map((segment, index) => (
              <div key={index} className="scrolling-text">{segment.text}</div>
            ))}
          </Marquee>
        </div>
      )}
      <div className="text-segment-editor">
        {textSegments.map((segment, index) => (
          <div key={index} className="text-segment">
            <input type="text" value={segment.text} onChange={(e) => updateTextSegment(index, 'text', e.target.value)} />
            <input type="text" value={segment.character_name} onChange={(e) => updateTextSegment(index, 'character_name', e.target.value)} />
            <input type="number" value={segment.start} onChange={(e) => updateTextSegment(index, 'start', parseFloat(e.target.value))} />
            <input type="number" value={segment.end} onChange={(e) => updateTextSegment(index, 'end', parseFloat(e.target.value))} />
            <button onClick={() => deleteTextSegment(index)}>Supprimer</button>
          </div>
        ))}
        <button onClick={addTextSegment}>Ajouter un segment</button>
        <button onClick={saveSegments}>Sauvegarder les segments</button>
      </div>
    </div>
  );
}
