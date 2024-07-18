import React from 'react';
import './fileupload.css';

interface FileUploadProps {
  label: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  size?: 'small' | 'medium' | 'large';
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onChange,
  disabled = false,
  multiple = false,
  accept = '',
  size = 'medium',
}) => {
  return (
    <div className={`file-upload ${size}`}>
      <label className="file-upload-label">
        {label}
        <input
          type="file"
          onChange={onChange}
          disabled={disabled}
          multiple={multiple}
          accept={accept}
        />
      </label>
    </div>
  );
};

export default FileUpload;
