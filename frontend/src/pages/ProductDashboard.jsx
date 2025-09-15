import React from 'react'
import { useState, useEffect } from 'react'
import { CirclePlus, ShoppingBasket }  from "lucide-react"
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
    <div className='min-h-screen bg-gray-900 text-emerald-400 text-center'>
        <div className='relative z-10 container mx-auto px-4 py-16'>
        ProductDashboard

            <div className='flex justify-center mb-8'>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? "bg-emerald-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                }`}
                            >
                                <tab.icon className='mr-2 h-5 w-5' />
                                {tab.label}
                            </button>
                        ))}
            </div>
            {activeTab === "create" && <CreateProductForm />}
			{activeTab === "products" && <ProductsList />}

        </div>
    </div>
  )
}

export default ProductDashboard;