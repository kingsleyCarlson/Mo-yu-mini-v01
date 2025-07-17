import { useState } from "react";

export default function Landing() {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("silentGift") || "";
    }
    return "";
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to SilentGift</h1>
          <p className="mb-2">這是一個屬於你的成長宇宙。</p>
          <p className="mb-4">每天留下一句話，為未來點一盞燈。</p>
        </div>

        <input
          type="text"
          placeholder="寫下一句 SilentGift"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full"
        />

        <button
          onClick={() => {
            setSubmitted(message);
            localStorage.setItem("silentGift", message);
            setMessage(""); // 清空輸入
          }}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          送出
        </button>

        {submitted && (
          <div className="mt-4 text-green-700">
            <p>✨ 你今天的 SilentGift：</p>
            <p className="font-semibold">{submitted}</p>
          </div>
        )}
      </div>
    </div>
  );
}