"use client";
import React, { useState } from "react";
import {
  Flag,
  AlertTriangle,
  MessageSquare,
  User,
  FileText,
} from "lucide-react";
import { useCreateReportMutation } from "@/redux/features/reports/reportsApi";
import CustomModal from "./custom-modal";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { IoMdClose } from "react-icons/io";
import { Checkbox } from "antd";

// Types matching your backend schema
export enum ReportType {
  USER = "user",
  MESSAGE = "message",
  POST = "post",
  COMMENT = "comment",
}

export interface ReportData {
  reportedUser: string;
  reportType: ReportType;
  reportReason: string[];
  reportMessage?: string;
  reportedMessageId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
}

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: ReportType;
  reportedUserId: string;
  reportedUserName?: string;
  reportedEntityId?: string;
  reportedPostId?: string;
}

// Predefined report reasons for different types
const REPORT_REASONS = {
  [ReportType.USER]: [
    "Harassment or bullying",
    "Hate speech or discrimination",
    "Spam or fake account",
    "Inappropriate behavior",
    "Impersonation",
    "Privacy violation",
    "Other",
  ],
  [ReportType.MESSAGE]: [
    "Harassment or threatening",
    "Spam or unwanted messages",
    "Hate speech",
    "Inappropriate content",
    "Scam or fraud",
    "Other",
  ],
  [ReportType.POST]: [
    "Spam or misleading content",
    "Hate speech or discrimination",
    "Violence or dangerous content",
    "Nudity or sexual content",
    "Intellectual property violation",
    "False information",
    "Other",
  ],
  [ReportType.COMMENT]: [
    "Harassment or bullying",
    "Hate speech",
    "Spam or irrelevant",
    "Inappropriate content",
    "Offensive language",
    "Other",
  ],
};

const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportType,
  reportedUserId,
  reportedUserName,
  reportedEntityId,
  reportedPostId,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customMessage, setCustomMessage] = useState("");
  const [step, setStep] = useState<"select" | "details" | "success">("select");

  // Use your API hook
  const [createReport, { isLoading }] = useCreateReportMutation();

  const reasons = REPORT_REASONS[reportType];

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (selectedReasons?.length === 0) return;

    const reportData: ReportData = {
      reportedUser: reportedUserId,
      reportType,
      reportReason: selectedReasons,
      reportMessage: customMessage?.trim() || undefined,
    };

    // Add specific fields based on report type
    if (reportType === ReportType.MESSAGE && reportedEntityId) {
      reportData.reportedMessageId = reportedEntityId;
    } else if (reportType === ReportType.POST && reportedEntityId) {
      reportData.reportedPostId = reportedPostId;
    } else if (
      reportType === ReportType.COMMENT &&
      reportedEntityId &&
      reportedPostId
    ) {
      reportData.reportedPostId = reportedPostId;
      reportData.reportedCommentId = reportedEntityId;
    }

    try {
      await createReport(reportData).unwrap();
      setStep("success");
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setCustomMessage("");
    setStep("select");
    onClose();
  };

  const getReportIcon = () => {
    switch (reportType) {
      case ReportType.USER:
        return <User className="w-5 h-5" />;
      case ReportType.MESSAGE:
        return <MessageSquare className="w-5 h-5" />;
      case ReportType.POST:
        return <FileText className="w-5 h-5" />;
      case ReportType.COMMENT:
        return <MessageSquare className="w-5 h-5" />;
      default:
        return <Flag className="w-5 h-5" />;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case ReportType.USER:
        return `Report ${reportedUserName || "User"}`;
      case ReportType.MESSAGE:
        return "Report Message";
      case ReportType.POST:
        return "Report Post";
      case ReportType.COMMENT:
        return "Report Comment";
      default:
        return "Report Content";
    }
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        {getReportIcon()}
        <h2 className="text-xl font-semibold text-gray-900">
          {getReportTitle()}
        </h2>
      </div>
      <button
        onClick={handleClose}
        className="p-2 text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
        disabled={isLoading}
      >
        <IoMdClose size={18} />
      </button>
    </div>
  );

  const renderSelectStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600">
          Help us understand what&apos;s happening. Select all that apply:
        </p>
      </div>

      <div className="space-y-2">
        {reasons.map((reason) => (
          <label
            key={reason}
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <Checkbox
              type="checkbox"
              className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              checked={selectedReasons.includes(reason)}
              onChange={() => handleReasonToggle(reason)}
            />
            <span className="ml-3 text-gray-700">{reason}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={handleClose}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          onClick={() => setStep("details")}
          disabled={selectedReasons.length === 0}
          className="flex-1 px-4 py-2 bg-secondary cursor-pointer text-white rounded-lg  disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Flag className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-gray-600">
          Add any additional details that might help us review this report
          (optional):
        </p>
      </div>

      <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Selected reasons:
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          {selectedReasons.map((reason) => (
            <li key={reason} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              {reason}
            </li>
          ))}
        </ul>
      </div>

      <textarea
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        placeholder="Provide additional context or details..."
        className="w-full h-24 p-3 border border-gray-300 rounded-lg outline-none resize-none focus:ring focus:ring-secondary focus:border-transparent"
        maxLength={500}
      />
      <p className="text-xs text-gray-500 text-right">
        {customMessage.length}/500 characters
      </p>

      <div className="flex gap-3 pt-4">
        <button
          onClick={() => setStep("select")}
          className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          disabled={isLoading}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Submitting..." : "Submit Report"}
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Report Submitted
      </h3>
      <p className="text-gray-600">
        Thank you for helping keep our community safe. We&apos;ll review your
        report and take appropriate action.
      </p>
    </div>
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      header={renderHeader()}
      maxWidth="max-w-xl"
      closeOnBackdropClick={false}
      className="mx-4 p-2"
    >
      {step === "select" && renderSelectStep()}
      {step === "details" && renderDetailsStep()}
      {step === "success" && renderSuccessStep()}
    </CustomModal>
  );
};

export default ReportModal;
