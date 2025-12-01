import ProtectedRoute from "./pages/ProtectedRoute";
import { useState,useEffect } from 'react' 
import Signup from "./pages/Signup"
 import Settings from "./pages/Settings"
  import AdminSignup from "./pages/AdminSignup"
   import Problems from "./pages/Problems"
    import Login from "./pages/Login" 
    import Navbar from "./pages/Navbar" 
    import CreateProblem from "./pages/CreateProblem" 
    import UpdateProblem from "./pages/UpdateProblem" 
    import DeleteProblem from "./pages/DeleteProblem"
     import ViewProblem from "./pages/viewproblem/ViewProblem" 
     import ViewCode from "./pages/viewproblem/ViewCode" 
     
     import Update from "./pages/Update" 
     import Profile from "./pages/Profile" 
     import './App.css' 
     import {Routes,Route} from "react-router" 
     
function App() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <Routes>
        {/* Public Routes */}
          <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/signup" element={<AdminSignup />} />

        {/* Protected Routes */}
        <Route
          path="/problems"
          element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute  role="admin">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update"
          element={
            <ProtectedRoute>
              <UpdateProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update/:id"
          element={
            <ProtectedRoute>
              <Update />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/fetchProblem/:id/viewcode/:submissionId"
          element={
            <ProtectedRoute>
              <ViewCode />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delete"
          element={
            <ProtectedRoute>
              <DeleteProblem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/problems/fetchProblem/:id"
          element={
            <ProtectedRoute>
              <ViewProblem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
