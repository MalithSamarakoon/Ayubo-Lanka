


// Import doctorimages

import doc1 from "../Doctor_list_image/doc1.png";
import doc2 from "../Doctor_list_image/doc2.png";
import doc3 from "../Doctor_list_image/doc3.png";
import doc4 from "../Doctor_list_image/doc4.png";
import doc5 from "../Doctor_list_image/doc5.png";
import doc6 from "../Doctor_list_image/doc6.png";
import doc7 from "../Doctor_list_image/doc7.png";
import doc8 from "../Doctor_list_image/doc8.png";
import doc9 from "../Doctor_list_image/doc9.png";
import doc10 from "../Doctor_list_image/doc10.png";
import doc11 from "../Doctor_list_image/doc11.png";
import doc12 from "../Doctor_list_image/doc12.png";
import doc13 from "../Doctor_list_image/doc13.png";
import doc14 from "../Doctor_list_image/doc14.png";
import doc15 from "../Doctor_list_image/doc15.png";

import logo from './logo.PNG'
import hero_img from './hero_img.jpg'
import cart_icon from './cart_icon.png'
import bin_icon from './bin_icon.png'
import dropdown_icon from './dropdown_icon.png'
import exchange_icon from './exchange_icon.png'
import profile_icon from './profile_icon.png'
import quality_icon from './quality_icon.png'
import search_icon from './search_icon.png'
import star_dull_icon from './star_dull_icon.png'
import star_icon from './star_icon.png'
import support_img from './support_img.png'
import menu_icon from './menu_icon.png'
import about_img from './about_img.png'
import contact_img from './contact_img.png'
import razorpay_logo from './razorpay_logo.png'
import stripe_logo from './stripe_logo.png'
import cross_icon from './cross_icon.png'

export const assets = {
    logo,
    hero_img,
    cart_icon,
    dropdown_icon,
    exchange_icon,
    profile_icon,
    quality_icon,
    search_icon,
    star_dull_icon,
    star_icon,
    bin_icon,
    support_img,
    menu_icon,
    about_img,
    contact_img,
    razorpay_logo,
    stripe_logo,
    cross_icon
}



export const doctors = [
  {
    _id: "doc1",
    name: "Dr. Nimal Perera",
    image: doc1,
    speciality: "Ayurvedic Physician",
    degree: "BAMS",
    experience: "4 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2000,
    address: { line1: "No 12, Galle Road", line2: "Colombo 03, Sri Lanka" },
  },
  {
    _id: "doc2",
    name: "Dr. Anusha Fernando",
    image: doc2,
    speciality: "Ayurveda Herbalist",
    degree: "BAMS",
    experience: "3 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2500,
    address: { line1: "No 42, Kandy Road", line2: "Kandy, Sri Lanka" },
  },
  {
    _id: "doc3",
    name: "Dr. Kamal Silva",
    image: doc3,
    speciality: "Sri Lankan Herbal Medicine Expert",
    degree: "BAMS",
    experience: "1 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 1800,
    address: { line1: "No 7, Ananda Road", line2: "Galle, Sri Lanka" },
  },
  {
    _id: "doc4",
    name: "Dr. Sunethra Rajapaksa",
    image: doc4,
    speciality: "Sri Lankan Herbal Medicine Expert",
    degree: "BAMS",
    experience: "2 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2300,
    address: { line1: "No 90, Main Street", line2: "Jaffna, Sri Lanka" },
  },
  {
    _id: "doc5",
    name: "Dr. Malinda Jayawardena",
    image: doc5,
    speciality: "Ayurvedic Dietician",
    degree: "BAMS",
    experience: "4 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2100,
    address: { line1: "No 33, Temple Road", line2: "Matara, Sri Lanka" },
  },
  {
    _id: "doc6",
    name: "Dr. Ishara Weerasinghe",
    image: doc6,
    speciality: "Ayurvedic Pulse Diagnostician",
    degree: "BAMS",
    experience: "4 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2400,
    address: { line1: "No 14, Flower Avenue", line2: "Negombo, Sri Lanka" },
  },
  {
    _id: "doc7",
    name: "Dr. Harsha Bandara",
    image: doc7,
    speciality: "Sri Lankan Classical Ayurveda Specialist",
    degree: "BAMS",
    experience: "4 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2200,
    address: { line1: "No 55, Lake Road", line2: "Nuwara Eliya, Sri Lanka" },
  },
  {
    _id: "doc8",
    name: "Dr. Dilani Senanayake",
    image: doc8,
    speciality: "Ayurvedic Pulse Diagnostician",
    degree: "BAMS",
    experience: "3 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 1900,
    address: { line1: "No 61, Hill Street", line2: "Hatton, Sri Lanka" },
  },
  {
    _id: "doc9",
    name: "Dr. Sanjeewa Kumara",
    image: doc9,
    speciality: "Ayurveda Yoga Consultant",
    degree: "BAMS",
    experience: "1 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2600,
    address: {
      line1: "No 28, Garden Road",
      line2: "Anuradhapura, Sri Lanka",
    },
  },
  {
    _id: "doc10",
    name: "Dr. Chandani Wickramasinghe",
    image: doc10,
    speciality: "Ayurveda Yoga Consultant",
    degree: "BAMS",
    experience: "2 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2000,
    address: { line1: "No 81, Riverbank", line2: "Polonnaruwa, Sri Lanka" },
  },
  {
    _id: "doc11",
    name: "Dr. Kasun Fernando",
    image: doc11,
    speciality: "Ayurvedic Detox Specialist",
    degree: "BAMS",
    experience: "4 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2700,
    address: { line1: "No 23, Lagoon Road", line2: "Trincomalee, Sri Lanka" },
  },
  {
    _id: "doc12",
    name: "Dr. Thusitha Amarasiri",
    image: doc12,
    speciality: "Ayurvedic Detox Specialist",
    degree: "BAMS",
    experience: "4 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2100,
    address: { line1: "No 45, Pine Street", line2: "Batticaloa, Sri Lanka" },
  },
  {
    _id: "doc13",
    name: "Dr. Chathura De Silva",
    image: doc13,
    speciality: "Ayurvedic Detox Specialist",
    degree: "BAMS",
    experience: "4 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2350,
    address: { line1: "No 37, Jasmine Lane", line2: "Ratnapura, Sri Lanka" },
  },
  {
    _id: "doc14",
    name: "Dr. Upeksha Jayasundara",
    image: doc14,
    speciality: "Ayurveda Massage Therapist",
    degree: "BAMS",
    experience: "3 Years",
    available: false,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2200,
    address: { line1: "No 66, Orchid Road", line2: "Monaragala, Sri Lanka" },
  },
  {
    _id: "doc15",
    name: "Dr. Anil Rathnayake",
    image: doc15,
    speciality: "Ayurveda Massage Therapist",
    degree: "BAMS",
    experience: "1 Years",
    available: true,
    about:
      "Experienced Ayurveda doctor specializing in holistic healing and traditional Sri Lankan practices.",
    fees: 2500,
    address: { line1: "No 16, Lotus Avenue", line2: "Badulla, Sri Lanka" },
  },
];