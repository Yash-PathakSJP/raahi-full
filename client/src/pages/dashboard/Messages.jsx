import { useEffect, useState, useRef, useCallback } from 'react';
import { Search, Send, Phone, Video, Paperclip, Smile } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export default function Messages() {
  const { user } = useAuth();
  const { socket, connected, onlineUserIds } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [typingUserId, setTypingUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data.conversations);
      if (data.conversations.length && !activeId) {
        setActiveId(data.conversations[0]._id);
      }
    } catch (err) {
      toast.error('Could not load conversations');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!activeId) return;

    const loadMessages = async () => {
      try {
        const { data } = await api.get(`/chat/conversations/${activeId}/messages`);
        setMessages(data.messages);
        api.put(`/chat/conversations/${activeId}/read`).catch(() => {});
      } catch (err) {
        toast.error('Could not load messages');
      }
    };
    loadMessages();

    if (socket) {
      socket.emit('conversation:join', activeId);
    }

    return () => {
      if (socket) socket.emit('conversation:leave', activeId);
    };
  }, [activeId, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (msg.conversation === activeId) {
        setMessages((prev) => [...prev, msg]);
      }
      loadConversations();
    };

    const handleTypingStart = ({ userId, conversationId }) => {
      if (conversationId === activeId) setTypingUserId(userId);
    };
    const handleTypingStop = ({ conversationId }) => {
      if (conversationId === activeId) setTypingUserId(null);
    };
    const handleConvUpdated = () => loadConversations();

    socket.on('message:new', handleNewMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);
    socket.on('conversation:updated', handleConvUpdated);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
      socket.off('conversation:updated', handleConvUpdated);
    };
  }, [socket, activeId, loadConversations]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !socket || !activeId) return;

    socket.emit('message:send', { conversationId: activeId, content: text.trim() }, (res) => {
      if (!res.success) toast.error(res.message);
    });
    setText('');
    socket.emit('typing:stop', { conversationId: activeId });
  };

  const handleTyping = (value) => {
    setText(value);
    if (!socket || !activeId) return;

    socket.emit('typing:start', { conversationId: activeId });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { conversationId: activeId });
    }, 1500);
  };

  const getOtherParticipant = (conv) => conv.participants.find((p) => p._id !== user.id && p._id !== user._id);

  const activeConv = conversations.find((c) => c._id === activeId);
  const otherUser = activeConv ? getOtherParticipant(activeConv) : null;

  const filteredConversations = conversations.filter((c) => {
    const other = getOtherParticipant(c);
    return other?.fullName?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="card flex h-[calc(100vh-160px)] overflow-hidden">
      {/* Conversation list */}
      <div className="flex w-full max-w-xs flex-col border-r border-gray-100">
        <div className="border-b border-gray-100 p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-thin">
          {loading ? (
            <div className="space-y-2 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100" />
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <p className="p-6 text-center text-sm text-gray-400">No conversations yet</p>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const isOnline = other && onlineUserIds.has(other._id);
              const isActive = conv._id === activeId;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveId(conv._id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 ${
                    isActive ? 'bg-brand-50' : ''
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                      {other?.fullName?.[0] || '?'}
                    </div>
                    {isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-semibold text-gray-900">{other?.fullName}</p>
                      {conv.lastMessageAt && (
                        <span className="shrink-0 text-[11px] text-gray-400">
                          {new Date(conv.lastMessageAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-gray-500">{conv.lastMessage?.content || 'Say hello 👋'}</p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Active conversation */}
      <div className="flex flex-1 flex-col">
        {activeConv ? (
          <>
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gradient text-sm font-bold text-white">
                  {otherUser?.fullName?.[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{otherUser?.fullName}</p>
                  <p className="text-xs text-gray-400">
                    {typingUserId === otherUser?._id
                      ? 'Typing…'
                      : onlineUserIds.has(otherUser?._id)
                      ? 'Online'
                      : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 text-gray-400">
                <button className="rounded-lg p-2 hover:bg-gray-100" aria-label="Voice call"><Phone className="h-4 w-4" /></button>
                <button className="rounded-lg p-2 hover:bg-gray-100" aria-label="Video call"><Video className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto scroll-thin p-4">
              {messages.map((m) => {
                const isMine = (m.sender?._id || m.sender) === (user.id || user._id);
                return (
                  <div key={m._id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                        isMine
                          ? 'rounded-br-sm bg-brand-gradient text-white'
                          : 'rounded-bl-sm bg-gray-100 text-gray-800'
                      }`}
                    >
                      {m.content}
                      <p className={`mt-1 text-[10px] ${isMine ? 'text-white/70' : 'text-gray-400'}`}>
                        {new Date(m.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-gray-100 p-3">
              <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Attach file">
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                value={text}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm outline-none focus:border-brand-500"
              />
              <button type="button" className="rounded-lg p-2 text-gray-400 hover:bg-gray-100" aria-label="Add emoji">
                <Smile className="h-4 w-4" />
              </button>
              <button
                type="submit"
                disabled={!connected || !text.trim()}
                className="rounded-xl bg-brand-gradient p-2.5 text-white disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
            {loading ? 'Loading…' : 'Select a conversation to start chatting'}
          </div>
        )}
      </div>
    </div>
  );
}
