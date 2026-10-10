import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { ApiException } from '../../infrastructure/http/HttpClient';

interface ErrorMessageProps {
  error: ApiException | Error | string | null;
  onDismiss?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onDismiss, className = '' }) => {
  if (!error) return null;

  let message = '';
  let fieldErrors: Record<string, string[]> = {};

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof ApiException) {
    message = error.message;
    fieldErrors = error.fieldErrors;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;

  return (
    <div className={`rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 shadow-sm relative ${className}`}>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-sm">
          <p className="font-semibold">{message}</p>
          {hasFieldErrors && (
            <ul className="mt-2 list-disc list-inside space-y-1 text-red-700 text-xs">
              {Object.entries(fieldErrors).map(([field, errs]) => (
                <li key={field}>
                  <span className="font-medium">{field}:</span> {errs.join(', ')}
                </li>
              ))}
            </ul>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-400 hover:text-red-600 transition-colors p-1 -mr-1 -mt-1 rounded"
            aria-label="Cerrar error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
