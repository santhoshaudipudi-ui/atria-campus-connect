import React, { useState } from 'react';
import { Send, CheckCircle, ShieldAlert, Upload } from 'lucide-react';

export default function StudentHODForm({ onSubmitRequest }) {
  const [formData, setFormData] = useState({
    studentName: '',
    usn: '',
    department: 'CSE',
    year: '1st Year',
    semester: '1st Sem',
    reason: '',
    idCardFile: null,
    docFile: null
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.idCardFile) {
      alert('Error: You must upload your Student ID Card to submit this request.');
      return;
    }
    onSubmitRequest(formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm text-center">
        <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-800">Request Submitted Successfully</h3>
        <p className="text-slate-600 mt-2">
          Your appointment request has been sent. You can track the HOD's response below in the history section.
        </p>
        <button
          onClick={() => { setSubmitted(false); setFormData({ ...formData, reason: '', idCardFile: null, docFile: null }); }}
          className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-lg font-semibold text-slate-800">Request HOD Appointment</h3>
        <p className="text-sm text-slate-500">Fill in the details below to schedule a meeting with your Head of Department.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={formData.studentName}
            onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            placeholder="e.g. Santhosh Reddy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            USN <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={formData.usn}
            onChange={(e) => setFormData({ ...formData, usn: e.target.value.toUpperCase() })}
            placeholder="e.g. 1AT23CS001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          >
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="ME">Mechanical</option>
            <option value="CIVIL">Civil</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Year <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Semester <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={formData.semester}
            onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
          >
            <option value="1st Sem">1st Sem</option>
            <option value="2nd Sem">2nd Sem</option>
            <option value="3rd Sem">3rd Sem</option>
            <option value="4th Sem">4th Sem</option>
            <option value="5th Sem">5th Sem</option>
            <option value="6th Sem">6th Sem</option>
            <option value="7th Sem">7th Sem</option>
            <option value="8th Sem">8th Sem</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Reason for Meeting <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={3}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          placeholder="Briefly state why you need to meet the HOD..."
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-medium text-sm border-b border-slate-200 pb-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <span>Verification & Documents</span>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            Upload Student ID Card <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-slate-400" />
            <input
              type="file"
              required
              accept="image/*,.pdf"
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-900 file:text-white hover:file:bg-slate-800"
              onChange={(e) => setFormData({ ...formData, idCardFile: e.target.files[0] })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Additional Documents <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="flex items-center space-x-3">
            <Upload className="w-5 h-5 text-slate-400" />
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-slate-200 file:text-slate-800 hover:file:bg-slate-300"
              onChange={(e) => setFormData({ ...formData, docFile: e.target.files[0] })}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-2.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition flex items-center justify-center space-x-2"
      >
        <Send className="w-4 h-4" />
        <span>Submit Request to HOD</span>
      </button>
    </form>
  );
}