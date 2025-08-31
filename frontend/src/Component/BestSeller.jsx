import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItems";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  const [latestproducts, setlatestproducts] = useState([]);

  useEffect(() => {
    setlatestproducts(products.slice(10, 20));
  }, []);
  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"BEST"} text2={"COLLOECTION"} />

        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Feel the difference with our authentic herbal medication
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
};

export default BestSeller;
