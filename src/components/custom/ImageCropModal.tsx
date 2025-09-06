"use client";
import CustomModal from "@/components/custom/custom-modal";
import { IoMdClose } from "react-icons/io";
import Cropper, { Area } from "react-easy-crop";
import { useState, useCallback, useEffect } from "react";
import getCroppedImg from "@/utils/cropUtils";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  cropShape?: "rect" | "round";
  aspect?: number; // Allow dynamic aspect ratio
  title: string;
  isUploading: boolean;
  isProfile?: boolean; // New prop to differentiate profile vs cover
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  cropShape = "rect",
  aspect = 1, // Default to 1:1, will be overridden by props
  title,
  isUploading,
  isProfile = false, // Default to false (cover), true for profile
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Load image size to adjust initial crop position
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.width, height: img.height });
    };
  }, [imageSrc]);

  // Set dynamic aspect ratio based on isProfile
  const effectiveAspect = isProfile ? 1 : aspect || 4 / 1; // 1:1 for profile, 4:1 for cover (LinkedIn-like)

  const onCropCompleteInternal = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!croppedAreaPixels || !imageSize) return;
    try {
      const croppedImage = await getCroppedImg(imageSrc, {
        x: croppedAreaPixels.x,
        y: croppedAreaPixels.y,
        width: croppedAreaPixels.width,
        height: croppedAreaPixels.height,
      });
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete, imageSize]);

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  // Initialize crop position based on image size and aspect ratio
  useEffect(() => {
    if (imageSize && effectiveAspect) {
      const initialX =
        (imageSize.width - imageSize.height * effectiveAspect) / 2;
      const initialY = 0;
      setCrop({ x: initialX > 0 ? initialX : 0, y: initialY });
    }
  }, [imageSize, effectiveAspect]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      maxWidth="max-w-3xl"
      header={
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Adjust your image to look perfect
            </p>
          </div>
          <button
            className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] hover:bg-[#D1FAE5] rounded-full border flex justify-center items-center transition-colors"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <IoMdClose size={18} />
          </button>
        </div>
      }
      className="w-full "
    >
      <div className="p-6">
        <div className="relative h-[300px] rounded-lg overflow-hidden mb-6">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={effectiveAspect}
            cropShape={cropShape}
            showGrid={cropShape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            style={{
              containerStyle: {
                background: "#f9fafb",
                borderRadius: "8px",
              },
              cropAreaStyle: {
                border: "2px solid #40e0d0",
                boxShadow: "0 0 0 9999em rgba(0, 0, 0, 0.5)",
              },
              mediaStyle: {
                objectFit: "cover", // Ensure the image fills the crop area
                width: "100%",
                height: "300px",
              },
            }}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Zoom
          </label>
          <div className="relative">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
              style={{
                background: `linear-gradient(to right, #40e0d0 0%, #40e0d0 ${
                  ((zoom - 1) / 2) * 100
                }%, #e5e7eb ${((zoom - 1) / 2) * 100}%, #e5e7eb 100%)`,
              }}
            />
            <style jsx>{`
              input[type="range"]::-webkit-slider-thumb {
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #40e0d0;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
              }
              input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #40e0d0;
                cursor: pointer;
                border: 2px solid white;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                border: none;
              }
            `}</style>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1x</span>
            <span>3x</span>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 cursor-pointer text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading || !croppedAreaPixels}
            className="px-6 py-2.5 cursor-pointer bg-primary hover:bg-secondary text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              "Save Image"
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImageCropModal;
