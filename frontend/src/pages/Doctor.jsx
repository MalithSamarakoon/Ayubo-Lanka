import React, { useContext } from 'react'
import{useParams} from "react-router-dom"
import AppContext from '../Context/AppContext'
const Doctor = () => {
  const { speciality } = useParams()
 const {doctors}=useContext(AppContext)
  
  return (
    <div>
      
    </div>
  )
}

export default Doctor
