import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams import
import axios from "axios";
import DirectoryHeader from "../components/DirectoryHeader";
import FilterSidebar from "../components/FilterSidebar";
import DoctorList from "../components/DoctorList";

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
  const { id } = useParams(); // This will be used if you need to fetch a specific doctor

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
          // ADDED: Fetch consultation fee from API response
          consultationFee: u.consultationFee ?? "",
          experience: u.experience ?? "",
          description: u.description ?? "",
          availability: u.availability ?? "not_available",
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
  //use memo to avoid unnecessary recalculations
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
    "General Ayurveda",
    "Women's Health",
    "Child Health",
    "Detox & Panchakarma",
    "Mental Health",
    "Geriatric Care",
    "Ayurvedic Surgery",
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
    </div>
  );
};

export default DoctorPage;
