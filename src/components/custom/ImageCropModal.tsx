"use client";
import CustomModal from "@/components/custom/custom-modal";
import { IoMdClose } from "react-icons/io";
import { HiOutlineZoomIn, HiOutlineZoomOut } from "react-icons/hi";
import { MdRotateLeft, MdRotateRight } from "react-icons/md";
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
  const [rotation, setRotation] = useState(0);
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

  // Set dynamic aspect ratio based on isProfile - LinkedIn style ratios
  const effectiveAspect = isProfile ? 1 : aspect || 4 / 1; // 1:1 for profile (circle), 4:1 for cover (LinkedIn style banner)

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
      }, rotation);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error("Error cropping image:", e);
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete, imageSize, rotation]);

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setCroppedAreaPixels(null);
    onClose();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.8));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  // Initialize crop position to center the image
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1); // Start with normal zoom for better initial framing
    setRotation(0); // Reset rotation
  }, [imageSrc]);

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      maxWidth="max-w-4xl"
      header={
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-orange-50 to-primary/10 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Drag to reposition • Scroll to zoom • Click tools to adjust
            </p>
          </div>
          <button
            className="text-gray-500 hover:text-gray-700 p-2 hover:bg-white/70 rounded-lg transition-all cursor-pointer"
            onClick={handleCancel}
            disabled={isUploading}
          >
            <IoMdClose size={24} />
          </button>
        </div>
      }
      className="w-full "
    >
      <div className="bg-gray-50">
        {/* Main cropper area with better styling */}
        <div className="relative h-[400px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={effectiveAspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            restrictPosition={true}
            minZoom={0.8}
            maxZoom={3}
            style={{
              containerStyle: {
                background: "transparent",
              },
              cropAreaStyle: {
                border: isProfile ? "3px solid rgb(251, 146, 60)" : "2px solid rgb(251, 146, 60)",
                boxShadow: isProfile
                  ? "0 0 0 9999px rgba(0, 0, 0, 0.65), 0 4px 20px rgba(251, 146, 60, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
                  : "0 0 0 9999px rgba(0, 0, 0, 0.6), 0 2px 10px rgba(251, 146, 60, 0.3)",
                color: "rgba(255, 255, 255, 0.5)",
              },
              mediaStyle: {
                maxHeight: "100%",
                maxWidth: "100%",
              },
            }}
          />
          {/* Overlay guides for better positioning */}
          {cropShape === "rect" && (
            <>
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 right-0 h-px bg-white/10" />
                <div className="absolute top-2/3 left-0 right-0 h-px bg-white/10" />
                <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/10" />
                <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/10" />
              </div>
            </>
          )}
        </div>

        {/* Controls section with Facebook/LinkedIn style */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          {/* Quick action buttons */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <HiOutlineZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <HiOutlineZoomIn className="w-5 h-5 text-gray-700" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={handleRotateLeft}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Rotate Left"
            >
              <MdRotateLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleRotateRight}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
              title="Rotate Right"
            >
              <MdRotateRight className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Zoom slider */}
          <div className="mb-4">
            <div className="flex items-center gap-4">
              <HiOutlineZoomOut className="w-4 h-4 text-gray-400" />
              <div className="flex-1 relative">
                <input
                  type="range"
                  min={0.8}
                  max={3}
                  step={0.01}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, rgb(251, 146, 60) 0%, rgb(251, 146, 60) ${
                      ((zoom - 0.8) / 2.2) * 100
                    }%, #e5e7eb ${((zoom - 0.8) / 2.2) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <style jsx>{`
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(251, 146, 60);
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: rgb(251, 146, 60);
                    cursor: pointer;
                    border: 3px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                  }
                `}</style>
              </div>
              <HiOutlineZoomIn className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-500">
              {isProfile ? "Your profile photo will be displayed as a circle" : "Cover photo will be displayed across the top of your profile"}
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUploading || !croppedAreaPixels}
                className="px-5 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Photo"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImageCropModal;
