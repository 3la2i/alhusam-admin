import { useState, useEffect } from 'react'

function Messages() {
  const [messages, setMessages] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/contact-messages', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (messageId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/contact-messages/${messageId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: 'read' }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update message status');
      }
      
      const updatedMessage = await response.json();
      setMessages(messages.map(msg => 
        msg._id === messageId ? updatedMessage : msg
      ));
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  }

  const handleReply = (email, subject) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const filteredMessages = messages.filter(message => 
    message.from?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-red-50 text-red-800 rounded-lg p-4">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-soft animate-fade-in">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2.5xl font-bold text-gray-900">Messages</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and respond to user inquiries</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            dir="rtl"
          />
          <svg
            className="absolute left-3 top-3 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid gap-4">
        {filteredMessages.map((message) => (
          <div
            key={message._id}
            className={`group p-5 rounded-xl border transition-all duration-200 hover:shadow-soft ${
              message.status === 'unread'
                ? 'bg-primary-50/50 border-primary-100'
                : 'bg-white border-gray-100 hover:border-primary-100'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-2.5 h-2.5 rounded-full transition-colors ${
                  message.status === 'unread' ? 'bg-primary-500' : 'bg-gray-300'
                }`} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate" dir="rtl">{message.from}</h3>
                  <p className="text-sm text-gray-500 truncate">{message.email}</p>
                </div>
              </div>
              <time className="text-sm text-gray-500" dir="rtl">{formatDate(message.date)}</time>
            </div>
            
            <div className="mt-4" dir="rtl">
              <h4 className="font-medium text-gray-900">{message.subject}</h4>
              <p className="mt-1 text-gray-600 line-clamp-2">{message.message}</p>
            </div>
            
            <div className="flex justify-end items-center gap-3 mt-4">
              {message.status === 'unread' && (
                <button
                  onClick={() => markAsRead(message._id)}
                  className="px-4 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Mark as Read
                </button>
              )}
              <button
                onClick={() => handleReply(message.email, message.subject)}
                className="px-4 py-1.5 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
              >
                Reply
              </button>
            </div>
          </div>
        ))}
        {filteredMessages.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages found</h3>
            <p className="mt-1 text-sm text-gray-500">No messages match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages