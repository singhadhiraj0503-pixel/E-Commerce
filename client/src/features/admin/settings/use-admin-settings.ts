import { useEffect, useMemo, useState } from "react";
import type { AdminBanner } from "./types";
import { getAdminBanners, uploadAdminBanners } from "./api";

export const useAdminSettings = () => {
  const [items, setItems] = useState<AdminBanner[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const refreshBanners = async () => {
    try {
      setLoading(true);

      const response = await getAdminBanners();
      setItems(response?.items ?? []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refreshBanners();
  }, []);

  const handleUpload = async () => {
    try {
      if (!files.length) return;
      setUploading(true);

      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const response = await uploadAdminBanners(formData);
      setItems(response?.items ?? []);
      setFiles([]);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const fileCountLabel = useMemo(() => {
    if (!files.length) return "No files selected";
    if (files.length === 1) return files[0].name;

    return `${files.length} files selected`;
  }, [files]);

  return {
    items,
    files,
    setFiles,
    fileCountLabel,
    loading,
    setLoading,
    refreshBanners,
    handleUpload,
    uploading,
  };
};
