import React, { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { assets } from '../assets/frontend_assets/assets'

const Collection = () => {
  const {product}=useContext(ShopContext)
  const [showFilter, setShowFilter] = useState(false)
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          FILTERS
        </p>
      
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"MassageOils"} />{" "}
              Massage Oils
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"HairOils"} />
              Hair Oils
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={" SkinOils"} /> Skin
              Oils
            </p>
          </div>
        </div>

        <div
          className={`border border-gray-300 pl-5 py-3 mt-6  my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"BaseOils"} /> Base
              Oils
            </p>
            <p className="flex gap-2">
              <input className="w-3" type="checkbox" value={"HerbalOils"} />
              Herbal Oils
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={" . DoshaSpecificOils"}
              />{" "}
              . Dosha-Specific Oils
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Collection
