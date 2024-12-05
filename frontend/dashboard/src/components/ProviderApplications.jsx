import { useState, useEffect } from 'react'

function ProviderApplications() {
  const [applications, setApplications] = useState([])
  const [providerProducts, setProviderProducts] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    if (applications.length > 0) {
      fetchProviderProducts()
    }
  }, [applications])

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/provider-applications', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const fetchProviderProducts = async () => {
    try {
      const providerIds = applications
        .filter(app => app.status === 'مقبول')
        .map(app => app.userId._id)

      if (providerIds.length === 0) return

      console.log('Sending provider IDs:', providerIds);

      const response = await fetch('http://localhost:4000/api/admin/provider-applications/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ providerIds })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch provider products');
      }

      const data = await response.json();
      console.log('Received products:', data);

      const productsByProvider = data.reduce((acc, product) => {
        const sellerId = product.seller._id.toString();
        acc[sellerId] = acc[sellerId] || [];
        acc[sellerId].push(product);
        return acc;
      }, {});

      setProviderProducts(productsByProvider);
    } catch (err) {
      console.error('Error fetching provider products:', err);
      setError(err.message);
    }
  }

  const updateStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/admin/provider-applications/${applicationId}/status`,
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
      
      const updatedApplication = await response.json();
      setApplications(applications.map(app => 
        app._id === applicationId ? updatedApplication : app
      ));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  }

  const filteredApplications = applications.filter(app => 
    app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'مقبول':
        return {
          bg: 'bg-green-50',
          text: 'text-green-700',
          icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      case 'مرفوض':
        return {
          bg: 'bg-red-50',
          text: 'text-red-700',
          icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
        };
      default:
        return {
          bg: 'bg-yellow-50',
          text: 'text-yellow-700',
          icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
        };
    }
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setSelectedProduct(null)
    setIsModalOpen(false)
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
          <h2 className="text-2.5xl font-bold text-gray-900">Provider Applications</h2>
          <p className="mt-1 text-sm text-gray-500">Review and manage provider applications</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search applications..."
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

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications.map((application) => {
          const statusStyle = getStatusColor(application.status);
          return (
            <div key={application._id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg" dir="rtl">{application.fullName}</h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-600">{application.email}</p>
                        <p className="text-sm text-gray-600">
                          Role: <span className="font-medium">{application.userId?.role || 'user'}</span>
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                      <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={statusStyle.icon} />
                      </svg>
                      <span className="text-sm font-medium">{application.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {application.phoneNumber}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {application.address}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-gray-900">Product Details</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.productType.map((type, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 text-xs font-medium bg-primary-50 text-primary-700 rounded-lg"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Skills Description</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg" dir="rtl">
                      {application.skillsDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              {application.status === 'مقبول' && providerProducts[application.userId._id] && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Provider Products</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {providerProducts[application.userId._id].map((product) => (
                      <div 
                        key={product._id} 
                        className="bg-gray-50 rounded-lg p-4 cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 mb-4">
                          <img
                            src={product.mainImage}
                            alt={product.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <h5 className="font-medium text-gray-900">{product.title}</h5>
                        <p className="text-sm text-gray-600 mt-1">{product.titleAr}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-medium text-gray-900">${product.price}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Management Buttons */}
              <div className="flex flex-wrap justify-end items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => updateStatus(application._id, 'مقبول')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    application.status === 'مقبول'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(application._id, 'قيد المراجعة')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    application.status === 'قيد المراجعة'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                  }`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Under Review
                </button>
                <button
                  onClick={() => updateStatus(application._id, 'مرفوض')}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    application.status === 'مرفوض'
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
        {filteredApplications.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">No applications match your search criteria</p>
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={selectedProduct.mainImage}
                      alt={selectedProduct.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  {selectedProduct.additionalImages?.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.additionalImages.map((image, index) => (
                        <div key={index} className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                          <img
                            src={image}
                            alt={`Additional ${index + 1}`}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">{selectedProduct.title}</h4>
                    <p className="text-sm text-gray-600">{selectedProduct.titleAr}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Category:</span> {selectedProduct.category}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Price:</span> ${selectedProduct.price}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Stock:</span> {selectedProduct.stock} units
                    </p>
                    {selectedProduct.size && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Size:</span> {selectedProduct.size}
                      </p>
                    )}
                    {selectedProduct.color && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Color:</span> {selectedProduct.color}
                      </p>
                    )}
                    {selectedProduct.material && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Material:</span> {selectedProduct.material}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium text-gray-900">Description</h5>
                    <p className="text-sm text-gray-600">{selectedProduct.description}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 mr-2">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm text-gray-600">{selectedProduct.averageRating.toFixed(1)}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Views:</span> {selectedProduct.views}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Purchases:</span> {selectedProduct.purchaseCount}
                    </div>
                  </div>

                  {selectedProduct.reviews?.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Recent Reviews</h5>
                      <div className="space-y-3">
                        {selectedProduct.reviews.slice(0, 3).map((review, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-yellow-400 mr-1">★</span>
                                <span className="text-sm text-gray-600">{review.rating}</span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProviderApplications