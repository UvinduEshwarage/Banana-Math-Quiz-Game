"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button className="text-sm bg-white hover:bg-gray-100 rounded shadow-md font-sans self-end px-4 py-1 text-black" onClick={handleLogout}>
      Logout
    </button>
  );
}