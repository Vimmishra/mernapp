import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  BadgeDollarSign,
  CalendarDays,
  Clock,
  FileWarning,
  PackageCheck,
  PlusCircle,
  LogIn,
  DoorOpen,
  LogOut,
  MoreVertical,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosInstance from "@/api/axiosInstance";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prevScrollY = useRef(0);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNavbar(prevScrollY.current > currentScrollY || currentScrollY < 10);
      prevScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPlan = async () => {
      if (user?.id) {
        try {
          const res = await axiosInstance.get(`/api/payment/user-plan/${user.id}`);
          const data = res.data;
          if (
            data.plan &&
            data.plan.name &&
            data.plan.purchaseDate &&
            !isNaN(new Date(data.plan.purchaseDate).getTime()) &&
            data.plan.expiryDate &&
            !isNaN(new Date(data.plan.expiryDate).getTime())
          ) {
            setUserPlan(data.plan);
          } else {
            setUserPlan(null);
          }
        } catch (err) {
          console.error("❌ Failed to fetch user plan", err);
          setUserPlan(null);
        }
      }
    };
    fetchPlan();
  }, [user]);

  const getInitial = (name) => name?.charAt(0)?.toUpperCase();
  const isActive = (path) => location.pathname === path;
  const hasValidPlan =
    userPlan &&
    new Date(userPlan.expiryDate).getTime() > new Date().getTime();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      } bg-black bg-opacity-90 backdrop-blur-md shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img
            src="/iconscout.png"
            alt="Logo"
            className="w-10 h-10 object-contain transition-transform group-hover:scale-110"
          />
          <span className="text-3xl font-extrabold text-red-600 tracking-wide group-hover:text-white transition">
            MVerse
          </span>
        </Link>

        {/* Right Side Nav */}
        <div className="flex items-center space-x-4 sm:space-x-6">
          {/* Community link (visible on md+) */}
          <Link
            to="/community"
            className={`hidden sm:block text-white hover:text-red-500 transition font-medium ${
              isActive("/community") ? "underline underline-offset-4 text-red-500" : ""
            }`}
          >
            Community
          </Link>

          {/* Search */}
          <button
            onClick={() => navigate("/search")}
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Search"
          >
            <Search className="w-6 h-6" />
          </button>

          {/* Mobile menu toggle (smaller screens) */}
          {user && (
            <div className="relative sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-white/10"
              >
                <MoreVertical className="w-6 h-6 text-white" />
              </button>
              {mobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-[#1c1c1c] text-white rounded-lg shadow-lg z-50 py-2 space-y-1 border border-gray-700">
                  <Link
                    to="/community"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-800 transition"
                  >
                    Community
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* User Avatar & Dialog */}
          {user && (
            <Dialog>
              <div className="relative group cursor-pointer" title={user.name}>
                <DialogTrigger asChild>
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full shadow-md ${
                      hasValidPlan ? "bg-yellow-500" : "bg-red-600"
                    } text-white text-sm font-bold border-2 border-white/10`}
                  >
                    {getInitial(user.name)}
                  </div>
                </DialogTrigger>

                {/* Dropdown for md+ */}
                <div className="hidden sm:block absolute right-0 mt-0 w-44 bg-[#1c1c1c]/90 backdrop-blur border border-gray-700 text-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-300 z-50 p-2 space-y-1">
                  <button
                    onClick={() => navigate("/create-room")}
                    className="flex items-center text-black hover:text-white gap-2 w-full px-3 py-2 hover:bg-gray-800/80 rounded-md transition"
                  >
                    <PlusCircle className="w-4 h-4 text-green-400" />
                    Create Room
                  </button>
                  <button
                    onClick={() => navigate("/join-room")}
                    className="flex items-center gap-2 w-full text-black px-3 py-2 hover:text-white hover:bg-gray-800/80 rounded-md transition"
                  >
                    <DoorOpen className="w-4 h-4 text-indigo-400" />
                    Join Room
                  </button>
                </div>
              </div>

              {/* Subscription Dialog */}
              <DialogContent className="bg-gray-900 text-white border border-gray-700 shadow-2xl rounded-xl">
                <DialogHeader>
                  <DialogTitle className="text-red-500 text-xl flex items-center gap-2">
                    <PackageCheck className="w-5 h-5" />
                    Subscription Info
                  </DialogTitle>
                </DialogHeader>

                {hasValidPlan ? (
                  <div className="space-y-4 mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <BadgeDollarSign className="text-green-400 w-4 h-4" />
                      <span className="font-semibold">Plan:</span> {userPlan.name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="text-yellow-300 w-4 h-4" />
                      <span className="font-semibold">Price:</span> ${userPlan.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-blue-400 w-4 h-4" />
                      <span className="font-semibold">Buy Date:</span>{" "}
                      {new Date(userPlan.purchaseDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-pink-400 w-4 h-4" />
                      <span className="font-semibold">Expires On:</span>{" "}
                      {new Date(userPlan.expiryDate).toLocaleDateString()}
                      {(() => {
                        const today = new Date();
                        const expiryDate = new Date(userPlan.expiryDate);
                        const timeDiff = expiryDate.getTime() - today.getTime();
                        const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
                        if (daysLeft <= 10 && daysLeft > 0) {
                          return (
                            <span className="text-red-500 font-medium ml-2">
                              ({daysLeft} day{daysLeft > 1 ? "s" : ""} left)
                            </span>
                          );
                        } else if (daysLeft <= 0) {
                          return (
                            <span className="text-red-600 font-medium ml-2">(Expired)</span>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="text-center mt-4">
                    <FileWarning className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">
                      You haven't purchased any plan yet.
                    </p>
                    <button
                      onClick={() => navigate("/plans")}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
                    >
                      Buy a Plan
                    </button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}

          {/* Desktop Logout Button */}
          {user && (
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}

          {/* Login (if not authenticated) */}
          {!user && (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 transition"
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
