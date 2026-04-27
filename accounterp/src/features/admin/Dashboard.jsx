import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, BarChart3,
  Menu, X, Bell, UserCircle, LogOut
} from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom"; // ✅ location add
import axios from "axios";
import './dashboard.css';

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({ name: "User", role: "" });

  const navigate = useNavigate();
  const location = useLocation(); // ✅ current route

  // ✅ check dashboard home
  const isDashboardHome =
    location.pathname === "/admin/dashboard" ||
    location.pathname === "/admin/Dashboard";

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setUser({
        name: storedRole === "admin" ? "Admin Account" : "Counselor Account",
        role: storedRole
      });
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/v1/logout", {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout API failed");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      navigate("/login");
    }
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <Users size={20} />, label: "lead admission", path: "/admin/dashboard/lead-admission" },
    {icons: <Users size={20} />, label: "Upload Main MIS", path: "/admin/dashboard/uploadallmis" },
{icon: <Users size={20} />, label: "Get All Main Students", path: "/admin/dashboard/getallmainstudent" },
    { icon: <Users size={20} />, label: "Add Student",path: "/admin/dashboard/cpage"  },
    { icon: <Users size={20} />, label: "Get All Counselors", path: "/admin/dashboard/getallcounslour" },
    { icon: <BarChart3 size={20} />, label: "Get All Students", path: "/admin/dashboard/getallstudents" },
    { icon: <Users size={20} />, label: "Create Sub Admin", path: "/admin/dashboard/create-subadmin" },


    {icons: <BarChart3 size={20} />, label: "TransferStudent", path: "/admin/dashboard/TransferStudent" },
   
  ];

  return (
    <div className="dashboard-container">

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">{user.role === 'admin' ? 'A' : 'C'}</div>
            {isSidebarOpen && <span className="logo-text">Careervidya</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="nav-item"
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer" }}
            >
              {item.icon}
              {isSidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <LogOut size={20} />
          {isSidebarOpen && <span>Logout</span>}
        </div>
      </aside>

      {/* Main Section */}
      <div className="main-section">

        {/* Header */}
        <header className="top-navbar">
          <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="header-actions">
            <button className="icon-btn"><Bell size={20} /></button>
            <div className="profile-pill">
              <UserCircle size={24} />
              <span style={{ textTransform: 'capitalize' }}>{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="content-area">

          {/* ✅ ONLY SHOW ON DASHBOARD HOME */}
          {isDashboardHome && (
            <>
              <div className="content-header">
                <h1>Welcome Back, {user.role}!</h1>
                <p>
                  Managing the {user.role === 'admin'
                    ? 'entire portal'
                    : 'counseling sessions'} today.
                </p>
              </div>

              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-info">
                    <span>Total Leads</span>
                    <h3>540</h3>
                  </div>
                </div>

                <div className="stat-card green">
                  <div className="stat-info">
                    <span>Logged In As</span>
                    <h3 style={{ fontSize: '1.2rem' }}>{user.role}</h3>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="stat-card orange">
                    <div className="stat-info">
                      <span>Revenue</span>
                      <h3>₹45,000</h3>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ✅ CHILD PAGES */}
          <div className="main-children-content">
            <Outlet />
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;