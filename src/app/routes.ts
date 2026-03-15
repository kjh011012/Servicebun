import { createBrowserRouter } from "react-router";
import { RootLayout } from "./pages/RootLayout";
import { HomePage } from "./pages/HomePage";
import { AIChatPage } from "./pages/AIChatPage";
import { VRPreviewPage } from "./pages/VRPreviewPage";
import { ARExperiencePage } from "./pages/ARExperiencePage";
import { PassportPage } from "./pages/PassportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "ai-chat", Component: AIChatPage },
      { path: "vr-preview", Component: VRPreviewPage },
      { path: "ar-experience", Component: ARExperiencePage },
      { path: "passport", Component: PassportPage },
    ],
  },
]);
