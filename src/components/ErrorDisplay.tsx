
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApiError } from '@/types/api';

interface ErrorDisplayProps {
  error: ApiError | Error | null;
  onRetry?: () => void;
  className?: string;
  title?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onRetry, 
  className,
  title = 'Произошла ошибка'
}) => {
  if (!error) return null;

  const errorMessage = 'message' in error ? error.message : String(error);
  const errorStatus = 'status' in error ? error.status : undefined;

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center justify-between">
        {title}
        {errorStatus && (
          <span className="text-sm font-mono">HTTP {errorStatus}</span>
        )}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-3">{errorMessage}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="bg-white hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Повторить
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorDisplay;
