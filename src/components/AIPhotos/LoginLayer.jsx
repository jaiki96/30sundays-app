import { FrameLayer } from "./Sheet";
import LoginV2 from "../../pages/LoginV2";
import { useAIPhotos } from "../../state/useAIPhotos";

// The app's own login screen, shown over the frame. Nothing about it is
// reinvented for this feature: finishing here just lands on the upload sheet
// instead of home, so the couple's intent survives the login.
export default function LoginLayer() {
  const { sheet, setSheet, onLoginCompleted } = useAIPhotos();
  if (sheet !== "login") return null;

  return (
    <FrameLayer zIndex={230} background="#fff">
      <LoginV2
        onComplete={onLoginCompleted}
        onSkip={() => setSheet(null)}
        validateOtp={(otp) => (otp === "0000" ? "Invalid OTP. Please try again." : null)}
      />
    </FrameLayer>
  );
}
