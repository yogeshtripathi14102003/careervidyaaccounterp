import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, MessageSquare, Menu, X, 
  Bell, UserCircle, LogOut, Calendar, ClipboardList 
} from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import './dashboard.css'; 

const CounselorDashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ name: "Counselor", role: "counselor" });
  
  const navigate = useNavigate();
  const location = useLocation();

  // Dashboard Home check (URL matching App.js)
  const isDashboardHome = location.pathname === "/counselor/DashboardLayout";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("userRole");

    if (!token) {
      navigate("/login");
    } else {
      setUser({
        name: localStorage.getItem("userName") || "Counselor Name",
        role: storedRole || "counselor"
      });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout failed");
    } finally {
      localStorage.clear();
      navigate("/login");
    }
  };

  
  // Counselor Specific Menu Items
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/counselor/DashboardLayout" },
    { icon: <Users size={20} />, label: "getallstudents", path: "/counselor/DashboardLayout/Getallstudents" },
    { icon: <ClipboardList size={20} />, label: "admission", path: "/counselor/DashboardLayout/admissions" },
    { icon: <Calendar size={20} />, label: "Follow Ups", path: "/counselor/DashboardLayout/schedule" },
    { icon: <MessageSquare size={20} />, label: "Chats", path: "/counselor/DashboardLayout/messages" },
  ];

  return (
    <div className={`dashboard-container ${!isSidebarOpen ? 'sidebar-collapsed' : ''}`}>
      
      {/* --- SIDEBAR --- */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">C</div>
            {isSidebarOpen && <span className="logo-text">CareerVidya</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              <div className="nav-icon">{item.icon}</div>
              {isSidebarOpen && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </div>
      </aside>

      {/* --- MAIN SECTION --- */}
      <div className="main-section">
        
        {/* HEADER */}
        <header className="top-navbar">
          <div className="header-left">
            <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
              {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className="page-title">Counselor Portal</h2>
          </div>

          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="profile-pill">
              <UserCircle size={24} />
              <div className="profile-info">
                <span className="user-name">{user.name}</span>
                <span className="user-status">Active Counselor</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="content-area">
          
          {/* Welcome Stats - Only on /counselor/DashboardLayout */}
          {isDashboardHome && (
            <div className="dashboard-home-content animate-in">
              <div className="content-header">
                <h1>Hi {user.name.split(' ')[0]}, Good Day! 🌟</h1>
                <p>Track your students and manage admissions effectively.</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-icon"><Users size={24} /></div>
                  <div className="stat-info">
                    <span>Assigned Students</span>
                    <h3>12</h3>
                    <p className="trend">+2 this week</p>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-icon"><ClipboardList size={24} /></div>
                  <div className="stat-info">
                    <span>Pending Leads</span>
                    <h3>08</h3>
                    <p className="trend">Action required</p>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon"><Calendar size={24} /></div>
                  <div className="stat-info">
                    <span>Follow-ups Today</span>
                    <h3>04</h3>
                    <p className="trend">Check schedule</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Child Pages Load Here */}
          <div className="outlet-container">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default CounselorDashboard;