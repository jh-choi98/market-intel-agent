// import { useState } from "react";

// interface ChatFormProps {
//   context: string;
// }

// interface ChatMessage {
//   sender: "user" | "bot";
//   content: string;
// }

// export default function ChatForm({ context }: ChatFormProps) {
//   const [input, setInput] = useState("");
//   const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: ChatMessage = { sender: "user", content: input };
//     setChatLog((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8080/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_input: input,
//           prompt: `다음 문서를 바탕으로 질문에 답변해줘:\n\n${context}`,
//         }),
//       });

//       const data = await res.json();
//       const botMessage: ChatMessage = {
//         sender: "bot",
//         content: data.result || data.error || "⚠️ No response.",
//       };
//       setChatLog((prev) => [...prev, botMessage]);
//     } catch {
//       setChatLog((prev) => [
//         ...prev,
//         { sender: "bot", content: "⚠️ Error fetching response." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col max-w-2xl mx-auto p-4 bg-white">
//       <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">
//         {chatLog.map((msg, i) => (
//           <div
//             style={{ whiteSpace: "pre-wrap" }}
//             key={i}
//             className={`p-2 rounded ${
//               msg.sender === "user"
//                 ? "bg-blue-100 text-blue-800 text-right"
//                 : "bg-gray-200 text-left"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         {loading && (
//           <div className="text-sm text-gray-500 italic">Thinking...</div>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={input}
//           placeholder="Ask a question about your documents..."
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 border rounded px-3 py-2 text-sm"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

// import { useState, useEffect } from "react";

// interface ChatFormProps {
//   context: string;
// }

// interface ChatMessage {
//   sender: "user" | "bot";
//   content: string;
// }

// export default function ChatForm({ context }: ChatFormProps) {
//   const [input, setInput] = useState("");
//   const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (context.trim()) {
//       handleInitialAnalysis(context);
//     }
//   }, [context]);

//   const handleInitialAnalysis = async (documentText: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch("http://localhost:8080/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ document: documentText }),
//       });

//       const data = await res.json();

//       const initialMessage: ChatMessage = {
//         sender: "bot",
//         content: data.result || data.error || "⚠️ No response from server.",
//       };
//       setChatLog((prev) => [...prev, initialMessage]);

//       if (data.error && data.result) {
//         const warningMessage: ChatMessage = {
//           sender: "bot",
//           content: data.error,
//         };
//         setChatLog((prev) => [...prev, warningMessage]);
//       }
//     } catch {
//       setChatLog((prev) => [
//         ...prev,
//         { sender: "bot", content: "⚠️ Failed to analyze the document." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage: ChatMessage = { sender: "user", content: input };
//     setChatLog((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8080/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           user_input: input,
//           prompt: `Based on the following document, answer the user's question:\n\n${context}`,
//         }),
//       });

//       const data = await res.json();
//       const botMessage: ChatMessage = {
//         sender: "bot",
//         content: data.result || data.error || "⚠️ No response.",
//       };
//       setChatLog((prev) => [...prev, botMessage]);
//     } catch {
//       setChatLog((prev) => [
//         ...prev,
//         { sender: "bot", content: "⚠️ Error fetching response." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="h-full flex flex-col max-w-2xl mx-auto p-4 bg-white">
//       <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">
//         {chatLog.map((msg, i) => (
//           <div
//             style={{ whiteSpace: "pre-wrap" }}
//             key={i}
//             className={`p-2 rounded ${
//               msg.sender === "user"
//                 ? "bg-blue-100 text-blue-800 text-right"
//                 : "bg-gray-200 text-left"
//             }`}
//           >
//             {msg.content}
//           </div>
//         ))}
//         {loading && (
//           <div className="text-sm text-gray-500 italic">Thinking...</div>
//         )}
//       </div>

//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={input}
//           placeholder="Ask a question about your documents..."
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={handleKeyPress}
//           className="flex-1 border rounded px-3 py-2 text-sm"
//         />
//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useRef } from "react";

interface ChatFormProps {
  context: string;
}

interface ChatMessage {
  sender: "user" | "bot";
  content: string;
}

export default function ChatForm({ context }: ChatFormProps) {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔐 prevent multiple runs for the same context
  const lastAnalyzedContext = useRef<string | null>(null);

  useEffect(() => {
    // only run if context is new and not yet analyzed
    if (context.trim() && lastAnalyzedContext.current !== context) {
      handleInitialAnalysis(context);
      lastAnalyzedContext.current = context; // mark as analyzed
    }
  }, [context]);

  const handleInitialAnalysis = async (documentText: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document: documentText }),
      });

      const data = await res.json();

      const initialMessage: ChatMessage = {
        sender: "bot",
        content: data.result || data.error || "⚠️ No response from server.",
      };
      setChatLog((prev) => [...prev, initialMessage]);

      if (data.error && data.result) {
        const warningMessage: ChatMessage = {
          sender: "bot",
          content: data.error,
        };
        setChatLog((prev) => [...prev, warningMessage]);
      }
    } catch {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", content: "⚠️ Failed to analyze the document." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { sender: "user", content: input };
    setChatLog((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_input: input,
          prompt: `Based on the following document, answer the user's question:\n\n${context}`,
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        sender: "bot",
        content: data.result || data.error || "⚠️ No response.",
      };
      setChatLog((prev) => [...prev, botMessage]);
    } catch {
      setChatLog((prev) => [
        ...prev,
        { sender: "bot", content: "⚠️ Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col max-w-2xl mx-auto p-4 bg-white">
      <div className="flex-1 overflow-y-auto border p-3 rounded bg-gray-50 mb-4 space-y-3">
        {chatLog.map((msg, i) => (
          <div
            style={{ whiteSpace: "pre-wrap" }}
            key={i}
            className={`p-2 rounded ${
              msg.sender === "user"
                ? "bg-blue-100 text-blue-800 text-right"
                : "bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-gray-500 italic">Thinking...</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          placeholder="Ask a question about your documents..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
