import { useState, useEffect } from "react";
import { AuthContext } from "../hooks/AuthContext";
import { isValidEmail, isValidPassword } from "../utils/validation";

export function AuthProvider({ children }) {
  // load user from storage
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  // keep user in localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // helper for persisting user list (managers + members)
  const saveUserToList = (userObj) => {
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    const exists = list.find((u) => u.email === userObj.email);
    if (!exists) {
      list.push(userObj);
      localStorage.setItem("users", JSON.stringify(list));
    }
  };

  // populate default accounts if none exist
  useEffect(() => {
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    if (list.length === 0) {
      const defaults = [
        { email: "manager@test.com", role: "manager", password: "password123", twoFA: false },
        { email: "member@test.com", role: "member", password: "password123", twoFA: false },
      ];
      localStorage.setItem("users", JSON.stringify(defaults));
    }
  }, []);

  const login = (email, password, role) => {
    const errors = {};
    if (!email) errors.email = "Email is required";
    else if (!isValidEmail(email)) errors.email = "Invalid email format";

    if (!password) errors.password = "Password is required";
    else if (!isValidPassword(password))
      errors.password = "Password must be at least 8 characters";

    if (!role) errors.role = "Role is required";

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const userData = {
      email,
      role,
      password,
      twoFA: false,
    };

    setUser(userData);
    saveUserToList(userData);

    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const changePassword = (oldPass, newPass) => {
    if (!user) return { success: false, error: "Not logged in" };
    if (oldPass !== user.password)
      return { success: false, error: "Old password is incorrect" };
    if (!isValidPassword(newPass))
      return { success: false, error: "New password must be 8+ characters" };

    const updated = { ...user, password: newPass };
    setUser(updated);

    // update in users list
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedList = list.map((u) =>
      u.email === user.email ? { ...u, password: newPass } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedList));

    return { success: true };
  };

  const toggleTwoFA = () => {
    if (!user) return;
    const updated = { ...user, twoFA: !user.twoFA };
    setUser(updated);
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedList = list.map((u) =>
      u.email === user.email ? { ...u, twoFA: updated.twoFA } : u
    );
    localStorage.setItem("users", JSON.stringify(updatedList));
  };

  const deleteAccount = () => {
    if (!user) return;
    const list = JSON.parse(localStorage.getItem("users") || "[]");
    const filtered = list.filter((u) => u.email !== user.email);
    localStorage.setItem("users", JSON.stringify(filtered));
    logout();
  };

  const value = {
    user,
    login,
    logout,
    changePassword,
    toggleTwoFA,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}