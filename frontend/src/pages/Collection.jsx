import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import Title from '../Component/Title';
import ProductItems from '../Component/ProductItems';

const Collection = () => {
  const { products, loading, fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  if (loading) {
    return (
      <div className="my-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-8 text-3xl">
          <Title text1={"ALL"} text2={"PRODUCTS"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
            Browse our complete collection of authentic Ceylonese Ayurvedic medicines and herbal products.
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10 px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8 text-3xl">
        <Title text1={"ALL"} text2={"PRODUCTS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
          Browse our complete collection of authentic Ceylonese Ayurvedic medicines and herbal products.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products available at the moment.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {products.map((item) => (
              <ProductItems
                key={item._id}
                id={item._id}
                image={[item.image]}
                name={item.name}
                price={item.price}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Collection;