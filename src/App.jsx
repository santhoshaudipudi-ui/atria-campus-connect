import React, { useState, useEffect } from 'react';
import { UserCheck, Search, Shield, LogOut, GraduationCap, ArrowRight, ArrowLeft, Mail, Lock } from 'lucide-react';
import StudentHODForm from './components/StudentHODForm';
import StaffSearch from './components/StaffSearch';
import HODDashboard from './components/HODDashboard';
import { initialStaffList } from './data/mockData';

// Firebase Imports for Database and Auth (Storage removed for free tier)
import { db } from './config/firebase'; 
import { collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [view, setView] = useState('LANDING'); 
  const [studentTab, setStudentTab] = useState('MENU'); 
  
  // Student Auth State
  const [isSignUp, setIsSignUp] = useState(false); 
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // HOD Auth State
  const [hodEmail, setHodEmail] = useState('');
  const [hodPassword, setHodPassword] = useState('');
  const [hodError, setHodError] = useState('');

  const [requests, setRequests] = useState([]);
  const [staffList] = useState(initialStaffList);
  const [historySort, setHistorySort] = useState('NEWEST');

  // Initialize Firebase Auth using your existing app connection
  const auth = getAuth(db.app);

  useEffect(() => {
    const fetchCloudRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'requests'));
        const cloudRequests = [];
        querySnapshot.forEach((doc) => {
          cloudRequests.push({ id: doc.id, ...doc.data() });
        });
        setRequests(cloudRequests);
      } catch (error) {
        console.error("Error fetching requests from cloud: ", error);
      }
    };
    
    fetchCloudRequests();
  }, []);

  const handleStudentAuth = async (e) => {
    e.preventDefault();
    if (!loginEmail.toLowerCase().endsWith('@atria.edu.in')) {
      setLoginError('Access denied: You must use your official @atria.edu.in college email ID.');
      return;
    }

    try {
      if (isSignUp) {
        // Creates a real, encrypted user account in Firebase
        await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
      } else {
        // Verifies the password against the database
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      }
      setLoginError('');
      setView('STUDENT');
      setStudentTab('MENU');
    } catch (error) {
      console.error("Auth Error:", error);
      if (error.code === 'auth/email-already-in-use') {
        setLoginError('An account with this email already exists. Switch to Login.');
      } else {
        setLoginError('Invalid email or incorrect password.');
      }
    }
  };

  const handleHODAuth = async (e) => {
    e.preventDefault();
    if (!hodEmail.toLowerCase().endsWith('@atria.edu.in')) {
      setHodError('Access denied: You must use an official HOD @atria.edu.in email ID.');
      return;
    }
    
    try {
      // Verifies the HOD password securely
      await signInWithEmailAndPassword(auth, hodEmail, hodPassword);
      setHodError('');
      setView('HOD');
    } catch (error) {
      console.error("HOD Auth Error:", error);
      setHodError('Invalid HOD credentials or account does not exist.');
    }
  };

  const handleLogout = () => {
    setView('LANDING');
    setLoginEmail('');
    setLoginPassword('');
    setLoginError('');
    setHodEmail('');
    setHodPassword('');
    setHodError('');
    setIsSignUp(false);
  };

  const handleNewRequest = async (newReq) => {
    // 1. Strict USN Validation Check
    const usnRegex = /^(1AT|1TT)25CS\d+$/i;
    if (newReq.usn && !usnRegex.test(newReq.usn)) {
      alert("Invalid USN format. It must start with 1AT25CS or 1TT25CS followed by numbers (e.g., 1AT25CS001).");
      return; 
    }

    const now = new Date();
    const { idCardFile, additionalDocs, ...cleanRequestData } = newReq;

    // 2. Save only the text data to avoid the Blaze plan requirement
    const requestPayload = {
      ...cleanRequestData,
      idCardFileName: idCardFile ? idCardFile.name : 'No file uploaded',
      idCardUrl: null, // Bypassing image storage to stay on the free tier
      email: loginEmail, 
      status: 'Pending',
      timestamp: `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      rawDate: now.getTime(),
      hodReply: ''
    };

    try {
      const docRef = await addDoc(collection(db, 'requests'), requestPayload);
      setRequests([{ ...requestPayload, id: docRef.id }, ...requests]);
      alert("Request submitted successfully!");
    } catch (error) {
      console.error("Error adding document to cloud: ", error);
      alert("Failed to connect to the database. Please try again.");
    }
  };

  const handleUpdateStatus = async (id, newStatus, reply) => {
    try {
      const requestRef = doc(db, 'requests', id);
      await updateDoc(requestRef, {
        status: newStatus,
        hodReply: reply
      });
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus, hodReply: reply } : req
      ));
    } catch (error) {
      console.error("Error updating status in cloud: ", error);
      alert("Failed to save the HOD response to the database.");
    }
  };

  const myRequests = requests
    .filter(r => r.email === loginEmail)
    .sort((a, b) => historySort === 'NEWEST' ? b.rawDate - a.rawDate : a.rawDate - b.rawDate);

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-3xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex justify-center mb-2">
              <img src="/atria-logo.png" alt="Atria Institute of Technology Logo" className="h-20 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Atria Campus Connect</h1>
            <p className="text-lg text-slate-600">Academic Management & Appointment System</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <button onClick={() => setView('STUDENT_LOGIN')} className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition text-left flex flex-col h-full">
              <div className="p-3 bg-slate-100 rounded-lg w-fit group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-6">Student Portal</h2>
              <p className="text-slate-500 mt-2 flex-grow">Login with your college email to book appointments, track statuses, and locate faculty.</p>
              <div className="flex items-center text-sm font-semibold text-slate-900 mt-6 group-hover:translate-x-2 transition-transform">
                Go to Login <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>

            <button onClick={() => setView('HOD_LOGIN')} className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition text-left flex flex-col h-full">
              <div className="p-3 bg-slate-100 rounded-lg w-fit group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mt-6">HOD Login</h2>
              <p className="text-slate-500 mt-2 flex-grow">Manage student meeting requests, provide quick approvals, and update your schedule.</p>
              <div className="flex items-center text-sm font-semibold text-slate-900 mt-6 group-hover:translate-x-2 transition-transform">
                Enter Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'STUDENT_LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={() => { setView('LANDING'); setIsSignUp(false); }} className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </button>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-slate-100 rounded-full mb-4">
                <GraduationCap className="w-8 h-8 text-slate-900" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {isSignUp ? 'Create Student Account' : 'Student Portal Login'}
              </h2>
            </div>

            <form onSubmit={handleStudentAuth} className="space-y-5">
              {loginError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">{loginError}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">College Email ID</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" required placeholder="use @atria.edu.in mail id" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">{isSignUp ? 'Create a Password' : 'Password'}</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input type="password" required placeholder={isSignUp ? "Create a strong password" : "Enter your password"} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition mt-2">
                {isSignUp ? 'Sign Up & Enter Portal' : 'Login to Portal'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-600">
              {isSignUp ? "Already have an account? " : "First time here? "}
              <button onClick={() => { setIsSignUp(!isSignUp); setLoginError(''); }} className="font-semibold text-slate-900 hover:underline">
                {isSignUp ? 'Login instead' : 'Create an Account'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'HOD_LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full">
          <button onClick={() => setView('LANDING')} className="flex items-center text-sm text-slate-500 hover:text-slate-900 mb-6 transition">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </button>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg border-t-4 border-t-slate-900">
            <div className="text-center mb-8">
              <div className="inline-flex p-3 bg-slate-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-slate-900" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">HOD Dashboard Login</h2>
              <p className="text-sm text-slate-500 mt-2">Restricted access for administrative staff only.</p>
            </div>

            <form onSubmit={handleHODAuth} className="space-y-5">
              {hodError && <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">{hodError}</div>}
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Official HOD Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" required placeholder="hod@atria.edu.in" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" value={hodEmail} onChange={(e) => setHodEmail(e.target.value)} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  <input type="password" required placeholder="Enter admin password" className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-900" value={hodPassword} onChange={(e) => setHodPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800 transition mt-2">
                Access Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-1 rounded">
              <img src="/atria-logo.png" alt="Atria Logo" className="h-8 object-contain" onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Atria Campus Connect</h1>
              <p className="text-xs text-slate-400">
                {view === 'STUDENT' ? `Student Portal (${loginEmail})` : 'HOD Management Portal'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm font-medium transition">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {view === 'STUDENT' ? (
          <div>
            {studentTab === 'MENU' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-8">
                <button onClick={() => setStudentTab('HOD')} className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <UserCheck className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-6">Meet HOD</h2>
                  <p className="text-slate-500 mt-2">Request an appointment and check your status history.</p>
                </button>

                <button onClick={() => setStudentTab('STAFF')} className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left flex flex-col items-center text-center h-full">
                  <div className="p-4 bg-slate-100 rounded-full group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-6">Staff Locator</h2>
                  <p className="text-slate-500 mt-2">Find faculty members and view their availability.</p>
                </button>
              </div>
            )}

            {studentTab !== 'MENU' && (
              <button onClick={() => setStudentTab('MENU')} className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portal Menu
              </button>
            )}

            {studentTab === 'HOD' && (
              <div className="space-y-8">
                <StudentHODForm onSubmitRequest={handleNewRequest} />
                
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">My Appointment History</h3>
                      <p className="text-sm text-slate-500">Track the HOD's responses to your requests.</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-slate-600">Sort by:</span>
                      <select 
                        value={historySort}
                        onChange={(e) => setHistorySort(e.target.value)}
                        className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
                      >
                        <option value="NEWEST">Newest First</option>
                        <option value="OLDEST">Oldest First</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 pt-2">
                    {myRequests.length === 0 ? (
                      <p className="text-sm text-slate-500 italic bg-slate-50 p-4 rounded-md border border-slate-100">
                        No appointment requests found for {loginEmail}.
                      </p>
                    ) : (
                      myRequests.map((item) => (
                        <div key={item.id} className="p-4 bg-slate-50 rounded-md border border-slate-200 space-y-2">
                          <div className="flex justify-between items-center text-xs text-slate-500">
                            <span>Submitted: {item.timestamp}</span>
                            <span className="font-semibold text-slate-700 px-2 py-1 bg-white rounded border border-slate-200">{item.status}</span>
                          </div>
                          <p className="text-sm text-slate-800"><strong>Reason:</strong> {item.reason}</p>
                          <div className="p-3 bg-white border border-slate-200 rounded text-xs mt-2">
                            <span className="font-bold text-slate-700">HOD Response: </span>
                            {item.hodReply ? <span className="text-emerald-700 font-medium">{item.hodReply}</span> : <span className="text-slate-400 italic">Awaiting response from HOD office...</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {studentTab === 'STAFF' && <StaffSearch staffList={staffList} />}
          </div>
        ) : (
          <HODDashboard requests={requests} onUpdateStatus={handleUpdateStatus} />
        )}
      </main>
    </div>
  );
}