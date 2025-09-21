import React from 'react'
import { useState, useEffect } from 'react'
import { CirclePlus, ShoppingBasket } from "lucide-react"
import CreateProductForm from '../components/CreateProductForm'
import ProductsList from '../components/ProductsList'
import { useProductStore } from '../stores/useProductStore'

const tabs = [
  { id: "create", label: "Create Product", icon: CirclePlus },
  { id: "products", label: "Products", icon: ShoppingBasket }
]

const ProductDashboard = () => {
  const [activeTab, setActiveTab] = useState("create");
  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">Product Management</h1>
          <p className="text-gray-600">Manage your product inventory and create new products</p>
        </div>

        {/* Navigation Tabs - CENTERED */}
        <div className="mb-6 flex justify-center">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200 max-w-md">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-green-500 text-white shadow-md"
                      : "text-gray-600 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === "create" && <CreateProductForm />}
          {activeTab === "products" && <ProductsList />}
        </div>
      </div>
    </div>
  )
}

export default ProductDashboard

