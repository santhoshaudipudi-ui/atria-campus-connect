import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Mail, Phone, BookOpen, Sparkles, Building2, Filter, Home } from 'lucide-react';

export default function StaffSearch({ staffList }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Updates current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const timeToMins = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const format12Hour = (timeStr) => {
    if (!timeStr) return '';
    let [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  // Upgraded Live Status Engine (Handles Holidays and After-Hours)
  const getLiveStatus = (staff) => {
    const schedule = staff.schedule || [];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = days[currentTime.getDay()];
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

    // 1. Check if it is Sunday (Holiday)
    if (currentDay === 'Sunday') {
      return {
        statusType: 'away',
        statusText: 'Holiday',
        location: 'Off Campus / Home',
        activity: 'Weekend (Sunday)',
        freeInfo: 'College is closed today.'
      };
    }

    // 2. Check if outside of normal college hours (Before 8:00 AM or After 5:30 PM)
    if (currentMins < 480 || currentMins > 1050) { 
      return {
        statusType: 'away',
        statusText: 'Away',
        location: 'Off Campus',
        activity: 'Outside Working Hours',
        freeInfo: 'Faculty has left for the day.'
      };
    }

    const todaysClasses = schedule
      .filter(cls => cls.day === currentDay)
      .map(cls => ({
        ...cls,
        startMins: timeToMins(cls.start),
        endMins: timeToMins(cls.end)
      }))
      .sort((a, b) => a.startMins - b.startMins);

    // 3. Check if currently teaching a class
    const activeClass = todaysClasses.find(
      cls => currentMins >= cls.startMins && currentMins < cls.endMins
    );

    if (activeClass) {
      let freeTimeStr = activeClass.end;
      let checkMins = activeClass.endMins;
      while (true) {
        const nextConsecutive = todaysClasses.find(c => c.startMins === checkMins);
        if (nextConsecutive) {
          checkMins = nextConsecutive.endMins;
          freeTimeStr = nextConsecutive.end;
        } else {
          break;
        }
      }

      return {
        statusType: 'busy',
        statusText: 'In Class',
        location: `Classroom / Lab: ${activeClass.room}`,
        activity: `In Class: ${activeClass.subject}`,
        freeInfo: `Currently busy. Expected to be free after ${format12Hour(freeTimeStr)}.`
      };
    }

    // 4. Find the next upcoming class today
    const nextClass = todaysClasses.find(cls => cls.startMins > currentMins);

    if (nextClass) {
      return {
        statusType: 'available',
        statusText: 'Available',
        location: staff.cabin ? `Cabin: ${staff.cabin}` : 'Cabin: TBD',
        activity: 'Available Right Now',
        freeInfo: `Free until ${format12Hour(nextClass.start)}. Next class is ${nextClass.subject}.`
      };
    }

    // 5. Done with all classes for the day, but still during college hours
    return {
      statusType: 'available',
      statusText: 'Available',
      location: staff.cabin ? `Cabin: ${staff.cabin}` : 'Cabin: TBD',
      activity: 'Free (No more classes)',
      freeInfo: 'Done with all classes for today.'
    };
  };

  const getSubjects = (schedule) => {
    if (!schedule || schedule.length === 0) return 'TBD';
    const subjects = schedule.map(s => s.subject.split(' (')[0]);
    const uniqueSubjects = [...new Set(subjects)];
    return uniqueSubjects.join(', ');
  };

  const getDepartment = (email) => {
    if (!email) return 'TBD';
    const lowerEmail = email.toLowerCase();
    if (lowerEmail.includes('aiml')) return 'AI & Machine Learning';
    if (lowerEmail.includes('maths') || lowerEmail.includes('physics') || lowerEmail.includes('chemistry')) return 'Basic Sciences';
    if (lowerEmail.includes('ece')) return 'Electronics & Communication';
    if (lowerEmail.includes('ise')) return 'Information Science';
    if (lowerEmail.includes('mech')) return 'Mechanical Engineering';
    if (lowerEmail.includes('civil')) return 'Civil Engineering';
    return 'Computer Science & Engineering';
  };

  const availableDepartments = ['All Departments', ...new Set(staffList.map(staff => getDepartment(staff.email)))];

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All Departments' || getDepartment(staff.email) === departmentFilter;
    
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Faculty Locator</h2>
          <p className="text-sm text-slate-500">Search and click on a faculty member for detailed profiles and live availability.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <input 
              type="text" 
              placeholder="Search by faculty name or designation..." 
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative md:w-72 shrink-0">
            <Filter className="w-5 h-5 text-slate-400 absolute left-3 top-3.5" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white appearance-none text-slate-700"
            >
              {availableDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-lg border border-slate-200">
            <p className="text-slate-500">No faculty members found matching your filters.</p>
          </div>
        ) : (
          filteredStaff.map(staff => {
            const liveStatus = getLiveStatus(staff);
            
            return (
              <div 
                key={staff.id} 
                onClick={() => setSelectedStaff({ ...staff, liveStatus })}
                className="cursor-pointer bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{staff.name}</h3>
                      <p className="text-xs font-semibold text-blue-700 mt-1">{staff.role}</p>
                    </div>
                    
                    {/* Dynamic 3-State Badge */}
                    <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border shrink-0 ${
                      liveStatus.statusType === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      liveStatus.statusType === 'busy' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {liveStatus.statusText}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-slate-600 font-medium">
                    {liveStatus.statusType === 'away' ? (
                      <Home className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{liveStatus.location}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Modal Overlay */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900">Faculty Profile</h2>
              <button 
                onClick={() => setSelectedStaff(null)} 
                className="p-1 hover:bg-slate-200 rounded-full transition text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{selectedStaff.name}</h1>
                <p className="text-sm font-semibold text-blue-700 mt-1">{selectedStaff.role}</p>
                <div className="flex items-center text-sm text-slate-500 mt-2">
                  <Building2 className="w-4 h-4 mr-2 shrink-0" />
                  {getDepartment(selectedStaff.email)}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Status Tracking</h3>
                
                <div className="flex items-start">
                  {selectedStaff.liveStatus.statusType === 'away' ? (
                    <Home className="w-5 h-5 mr-3 text-slate-400 shrink-0 mt-0.5" />
                  ) : (
                    <MapPin className="w-5 h-5 mr-3 text-slate-700 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-slate-500">Current Location</p>
                    <p className="text-base font-semibold text-slate-900">{selectedStaff.liveStatus.location}</p>
                    <p className="text-sm text-slate-600 mt-0.5">{selectedStaff.liveStatus.activity}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Sparkles className="w-5 h-5 mr-3 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">AI Availability Suggestion</p>
                    <p className="text-base font-semibold text-slate-900">{selectedStaff.liveStatus.freeInfo}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <BookOpen className="w-5 h-5 mr-3 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Subjects Taught</p>
                    <p className="text-sm text-slate-900 mt-1 leading-relaxed">
                      {getSubjects(selectedStaff.schedule)}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 flex items-center mb-1">
                    <Mail className="w-4 h-4 mr-1.5" /> Email
                  </span>
                  <a href={`mailto:${selectedStaff.email}`} className="text-sm font-semibold text-blue-600 hover:underline truncate">
                    {selectedStaff.email || 'TBD'}
                  </a>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-500 flex items-center mb-1">
                    <Phone className="w-4 h-4 mr-1.5" /> Phone
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {selectedStaff.phone || 'TBD'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}