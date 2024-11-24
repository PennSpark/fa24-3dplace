import { FaRegEnvelope } from "react-icons/fa";

export function FeedbackForm() {
  return (
    <a
      href="https://docs.google.com/forms/d/e/1FAIpQLSeZp5uauqYXjWGZrO80RA_u2CpgsK1jO8NOMbA8rp87sWq7iw/viewform?usp=sf_link"
      target="_blank"
      rel="noopener noreferrer"
      className="absolute bottom-5 right-5 ui-element select-none"
    >
      <div className="bg-white text-black px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 hover:underline transition duration-200">
        <FaRegEnvelope className="scale-125" />
        Feedback
      </div>
    </a>
  );
}
