import React, { memo, useCallback, useMemo, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { AppNavMode } from "@/hooks/logic/useAppNavContext";
import { Button as UIButton } from "@/components/ui/button";

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
  navMode: AppNavMode;
}

const DefaultImageDropzoneWithPreview: React.FC<Props> = ({
  dragDisplayText,
  clearButtonText,
  selectButtonText,
  onSelectFile,
  onClearFile,
  acceptOnly = undefined,
  initialPreview = null,
  navMode,
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
      if (navMode === "navigate") {
        URL.revokeObjectURL(previewImage?.url);
      }
    }
    if (onClearFile) onClearFile();
  }, [navMode, onClearFile, previewImage]);

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
    <React.Fragment>
      <div {...getRootProps({ style: style as any })}>
        <input {...getInputProps()} />
        {previewImage ? (
          <figure className="flex w-full flex-col items-center">
            <img
              alt={previewImage.fileName}
              src={previewImage.url}
              className="object-contain"
              style={{ height: "130px" }}
            />
            <figcaption className="mt-1 text-xs">{previewImage.fileName}</figcaption>
          </figure>
        ) : (
          <p className="text-sm">{dragDisplayText}</p>
        )}
      </div>
      <div className="mt-2 px-4">
        {previewImage ? (
          <UIButton variant="secondary" size="sm" className="w-full" onClick={handleClearImage}>
            {clearButtonText}
          </UIButton>
        ) : (
          <UIButton variant="secondary" size="sm" className="w-full" onClick={open}>
            {selectButtonText}
          </UIButton>
        )}
      </div>
    </React.Fragment>
  );
};

export default memo(DefaultImageDropzoneWithPreview);
