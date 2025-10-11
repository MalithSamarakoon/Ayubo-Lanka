
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterSidebar from "../components/FilterSidebar";
import DoctorList from "../components/DoctorList";
import Fotter from "../Component/Fotter"; 

const URL = "http://localhost:5000/api/user/users";

const DoctorPage = () => {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpec, setActiveSpec] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState("all");
  const navigate = useNavigate();

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchHandler = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(URL);
        const normalized = (res.data?.users || []).map((u) => ({
          _id: u._id || u.id || `${u.email ?? "user"}-${Math.random()}`,
          name: u.name ?? "-",
          email: u.email ?? "-",
          role: (u.role ?? "-").toString(),
          mobile: u.mobile ?? "-",
          doctorLicenseNumber: u.doctorLicenseNumber ?? "-",
          specialization: u.specialization ?? "-",
          isApproved:
            typeof u.isApproved === "boolean"
              ? u.isApproved
              : Boolean(u.approved),
        }));
        const doctorsOnly = normalized.filter(
          (u) => u.role?.toLowerCase() === "doctor"
        );
        setUsers(doctorsOnly);
      } catch (e) {
        console.error("Fetch users failed:", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHandler();
  }, []);

  // --- DATA PROCESSING & FILTERING ---
  const filteredApiDoctors = useMemo(() => {
    let filtered = users;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(q) ||
          doc.specialization?.toLowerCase().includes(q) ||
          doc.email?.toLowerCase().includes(q)
      );
    }
    if (activeSpec !== "All") {
      filtered = filtered.filter((doc) =>
        doc.specialization?.toLowerCase().includes(activeSpec.toLowerCase())
      );
    }
  
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "specialization":
          return (a.specialization || "").localeCompare(b.specialization || "");
        case "approved":
          return (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0);
        case "name":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });
  }, [users, searchQuery, activeSpec, sortBy]);

  // --- STATISTICS CALCULATION ---
  const stats = useMemo(
    () => ({
      total: filteredApiDoctors.length,
      approved: filteredApiDoctors.filter((d) => d.isApproved).length,
      avgRating: "4.0", // Assuming static rating for now as it's not in user data
      specialties: new Set(filteredApiDoctors.map((d) => d.specialization))
        .size,
    }),
    [filteredApiDoctors]
  );

  // --- EVENT HANDLERS ---
  const handleBook = (_id) => navigate(`/doctor/${_id}`);
  const handleDoctorDetails = (_id) => navigate(`/doctor/${_id}`);
  const handleFilterClick = (spec) => setActiveSpec(spec);
  const clearAllFilters = () => {
    setActiveSpec("All");
    setSearchQuery("");
    setShowAvailableOnly(false);
    setSelectedRating("all");
    setSortBy("name");
  };

  const specialityList = [
    "All",
    "Ayurveda Massage Therapist",
    "Ayurvedic Detox Specialist",
    "Ayurveda Yoga Consultant",
    "Ayurveda Panchakarma Specialist",
    "Ayurvedic Pulse Diagnostician",
    "Sri Lankan Herbal Medicine Expert",
    "Ayurveda Herbalist",
    "Ayurvedic Physician",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <DirectoryHeader stats={stats} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <FilterSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeSpec={activeSpec}
            handleFilterClick={handleFilterClick}
            specialityList={specialityList}
            showAvailableOnly={showAvailableOnly}
            setShowAvailableOnly={setShowAvailableOnly}
            selectedRating={selectedRating}
            setSelectedRating={setSelectedRating}
            clearAllFilters={clearAllFilters}
            resultsCount={filteredApiDoctors.length}
          />
          <DoctorList
            isLoading={isLoading}
            doctors={filteredApiDoctors}
            sortBy={sortBy}
            setSortBy={setSortBy}
            handleBook={handleBook}
            handleDoctorDetails={handleDoctorDetails}
            clearAllFilters={clearAllFilters}
          />
        </div>
      </div>
      <Fotter />
    </div>
  );
};

export default DoctorPage;
