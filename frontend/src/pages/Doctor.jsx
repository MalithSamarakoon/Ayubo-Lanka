import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Fotter from "../Component/Fotter"

import { doctors } from "../assets/frontend_assets/assets";

const URL = "http://localhost:5000/api/user/users";

const Doctor = () => {
  // -------------------- Users (doctor-only) --------------------
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(URL);

        // Normalize
        const normalized = (res.data?.users || []).map((u) => ({
          _id: u._id || u.id || `${u.email ?? "user"}-${Math.random()}`,
          name: u.name ?? "-",
          email: u.email ?? "-",
          role: (u.role ?? "-").toString(),
          mobile: u.mobile ?? "-",
          doctorLicenseNumber: u.doctorLicenseNumber ?? "-",
          specialization: u.specialization ?? "-",
          companyAddress: u.companyAddress ?? "-",
          productCategory: u.productCategory ?? "-",
          isApproved:
            typeof u.isApproved === "boolean"
              ? u.isApproved
              : Boolean(u.approved),
          createdAt: u.createdAt ?? null,
        }));

        // 🔒 Accept/keep ONLY doctors
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

  // Extra safety: even if users changes, keep doctor-only
  const filteredData = useMemo(
    () => users.filter((u) => u.role?.toLowerCase() === "doctor"),
    [users]
  );

  // -------------------- Navigation Handlers --------------------
  const handleBook = (_id) => {
    if (!_id) {
      console.error("Doctor ID is required for booking");
      return;
    }
    // ✅ FIX: this must match your Route: /doctor/:docId
    navigate(`/doctor/${_id}`);
  };

  const handleDoctorDetails = (_id) => {
    if (!_id) {
      console.error("Doctor ID is required for viewing details");
      return;
    }
    navigate(`/doctor/${_id}`);
  };

  // -------------------- Doctor filter (sidebar demo) --------------------
  const [activeSpec, setActiveSpec] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedRating, setSelectedRating] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

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

  const processedDoctors = useMemo(() => {
    let filtered = doctors || [];

    if (activeSpec !== "All") {
      filtered = filtered.filter(
        (doc) => doc.speciality?.toLowerCase() === activeSpec.toLowerCase()
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name?.toLowerCase().includes(q) ||
          doc.speciality?.toLowerCase().includes(q) ||
          doc.location?.toLowerCase().includes(q)
      );
    }

    if (showAvailableOnly) {
      filtered = filtered.filter((doc) => doc.available !== false);
    }

    if (selectedRating !== "all") {
      const minRating = parseFloat(selectedRating);
      filtered = filtered.filter((doc) => (doc.rating ?? 4) >= minRating);
    }

    if (priceRange !== "all") {
      filtered = filtered.filter((doc) => {
        const price = doc.fees ?? 50;
        switch (priceRange) {
          case "low":
            return price < 1000;
          case "medium":
            return price >= 1000 && price <= 1500;
          case "high":
            return price > 1900;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "price":
          return (a.fees || 0) - (b.fees || 0);
        case "availability":
          return (b.available ? 1 : 0) - (a.available ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    activeSpec,
    searchQuery,
    sortBy,
    showAvailableOnly,
    selectedRating,
    priceRange,
  ]);

  const handleFilterClick = (spec) => setActiveSpec(spec);
  const clearAllFilters = () => {
    setActiveSpec("All");
    setSearchQuery("");
    setShowAvailableOnly(false);
    setSelectedRating("all");
    setPriceRange("all");
    setSortBy("name");
  };

  const stats = useMemo(() => {
    const available = processedDoctors.filter(
      (d) => d.available !== false
    ).length;
    const avgRating =
      processedDoctors.reduce((s, d) => s + (d.rating ?? 4), 0) /
      (processedDoctors.length || 1);
    const specialties = new Set(processedDoctors.map((d) => d.speciality)).size;

    return {
      total: processedDoctors.length,
      available,
      avgRating: avgRating.toFixed(1),
      specialties,
    };
  }, [processedDoctors]);

  // Filter API doctors based on search and specialization
  const filteredApiDoctors = useMemo(() => {
    let filtered = filteredData;

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

    // Sort the filtered API doctors
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "specialization":
          return (a.specialization || "").localeCompare(b.specialization || "");
        case "approved":
          return (b.isApproved ? 1 : 0) - (a.isApproved ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [filteredData, searchQuery, activeSpec, sortBy]);

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Medical Staff Directory
                </h1>
                <p className="text-gray-600">
                  Hospital Management System - Find Your Specialist
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredApiDoctors.length}
                </div>
                <div className="text-xs text-gray-500">Total Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {filteredApiDoctors.filter((d) => d.isApproved).length}
                </div>
                <div className="text-xs text-gray-500">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.avgRating}★
                </div>
                <div className="text-xs text-gray-500">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    new Set(filteredApiDoctors.map((d) => d.specialization))
                      .size
                  }
                </div>
                <div className="text-xs text-gray-500">Specialties</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-6">
              {/* Search */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Filter Header */}
              <div className="px-6 py-4 border-b border-green-400 bg-emerald-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
                      />
                    </svg>
                    Filters
                  </h2>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-green-100 hover:text-white underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Specialty list */}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Medical Specialties
                  </h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {specialityList.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => handleFilterClick(spec)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 border text-sm ${
                          activeSpec === spec
                            ? "bg-blue-50 border-green-200 text-green-700 font-medium"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {spec === "All" ? "All Departments" : spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Availability
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showAvailableOnly}
                      onChange={(e) => setShowAvailableOnly(e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Available today only
                    </span>
                  </label>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">
                    Minimum Rating
                  </h3>
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="3.5">3.5+ Stars</option>
                    <option value="3.0">3.0+ Stars</option>
                  </select>
                </div>
              </div>

              {/* Stats footer */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Showing Results:</span>
                  <span className="font-semibold text-blue-600 bg-green-100 px-2 py-1 rounded-full">
                    {filteredApiDoctors.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main content: Doctor Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Our Medical Professionals
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {filteredApiDoctors.length} verified doctors
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="specialization">Sort by Specialty</option>
                      <option value="approved">Sort by Status</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Quick info */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
                    Online Booking Available
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Verified Professionals
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Same Day Appointments
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center px-4 py-2 font-semibold text-sm text-gray-600">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading doctors...
                </div>
              </div>
            ) : filteredApiDoctors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApiDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                  >
                    {/* Doctor Avatar */}
                    <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 p-6">
                      <div className="flex justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                          <svg
                            className="w-10 h-10 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Approval Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doctor.isApproved
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}
                        >
                          {doctor.isApproved ? (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Verified
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Pending
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          Dr. {doctor.name}
                        </h3>
                        <p className="text-green-600 font-medium text-sm bg-green-50 px-3 py-1 rounded-full inline-block">
                          {doctor.specialization || "General Practice"}
                        </p>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-600 text-sm">
                          <svg
                            className="w-4 h-4 mr-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          {doctor.email}
                        </div>

                        {doctor.mobile !== "-" && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <svg
                              className="w-4 h-4 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                            {doctor.mobile}
                          </div>
                        )}

                        {doctor.doctorLicenseNumber !== "-" && (
                          <div className="flex items-center text-gray-600 text-sm">
                            <svg
                              className="w-4 h-4 mr-3 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            License: {doctor.doctorLicenseNumber}
                          </div>
                        )}
                      </div>

                      {/* Availability Status */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                              doctor.isApproved
                                ? "bg-green-500 animate-pulse"
                                : "bg-gray-400"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">
                            {doctor.isApproved
                              ? "Available for Consultation"
                              : "Not Available"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleBook(doctor._id)}
                          disabled={!doctor.isApproved}
                          className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                            doctor.isApproved
                              ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Book Appointment
                        </button>

                        <button
                          onClick={() => handleDoctorDetails(doctor._id)}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg
                            className="w-4 h-4 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No doctors found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your search criteria or filters to find more
                  doctors.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="inline-flex items-center px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
  
    </div>
  );
};

export default Doctor;
