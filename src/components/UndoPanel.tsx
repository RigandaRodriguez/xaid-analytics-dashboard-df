
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Undo2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UndoPanelProps {
  isVisible: boolean;
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
  duration?: number;
}

const UndoPanel = ({ isVisible, message, onUndo, onDismiss, duration = 5000 }: UndoPanelProps) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(duration / 1000);

  useEffect(() => {
    if (!isVisible) return;

    setTimeLeft(duration / 1000);
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, duration, onDismiss]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in-up">
      <Card className="px-4 py-3 bg-gray-900 text-white border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Undo2 className="w-4 h-4" />
          <span className="text-sm">{message}</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onUndo}
            className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 h-auto py-1 px-2"
          >
            {t('messages.undo')}
          </Button>
          <div className="text-xs text-gray-400">
            {timeLeft}с
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-300 hover:bg-gray-800 h-auto p-1"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default UndoPanel;
