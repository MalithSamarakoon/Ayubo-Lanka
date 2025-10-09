import React, { useState } from 'react'
import {motion} from 'framer-motion'
import { Trash, Star, SquarePen, Search, X } from 'lucide-react'
import { useProductStore }  from '../stores/useProductStore'
import { useNavigate } from 'react-router-dom'

function ProductsList() {
  const { products, toggleFeaturedProduct, deleteProduct } = useProductStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleEditClick = (productId) => {
    navigate(`/update-product/${productId}`);
  };

  // Filter products based on search term
  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  console.log("products:", products);

  return (
    <motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
    
		{/* Search Bar Section */}
		<div className='px-6 pt-6 pb-4'>
			<div className='relative'>
				<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
					<Search className='h-5 w-5 text-gray-400' />
				</div>
				<input
					type='text'
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder='Search products by name...'
					className='block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-lg 
					bg-gray-700 text-white placeholder-gray-400 
					focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
					transition duration-200'
				/>
				{searchTerm && (
					<button
						onClick={handleClearSearch}
						className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 transition-colors'
					>
						<X className='h-5 w-5' />
					</button>
				)}
			</div>
			{searchTerm && (
				<p className='mt-2 text-sm text-gray-400'>
					Found {filteredProducts?.length || 0} product{filteredProducts?.length !== 1 ? 's' : ''}
				</p>
			)}
		</div>

	<div className='overflow-x-auto'>
      <table className=' min-w-full divide-y divide-gray-700'>
          <thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Product
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Description
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Category
						</th>
            
            <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
						  Price
						</th>
            
            <th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Stock
						</th>

						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Featured
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Actions
						</th>
					</tr>
				</thead>

        <tbody className='bg-gray-800 divide-y divide-gray-700'>
					{filteredProducts?.length > 0 ? (
						filteredProducts.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.image}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.description}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.category}</div>
							</td>
              <td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{Number(product.price).toFixed(2)}</div>
							</td>
              <td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{product.stock}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full transition-colors duration-200 ${
										product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className={`h-5 w-5 ${product.isFeatured ? 'fill-current' : ''}`} />
								</button>
							</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => handleEditClick(product._id)}
									className='text-indigo-400 hover:text-indigo-300 mr-3'
								>
									<SquarePen className='h-5 w-5' />
								</button>
							</td>

							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))
					) : (
						<tr>
							<td colSpan='7' className='px-6 py-8 text-center'>
								<div className='flex flex-col items-center justify-center'>
									<Search className='h-12 w-12 text-gray-500 mb-3' />
									<p className='text-gray-400 text-lg'>
										{searchTerm ? 'No products found matching your search.' : 'No products available.'}
									</p>
									{searchTerm && (
										<button
											onClick={handleClearSearch}
											className='mt-3 text-green-500 hover:text-green-400 transition-colors'
										>
											Clear search
										</button>
									)}
								</div>
							</td>
						</tr>
					)}
				</tbody>
      </table>
	</div>

    </motion.div>
  )
  
}

export default ProductsList