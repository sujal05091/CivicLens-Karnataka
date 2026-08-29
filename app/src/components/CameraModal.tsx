'use client';

import { useState, useRef, useEffect } from 'react';
import { X, RefreshCw, Check, Camera, Sliders } from 'lucide-react';

interface CameraModalProps {
  onClose: () => void;
  onCapture: (imageBase64: string, file: File) => void;
}

export default function CameraModal({ onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [flashAnimation, setFlashAnimation] = useState(false);

  // Initialize camera stream
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    async function startCamera() {
      setCameraError(null);

      // Stop active stream if switching mode
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        // Try rear camera first (mobile environment)
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode === 'environment' ? { ideal: 'environment' } : 'user',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch {
        // Fallback for PC/Desktop without rear camera
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
          currentStream = fallbackStream;
          setStream(fallbackStream);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch {
          setCameraError('Camera access denied or unavailable. You can upload an image file instead.');
        }
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  // Capture current video frame
  const handleShutterClick = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setFlashAnimation(true);
    setTimeout(() => setFlashAnimation(false), 300);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedPhoto(dataUrl);
    }
  };

  // Switch facing mode (Rear vs Front)
  const toggleCamera = () => {
    setCapturedPhoto(null);
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Confirm captured photo
  const handleConfirmPhoto = () => {
    if (!capturedPhoto) return;

    // Convert dataUrl to File
    const arr = capturedPhoto.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], `captured_evidence_${Date.now()}.jpg`, { type: mime });

    // Stop stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    onCapture(capturedPhoto, file);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex items-center justify-center p-2 md:p-6 overflow-hidden">
      
      {/* 1:1 Reference HTML Camera Card Container */}
      <div className="relative w-full max-w-[800px] h-[85vh] max-h-[640px] rounded-3xl overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 flex flex-col justify-between">
        
        {/* Shutter Flash Overlay */}
        {flashAnimation && (
          <div className="absolute inset-0 bg-white z-40 animate-fadeOut pointer-events-none" />
        )}

        {/* Video Preview or Captured Frame */}
        <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
          {capturedPhoto ? (
            <img src={capturedPhoto} alt="Captured evidence frame" className="w-full h-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Viewfinder Target Reticle Overlay 1:1 Stitch Reference */}
        {!capturedPhoto && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-64 md:h-64 border-2 border-cyan-400/40 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <div className="absolute -top-1 -left-1 w-5 h-5 border-t-4 border-l-4 border-cyan-400 rounded-tl" />
              <div className="absolute -top-1 -right-1 w-5 h-5 border-t-4 border-r-4 border-cyan-400 rounded-tr" />
              <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b-4 border-l-4 border-cyan-400 rounded-bl" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b-4 border-r-4 border-cyan-400 rounded-br" />
            </div>
          </div>
        )}

        {/* Top Header Overlay Controls 1:1 Stitch */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-20 flex justify-between items-center">
          <button
            onClick={() => {
              if (stream) stream.getTracks().forEach((track) => track.stop());
              onClose();
            }}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors border border-white/30"
            aria-label="Close viewfinder"
          >
            <X size={22} />
          </button>

          <div className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white text-xs font-mono font-bold flex items-center gap-2 border border-white/30 shadow-sm">
            <Sliders size={14} className="text-cyan-300" />
            <span>HDR AUTO • {facingMode === 'environment' ? 'REAR CAM' : 'FRONT CAM'}</span>
          </div>
        </div>

        {/* Camera Error Alert */}
        {cameraError && (
          <div className="absolute top-24 left-6 right-6 z-30 bg-red-600/90 backdrop-blur-md text-white p-4 rounded-2xl text-xs font-bold text-center border border-red-400 shadow-xl">
            {cameraError}
          </div>
        )}

        {/* Bottom Guidance & Controls 1:1 Stitch */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-20 space-y-4">
          
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-black text-white shadow-sm">
              {capturedPhoto ? 'Review captured photo' : 'Capture the problem clearly'}
            </h2>
            <p className="text-xs text-white/80 max-w-md mx-auto font-medium mt-1">
              {capturedPhoto
                ? 'Ensure the defect is clearly visible before submitting to Gemini AI.'
                : 'Include enough of the surrounding area to help confirm the location.'}
            </p>
          </div>

          {/* Action Control Buttons 1:1 Stitch */}
          <div className="flex items-center justify-center gap-6 pt-1">
            
            {/* Replay / Toggle Camera Button */}
            <button
              onClick={() => {
                if (capturedPhoto) {
                  setCapturedPhoto(null);
                } else {
                  toggleCamera();
                }
              }}
              className="w-14 h-14 rounded-full border-2 border-white text-white flex items-center justify-center hover:bg-white/20 active:scale-90 transition-all shadow-md"
              title={capturedPhoto ? 'Retake photo' : 'Switch camera'}
            >
              <RefreshCw size={22} />
            </button>

            {/* Shutter Button 1:1 Stitch */}
            {!capturedPhoto ? (
              <button
                onClick={handleShutterClick}
                className="relative w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent group active:scale-95 transition-all shadow-2xl"
                title="Take photo"
              >
                <div className="w-16 h-16 bg-white rounded-full group-hover:scale-105 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleConfirmPhoto}
                className="w-20 h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all shadow-2xl"
                title="Confirm & Analyze"
              >
                <Check size={36} />
              </button>
            )}

            {/* Confirm Check Button */}
            <button
              onClick={() => {
                if (!capturedPhoto) {
                  handleShutterClick();
                } else {
                  handleConfirmPhoto();
                }
              }}
              className="w-14 h-14 rounded-full bg-[var(--color-civic-blue)] text-white flex items-center justify-center hover:bg-[var(--color-civic-blue-dark)] active:scale-90 transition-all shadow-md"
              title="Confirm"
            >
              <Check size={24} />
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}
