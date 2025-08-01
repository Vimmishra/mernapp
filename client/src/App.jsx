import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import UploadMovie from "./pages/admin/UploadMovie";
import UploadSeries from "./pages/admin/UploadSeries";
import Layout from "./components/common/LayOut";
import MovieDetails from "./pages/MovieDetails";
import CommunityNews from "./pages/communityPage";
import SeriesDetails from "./pages/SeriesDetail";
import SearchPage from "./pages/search";
import Success from "./pages/success";
import AllMovies from "./pages/Allmovies";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";
import WatchPartyRoom from "./pages/WatchPartyRoom";
import ViewMorePage from "./pages/viewMore";
import Plans from "./pages/plans";
import GetAllRecommendedMoviesList from "./pages/view-all-recommended-movies";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Protected User Routes (with layout) */}
        <Route
          element={
            <ProtectedRoute role="user">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<UserDashboard />} />
          <Route path="/success" element={<Success />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/community" element={<CommunityNews />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/movies" element={<AllMovies />} />
          <Route path="/plans" element={<Plans />} />
           <Route path="/view-more/:category" element={<ViewMorePage/>} />
           <Route path= "/recommended-movies" element={<GetAllRecommendedMoviesList/>}/>



<Route path="/create-room" element={<CreateRoom />} />
<Route path="/join-room" element={<JoinRoom />} />
<Route path="/watch/:roomId" element={<WatchPartyRoom />} />

        </Route>

        {/* Protected Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadMovie"
          element={
            <ProtectedRoute role="admin">
              <UploadMovie />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadseries"
          element={
            <ProtectedRoute role="admin">
              <UploadSeries />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
