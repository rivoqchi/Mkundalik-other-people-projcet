import { createContext, useContext, useState, useEffect } from "react";
import LoadingScreen from "./LoadingAnim";

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  // 🎬 Fade in / fade out MARKAZDAN boshqariladi
  useEffect(() => {
    if (loading) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}

      {/* 🔥 BARCHA SAHIFALAR UCHUN YAGONA LOADER */}
      {visible && <LoadingScreen loading={loading} />}
    </LoadingContext.Provider>
  );
};
