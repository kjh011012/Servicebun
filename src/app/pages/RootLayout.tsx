import { Outlet, useLocation } from "react-router";
import { Header } from "../components/Header";

export function RootLayout() {
  const location = useLocation();
  const hideHeader = location.pathname === "/vr-preview";

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      {!hideHeader && <Header />}
      <Outlet />
    </div>
  );
}