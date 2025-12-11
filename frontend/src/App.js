import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, DollarSign } from 'lucide-react';

const API_URL = 'http://localhost:8080/api';


export default function MarketplaceApp() {
  const [listings, setListings] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    seller_name: '',
    seller_email: ''
  });

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/listings`);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      alert('Failed to fetch listings. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = async () => {
    if (!formData.title || !formData.price || !formData.seller_name || !formData.seller_email) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Listing created successfully!');
        setFormData({
          title: '',
          description: '',
          price: '',
          seller_name: '',
          seller_email: ''
        });
        setShowCreateForm(false);
        fetchListings();
      } else {
        alert('Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!/*confirm*/('Are you sure you want to delete this listing?')) return;

    try {
      const response = await fetch(`${API_URL}/listings/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Listing deleted successfully!');
        fetchListings();
      } else {
        alert('Failed to delete listing');
      }
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  const handleBuyListing = async (id) => {
    if (!/*confirm*/('Are you sure you want to buy this item?')) return;

    try {
      const response = await fetch(`${API_URL}/listings/${id}/buy`, {
        method: 'POST'
      });

      if (response.ok) {
        alert('Purchase successful!');
        fetchListings();
      } else {
        alert('Failed to complete purchase');
      }
    } catch (error) {
      console.error('Error buying listing:', error);
      alert('Failed to complete purchase');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">KleptoKart</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            Create Listing
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Create New Listing</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe your item"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={formData.seller_name}
                    onChange={(e) => setFormData({ ...formData, seller_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={formData.seller_email}
                    onChange={(e) => setFormData({ ...formData, seller_email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCreateListing}
                  className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Create Listing
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Active Listings</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading listings...</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No active listings yet</p>
              <p className="text-gray-500 mt-2">Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div key={listing.id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{listing.description || 'No description'}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {parseFloat(listing.price).toFixed(2)}
                    </span>
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Seller:</span> {listing.seller_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(listing.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBuyListing(listing.id)}
                      className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={() => handleDeleteListing(listing.id)}
                      className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

