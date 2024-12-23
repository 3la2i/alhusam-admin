import React, { useState, useEffect } from "react";
import axios from "axios";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    titleAr: "",
    price: "",
    category: "",
    stock: "",
    isDeleted: false, // Added isDeleted to updateForm
  });

  const categories = ["ملابس", "طعام", "مصنوعات يدوية", "اكسسوارات", "أخرى"];

  const getImagePath = (fullUrl) => {
    try {
      const matches = fullUrl.match(/\/uploads\/(.+)$/);
      return matches ? matches[1] : fullUrl;
    } catch (e) {
      return fullUrl;
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/products/products");
      setProducts(response.data);
    } catch (error) {
      setError("Failed to fetch products.");
    }
  };

  const handleOpenUpdateModal = (product) => {
    setSelectedProduct(product);
    setUpdateForm({
      titleAr: product.titleAr,
      price: product.price,
      category: product.category,
      stock: product.stock,
      isDeleted: product.isDeleted, // Set isDeleted value from the selected product
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/products/products/${selectedProduct._id}`,
        updateForm
      );
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id ? { ...product, ...response.data } : product
        )
      );
      setIsUpdateModalOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      setError("Failed to update product.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/products/products/${id}`);
      setProducts((prev) => prev.filter((product) => product._id !== id));
    } catch (error) {
      setError("Failed to delete product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Modal component
  const UpdateModal = () => {
    if (!isUpdateModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Product</h2>
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title (Arabic)
              </label>
              <input
                type="text"
                value={updateForm.titleAr}
                onChange={(e) => setUpdateForm({ ...updateForm, titleAr: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={updateForm.price}
                onChange={(e) => setUpdateForm({ ...updateForm, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={updateForm.category}
                onChange={(e) => setUpdateForm({ ...updateForm, category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                value={updateForm.stock}
                onChange={(e) => setUpdateForm({ ...updateForm, stock: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deleted
              </label>
              <input
                type="checkbox"
                checked={updateForm.isDeleted}
                onChange={(e) => setUpdateForm({ ...updateForm, isDeleted: e.target.checked })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setIsUpdateModalOpen(false)}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">All Products</h1>
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}

      <table className="table-auto w-full border-collapse border border-gray-700 text-left">
        <thead>
          <tr>
            <th className="border border-gray-700 px-4 py-2">Image</th>
            <th className="border border-gray-700 px-4 py-2">Id</th>
            <th className="border border-gray-700 px-4 py-2">Title (Arabic)</th>
            <th className="border border-gray-700 px-4 py-2">Seller</th>
            <th className="border border-gray-700 px-4 py-2">Stock</th>
            <th className="border border-gray-700 px-4 py-2">Price</th>
            <th className="border border-gray-700 px-4 py-2">Category</th>
            <th className="border border-gray-700 px-4 py-2">isDeleted?</th>
            <th className="border border-gray-700 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-blue-100">
              <td className="border border-gray-700 px-4 py-2">
                <img
                  src={`http://localhost:4000/uploads/${getImagePath(product.mainImage)}`}
                  alt="Product"
                  className="h-16 w-16 object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </td>
              <td className="border border-gray-700 px-4 py-2">{product._id}</td>
              <td className="border border-gray-700 px-4 py-2">{product.titleAr}</td>
              <td className="border border-gray-700 px-4 py-2">{product.seller}</td>
              <td className="border border-gray-700 px-4 py-2">{product.stock}</td>
              <td className="border border-gray-700 px-4 py-2">${product.price}</td>
              <td className="border border-gray-700 px-4 py-2">{product.category}</td>
              <td className="border border-gray-700 px-4 py-2">
                {product.isDeleted ? 'Yes' : 'No'}
              </td>
              <td className="border border-gray-700 px-4 py-2 space-x-2">
                <button
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => handleOpenUpdateModal(product)}
                >
                  Update
                </button>
                <button
                  className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                  onClick={() => handleDelete(product._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <UpdateModal />
    </div>
  );
};

export default AllProducts;
