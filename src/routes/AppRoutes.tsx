import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../admin/layout/AdminLayout";

// Common components
import ScrollToTop from "../components/common/ScrollToTop";
import RouteProgress from "../components/common/RouteProgress";

// Public pages
import Home from "../pages/Home";
import About from "../pages/About";
import Academics from "../pages/Academics";
import InnovarInstitute from "../pages/InnovarInstitute";
import Courses from "../pages/Courses";
import Admissions from "../pages/Admissions";
import StudentLife from "../pages/StudentLife";
import Gallery from "../pages/Gallery";
import News from "../pages/News";
import NewsDetails from "../pages/NewsDetails";
import Contact from "../pages/Contact";
import Downloads from "../pages/Downloads";
import Application from "../pages/Application";
import NotFound from "../pages/NotFound";

// Programmes
import Programmes from "../pages/programmes/Programmes";
import ProgrammeDetails from "../pages/programmes/ProgrammeDetails";

// Admin authentication
import AdminLogin from "../admin/pages/AdminLogin";
import ProtectedAdminRoute from "../admin/layout/ProtectedAdminRoute";

// Admin dashboard
import Dashboard from "../admin/pages/Dashboard";

// Programmes administration
import ProgrammesAdmin from "../admin/pages/ProgrammesAdmin";
import AddProgramme from "../admin/pages/AddProgramme";
import EditProgramme from "../admin/pages/EditProgramme";

// News administration
import NewsAdmin from "../admin/pages/NewsAdmin";
import AddNews from "../admin/pages/AddNews";
import EditNews from "../admin/pages/EditNews";

// Other administration pages
import GalleryAdmin from "../admin/pages/GalleryAdmin";
import DownloadsAdmin from "../admin/pages/DownloadsAdmin";
import ApplicationsAdmin from "../admin/pages/ApplicationsAdmin";
import MessagesAdmin from "../admin/pages/MessagesAdmin";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <RouteProgress />

      <Routes>
        {/* =====================================
            PUBLIC WEBSITE
        ===================================== */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />

          {/* About Innovar */}
          <Route path="about" element={<About />} />

          {/* Innovar International School */}
          <Route path="academics" element={<Academics />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="student-life" element={<StudentLife />} />

          {/* Innovar Institute */}
          <Route path="institute" element={<InnovarInstitute />} />

          {/* Preserve existing institute URL */}
          <Route
            path="innovar-institute"
            element={<Navigate to="/institute" replace />}
          />

          {/* Courses and programmes */}
          <Route path="courses" element={<Courses />} />
          <Route path="programmes" element={<Programmes />} />
          <Route path="programmes/:slug" element={<ProgrammeDetails />} />

          {/* News and events */}
          <Route path="news" element={<News />} />
          <Route path="news/:slug" element={<NewsDetails />} />

          {/* Gallery */}
          <Route path="gallery" element={<Gallery />} />

          {/* Downloads */}
          <Route path="downloads" element={<Downloads />} />

          {/* Applications */}
          <Route path="apply" element={<Application />} />

          {/* Contact */}
          <Route path="contact" element={<Contact />} />

          {/* Public 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* =====================================
            ADMIN LOGIN
        ===================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* =====================================
            PROTECTED ADMINISTRATION
        ===================================== */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Programmes */}
            <Route path="programmes" element={<ProgrammesAdmin />} />
            <Route path="programmes/add" element={<AddProgramme />} />
            <Route path="programmes/edit/:id" element={<EditProgramme />} />

            {/* News and events */}
            <Route path="news" element={<NewsAdmin />} />
            <Route path="news/add" element={<AddNews />} />
            <Route path="news/edit/:id" element={<EditNews />} />

            {/* Gallery */}
            <Route path="gallery" element={<GalleryAdmin />} />

            {/* Downloads */}
            <Route path="downloads" element={<DownloadsAdmin />} />

            {/* Applications */}
            <Route path="applications" element={<ApplicationsAdmin />} />

            {/* Contact messages */}
            <Route path="messages" element={<MessagesAdmin />} />

            {/* Unknown admin route */}
            <Route
              path="*"
              element={<Navigate to="/admin/dashboard" replace />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
