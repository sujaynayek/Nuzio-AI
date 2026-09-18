import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import Header from "./components/layout/Header";
import BottomNav from "./components/layout/BottomNav";
import MiniPlayer from "./components/Player/MiniPlayer";
import FullPlayer from "./components/Player/FullPlayer";
import Feed from "./pages/Feed";
import Discover from "./pages/Discover";
import Bookmarks from "./pages/Bookmarks";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";

const MainApp = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("feed");
  const [authView, setAuthView] = useState("login");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-glow-purple animate-pulse">
            🎙️
          </div>
          <span className="text-xs text-nuzio-muted font-medium">
            Loading Nuzio AI...
          </span>
        </div>
      </div>
    );
  }

  const needsOnboarding =
    isAuthenticated && user?.preferences?.onboardingComplete === false;

  if (!isAuthenticated) {
    if (authView === "login") {
      return (
        <Login
          onSwitchToRegister={() => setAuthView("register")}
          onLoginSuccess={() => {
            setAuthView("login");
            setActiveTab("feed");
          }}
        />
      );
    }

    if (authView === "register") {
      return (
        <Register
          onSwitchToLogin={() => setAuthView("login")}
          onRegisterSuccess={() => setAuthView("onboarding")}
        />
      );
    }

    if (authView === "onboarding") {
      return <Onboarding onComplete={() => setActiveTab("feed")} />;
    }

    return (
      <Login
        onSwitchToRegister={() => setAuthView("register")}
        onLoginSuccess={() => {
          setAuthView("login");
          setActiveTab("feed");
        }}
      />
    );
  }

  if (needsOnboarding) {
    return <Onboarding onComplete={() => setActiveTab("feed")} />;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10] text-nuzio-text flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      <Header onNavigate={(tab) => setActiveTab(tab)} />

      <main className="flex-1">
        {activeTab === "feed" && <Feed />}
        {activeTab === "discover" && <Discover />}
        {activeTab === "bookmarks" && <Bookmarks />}
        {activeTab === "profile" && (
          <Profile onOpenLogin={() => setAuthView("login")} />
        )}
      </main>

      <MiniPlayer />
      <FullPlayer />
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <MainApp />
      </PlayerProvider>
    </AuthProvider>
  );
}
