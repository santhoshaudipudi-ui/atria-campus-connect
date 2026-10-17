import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ShieldCheck, MessageSquare } from 'lucide-react';

export default function HODDashboard({ requests, onUpdateStatus }) {
  const [replyText, setReplyText] = useState({});

  const handleQuickReply = (reqId, quickMessage) => {
    onUpdateStatus(reqId, 'Responded', quickMessage);
  };

  const handleCustomSubmit = (reqId) => {
    if (replyText[reqId]) {
      onUpdateStatus(reqId, 'Responded', replyText[reqId]);
      setReplyText({ ...replyText, [reqId]: '' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">HOD Management Portal</h3>
          <p className="text-xs text-slate-500">CSE Department — Atria Institute of Technology</p>
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
          {requests.length} Pending Requests
        </span>
      </div>

      <div className="space-y-4">
        {requests.map((req) => (
          <div key={req.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-slate-900">{req.studentName}</h4>
                  <span className="text-xs text-slate-500">({req.usn})</span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded">
                    {req.department} - {req.semester}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">Submitted at {req.timestamp}</p>
              </div>

              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                req.urgency === 'Urgent' ? 'bg-red-100 text-red-800' :
                req.urgency === 'Signature Required' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {req.urgency}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 uppercase">Reason for Appointment</p>
              <p className="text-sm text-slate-800 mt-1">{req.reason}</p>
            </div>

            <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 p-2 rounded">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Student ID Card Verified</span>
            </div>

            {/* Response Section */}
            {req.hodReply ? (
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700">Sent Response: </span>
                <span className="text-slate-600">{req.hodReply}</span>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <p className="text-xs font-medium text-slate-600">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickReply(req.id, "Meet me immediately in cabin.")}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded transition"
                  >
                    Come Now
                  </button>
                  <button
                    onClick={() => handleQuickReply(req.id, "Please wait 20 minutes outside room 204.")}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded transition"
                  >
                    Wait 20 Mins
                  </button>
                  <button
                    onClick={() => handleQuickReply(req.id, "Meet me post-lunch between 2:30 PM - 3:00 PM.")}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded transition"
                  >
                    Post Lunch
                  </button>
                  <button
                    onClick={() => handleQuickReply(req.id, "Busy today with meetings. Visit tomorrow at 10:00 AM.")}
                    className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-medium rounded transition"
                  >
                    Visit Tomorrow
                  </button>
                </div>

                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Write a custom response..."
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-slate-500"
                    value={replyText[req.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [req.id]: e.target.value })}
                  />
                  <button
                    onClick={() => handleCustomSubmit(req.id)}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}