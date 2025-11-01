import { useCallback, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, ImageIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadZoneProps {
  onImageUpload: (imageUrl: string) => void;
}
export default function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [usageData, setUsageData] = useState<{
    usageCount: number;
    usageLimit: number;
    plan: "Free" | "Paid";
    canUpload: boolean;
  } | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      handleFiles(files);
    },
    []
  );

  async function handleFiles(files: File[]) {}

  // check usage on component mount

  const CheckUsage = async () => {
    const response = await fetch("/api/usage");
    console.log("up-res", response);
    if (!response.ok) {
      throw new Error("Failed to fetch usage data");
    }
    const data = await response.json();
    console.log("ud", data);
    setUsageData(data.data);
    return data;
  };

  useEffect(() => {
    CheckUsage()?.catch(console.error);
  }, []);

  // update the usage
  // const UpdateUsage = async () => {
  //   const response = await fetch("/api/usage", {
  //     method: "POST",
  //   });
  //   if (!response.ok) {
  //     const errorData = await response.json();
  //     if (response.status === 403) {
  //       // usage limit reached
  //       setUsageData(errorData);
  //       setShowPaymentModal(true);
  //       throw new Error("Usage limit reached");
  //     }
  //     throw new Error("Failed to update usage");
  //   }
  //   const data = await response.json();
  //   setUsageData(data);
  //   return data;
  // };
  console.log("ud", usageData);

  function clearImage() {
    setUploadedImage(null);
    onImageUpload("");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {uploadedImage ? (
        <div className="relative glass rounded-xl p-4 border border-card-border">
          <button
            className="absolute top-2 right-2 z-10 p-1 bg-background/80 rounded-full hover:bg-destructive/20 transition-colors"
            type="button"
            onClick={clearImage}
          >
            <X className="w-4 h-4 text-foreground hover:text-destructive" />
          </button>
          <div className="aspect-square rounded-lg overflow-hidden">
            <img
              src={uploadedImage}
              alt="Uploaded preview"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-center">
            <p className="text-sm font-medium text-foreground">
              {uploadedImage.startsWith("data:")
                ? "Local preview"
                : "Uploaded to cloud"}
            </p>
            <p className="text-xs text-muted-foreground">
              Ready for AI magic ✨
            </p>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`shadow-glass rounded-xl border-dashed border-gray-800 transition-all duration-300 cursor-pointer border-2 p-8
            ${
              isDragOver
                ? "border-primary bg-primary/5 scale-105"
                : "border-card-border hover:border-primary/50 hover:bg-primary/5"
            }
            
            `}
        >
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <Label
            htmlFor="file-upload"
            className="cursor-pointer block text-center"
          >
            <motion.div
              animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
              className="mb-4"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br  from-primary/20 to-secondary/20 mb-4">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : isDragOver ? (
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary" />
                )}
              </div>
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {isUploading
                ? "Uploading..."
                : isDragOver
                ? "Drop your image here"
                : "Click or Drag & Drop to Upload"}
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {isUploading
                ? "Please wait while we upload your image."
                : "Drag & drop or click to browse"}
            </p>
            <Button
              variant="outline"
              className="glass border-card-border"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Browse Files
                </>
              )}
            </Button>
          </Label>
        </div>
      )}

      {/* usage info */}
      {usageData && (
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <span>
              Usage: {usageData.usageCount}/{usageData.usageLimit}
            </span>
            {usageData.plan === "Free" && (
              <Crown className="h-3 w-3 text-primary" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Supports JPG, PNG, WebP up to 10MB
          </p>
        </div>
      )}

      {/* payment modal */}
    </motion.div>
  );
}
