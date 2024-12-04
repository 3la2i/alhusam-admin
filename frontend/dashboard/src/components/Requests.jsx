import { useState, useEffect } from 'react'

function Requests() {
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/requests', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      
      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/requests/${requestId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ status: newStatus }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const updatedRequest = await response.json();
      setRequests(requests.map(req => 
        req._id === requestId ? updatedRequest : req
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  const handleReply = (email, subject) => {
    window.location.href = `mailto:${email}?subject=Re: ${subject}`
  }

  const filteredRequests = requests.filter(request => 
    request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'pending':
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'rejected':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-700',
          icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  }

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="bg-red-50 text-red-800 rounded-lg p-4 flex items-center space-x-2">
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span>{error}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-soft animate-fade-in">
      {/* Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-2.5xl font-bold text-gray-900">Requests</h2>
          <p className="mt-1 text-sm text-gray-500">Manage and respond to user requests</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search requests..."
            className="w-full sm:w-72 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.map((request) => {
          const statusStyle = getStatusColor(request.status);
          return (
            <div
              key={request._id}
              className="group p-5 rounded-xl border border-gray-100 bg-white hover:shadow-soft transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={statusStyle.icon} />
                      </svg>
                      <span className="text-sm font-medium">{request.status}</span>
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">{request.name}</p>
                    <p className="text-sm text-gray-600">{request.email}</p>
                    <time className="text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </time>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-gray-600 whitespace-pre-wrap">{request.message}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleReply(request.email, request.subject)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Reply
                </button>
                <button
                  onClick={() => updateStatus(request._id, 'completed')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    request.status === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Complete
                </button>
                <button
                  onClick={() => updateStatus(request._id, 'rejected')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    request.status === 'rejected'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Reject
                </button>
              </div>
            </div>
          );
        })}
        
        {filteredRequests.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No requests found</h3>
            <p className="mt-1 text-sm text-gray-500">No requests match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Requests 