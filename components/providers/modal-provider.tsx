"use client";
import { useState, useEffect } from "react";
import SettingsModal from "../modals/settings-modal";
import CoverImageModal from "../modals/cover-image-modal";
const ModalProvider = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  );
};

export default ModalProvider;
