import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadLogs } from '../../api/client.jsx';
import { useDashboardStore } from '../../store/dashboardStore.jsx';

const LOG_TYPES = [
  { value: 'apache', label: 'Apache Access Log', hint: 'Combined log format (access.log)' },
  { value: 'ssh', label: 'SSH Auth Log', hint: 'Linux auth.log / syslog SSH events' },
  { value: 'windows', label: 'Windows Event Log', hint: 'CSV export from Event Viewer' },
];

export default function LogUploader() {
  const [logType, setLogType] = useState('apache');
  const { setResult, setLoading, setError, isLoading } = useDashboardStore();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!acceptedFiles.length) return;
    setLoading(true);
    try {
      const result = await uploadLogs(acceptedFiles[0], logType);
      setResult(result);
    } catch (err) {
      setError(err.response?.data?.error ?? err.message ?? 'Upload failed');
    } finally {
      setLoading(false);
    }
  }, [logType, setResult, setLoading, setError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
      <div className="w-full max-w-xl">
        <h2 className="text-white text-2xl font-semibold mb-2 text-center">Analyze a Log File</h2>
        <p className="text-gray-400 text-sm text-center mb-8">
          Upload an Apache, SSH, or Windows Event log to detect anomalies and visualize activity.
        </p>

        {/* Log type selector */}
        <div className="mb-4 grid grid-cols-3 gap-2">
          {LOG_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setLogType(t.value)}
              className={`p-3 rounded-lg border text-left transition-all ${
                logType === t.value
                  ? 'border-blue-500 bg-blue-500/10 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200'
              }`}
            >
              <div className="font-medium text-sm">{t.label}</div>
              <div className="text-xs mt-0.5 opacity-70">{t.hint}</div>
            </button>
          ))}
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-400 bg-blue-400/5'
              : 'border-gray-600 hover:border-gray-400 hover:bg-gray-800/30'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-400 text-sm">Parsing and analyzing...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-gray-300 font-medium">
                  {isDragActive ? 'Drop it here' : 'Drag & drop your log file'}
                </p>
                <p className="text-gray-500 text-sm mt-1">or click to browse</p>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          Sample files available in the <code className="text-gray-500">samples/</code> folder
        </p>
      </div>
    </div>
  );
}