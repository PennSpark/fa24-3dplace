import { useState } from "react";

function WelcomeScreen({ onSubmit }: any) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">
        Welcome to Penn Place!
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
          className="p-2 w-64 text-base text-black border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
        >
          Start
        </button>
      </form>
    </div>
  );
}

export default WelcomeScreen;
