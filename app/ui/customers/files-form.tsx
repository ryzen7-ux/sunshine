"use client";

import {
  Form,
  Input,
  Button,
  Spinner,
  addToast,
  NumberInput,
} from "@heroui/react";
import {
  updateMember,
  MembersState,
  updateMemberDocs,
} from "@/app/lib/sun-actions";
import { useState, useEffect } from "react";
import { FileCheck, X, Upload, Trash } from "lucide-react";
import { set } from "zod";

export default function FilesForm({
  member,
  onClose,
  loanee,
}: {
  member: any;
  onClose: any;
  loanee: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [idFrontUrl, setIdFrontUrl] = useState(member.id_front);
  const [idBackUrl, setIdBackUrl] = useState(member.id_back);
  const [passportUrl, setPassportUrl] = useState(member.passport);
  const [applicationFormUrl, setApplicationFomUrl] = useState(member.doc);
  const [currentInput, setCurrentInput] = useState("");

  const handleDocumentUpload = async (
    documentType: "idCardFront" | "idCardBack" | "passport" | "applicationForm",
    file: File
  ) => {
    setIsUploading(true);
    setCurrentInput(documentType);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", file);
      formDataToSend.append("memberId", member.id);
      formDataToSend.append("documentType", documentType);
      formDataToSend.append("groupId", member.groupid);
      formDataToSend.append("loanee", loanee);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) throw new Error("Upload failed");

      const data = await response.json();
      formDataToSend.append("fileUrl", data.url);

      const results = await updateMemberDocs(formDataToSend);

      if (documentType === "idCardFront") {
        setIdFrontUrl(data.url);
      }
      if (documentType === "idCardBack") {
        setIdBackUrl(data.url);
      }
      if (documentType === "passport") {
        setPassportUrl(data.url);
      }
      if (documentType === "applicationForm") {
        setApplicationFomUrl(data.url);
      }
      addToast({
        title: "Document uploaded !",
        color: "success",
      });
    } catch (error) {
      console.error("Upload error:", error);
      addToast({
        title: "Error !",
        description: "Failed to upload document",
        color: "danger",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentDelete = async (
    documentType: "idCardFront" | "idCardBack" | "passport" | "applicationForm"
  ) => {
    setIsDeleting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("memberId", member.id);
    formDataToSend.append("documentType", documentType);
    formDataToSend.append("groupId", member.groupid);

    setCurrentInput(documentType);
    const url =
      documentType === "idCardBack"
        ? idBackUrl
        : documentType === "idCardFront"
        ? idFrontUrl
        : documentType === "passport"
        ? passportUrl
        : applicationFormUrl;
    if (!url) {
      setIsDeleting(false);
      return;
    }

    try {
      const memberId = member.id;
      const docType: any = documentType;
      const groupId = member.groupid;
      const loaneeType = loanee;

      const response = await fetch("/api/delete", {
        method: "DELETE",
        body: JSON.stringify({ url, memberId, docType, groupId, loaneeType }),
      });

      if (!response.ok) {
        setIsDeleting(false);
        throw new Error("Delete failed");
      }

      const results = await updateMemberDocs(formDataToSend);

      if (documentType === "idCardFront") {
        setIdFrontUrl("");
      }
      if (documentType === "idCardBack") {
        setIdBackUrl("");
      }
      if (documentType === "passport") {
        setPassportUrl("");
      }
      if (documentType === "applicationForm") {
        setApplicationFomUrl("");
      }

      addToast({
        title: "Document deleted!",
        color: "warning",
      });
      setIsDeleting(false);
    } catch (error) {
      setIsDeleting(false);
      console.error("Delete error:", error);
      addToast({
        title: "Error !",
        description: "Failed to delete document",
        color: "danger",
      });
    }
  };

  return (
    <>
      <Form>
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="hidden" name="id" value={member.id} readOnly />
            <Input
              className="hidden"
              name="groupId"
              type="text"
              defaultValue={member.groupid}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-4">
            <DocumentUploadField
              label="Passport Picture"
              documentUrl={passportUrl}
              onUpload={(file) => handleDocumentUpload("passport", file)}
              onDelete={() => handleDocumentDelete("passport")}
              isUploading={isUploading}
              isDeleting={isDeleting}
              fileType="image"
              type="passport"
              currentInput={currentInput}
              loanee={loanee}
            />
            <DocumentUploadField
              label="ID Card Front"
              documentUrl={idFrontUrl}
              onUpload={(file) => handleDocumentUpload("idCardFront", file)}
              onDelete={() => handleDocumentDelete("idCardFront")}
              isUploading={isUploading}
              isDeleting={isDeleting}
              fileType="image"
              type="idCardFront"
              currentInput={currentInput}
              loanee={loanee}
            />
            <DocumentUploadField
              label="ID Card Back"
              documentUrl={idBackUrl}
              onUpload={(file) => handleDocumentUpload("idCardBack", file)}
              onDelete={() => handleDocumentDelete("idCardBack")}
              isUploading={isUploading}
              isDeleting={isDeleting}
              fileType="image"
              type="idCardBack"
              currentInput={currentInput}
              loanee={loanee}
            />
            <DocumentUploadField
              label="Application Form (PDF)"
              documentUrl={applicationFormUrl}
              onUpload={(file) => handleDocumentUpload("applicationForm", file)}
              onDelete={() => handleDocumentDelete("applicationForm")}
              isUploading={isUploading}
              isDeleting={isDeleting}
              fileType="pdf"
              type="applicationForm"
              currentInput={currentInput}
              loanee={loanee}
            />
          </div>

          <div className="my-6 py-6">
            <Button
              onPress={onClose}
              type="button"
              color="success"
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

function DocumentUploadField({
  label,
  documentUrl,
  onUpload,
  onDelete,
  isUploading,
  isDeleting,
  fileType = "image",
  type,
  currentInput,
  loanee,
}: {
  label: string;
  documentUrl?: string;
  onUpload: (file: File) => Promise<void>;
  onDelete: () => Promise<void>;
  isUploading: boolean;
  isDeleting: boolean;
  fileType?: "image" | "pdf";
  type: string;
  currentInput: string;
  loanee: string;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (fileType === "pdf" && file.type === "application/pdf") {
        onUpload(file);
      } else if (fileType === "image" && file.type.startsWith("image/")) {
        onUpload(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (file) {
      if (fileType === "pdf" && file.type === "application/pdf") {
        onUpload(file);
      } else if (fileType === "image" && file.type.startsWith("image/")) {
        onUpload(file);
      }
    }
  };
  return (
    <div className="space-y-2">
      <label className="text-green-500 text-sm">{label}</label>
      {documentUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <FileCheck className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Document uploaded
              </p>
              <a
                href={documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-green-600 hover:underline"
              >
                View document
              </a>
            </div>
            {isDeleting && type === currentInput ? (
              <Spinner
                color="danger"
                variant="wave"
                labelColor="danger"
                label="deleting..."
                size="md"
              />
            ) : (
              <Button
                type="button"
                size="sm"
                onPress={() => onDelete()}
                disabled={isUploading || isDeleting}
                className="text-red-600 hover:text-red-700 bg-red-200"
                startContent={<Trash className="h-4 w-4 text-red-700" />}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-green-300 hover:border-green-400"
          }`}
        >
          <input
            type="file"
            accept={fileType === "pdf" ? ".pdf" : "image/*"}
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`file-input-${label}`}
          />
          <label htmlFor={`file-input-${label}`} className="cursor-pointer">
            <Upload className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-sm font-medium text-green-700">
              {isUploading && type === currentInput ? (
                <Spinner
                  color="success"
                  size="md"
                  label="Uploading...."
                  labelColor="success"
                />
              ) : (
                "Drag and drop or click to upload"
              )}
            </div>
            <p className="text-xs  text-green-500">
              {" "}
              {fileType === "pdf"
                ? "PDF up to 10MB"
                : "PNG, JPG, GIF up to 10MB"}
            </p>
          </label>
        </div>
      )}
    </div>
  );
}
