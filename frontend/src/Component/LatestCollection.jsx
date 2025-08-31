import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import Title from './Title';
import ProductItems from './ProductItems';

const LatestCollection = () => {
const {products}=useContext(ShopContext)

const [latestproducts,setlatestproducts]=useState([])

useEffect(()=>
{
setlatestproducts(products.slice(0,10))
},[])
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLOECTION"} />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Building on ancient knowledge & herbal recipes passed down from
          generations , our mission is to help people lead healthier & more
          balanced lifestyles through our authentic Ceylonese Ayurvedic
          medicines. Feel the difference with our authentic herbal medication
          and level up your healthy lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestproducts.map((item, index) => (
          <ProductItems
            key={index}
            id={item.id}
            image={item.image}
            name={item.name}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
}

export default LatestCollection
