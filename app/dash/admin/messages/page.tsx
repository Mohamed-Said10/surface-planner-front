'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Send, Search, ArrowLeft, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId: string;
  bookingId: string;
  createdAt: string;
  isRead: boolean;
}

interface Conversation {
  bookingId: string;
  booking: {
    id: string;
    package: {
      name: string;
    };
    appointmentDate: string;
  };
  client: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
  photographer: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
  lastMessage: Message | null;
  unreadCount: number;
}

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all conversations (admin can see all)
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages/conversations', {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/messages?bookingId=${bookingId}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchConversations();
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation.bookingId);
  };

  const filteredConversations = conversations.filter(conv => {
    // Filter by search query
    const clientName = `${conv.client.firstname} ${conv.client.lastname}`.toLowerCase();
    const photographerName = conv.photographer
      ? `${conv.photographer.firstname} ${conv.photographer.lastname}`.toLowerCase()
      : '';
    const packageName = conv.booking.package.name.toLowerCase();
    const query = searchQuery.toLowerCase();

    const matchesSearch =
      clientName.includes(query) ||
      photographerName.includes(query) ||
      packageName.includes(query) ||
      conv.bookingId.includes(query);

    // Filter by status
    const matchesFilter = filterStatus === 'all' || (filterStatus === 'unread' && conv.unreadCount > 0);

    return matchesSearch && matchesFilter;
  });

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-lg shadow">
      {/* Conversations List */}
      <div className="w-96 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#0F553E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filterStatus === 'unread'
                  ? 'bg-[#0F553E] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No conversations found</p>
            </div>
          ) : (
            <div>
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.bookingId}
                  onClick={() => handleConversationSelect(conversation)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-colors ${
                    selectedConversation?.bookingId === conversation.bookingId
                      ? 'bg-blue-50 border-l-4 border-l-blue-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                          #{conversation.bookingId.slice(0, 8)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="h-5 w-5 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-sm text-gray-900">
                        {conversation.client.firstname} {conversation.client.lastname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {conversation.photographer
                          ? `↔ ${conversation.photographer.firstname} ${conversation.photographer.lastname}`
                          : '↔ No photographer assigned'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {conversation.booking.package.name}
                      </p>
                    </div>
                  </div>
                  {conversation.lastMessage && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {conversation.lastMessage.text}
                      </p>
                      <span className="text-xs text-gray-400 ml-2">
                        {formatMessageTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className="md:hidden"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
                        Booking #{selectedConversation.bookingId.slice(0, 8)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">
                          {selectedConversation.client.firstname.charAt(0)}
                          {selectedConversation.client.lastname.charAt(0)}
                        </span>
                      </div>
                      <p className="font-medium text-sm text-gray-900">
                        {selectedConversation.client.firstname}{' '}
                        {selectedConversation.client.lastname}
                      </p>
                      <span className="text-gray-400">↔</span>
                      {selectedConversation.photographer ? (
                        <>
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-xs font-medium text-green-600">
                              {selectedConversation.photographer.firstname.charAt(0)}
                              {selectedConversation.photographer.lastname.charAt(0)}
                            </span>
                          </div>
                          <p className="font-medium text-sm text-gray-900">
                            {selectedConversation.photographer.firstname}{' '}
                            {selectedConversation.photographer.lastname}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500">No photographer</p>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {selectedConversation.booking.package.name} -{' '}
                      {new Date(selectedConversation.booking.appointmentDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>No messages in this conversation</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isClient = message.senderId === selectedConversation.client.id;
                  const isPhotographer = message.senderId === selectedConversation.photographer?.id;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isClient ? 'justify-start' : 'justify-end'}`}
                    >
                      <div className="flex flex-col max-w-[70%]">
                        <div
                          className={`rounded-lg p-3 ${
                            isClient
                              ? 'bg-white text-gray-900 border border-gray-200'
                              : 'bg-[#0F553E] text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium ${
                              isClient ? 'text-blue-600' : 'text-green-200'
                            }`}>
                              {isClient
                                ? `${selectedConversation.client.firstname}`
                                : selectedConversation.photographer
                                ? `${selectedConversation.photographer.firstname}`
                                : 'Unknown'}
                            </span>
                          </div>
                          <p className="text-sm">{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isClient ? 'text-gray-500' : 'text-gray-300'
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Info Message */}
            <div className="p-4 border-t border-gray-200 bg-yellow-50">
              <p className="text-sm text-gray-700 text-center">
                Admin view only - You can monitor conversations but cannot send messages
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Select a conversation</p>
              <p className="text-sm">Choose a conversation to view messages</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
