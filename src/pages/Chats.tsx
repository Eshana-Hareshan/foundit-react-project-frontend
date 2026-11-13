import { useState, type FormEvent } from 'react';
import { Send } from 'lucide-react';

export default function Chats() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const chatContacts = [
    { id: 1, name: "David Miller", item: "Lost Macbook Pro 16''", status: "Online" },
    { id: 2, name: "Sarah Jenkins", item: "Found Brown Leather Wallet", status: "Offline" },
    { id: 3, name: "Elena Rostova", item: "Golden Retriever 'Charlie'", status: "Online" },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: "David Miller", text: "Hi! Did you find the Macbook near Central Park?", time: "10:30 AM" },
    { id: 2, sender: "Me", text: "Hello! Yes, I found a Macbook inside a blue leather sleeve.", time: "10:32 AM" },
  ]);

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: "Me", text: messageInput, time: "Just now" }]);
    setMessageInput('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
      {/* Contact List */}
      <div className="border-r border-slate-200 p-4 space-y-3 bg-slate-50">
        <h2 className="font-extrabold text-slate-900 text-lg">Active Conversations</h2>
        <div className="space-y-2">
          {chatContacts.map((contact) => (
            <div 
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                activeChat === contact.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white hover:bg-slate-100 border-slate-200'
              }`}
            >
              <p className="font-bold text-sm">{contact.name}</p>
              <p className={`text-xs ${activeChat === contact.id ? 'text-indigo-100' : 'text-slate-500'}`}>{contact.item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Message Area */}
      <div className="col-span-2 flex flex-col justify-between p-4">
        <div className="space-y-3 overflow-y-auto max-h-[380px] p-2">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'Me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-2xl text-xs max-w-xs ${msg.sender === 'Me' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-70 block text-right mt-1">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-slate-200">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 px-4 py-2 text-sm border border-slate-300 rounded-xl outline-none focus:border-indigo-600"
          />
          <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
