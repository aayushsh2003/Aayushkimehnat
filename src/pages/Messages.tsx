import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  User, 
  Mail, 
  Search, 
  MessageSquare, 
  Clock, 
  ChevronLeft,
  Loader2,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { db, auth } from '../firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs,
  deleteDoc,
  where,
  limit
} from 'firebase/firestore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
}

interface Conversation {
  id: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastUpdatedAt: any;
  unreadCountAdmin: number;
  unreadCountUser: number;
}

export const Messages = () => {
  const { user, profile } = useAppStore();
  const isAdmin = profile?.role === 'admin';
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSending, setIsSending] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch conversations (Admin only)
  React.useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'conversations'), orderBy('lastUpdatedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Conversation[];
      setConversations(convs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Fetch messages for selected conversation
  React.useEffect(() => {
    let convId = '';
    if (isAdmin) {
      if (!selectedConversation) return;
      convId = selectedConversation.id;
    } else {
      if (!user) return;
      convId = user.uid;
    }

    const q = query(
      collection(db, 'conversations', convId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setIsLoading(false);
      
      // Mark as read
      if (isAdmin) {
        updateDoc(doc(db, 'conversations', convId), { unreadCountAdmin: 0 });
      } else {
        updateDoc(doc(db, 'conversations', convId), { unreadCountUser: 0 });
      }
    });

    return () => unsubscribe();
  }, [isAdmin, selectedConversation, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    const convId = isAdmin ? selectedConversation?.id : user?.uid;
    if (!convId) return;

    setIsSending(true);
    try {
      const messageData = {
        text: newMessage,
        senderId: user?.uid,
        createdAt: serverTimestamp()
      };

      // Add message to subcollection
      await addDoc(collection(db, 'conversations', convId, 'messages'), messageData);

      // Update conversation metadata
      const convRef = doc(db, 'conversations', convId);
      await setDoc(convRef, {
        lastMessage: newMessage,
        lastUpdatedAt: serverTimestamp(),
        userName: profile?.displayName || user?.email?.split('@')[0] || 'User',
        userEmail: user?.email || '',
        unreadCountAdmin: isAdmin ? 0 : (conversations.find(c => c.id === convId)?.unreadCountAdmin || 0) + 1,
        unreadCountUser: isAdmin ? (selectedConversation?.unreadCountUser || 0) + 1 : 0
      }, { merge: true });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const filteredConversations = conversations.filter(c => 
    c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Mail size={48} className="mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold text-gray-900">Please login to view messages</h2>
          <p className="text-gray-500">You need to be authenticated to chat with our team.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-160px)] flex bg-white rounded-[2.5rem] border border-black/5 shadow-xl overflow-hidden">
      {/* Sidebar - Conversations List (Admin Only) */}
      {isAdmin && (
        <div className={cn(
          "w-full md:w-80 border-r border-black/5 flex flex-col bg-gray-50/50",
          selectedConversation ? "hidden md:flex" : "flex"
        )}>
          <div className="p-6 border-b border-black/5 bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Conversations</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-emerald-600" size={24} />
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={cn(
                    "w-full p-4 flex items-center gap-4 hover:bg-white transition-all border-b border-black/5 text-left",
                    selectedConversation?.id === conv.id ? "bg-white shadow-sm" : ""
                  )}
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shrink-0">
                    {conv.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-bold text-gray-900 truncate">
                        {conv.userName || conv.userEmail?.split('@')[0] || 'User'}
                      </p>
                      {conv.unreadCountAdmin > 0 && (
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                          {conv.unreadCountAdmin}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">
                <p>No conversations found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white",
        isAdmin && !selectedConversation ? "hidden md:flex items-center justify-center text-gray-400" : "flex"
      )}>
        {isAdmin && !selectedConversation ? (
          <div className="text-center space-y-4">
            <MessageSquare size={64} className="mx-auto opacity-10" />
            <p className="text-lg">Select a conversation to start chatting</p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 border-b border-black/5 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
                  {isAdmin ? (selectedConversation?.userName || selectedConversation?.userEmail?.split('@')[0] || 'U').charAt(0).toUpperCase() : 'A'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {isAdmin ? (selectedConversation?.userName || selectedConversation?.userEmail?.split('@')[0] || 'User') : 'Admin Support'}
                  </h4>
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/30">
              {messages.map((msg, idx) => {
                const isMe = msg.senderId === user?.uid;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={cn(
                      "flex flex-col max-w-[80%] space-y-1",
                      isMe ? "ml-auto items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "p-4 rounded-2xl text-sm shadow-sm",
                      isMe 
                        ? "bg-emerald-600 text-white rounded-tr-none" 
                        : "bg-white text-gray-900 border border-black/5 rounded-tl-none"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                    </span>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 md:p-6 border-t border-black/5 bg-white">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="bg-emerald-600 text-white p-4 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSending ? (
                    <Loader2 className="animate-spin" size={24} />
                  ) : (
                    <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
