import React, { memo, useCallback, useState } from "react";
import { useDropzone, type Accept } from "react-dropzone";

import { Button as UIButton } from "@/components/ui/button";
import { cn } from "@/utils";

export type PreviewImage = { fileName: string; dataUrl: string };
export type PreviewImageState = PreviewImage | null;
export type OnClearImageFn = (previewImageState: PreviewImageState) => void;
export type OnSelectImageFn = (previewImage: PreviewImage) => void;

interface Props {
  dragDisplayText: string;
  selectButtonText: string;
  clearButtonText: string;
  onSelectFile?: OnSelectImageFn;
  onClearFile?: OnClearImageFn;
  acceptOnly?: Accept;
  initialPreview?: PreviewImage | null;
}

const ImageDropzoneWithPreview: React.FC<Props> = ({
  dragDisplayText,
  clearButtonText,
  selectButtonText,
  onSelectFile,
  onClearFile,
  acceptOnly = undefined,
  initialPreview = null,
}) => {
  const [previewImage, setPreviewImage] = useState<PreviewImageState>(initialPreview);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const objectUrl = URL.createObjectURL(file);
      const fileState = { fileName: file.name, dataUrl: objectUrl };
      setPreviewImage(fileState);
      onSelectFile?.(fileState);
    },
    [onSelectFile]
  );

  const handleClearImage = useCallback(() => {
    onClearFile?.(previewImage);
    if (previewImage) {
      setPreviewImage(null);
    }
  }, [onClearFile, previewImage]);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
    accept: acceptOnly,
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    onDrop,
  });

  return (
    <React.Fragment>
      <div
        {...getRootProps({
          className: cn(
            "flex flex-1 flex-col items-center justify-center p-6 border-2 border-dashed border-primary-foreground rounded outline-none bg-muted-foreground/10 text-primary/75",
            isDragActive ? "border-accent" : undefined,
            isDragAccept ? "border-success" : undefined,
            isDragReject ? "border-destructive" : undefined
          ),
          style: {
            transition: "border .24s ease-in-out",
          },
        })}
      >
        <input {...getInputProps()} />
        {previewImage ? (
          <figure className="flex w-full flex-col items-center">
            <img
              alt={previewImage.fileName}
              src={previewImage.dataUrl}
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
          <UIButton type="button" variant="secondary" size="sm" className="w-full" onClick={handleClearImage}>
            {clearButtonText}
          </UIButton>
        ) : (
          <UIButton type="button" variant="secondary" size="sm" className="w-full" onClick={open}>
            {selectButtonText}
          </UIButton>
        )}
      </div>
    </React.Fragment>
  );
};

export default memo(ImageDropzoneWithPreview);
