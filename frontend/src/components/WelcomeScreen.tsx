import { useEffect, useState } from "react";
import logo from "../assets/penn_place_logo.png";

function WelcomeScreen({ onSubmit }: any) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    //! handle weird mobile website formatting
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "instant",
    });
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (username.trim()) {
      onSubmit(username);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mx-7">
      <img src={logo} className="w-24 mb-5" alt="logo" />
      <h1 className="text-3xl lg:text-4xl font-semibold mb-1 text-black">
        Welcome to Penn Place!
      </h1>
      <h3 className="mb-5 text-gray-500 font-medium">
        Made by{" "}
        <a
          href="https://pennspark.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium cursor-pointer text-[#6998DE] hover:text-[#6998DE] transition-all"
        >
          Spark
        </a>
      </h3>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
          className="p-2 w-64 text-black font-medium shadow-lg rounded-md mb-5 focus:outline-none  bg-white"
        />
        <button
          type="submit"
          className="px-4 py-2 text-white font-semibold bg-[#6998DE] rounded-md hover:bg-[#7BB0FF] transition-colors hover:border-[#7BB0FF]"
        >
          Start
        </button>
      </form>
    </div>
  );
}

export default WelcomeScreen;
