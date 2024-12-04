import { useState, useEffect } from 'react'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/testimonials', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const toggleStatus = async (testimonialId) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/testimonials/${testimonialId}/toggle-status`,
        {
          method: 'PATCH',
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const updatedTestimonial = await response.json();
      setTestimonials(testimonials.map(t => 
        t._id === testimonialId ? updatedTestimonial : t
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial => 
    testimonial.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testimonial.text.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h2 className="text-2.5xl font-bold text-gray-900">Testimonials</h2>
          <p className="mt-1 text-sm text-gray-500">Manage customer testimonials and reviews</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search testimonials..."
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

      {/* Testimonials Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial) => (
          <div
            key={testimonial._id}
            className="relative group bg-white rounded-xl border border-gray-100 p-6 hover:shadow-soft transition-all duration-200"
          >
            {/* Rating Stars */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, index) => (
                <svg
                  key={index}
                  className={`w-5 h-5 ${
                    index < testimonial.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Testimonial Text */}
            <p className="text-gray-600 mb-4 line-clamp-4">{testimonial.text}</p>

            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">{testimonial.author}</h4>
                <p className="text-sm text-gray-500">{testimonial.email}</p>
              </div>
              <button
                onClick={() => toggleStatus(testimonial._id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  testimonial.isActive
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : 'bg-red-50 text-red-700 hover:bg-red-100'
                }`}
              >
                {testimonial.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>

            {/* Date */}
            <div className="absolute top-4 right-4 text-sm text-gray-400">
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No testimonials found</h3>
          <p className="mt-1 text-sm text-gray-500">No testimonials match your search criteria</p>
        </div>
      )}
    </div>
  )
}

export default Testimonials 