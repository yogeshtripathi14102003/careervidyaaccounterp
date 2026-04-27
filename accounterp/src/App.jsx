import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';

import Header from './layout/Header';
import Footer from './layout/Footer';

import Home from './features/common/Home';
import Contact from './features/common/contact';
import LoginPage from './features/auth/LoginPage';
import Dashboard from './features/admin/Dashboard';
import DashboardLayout from './features/counselor/DashboardLayout';
import Signup from './features/auth/Signup';
import ForgotPassword from './features/auth/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Cpage from './features/admin/Cpage';
import AllStudents from './features/admin/getallstudent';
import AllCounselors from './features/admin/Getallcounslour';
import TransferStudent from './features/admin/TransferStudent';
import Getallstudents from "./features/counselor/Getallstudents";

import Getallmainstudent from "./features/admin/getallmainstudent";
import LeadAdmission from "./features/admin/leadadminsion";
import UploadExcelPage from "./features/admin/uploadmainmis";
import CreateSubAdmin from "./features/admin/CreateSubAdmin";
import Admissions from "./features/counselor/Admission";
// ✅ Layout Wrapper (FINAL FIX)
const LayoutWrapper = ({ children }) => {
  const location = useLocation();

  // 🔥 Hide header/footer for ALL admin & counselor routes
  const shouldHide =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/counselor");

  return (
    <>
      {!shouldHide && <Header />}

      {children}

      {!shouldHide && <Footer />}
    </>
  );
};


function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />

          {/* Counselor Dashboard */}
          <Route
            path="/counselor/DashboardLayout"
            element={
              <ProtectedRoute allowedRoles={["counsellor"]}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="getallstudents" element={< Getallstudents />} /> 
            <Route path="admissions" element={<Admissions />} /> 
            </Route>

          {/* Admin Dashboard (Nested Routes) */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            {/* 🔥 Nested Pages */}
            <Route path="cpage" element={<Cpage />} />
              <Route path="getallstudents" element={<AllStudents />} />
              <Route path="getallcounslour" element={< AllCounselors />} />
              <Route path="TransferStudent" element={<TransferStudent />} />
              <Route path="getallmainstudent" element={<Getallmainstudent />} />
              <Route path="lead-admission" element={<LeadAdmission />} />
              <Route path="uploadallmis" element={<UploadExcelPage />} />
              <Route path="create-subadmin" element={<CreateSubAdmin />} />
             
           
          </Route>

        </Routes>
      </LayoutWrapper>
    </BrowserRouter>
  );
}

export default App;