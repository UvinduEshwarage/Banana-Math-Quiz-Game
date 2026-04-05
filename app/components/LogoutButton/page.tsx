"use client";

export default function LogoutButton() {
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-1 rounded-xl font-bold uppercase tracking-widest text-black bg-linear-to-r from-purple-700 via-pink-600 to-red-500 shadow-neon hover:shadow-[0_0_30px_rgba(255,0,255,0.7)] transition-all hover:scale-105"
    >
      Logout
    </button>
  );
}

// Global styles (if not already in your app)
<style jsx global>{`
  .shadow-neon {
    box-shadow: 0 0 20px rgba(0,255,255,0.5), 0 0 40px rgba(0,255,255,0.3);
  }
`}</style>