import LoginLayer from "./LoginLayer";
import UploadSheet from "./UploadSheet";
import DestinationPicker from "./DestinationPicker";
import AIPhotoSettings from "./AIPhotoSettings";
import FullScreenView from "./FullScreenView";

// Every AI Photos surface, mounted once for the whole shell. The controls live
// in Account now, so these cannot hang off the home screen any more. All of
// them render nothing until their sheet is opened.
export default function AIPhotoSurfaces() {
  return (
    <>
      <LoginLayer />
      <UploadSheet />
      <DestinationPicker />
      <AIPhotoSettings />
      <FullScreenView />
    </>
  );
}
