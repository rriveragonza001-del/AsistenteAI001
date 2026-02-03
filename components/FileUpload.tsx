
import React, { useState } from 'react';
import { FileCategory, UploadedFile } from '../types';

interface FileUploadProps {
  category: FileCategory;
  onFilesAdded: (files: UploadedFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ category, onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Fix: Cast to File[] to avoid 'unknown' type errors during mapping
      const filesArray = Array.from(e.target.files) as File[];
      const newFiles: UploadedFile[] = await Promise.all(
        filesArray.map(async (f: File) => {
          const reader = new FileReader();
          const base64Promise = new Promise<string>((resolve) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]); // Extract base64
            };
          });
          // Fix: reader.readAsDataURL now correctly receives a File (Blob)
          reader.readAsDataURL(f);
          const base64 = await base64Promise;

          return {
            id: Math.random().toString(36).substr(2, 9),
            // Fix: f.name is now accessible on the typed File object
            name: f.name,
            type: f.name.split('.').pop() || '',
            category,
            uploadDate: new Date(),
            ownerId: 'current-user',
            contentBase64: base64,
            // Fix: f.type is now accessible on the typed File object
            mimeType: f.type,
            status: 'pending',
            tags: []
          };
        })
      );
      onFilesAdded(newFiles);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); /* Handle drop */ }}
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all text-center ${
        isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-white hover:border-slate-400'
      }`}
    >
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
      />
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-cloud-upload-alt text-2xl text-slate-500"></i>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">Subir {category === FileCategory.PROGRAMACION ? 'Programación' : 'Reporte'}</h3>
        <p className="text-sm text-slate-500 mt-2">
          Arrastra o haz clic para subir archivos PDF, Word o Excel.
        </p>
        <div className="mt-4 flex gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] rounded uppercase font-bold">PDF</span>
          <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] rounded uppercase font-bold">EXCEL</span>
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] rounded uppercase font-bold">WORD</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
