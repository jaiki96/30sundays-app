import { useEffect, useState } from "react";

const KEY = "30s_saved_videos";

// Cross-tab/cross-component event so multiple instances stay in sync.
const EVT = "30s_saved_videos_change";

function read() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(ids) {
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new CustomEvent(EVT));
}

export function useSavedVideos() {
  const [ids, setIds] = useState(read);

  useEffect(() => {
    const sync = () => setIds(read());
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = (id) => ids.includes(id);
  const toggle = (id) => write(ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);

  return { ids, isSaved, toggle };
}
