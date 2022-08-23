import React, { memo, useCallback, useMemo, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import Button from "../Elements/Button";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px 20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

interface Props {
  dragDisplayText: string;
  selectButtonText: string;
  clearButtonText: string;
  onSelectFile?: (file: File) => void;
  onClearFile?: () => void;
  acceptOnly?: Accept;
  initialPreview?: { fileName: string; url: string } | null | undefined;
}

const DefaultImageDropzoneWithPreview: React.FC<Props> = ({
  dragDisplayText,
  clearButtonText,
  selectButtonText,
  onSelectFile,
  onClearFile,
  acceptOnly = undefined,
  initialPreview = null,
}) => {
  const [previewImage, setPreviewImage] = useState<{ fileName: string; url: string } | null>(initialPreview);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      setPreviewImage({ fileName: file.name, url: objectUrl });

      if (onSelectFile) {
        // callBack to lift file to parent state
        onSelectFile(file);
      }
    },
    [onSelectFile]
  );

  const handleClearImage = useCallback(() => {
    if (previewImage) {
      setPreviewImage(null);
      URL.revokeObjectURL(previewImage?.url);
    }
    if (onClearFile) onClearFile();
  }, [onClearFile, previewImage]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    accept: acceptOnly,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onDrop,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragAccept, isDragReject]
  );
  return (
    <>
      <div {...getRootProps({ style: style as any })}>
        <input {...getInputProps()} />
        {previewImage ? (
          <figure className="w-full flex flex-col items-center">
            <img
              alt={previewImage.fileName}
              src={previewImage.url}
              className="object-contain"
              style={{ height: "130px" }}
            />
            <figcaption>{previewImage.fileName}</figcaption>
          </figure>
        ) : (
          <p>{dragDisplayText}</p>
        )}
      </div>
      <div className="mt-2">
        {previewImage ? (
          <Button variant="danger" size="sm" onClick={handleClearImage}>
            {clearButtonText}
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={open}>
            {selectButtonText}
          </Button>
        )}
      </div>
    </>
  );
};

export default memo(DefaultImageDropzoneWithPreview);
