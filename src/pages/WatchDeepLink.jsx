import { useNavigate, useParams } from "react-router-dom";
import { findVideo, videosForDest, videosForHome } from "../data/watchData";
import WatchPlayer from "../components/WatchPlayer";

// Resolves /watch/:videoId — supports shareable links into the player.
export default function WatchDeepLink() {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const video = findVideo(videoId);

  if (!video) {
    navigate("/", { replace: true });
    return null;
  }

  // Cross-destination videos play from the Home deck; per-dest videos
  // play from the destination's deck.
  const fromHome = !!video.crossDest;
  const videos = fromHome ? videosForHome() : videosForDest(video.dest);
  const fallback = fromHome ? "/" : `/destination/${video.dest}`;

  return (
    <WatchPlayer
      videos={videos}
      startId={videoId}
      activeCategory="all"
      showCategorySwitcher={false}
      onClose={() => navigate(fallback, { replace: true })}
    />
  );
}
