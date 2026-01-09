import type { SyntheticEvent } from "react";
import ReactPlayer from "react-player";

interface Props {
  width: string;
  height: string;
  url?: string;
  onVideoEnded?: (e: SyntheticEvent<HTMLVideoElement, Event>) => void;
}
const VideoPlayer = ({ width, height, url, onVideoEnded }: Props) => {
  return (
    <div
      className={`relative bg-gray-900 rounded-lg shadow-2xl transition-all duration-300 ease-in-out `}
      style={{ width, height }}
    >
      <ReactPlayer
        width={"100%"}
        height={"100%"}
        src={url}
        className="absolute top-0 left-0"
        controls
        onEnded={onVideoEnded}
      />
    </div>
  );
};
export default VideoPlayer;
