import { useState, useRef, useEffect } from "react";
import axios from "axios";
import loadingGif from "./anime_load_chat.gif";
import userAvatar from "./user.png";
import botAvatar from "./bot.png";
import streamLogo from "./stream_logo.jpeg"; // ✅ โลโก้

export default function Chatbox() {
  const [username, setUsername] = useState("");
  const [selectedOption, setSelectedOption] = useState("Llama");
  const [message, setMessage] = useState("");
  const [objChat, set_objChat] = useState([
    {
      user_id: "ai_response",
      name: "StreamGPT",
      msg: "สวัสดีครับ มีอะไรให้ StreamGPT ช่วยเหลือไหมครับ?",
      create_at: Math.floor(Date.now() / 1000),
      type: "chat",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const chatBoxRef = useRef(null);

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const apiEndpoints = {
    "Llama": `${import.meta.env.VITE_ANOTHER_API}/msgquery`,
  };

  const handleSendMessage = async () => {
    if (!username.trim()) {
      alert("กรุณากรอกชื่อของคุณก่อนส่งข้อความ");
      return;
    }

    if (message.trim()) {
      setIsLoading(true);
      setIsError(false);

      const newMessage = {
        user_id: "user",
        name: username,
        msg: message,
        create_at: Math.floor(Date.now() / 1000),
        type: "user",
      };

      set_objChat((prevChat) => [...prevChat, newMessage]);
      setMessage("");

      const apiEndpoint = apiEndpoints["Llama"];

      try {
        setTimeout(async () => {
          const response = await axios.post(
            apiEndpoint,
            { username: username, msg: message, model: "Llama" },
            { headers: { "Content-Type": "application/json" } }
          );

          if (response.data.response) {
            set_objChat((prevChat) => [
              ...prevChat,
              {
                user_id: "ai_response",
                name: "StreamGPT",
                msg: response.data.response,
                create_at: Math.floor(Date.now() / 1000),
                type: "chat",
              },
            ]);
          }
          setIsLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error sending message:", error);
        setIsError(true);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [objChat, isLoading]);

  function formatUnixTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  }

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto border border-gray-200 rounded-lg shadow-lg bg-white" style={{ marginTop: "5px", marginBottom: "5px" }}>
      
      {/* ✅ ส่วนหัวของ Chatbox */}
      <div className="p-4 border-b border-gray-300 bg-gray-100 flex items-center">
        {/* ✅ โลโก้ขยับชิดซ้ายสุด */}
        <div className="flex items-center justify-start w-1/3">
          <img src={streamLogo} alt="StreamGPT Logo" className="w-full max-w-40 h-auto rounded-lg" />
        </div>

        {/* ✅ ช่องกรอกชื่อผู้ใช้ ตรงกลาง */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            className="block w-2/3 bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded shadow focus:outline-none focus:shadow-outline text-center"
            placeholder="กรอกชื่อผู้ใช้งานด้วยครับ"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* ✅ เลือกโมเดล อยู่ทางขวา */}
        <div className="w-1/3 flex justify-end">
          <select
            className="block bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            value={selectedOption}
            onChange={handleSelect}
          >
            <option value="Llama">Llama</option>
          </select>
        </div>
      </div>

      {/* ✅ ส่วนเนื้อหา (ข้อความแชท) */}
      <div ref={chatBoxRef} className="flex-grow overflow-y-auto p-4">
        {objChat.map((chat, index) => (
          <div key={index} className={chat.type === "user" ? "chat chat-end mb-4" : "chat chat-start mb-4"}>
            <div className="chat-header font-semibold">{chat.name}</div>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img alt="Avatar" src={chat.type === "user" ? userAvatar : botAvatar} />
              </div>
            </div>
            <div className={`chat-bubble ${chat.type === "error" ? "bg-red-500 text-white" : ""}`}>
              {chat.msg}
            </div>
            <div className="chat-footer opacity-50">
              {chat.type !== "error" && `Seen at ${formatUnixTime(chat.create_at)}`}
            </div>
          </div>
        ))}

        {/* ✅ แสดง GIF Loading และ Avatar ของ AI ขณะกำลังโหลด (ไม่มีกรอบแชท) */}
        {isLoading && (
          <div className="chat chat-start mb-4 flex items-center">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={botAvatar} alt="AI Avatar" />
              </div>
            </div>
            <img src={loadingGif} alt="Loading..." className="w-16 h-10 ml-2" />
          </div>
        )}

        {/* ✅ แสดง Error Message ถ้า API ไม่ตอบสนอง */}
        {isError && (
          <div className="chat chat-start mb-4">
            <div className="chat-header font-semibold">StreamGPT</div>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={botAvatar} alt="AI Avatar" />
              </div>
            </div>
            <div className="chat-bubble bg-red-500 text-white">
              เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง
            </div>
          </div>
        )}
      </div>

      {/* ✅ ส่วนท้ายของ Chatbox */}
      <div className="p-4 border-t border-gray-300 bg-gray-100 flex items-center gap-2">
        <input
          type="text"
          className="input grow input-bordered"
          placeholder="Type your message..."
          value={message}
          onChange={handleMessageChange}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />

        {/* <button className="btn btn-outline" onClick={() => console.log("Attach file clicked")}>
          📎
        </button> */}

        <button className="btn btn-primary" onClick={handleSendMessage} disabled={!username.trim()}>
          Enter
        </button>
      </div>
    </div>
  );
}
