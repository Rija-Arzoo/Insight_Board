import { useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../hooks/AuthContext";
import { useToast } from "../hooks/ToastContext";
import { useTheme } from "../hooks/ThemeContext";

function Settings() {
  const { user, changePassword, toggleTwoFA, deleteAccount } = useAuth();
  const { toast } = useToast();
  const { preset, setPreset, theme } = useTheme();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [message, setMessage] = useState("");
  const [messageVariant, setMessageVariant] = useState("success");

  const handlePassword = (e) => {
    e.preventDefault();
    const res = changePassword(oldPass, newPass);
    if (res.success) {
      setMessage("Password updated successfully");
      setMessageVariant("success");
      toast({ variant: "success", title: "Password updated" });
      setOldPass("");
      setNewPass("");
    } else {
      setMessage(res.error);
      setMessageVariant("error");
      toast({ variant: "error", title: "Update failed", message: res.error });
    }
  };

  const handleToggle2FA = () => {
    toggleTwoFA();
    toast({
      variant: "success",
      title: "2FA updated",
      message: user?.twoFA ? "Disabled" : "Enabled",
    });
  };

  const handleDelete = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    ) {
      deleteAccount();
      toast({ variant: "success", title: "Account deleted" });
    }
  };

  return (
    <Layout>
      <h1 className="mb-4 text-xl font-bold tracking-tight text-[color:var(--text)] sm:text-2xl">Settings</h1>

      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold mb-2">Theme</h2>
          <p className="text-sm text-[color:var(--muted)]">
            Pick a preset inspired by modern dashboard UI.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center">
            <label className="text-sm font-semibold text-[color:var(--text)]">Preset</label>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--ring)] sm:w-72"
            >
              <option value="lavender">Pastel Lavender</option>
              <option value="sky">Sky Blue</option>
              <option value="mint">Mint Green</option>
            </select>
            <div className="text-xs text-[color:var(--muted)]">
              Mode: <span className="font-semibold">{theme}</span>
            </div>
          </div>
        </div>

        {/* Change password */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold mb-2">Change Password</h2>
          {message ? (
            <p
              className={
                messageVariant === "error"
                  ? "mb-2 text-sm font-bold text-[#7f1d1d] dark:text-[#fecaca]"
                  : "mb-2 text-sm font-bold text-[#065f46] dark:text-[#bbf7d0]"
              }
            >
              {message}
            </p>
          ) : null}
          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[color:var(--text)]">
                Old Password
              </label>
              <input
                type="password"
                className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[color:var(--text)]">
                New Password
              </label>
              <input
                type="password"
                className="mt-1 border border-[color:var(--border)] bg-[color:var(--panel-2)] text-[color:var(--text)] rounded-lg px-3 py-2 w-full outline-none focus:ring-2 focus:ring-[var(--ring)]"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
            <button className="bg-[color:var(--accent)] hover:brightness-95 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">
              Update Password
            </button>
          </form>
        </div>

        {/* Two-factor */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold mb-2">Two-Factor Authentication</h2>
          <p className="text-[color:var(--muted)]">
            Status: <span className="font-semibold">{user?.twoFA ? "Enabled" : "Disabled"}</span>
          </p>
          <button
            onClick={handleToggle2FA}
            className="mt-3 inline-flex items-center rounded-lg border border-[color:var(--border)] bg-[color:var(--panel-2)] hover:bg-black/5 dark:hover:bg-white/5 px-4 py-2 font-semibold transition text-[color:var(--text)]"
          >
            Toggle 2FA
          </button>
        </div>

        {/* Delete account */}
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--panel)] p-4 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold mb-2">Delete Account</h2>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            Delete My Account
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default Settings