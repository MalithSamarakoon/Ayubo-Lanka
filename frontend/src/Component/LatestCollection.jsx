import React, { useEffect } from 'react'
import { useProductStore } from '../stores/useProductStore'
import Title from './Title';
import ProductItems from './ProductItems';

const LatestCollection = () => {
  const { products, loading, fetchFeaturedProducts } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (loading) {
    return (
      <div className="my-10">
        <div className="text-center py-8 text-3xl">
          <Title text1={"LATEST"} text2={"COLLECTION"} />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
            Building on ancient knowledge & herbal recipes passed down from
            generations , our mission is to help people lead healthier & more
            balanced lifestyles through our authentic Ceylonese Ayurvedic
            medicines. Feel the difference with our authentic herbal medication
            and level up your healthy lifestyle.
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"} />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Building on ancient knowledge & herbal recipes passed down from
          generations , our mission is to help people lead healthier & more
          balanced lifestyles through our authentic Ceylonese Ayurvedic
          medicines. Feel the difference with our authentic herbal medication
          and level up your healthy lifestyle.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No featured products available at the moment.</p>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default LatestCollection
