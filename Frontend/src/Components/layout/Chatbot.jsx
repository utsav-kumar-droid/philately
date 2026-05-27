import React, { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Namaste! 🙏 I'm StampBot, your 24/7 philately assistant. How can I help?",
    },
    {
      type: "bot",
      text: "Ask me about stamps, orders, auctions, payments — anything!",
    },
  ]);
  const [input, setInput] = useState("");

  const msgEndRef = useRef(null);

  // auto scroll
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // load Tidio chat widget
  useEffect(() => {
    if (document.querySelector('script[data-tidio]')) return;

    const script = document.createElement('script');
    script.src = '//code.tidio.co/rlwlxtxzugkkpdvxx9tmvrxcrx2wx81r.js';
    script.async = true;
    script.dataset.tidio = 'loaded';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const toggleChat = () => {
    console.log("Chat toggled"); // 👈 ADD THIS
    setOpen((prev) => !prev);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { type: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    // Fake AI reply (you can connect backend here)
    setTimeout(() => {
      const botReply = getBotReply(text);
      setMessages((prev) => [...prev, { type: "bot", text: botReply }]);
    }, 600);
  };

  const sendChat = () => {
    sendMessage(input);
    setInput("");
  };

  const sendQuick = (q) => {
    sendMessage(q);
  };

  // Simple bot logic (replace with API later)
  const getBotReply = (msg) => {
    msg = msg.toLowerCase();

    if (msg.includes("track"))
      return "You can track your order in the Track Order section 📦";
    if (msg.includes("rare"))
      return "We have rare stamps in auctions and featured collections 🏷️";
    if (msg.includes("bid"))
      return "To bid, go to Live Auctions and place your bid before time ends 🔨";
    if (msg.includes("support"))
      return "You can contact support via Contact page 📞";

    return "I'm here to help! Try asking about orders, stamps, or auctions 😊";
  };

  return (
    <>
      {/* Floating Button */}
      {/* <button className="chat-fab" onClick={toggleChat}>
        <span className="cb-bounce">🤖</span>
      </button> */}

      {/* Chat Panel */}
      <div className={`chat-panel ${open ? "open" : ""}`}>
        {/* Header */}
        <div className="chat-hd">
          <div className="chat-av">🤖</div>

          <div className="chat-hd-txt">
            <h4>StampBot Assistant</h4>
            <p>Powered by AI · Philately Expert</p>
          </div>

          <div className="chat-online">
            <div className="c-dot"></div>Online
          </div>

          <button className="chat-close" onClick={toggleChat}>
            ×
          </button>
        </div>

        {/* Messages */}
        <div className="chat-msgs">
          {messages.map((m, i) => (
            <div key={i} className={`c-msg ${m.type}`}>
              {m.text}
            </div>
          ))}
          <div ref={msgEndRef}></div>
        </div>

        {/* Quick Buttons */}
        <div className="chat-quick-row">
          <button onClick={() => sendQuick("Track my order")} className="cq-btn">
            📦 Track Order
          </button>
          <button onClick={() => sendQuick("Show rare stamps")} className="cq-btn">
            🏷️ Rare Stamps
          </button>
          <button onClick={() => sendQuick("How to bid?")} className="cq-btn">
            🔨 Bidding
          </button>
          <button onClick={() => sendQuick("Contact support")} className="cq-btn">
            📞 Support
          </button>
        </div>

        {/* Input */}
        <div className="chat-inp-row">
          <input
            className="chat-inp"
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
          />
          <button className="chat-send" onClick={sendChat}>
            ➤
          </button>
        </div>
      </div>
    </>
  );
}