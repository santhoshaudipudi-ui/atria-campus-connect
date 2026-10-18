import React, { useState } from 'react';
import { LayoutDashboard, Clock, CheckCircle, Search, Filter, ExternalLink, User, MessageSquare, Send, Mail, MapPin, Building2, BookOpen, Briefcase, Lightbulb, Award } from 'lucide-react';

export default function HODDashboard({ requests, onUpdateStatus }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyTexts, setReplyTexts] = useState({});

  // Analytics Calculations
  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const resolvedCount = requests.filter(r => r.status !== 'Pending').length;
  const totalCount = requests.length;

  // Filter and Search Logic
  const filteredRequests = requests.filter(req => {
    const matchesFilter = filterStatus === 'All' || 
                         (filterStatus === 'Pending' && req.status === 'Pending') ||
                         (filterStatus === 'Resolved' && req.status !== 'Pending');
    
    const matchesSearch = (req.usn && req.usn.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (req.email && req.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (req.reason && req.reason.toLowerCase().includes(searchQuery.toLowerCase()));
                          
    return matchesFilter && matchesSearch;
  });

  const handleReplyChange = (id, text) => {
    setReplyTexts({ ...replyTexts, [id]: text });
  };

  const submitStatusUpdate = (id, newStatus) => {
    const reply = replyTexts[id] || (newStatus === 'Approved' ? 'Request Approved.' : 'Request Denied.');
    onUpdateStatus(id, newStatus, reply);
    
    // Clear the input after submitting
    const updatedReplies = { ...replyTexts };
    delete updatedReplies[id];
    setReplyTexts(updatedReplies);
  };

  const insertQuickReply = (id, template) => {
    setReplyTexts({ ...replyTexts, [id]: template });
  };

  return (
    <div className="space-y-6">
      
      {/* HOD Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50 pointer-events-none"></div>
        
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center border-4 border-white shadow-md shrink-0 relative z-10 overflow-hidden">
          <User className="w-12 h-12 text-slate-400" />
        </div>
        
        <div className="flex-grow text-center md:text-left relative z-10 w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900">DR DEVI KANNAN</h1>
              <p className="text-slate-600 font-semibold mt-1">B.E., M.Tech, Ph.D</p>
              <p className="text-blue-700 font-bold mt-1 text-sm tracking-wide uppercase">
                HOD | Computer Science & Engineering
              </p>
            </div>
            <a 
              href="https://scholar.google.com/citations?user=Hvya1EkAAAAJ&hl=en&authuser=2" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md hover:bg-blue-100 transition shrink-0 mx-auto md:mx-0"
            >
              Google Scholar Profile <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-slate-600 font-medium">
            <span className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-slate-400" /> 
              Devi.kannan@atria.edu
            </span>
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" /> 
              Room No 309
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center md:justify-start">
                <BookOpen className="w-3 h-3 mr-1" /> Specialization
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">NLP, AI/ML, Deep Learning</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center md:justify-start">
                <Briefcase className="w-3 h-3 mr-1" /> Experience
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">21 Years (17 Acad / 4 Ind)</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center md:justify-start">
                <Lightbulb className="w-3 h-3 mr-1" /> Projects Guided
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">5</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold flex items-center justify-center md:justify-start">
                <Award className="w-3 h-3 mr-1" /> Patents
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-1">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Pending</p>
            <p className="text-3xl font-bold text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="p-3 bg-amber-50 rounded-full"><Clock className="w-8 h-8 text-amber-500" /></div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Resolved</p>
            <p className="text-3xl font-bold text-emerald-600 mt-1">{resolvedCount}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full"><CheckCircle className="w-8 h-8 text-emerald-500" /></div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Requests</p>
            <p className="text-3xl font-bold text-slate-800 mt-1">{totalCount}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-full"><LayoutDashboard className="w-8 h-8 text-slate-500" /></div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text" 
            placeholder="Search by student USN, Email, or Reason..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          {['All', 'Pending', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition flex items-center ${
                filterStatus === status 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Filter className="w-4 h-4 mr-2" />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Feed */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200 border-dashed">
            <p className="text-slate-500">No requests found matching your filters.</p>
          </div>
        ) : (
          filteredRequests.map(req => (
            <div key={req.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
              
              {/* Left Side: Student Info */}
              <div className="p-6 md:w-1/3 bg-slate-50 border-r border-slate-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-full">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{req.usn || 'USN Not Provided'}</p>
                    <p className="text-xs text-slate-500">{req.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date:</span>
                    <span className="font-medium text-slate-800">{req.timestamp.split(' ')[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time:</span>
                    <span className="font-medium text-slate-800">{req.timestamp.split(' ').slice(1).join(' ')}</span>
                  </div>
                  
                  {/* ID Card Display/Link */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Attached ID Card</span>
                    {req.idCardUrl ? (
                      <a href={req.idCardUrl} target="_blank" rel="noreferrer" className="mt-1 flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition">
                        <ExternalLink className="w-4 h-4 mr-1" /> View Document
                      </a>
                    ) : (
                      <p className="text-sm text-slate-700 mt-1 flex items-center">
                         {req.idCardFileName} 
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Request Details & Actions */}
              <div className="p-6 md:w-2/3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-slate-400" />
                      Request Reason
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                      req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    {req.reason}
                  </p>
                </div>

                {/* HOD Action Area */}
                {req.status === 'Pending' ? (
                  <div className="mt-6 space-y-3">
                    <div className="flex space-x-2 mb-2">
                      <button onClick={() => insertQuickReply(req.id, 'Approved. Please come to my cabin at 2:00 PM.')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition">Meet at 2 PM</button>
                      <button onClick={() => insertQuickReply(req.id, 'Approved. Your request has been forwarded.')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition">Forwarded</button>
                      <button onClick={() => insertQuickReply(req.id, 'Denied. Please submit proper documentation.')} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition">Need Docs</button>
                    </div>
                    
                    <textarea 
                      placeholder="Type your official response to the student here..."
                      className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                      rows="2"
                      value={replyTexts[req.id] || ''}
                      onChange={(e) => handleReplyChange(req.id, e.target.value)}
                    ></textarea>
                    
                    <div className="flex justify-end space-x-3">
                      <button 
                        onClick={() => submitStatusUpdate(req.id, 'Rejected')}
                        className="px-4 py-2 bg-rose-50 text-rose-700 font-medium rounded-md hover:bg-rose-100 transition"
                      >
                        Reject
                      </button>
                      <button 
                        onClick={() => submitStatusUpdate(req.id, 'Approved')}
                        className="flex items-center px-4 py-2 bg-slate-900 text-white font-medium rounded-md hover:bg-slate-800 transition"
                      >
                        <Send className="w-4 h-4 mr-2" /> Approve & Send
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Your Official Response</span>
                    <p className={`mt-1 font-medium ${req.status === 'Approved' ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {req.hodReply}
                    </p>
                  </div>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}