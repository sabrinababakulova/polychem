import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
//  doc, xls, pdf, zip, jpg, png.

export const FileDrop = ({ onClose, setFile, fileType, children }) => {
  const [fileError, setFileError] = useState(false);
  const [tempFile, setTempFile] = useState([]);
  const [dropEnded, setDropEnded] = useState(false);
  const onDrop = useCallback(acceptedFiles => {
    fileType.forEach((type) => {
      acceptedFiles?.forEach((file) => {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        if (file.type.includes(type)) {
          setTempFile((prev) => [...prev, newFile]);
        }
      });
    });
    setDropEnded(true);
    onClose && onClose();
  }, []);

  useEffect(() => {
    if (dropEnded) {
      setFileError(!tempFile);
    }
  }, [dropEnded, tempFile]);

  useEffect(() => {
    if (!fileError && tempFile) {
      setFile(tempFile);
    }
  }, [fileError, tempFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <>
      {children ? (
        <div {...getRootProps()}>
          <input {...getInputProps()} accept={fileType} />
          {children}
        </div>
      ) : (
        <div className="w-full h-full">
          <div
            {...getRootProps()}
            className={`${
              isDragActive ? "bg-cyan-500" : "bg-pale-grey"
            } w-full h-full flex flex-col ${
              fileError ? " border-red-400" : "border-cold-purple"
            }  justify-center items-center rounded-lg border-2 border-dashed`}
          >
            <input {...getInputProps()} accept={fileType} />
            <p
              className={`${
                fileError ? " text-red-400" : "text-storm-grey"
              } font-semibold`}
            >
              Drag files here or browse
            </p>
          </div>
        </div>
      )}
    </>
  );
};
