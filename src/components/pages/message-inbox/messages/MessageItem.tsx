import React, { useState } from "react";
import Image from "next/image";
import moment from "moment";
import { IMessage, MessageType } from "@/types/messagesType";
import "yet-another-react-lightbox/styles.css";
import Link from "next/link";
import pdf from "@/asset/message/pdf.png";
import { IUser } from "@/types/user.types";
import {
  Eye,
  Download,
  FileText,
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
} from "lucide-react";
import { getFullName } from "@/utils/nameUtils";

interface MessageItemProps {
  message: IMessage;
  isMyMessage: boolean;
  receiverInfo: IUser;
  onOpenLightbox: (images: string[], initialIndex?: number) => void;
}

// PDF Modal Component
interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  fileName: string;
}

const PDFModal: React.FC<PDFModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  fileName,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = fileName;
    link.target = "_blank";
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <FileText size={20} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 truncate">
                {fileName}
              </h3>
              <p className="text-sm text-gray-500">PDF Document</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download size={16} />
              <span>Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 p-4">
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=FitH`}
            className="w-full h-full rounded-lg border border-gray-200"
            title={fileName}
          />
        </div>
      </div>
    </div>
  );
};

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  isMyMessage,
  receiverInfo,
  onOpenLightbox,
}) => {
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [videoStates, setVideoStates] = useState<
    Record<
      string,
      {
        isPlaying: boolean;
        isMuted: boolean;
        showControls: boolean;
      }
    >
  >({});

  const fileUrls = message?.content?.fileUrls || [];

  // Video control functions
  const togglePlay = (videoId: string, videoElement: HTMLVideoElement) => {
    if (videoStates[videoId]?.isPlaying) {
      videoElement.pause();
    } else {
      // Pause all other videos first
      Object.keys(videoStates).forEach((id) => {
        if (id !== videoId && videoStates[id]?.isPlaying) {
          const otherVideo = document.getElementById(
            `video-${id}`
          ) as HTMLVideoElement;
          if (otherVideo) otherVideo.pause();
        }
      });
      videoElement.play();
    }
  };

  const toggleMute = (videoId: string, videoElement: HTMLVideoElement) => {
    videoElement.muted = !videoElement.muted;
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: {
        ...prev[videoId],
        isMuted: videoElement.muted,
      },
    }));
  };

  const handleVideoPlay = (videoId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], isPlaying: true },
    }));
  };

  const handleVideoPause = (videoId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], isPlaying: false },
    }));
  };

  const showVideoControls = (videoId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], showControls: true },
    }));
  };

  const hideVideoControls = (videoId: string) => {
    setVideoStates((prev) => ({
      ...prev,
      [videoId]: { ...prev[videoId], showControls: false },
    }));
  };

  // Initialize video state
  const initVideoState = (videoId: string) => {
    if (!videoStates[videoId]) {
      setVideoStates((prev) => ({
        ...prev,
        [videoId]: {
          isPlaying: false,
          isMuted: true,
          showControls: false,
        },
      }));
    }
  };

  // Limit displayed images to 2
  const displayedImages = fileUrls.slice(0, 2);
  const extraImagesCount = fileUrls.length - displayedImages.length;

  const openPdfModal = (pdfUrl: string, fileName: string) => {
    setSelectedPdfUrl(pdfUrl);
    setSelectedFileName(fileName);
    setPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setSelectedPdfUrl("");
    setSelectedFileName("");
  };

  console.log("MessageItem:", message);
  return (
    <div
      className={`flex ${
        isMyMessage ? "justify-end" : "justify-start"
      } items-end gap-3 mb-3`}
    >
      {/* Sender/Receiver Image */}
      {!isMyMessage && receiverInfo?.profileImage && (
        <Image
          src={receiverInfo.profileImage}
          alt="profile"
          width={40}
          height={40}
          className="size-10 md:size-12 object-cover rounded-full flex-shrink-0"
        />
      )}

      {/* Message Content */}
      <div
        className={`w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] flex flex-col ${
          isMyMessage ? "items-end" : "items-start"
        } flex-shrink-0`}
      >
        {/* Mixed Content - Enhanced layout */}
        {message?.content?.messageType === MessageType.MIXED && (
          <div
            className={`flex flex-col space-y-2 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {fileUrls.length > 0 && (
              <div
                className={`grid gap-1 max-w-[300px] sm:max-w-[400px] ${
                  fileUrls.length === 1
                    ? "grid-cols-1"
                    : fileUrls.length === 2
                    ? "grid-cols-2"
                    : "grid-cols-2"
                }`}
              >
                {displayedImages.map((url, index) => {
                  // Check if it's a video URL (basic check)
                  const isVideo =
                    url.includes(".mp4") ||
                    url.includes(".webm") ||
                    url.includes(".mov");
                  const mediaId = `mixed-${message._id}-${index}`;

                  if (isVideo) {
                    initVideoState(mediaId);
                    const currentVideoState = videoStates[mediaId] || {
                      isPlaying: false,
                      isMuted: true,
                      showControls: false,
                    };

                    return (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg bg-black"
                        onMouseEnter={() => showVideoControls(mediaId)}
                        onMouseLeave={() => hideVideoControls(mediaId)}
                      >
                        <video
                          id={`video-${mediaId}`}
                          className="w-full h-[150px] object-cover"
                          muted={currentVideoState.isMuted}
                          playsInline
                          preload="metadata"
                          onPlay={() => handleVideoPlay(mediaId)}
                          onPause={() => handleVideoPause(mediaId)}
                          onClick={(e) => {
                            const video = e.target as HTMLVideoElement;
                            togglePlay(mediaId, video);
                          }}
                        >
                          <source src={url} type="video/mp4" />
                        </video>

                        {(!currentVideoState.isPlaying ||
                          currentVideoState.showControls) && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const video = document.getElementById(
                                  `video-${mediaId}`
                                ) as HTMLVideoElement;
                                if (video) togglePlay(mediaId, video);
                              }}
                              className="bg-black/60 hover:bg-black/80 text-white rounded-full p-2"
                            >
                              {currentVideoState.isPlaying ? (
                                <Pause size={16} fill="white" />
                              ) : (
                                <Play
                                  size={16}
                                  fill="white"
                                  className="ml-0.5"
                                />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={index}
                        className="relative cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => onOpenLightbox(fileUrls, index)}
                      >
                        <Image
                          src={url}
                          alt={`image-${index}`}
                          width={150}
                          height={150}
                          className="w-full h-[150px] object-cover hover:scale-105 transition-transform duration-200"
                        />
                        {index === 1 && extraImagesCount > 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                            +{extraImagesCount}
                          </div>
                        )}
                      </div>
                    );
                  }
                })}
              </div>
            )}
            {message.content.text && (
              <div
                className={`max-w-fit p-3 rounded-xl ${
                  isMyMessage
                    ? "bg-[#E6E6E6] text-gray-800"
                    : "bg-[#ECFCFA] text-[#1A1A1A]"
                }`}
              >
                {message.content.text}
              </div>
            )}
          </div>
        )}

        {/* Text Message */}
        {message?.content?.messageType === MessageType.TEXT && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <div
              className={`max-w-fit p-3 rounded-xl ${
                isMyMessage
                  ? "bg-[#E6E6E6] text-gray-800"
                  : "bg-[#ECFCFA] text-[#1A1A1A]"
              }`}
            >
              {message.content.text}
            </div>
          </div>
        )}

        {/* Image Message - Enhanced for better layout */}
        {message?.content?.messageType === MessageType.IMAGE && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <div
              className={`grid gap-1 max-w-[300px] sm:max-w-[400px] ${
                fileUrls.length === 1
                  ? "grid-cols-1"
                  : fileUrls.length === 2
                  ? "grid-cols-2"
                  : fileUrls.length === 3
                  ? "grid-cols-2"
                  : "grid-cols-2"
              }`}
            >
              {displayedImages.map((url, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer overflow-hidden rounded-lg ${
                    fileUrls.length === 1
                      ? "col-span-1"
                      : fileUrls.length === 3 && index === 0
                      ? "col-span-2"
                      : "col-span-1"
                  }`}
                  onClick={() => onOpenLightbox(fileUrls, index)}
                >
                  <Image
                    src={url}
                    alt={`image-${index}`}
                    width={fileUrls.length === 1 ? 300 : 150}
                    height={fileUrls.length === 1 ? 300 : 150}
                    className={`object-cover hover:scale-105 transition-transform duration-200 ${
                      fileUrls.length === 1
                        ? "w-full h-auto max-h-[400px]"
                        : "w-full h-[150px]"
                    }`}
                  />
                  {index === 1 && extraImagesCount > 0 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-bold">
                      +{extraImagesCount}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Message */}
        {message?.content?.messageType === MessageType.AUDIO && (
          <div className="flex flex-col space-y-1">
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            <audio controls className="max-w-full">
              <source src={fileUrls[0]} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Video Message - Enhanced Instagram/Messenger Style */}
        {message?.content?.messageType === MessageType.VIDEO && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {fileUrls.map((videoUrl, index) => {
              const videoId = `${message._id}-${index}`;
              initVideoState(videoId);
              const currentVideoState = videoStates[videoId] || {
                isPlaying: false,
                isMuted: true,
                showControls: false,
              };

              return (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden bg-black max-w-[300px] sm:max-w-[400px]"
                  onMouseEnter={() => showVideoControls(videoId)}
                  onMouseLeave={() => hideVideoControls(videoId)}
                >
                  <video
                    id={`video-${videoId}`}
                    className="w-full h-auto max-h-[400px] object-cover cursor-pointer"
                    muted={currentVideoState.isMuted}
                    playsInline
                    preload="metadata"
                    onPlay={() => handleVideoPlay(videoId)}
                    onPause={() => handleVideoPause(videoId)}
                    onClick={(e) => {
                      const video = e.target as HTMLVideoElement;
                      togglePlay(videoId, video);
                    }}
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>

                  {/* Play/Pause Button Overlay */}
                  {(!currentVideoState.isPlaying ||
                    currentVideoState.showControls) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const video = document.getElementById(
                            `video-${videoId}`
                          ) as HTMLVideoElement;
                          if (video) togglePlay(videoId, video);
                        }}
                        className="bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                      >
                        {currentVideoState.isPlaying ? (
                          <Pause size={24} fill="white" />
                        ) : (
                          <Play size={24} fill="white" className="ml-1" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Video Controls Overlay */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 transition-opacity duration-200 ${
                      currentVideoState.showControls
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const video = document.getElementById(
                              `video-${videoId}`
                            ) as HTMLVideoElement;
                            if (video) toggleMute(videoId, video);
                          }}
                          className="text-white hover:text-blue-400 transition-colors"
                        >
                          {currentVideoState.isMuted ? (
                            <VolumeX size={20} />
                          ) : (
                            <Volume2 size={20} />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const video = document.getElementById(
                            `video-${videoId}`
                          ) as HTMLVideoElement;
                          if (video && video.requestFullscreen) {
                            video.requestFullscreen();
                          }
                        }}
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        <Maximize2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Loading/Buffering Indicator */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Video
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* Document Message */}
        {message?.content?.messageType === MessageType.DOCUMENT && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message.createdAt).format("h:mm A")}
            </span>
            {fileUrls.map((fileUrl, index) => {
              const fileName = decodeURIComponent(
                fileUrl.split("/").pop()?.split("?")[0] || `file-${index}`
              );
              const isPdf = fileName.toLowerCase().endsWith(".pdf");

              return (
                <div
                  key={index}
                  className={`w-64 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${
                    isMyMessage ? "" : ""
                  }`}
                >
                  {isPdf ? (
                    // Enhanced PDF preview with WhatsApp-style design
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                          <FileText size={24} className="text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-sm">
                            {fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF Document
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
                        <button
                          onClick={() => openPdfModal(fileUrl, fileName)}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = fileUrl;
                            link.download = fileName;
                            link.target = "_blank";
                            link.click();
                          }}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                        >
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Regular file display
                    <div
                      className={`flex items-center gap-2 ${
                        isMyMessage ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <Image src={pdf} width={32} height={32} alt="file" />
                      <Link
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate text-sm"
                        title={fileName}
                      >
                        {fileName}
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {/* Story Message */}
        {message?.content?.messageType === MessageType.STORYMESSAGE && (
          <div
            className={`flex flex-col space-y-1 ${
              isMyMessage ? "items-end" : "items-start"
            }`}
          >
            <span
              className={`text-xs text-gray-500 ${
                isMyMessage ? "mr-2 mb-1" : "ml-2 mb-1"
              }`}
            >
              {moment(message?.createdAt).format("h:mm A")}
            </span>
            {/* user friendly message for story */}
            <div className="text-xs text-gray-500 mb-1">
              {isMyMessage
                ? `You replied to ${getFullName(receiverInfo)}'s journey`
                : `${getFullName(receiverInfo)} replied to your journey`}
            </div>
            {/* Image */}
            <div>
              {message?.storyMedia?.mediaType === "image" ? (
                message?.storyMedia?.mediaUrl ? (
                  <>
                    <Image
                      src={message?.storyMedia?.mediaUrl || ""}
                      alt={`Story Image`}
                      width={150}
                      height={150}
                      className="w-[120px] h-[120px] object-cover rounded-lg"
                    />
                    {message?.content?.text && !isMyMessage && (
                      <h1 className="max-w-fit p-3 rounded-xl bg-[#ECFCFA] text-[#1A1A1A]">
                        {message?.content?.text}
                      </h1>
                    )}
                  </>
                ) : (
                  <div className="w-[120px] h-[120px] bg-slate-100 flex items-center justify-center rounded-lg">
                    <h1 className="text-xs text-gray-700 text-center">
                      Journey no longer available
                    </h1>
                  </div>
                )
              ) : message?.storyMedia?.mediaType === "mixed" ? (
                message?.storyMedia?.mediaUrl ? (
                  <div className="flex flex-col gap-2">
                    <Image
                      src={message?.storyMedia?.mediaUrl || ""}
                      alt={`Story Image`}
                      width={150}
                      height={150}
                      className="w-[120px] h-[120px] object-cover rounded-lg"
                    />
                    {message?.content?.text && !isMyMessage && (
                      <h1 className="max-w-fit p-3 rounded-xl bg-[#ECFCFA] text-[#1A1A1A]">
                        {message?.content?.text}
                      </h1>
                    )}
                  </div>
                ) : (
                  <div className="w-[120px] h-[120px] bg-slate-100 flex items-center justify-center rounded-lg">
                    <h1 className="text-xs text-gray-700 text-center">
                      Journey no longer available
                    </h1>
                  </div>
                )
              ) : (
                <div
                  className={`max-w-fit p-3 rounded-xl mt-2 ${
                    isMyMessage
                      ? "bg-[#E6E6E6] text-gray-800"
                      : "bg-[#ECFCFA] text-[#1A1A1A]"
                  }`}
                >
                  {message.content.text}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Modal */}
      <PDFModal
        isOpen={pdfModalOpen}
        onClose={closePdfModal}
        pdfUrl={selectedPdfUrl}
        fileName={selectedFileName}
      />
    </div>
  );
};

export default MessageItem;
