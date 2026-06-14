"use client";

import { useEffect, useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

export default function AuthWidget({ onAuthChange }) {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const res = await fetch("/api/me", { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setUser(data.user || null);
      } catch (e) {
        if (mounted) setUser(null);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    onAuthChange && onAuthChange();
  }

  function handleAuthChange() {
    // refresh user
    fetch("/api/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setUser(d.user || null);
        onAuthChange && onAuthChange();
      })
      .catch(() => {});
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink-soft">{user.email}</span>
        <button onClick={handleLogout} className="rounded-md bg-ink px-3 py-1 text-sm text-paper">
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {mode === "login" ? (
        <LoginForm onLogin={handleAuthChange} />
      ) : (
        <RegisterForm onRegister={handleAuthChange} />
      )}
      <button
        type="button"
        onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
        className="text-sm text-ink-soft/80"
      >
        {mode === "login" ? "Register" : "Log in"}
      </button>
    </div>
  );
}
