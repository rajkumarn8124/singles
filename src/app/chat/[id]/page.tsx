"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ChatPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const res = await fetch(`/api/messages?otherUserId=${params.id}`);
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    if (data.messages) {
      setMessages(data.messages);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [params.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const currentContent = content;
    setContent("");

    // Optimistic UI update could be done here

    const res = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ receiverId: params.id, content: currentContent }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      fetchMessages();
    }
  };

  if (loading) return <div className="text-center mt-20">Loading chat...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-[600px]">
      <div className="bg-gray-50 border-b p-4">
        <h2 className="font-bold text-lg">Chat</h2>
        <p className="text-xs text-gray-500">Your email is kept private.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId !== params.id;
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
              <span className="text-xs text-gray-500 mb-1">{msg.sender.name}</span>
              <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${isMe ? "bg-red-500 text-white rounded-br-none" : "bg-white text-gray-800 border rounded-bl-none"}`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
        <input 
          type="text" 
          className="flex-1 rounded-full border-gray-300 shadow-sm px-4 py-2 border focus:ring-red-500 focus:border-red-500" 
          placeholder="Type a message..." 
          value={content} 
          onChange={e => setContent(e.target.value)} 
        />
        <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 font-medium">
          Send
        </button>
      </form>
    </div>
  );
}
