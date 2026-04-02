import { ScreenContainer } from "@/components/screen-container";
import { WebViewContainer } from "@/components/webview-container";

export default function HomeScreen() {
  return (
    <ScreenContainer className="flex-1" edges={["top", "left", "right", "bottom"]}>
      <WebViewContainer uri="https://www.asasurealty.com" />
    </ScreenContainer>
  );
}
