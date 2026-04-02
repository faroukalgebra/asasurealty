import { Platform, View, ActivityIndicator, Pressable, Text } from "react-native";
import { useRef, useState } from "react";
import { useColors } from "@/hooks/use-colors";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Native WebView (iOS/Android only)
let WebView: any = null;
if (Platform.OS !== "web") {
  WebView = require("react-native-webview").WebView;
}

interface WebViewContainerProps {
  uri: string;
}

export function WebViewContainer({ uri }: WebViewContainerProps) {
  const colors = useColors();
  const webViewRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const handleNavigationStateChange = (navState: any) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
  };

  // Web platform: use iframe
  if (Platform.OS === "web") {
    return (
      <View className="flex-1">
        {/* Navigation Bar */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <Pressable
            onPress={() => (window as any).history.back()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary font-semibold">Back</Text>
          </Pressable>

          <Pressable
            onPress={() => window.location.reload()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary font-semibold">Refresh</Text>
          </Pressable>

          <Pressable
            onPress={() => (window as any).history.forward()}
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          >
            <Text className="text-primary font-semibold">Forward</Text>
          </Pressable>
        </View>

        {/* Web iframe */}
        <iframe
          src={uri}
          style={{
            flex: 1,
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </View>
    );
  }

  // Native platform: use react-native-webview
  return (
    <View className="flex-1">
      {/* Navigation Bar */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <Pressable
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}
          style={({ pressed }) => [{ opacity: pressed && canGoBack ? 0.6 : canGoBack ? 1 : 0.4 }]}
        >
          <IconSymbol name="chevron.left.forwardslash.chevron.right" size={24} color={colors.primary} />
        </Pressable>

        <Pressable
          onPress={() => webViewRef.current?.reload()}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
        >
          <Text className="text-primary font-semibold">Refresh</Text>
        </Pressable>

        <Pressable
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}
          style={({ pressed }) => [{ opacity: pressed && canGoForward ? 0.6 : canGoForward ? 1 : 0.4 }]}
        >
          <IconSymbol name="chevron.right" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* WebView */}
      <View className="flex-1">
        <WebView
          ref={webViewRef}
          source={{ uri }}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          renderLoading={() => (
            <View className="flex-1 items-center justify-center bg-background">
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}
          scalesPageToFit={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    </View>
  );
}
