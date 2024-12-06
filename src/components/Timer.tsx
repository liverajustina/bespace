import { useState, useEffect } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { FiPlay, FiPause, FiRotateCcw } from 'react-icons/fi';

interface TimerProps {
  duration: number;
  onComplete: () => void;
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

export function Timer({ duration, onComplete, isActive, onToggle, onReset }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            clearInterval(interval);
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mt-3">
      <div className="d-flex align-items-center justify-content-between mb-2">
        <span className="h4 mb-0">{formatTime(timeLeft)}</span>
        <div>
          <Button
            variant={isActive ? "outline-warning" : "outline-success"}
            size="sm"
            onClick={onToggle}
            className="me-2"
          >
            {isActive ? <FiPause /> : <FiPlay />}
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              onReset();
              setTimeLeft(duration * 60);
            }}
          >
            <FiRotateCcw />
          </Button>
        </div>
      </div>
      <ProgressBar now={progress} variant="info" />
    </div>
  );
}