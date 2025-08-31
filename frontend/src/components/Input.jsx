import React from 'react'

const Input = ({icon:Icon,...props}) => {
  return (
    <div className='relative mb-6'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
         <Icon className="size-5 text-green-500" />
        </div>
        <input
        {...props}
        className='w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 
                   bg-gray-50 text-gray-800 placeholder-gray-400
                   focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400
                   shadow-sm'
        />
    </div>
  );
};

export default Input;