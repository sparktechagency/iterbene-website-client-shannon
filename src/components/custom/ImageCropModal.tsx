"use client";
import CustomModal from "@/components/custom/custom-modal";
import { IoMdClose } from "react-icons/io";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedImage: File) => void;
  cropShape?: "rect" | "round";
  aspect?: number;
  title: string;
  isUploading: boolean;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  cropShape = "rect",
  aspect = 12 / 6,
  title,
  isUploading
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | { x: number; y: number; width: number; height: number }>(null);

  const onCropCompleteInternal = useCallback(( croppedAreaPixels: { x: number; y: number; width: number; height: number }) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const { getCroppedImg } = await import("@/utils/cropUtils");
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    }
  };

  const handleCancel = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      maxWidth="max-w-3xl"
      header={
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">Adjust your image to look perfect</p>
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
      className="w-full p-0"
    >
      <div className="p-6">
        {/* Cropper Container */}
        <div className="relative h-[300px]  rounded-lg overflow-hidden mb-6">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteInternal}
            style={{
              containerStyle: {
                background: '#f9fafb',
                borderRadius: '8px',
              },
              cropAreaStyle: {
                border: '2px solid #40e0d0',
                boxShadow: '0 0 0 9999em rgba(0, 0, 0, 0.5)',
              },
              mediaStyle: {
                transform: 'none',
              }
            }}
          />
        </div>

        {/* Zoom Control */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Zoom</label>
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
                background: `linear-gradient(to right, #40e0d0 0%, #40e0d0 ${((zoom - 1) / 2) * 100}%, #e5e7eb ${((zoom - 1) / 2) * 100}%, #e5e7eb 100%)`
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUploading || !croppedAreaPixels}
            className="px-6 py-2.5 bg-primary hover:bg-secondary text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </>
            ) : (
              'Save Image'
            )}
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ImageCropModal;