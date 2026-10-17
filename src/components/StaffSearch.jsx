import React, { useState } from 'react';
import { Search, Sparkles, MapPin, Clock, X, Building, Navigation, Mail, Phone, BookOpen, Filter } from 'lucide-react';

const StaffAvatar = ({ gender, className = "w-14 h-14" }) => {
  return (
    <svg viewBox="0 0 100 100" className={`rounded-full overflow-hidden ${className}`}>
      <circle cx="50" cy="50" r="50" fill="#1ABC9C" />
      <path d="M15 100 Q 50 50 85 100" fill="#34495E" />
      <rect x="42" y="55" width="16" height="20" fill="#F5CBA7" />
      <circle cx="50" cy="45" r="18" fill="#F5CBA7" />
      {gender === 'female' ? (
        <path d="M 32 45 Q 30 20 50 20 Q 70 20 68 45 L 68 65 Q 50 75 32 65 Z" fill="#5D4037" />
      ) : (
        <path d="M 32 45 Q 30 25 50 25 Q 70 25 68 45 Q 50 35 32 45 Z" fill="#5D4037" />
      )}
      <circle cx="50" cy="47" r="15" fill="#F5CBA7" />
    </svg>
  );
};

export default function StaffSearch({ staffList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || staff.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleStaffClick = (staff) => {
    setSelectedStaff(staff);
    setLoadingAi(true);
    setAiRecommendation('');

    setTimeout(() => {
      let advice = "";
      if (staff.status === "In Cabin") {
        advice = `Since ${staff.name} is currently in their cabin, you can visit them right now at ${staff.cabin}. Make sure to go before their next scheduled block.`;
      } else if (staff.status === "In Class") {
        advice = `${staff.name} is currently teaching. It is best not to interrupt. Wait near ${staff.currentLocation} for the class to end, or visit their cabin during their free hours.`;
      } else {
        advice = `${staff.name} is currently busy (${staff.status}). Based on their schedule, try visiting them when they are free.`;
      }
      setAiRecommendation(advice);
      setLoadingAi(false);
    }, 1200);
  };

  const closeDetails = () => {
    setSelectedStaff(null);
    setAiRecommendation('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm relative flex-1">
          <Search className="w-5 h-5 absolute left-7 top-7 text-slate-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-lg"
            placeholder="Search staff by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center md:w-64 relative">
          <Filter className="w-5 h-5 absolute left-7 top-7 text-slate-400" />
          <select
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 text-lg appearance-none cursor-pointer bg-white"
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">Mechanical</option>
            <option value="CIVIL">Civil</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStaff.map((staff) => (
          <button
            key={staff.id}
            onClick={() => handleStaffClick(staff)}
            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-400 transition flex items-center justify-between text-left group"
          >
            <div className="flex items-center space-x-4">
              <div className="shadow-sm group-hover:scale-105 transition-transform rounded-full">
                <StaffAvatar gender={staff.gender} className="w-16 h-16" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{staff.name}</h4>
                <p className="text-sm text-slate-500">{staff.designation}</p>
                <span className={`inline-block mt-1 px-2.5 py-0.5 text-xs font-medium rounded-full ${
                  staff.status === 'In Cabin' ? 'bg-emerald-100 text-emerald-800' :
                  staff.status === 'In Class' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {staff.status}
                </span>
              </div>
            </div>
            <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
              <Navigation className="w-5 h-5" />
            </div>
          </button>
        ))}
        {filteredStaff.length === 0 && (
          <div className="col-span-1 md:col-span-2 text-center p-8 bg-white rounded-lg border border-slate-200 text-slate-500">
            No staff members found matching your search.
          </div>
        )}
      </div>

      {selectedStaff && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-50 p-6 flex items-start justify-between border-b border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="shadow-md rounded-full border-4 border-white bg-white">
                  <StaffAvatar gender={selectedStaff.gender} className="w-20 h-20" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{selectedStaff.name}</h3>
                  <p className="text-slate-600 font-medium">{selectedStaff.designation}</p>
                  <p className="text-sm text-slate-500">{selectedStaff.department} Department</p>
                </div>
              </div>
              <button 
                onClick={closeDetails}
                className="p-2 bg-white hover:bg-slate-200 text-slate-500 rounded-full transition shadow-sm border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a href={`mailto:${selectedStaff.email}`} className="hover:text-slate-900 truncate" title={selectedStaff.email}>
                    {selectedStaff.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{selectedStaff.phone}</span>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <BookOpen className="w-4 h-4 text-slate-400 mt-1" />
                <div className="flex flex-wrap gap-1.5">
                  {selectedStaff.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <hr className="border-slate-100" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tracking Information</h4>
                
                <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className={`p-2 rounded-full mt-0.5 ${
                    selectedStaff.status === 'In Cabin' ? 'bg-emerald-100 text-emerald-600' :
                    selectedStaff.status === 'In Class' ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Current Location ({selectedStaff.status})</p>
                    <p className="font-semibold text-slate-900">{selectedStaff.currentLocation}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-full mt-0.5">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Permanent Cabin</p>
                    <p className="font-semibold text-slate-900">{selectedStaff.cabin}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-full mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Today's Schedule</p>
                    <p className="font-semibold text-slate-900">{selectedStaff.schedule}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl p-5 shadow-inner">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-white">AI Visit Assistant</h4>
                </div>
                {loadingAi ? (
                  <div className="animate-pulse flex space-x-2 items-center text-slate-400">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    <span className="text-sm ml-2">Analyzing schedule & location...</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-200 leading-relaxed border-l-2 border-amber-400 pl-3">
                    {aiRecommendation}
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}