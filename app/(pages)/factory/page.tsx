"use client";
import React, { useEffect, useState } from "react";
import { NotificationType, NOTIFICATION_TYPES } from "@/app/components/features/notifications/types/notification"
import { NotificationService } from "@/app/components/features/notifications/services/NotificationService";
import "@/app/components/features/notifications/entities/notifiers"



// 1️⃣ Define the prop types
type FactoryExampleProps = {
  initialType?: NotificationType; 
  initialMessage?: string;
};

const FactoryExample: React.FC<FactoryExampleProps> = ({ initialType = "", initialMessage = "" }) => {
  const [type, setType] = useState<NotificationType>(initialType);
  const [message, setMessage] = useState<string>(initialMessage);
  const [output, setOutput] = useState("");

  const handleSend = () => {
    const output = NotificationService.send(type, message);
    setOutput(output);
    setMessage("");
  };

  useEffect(() => {
    if (output) alert(output);
  }, [output]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 font-sans p-4">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          🏭 Factory Method Demo — Notifications
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as NotificationType)
            }
            className="p-3 border border-gray-300 rounded-lg w-full md:w-40 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Type</option>
            {NOTIFICATION_TYPES?.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg text-base w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button
            onClick={handleSend}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200"
          >
            Send
          </button>
        </div>

        {output && (
          <div
            className={`mt-4 text-center text-lg font-medium ${output.includes("⚠️")
                ? "text-yellow-600"
                : output.toLowerCase().includes("sent")
                  ? "text-green-600"
                  : "text-gray-700"
              }`}
          >
            {output}
          </div>
        )}
      </div>
    </div>
  );
};

export default FactoryExample;
