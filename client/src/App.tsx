import { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatForm from "./components/ChatForm";

export default function App() {
  const [contextText, setContextText] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="p-4 border-b">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Market Intel Agent
        </h1>
      </header>

      <main className="flex-1 overflow-hidden">
        {!isUploaded ? (
          <FileUpload
            onComplete={(combinedText) => {
              setContextText(combinedText);
              setIsUploaded(true);
            }}
          />
        ) : (
          <ChatForm context={contextText} />
        )}
      </main>
    </div>
  );
}
