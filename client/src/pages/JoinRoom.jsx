import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";
import { Loader, LogIn, Key, User } from "lucide-react";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [hasActivePlan, setHasActivePlan] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const checkPlan = async () => {
      try {
        if (!user?.id) return setHasActivePlan(false);
        const res = await axiosInstance.get(`/api/payment/user-plan/${user.id}`);
        const plan = res.data?.plan;

        if (plan && new Date(plan.expiryDate) > new Date()) {
          setHasActivePlan(true);
        } else {
          setHasActivePlan(false);
        }
      } catch (err) {
        console.error("Failed to fetch user plan", err);
        setHasActivePlan(false);
      }
    };

    checkPlan();
  }, [user]);

  const handleJoin = () => {
    if (!roomId.trim() || !name.trim()) return;
    localStorage.setItem("user", JSON.stringify({ name: name.trim() }));
    navigate(`/watch/${roomId}`);
  };

  if (hasActivePlan === null) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-black">
        <Loader className="animate-spin text-pink-500 w-8 h-8 mb-2" />
        <p className="text-sm text-zinc-400">Checking your subscription...</p>
      </div>
    );
  }

  return (
    <>
      {hasActivePlan ? (
        <div className="flex flex-col items-center justify-center h-screen px-4 bg-gradient-to-br from-zinc-900 to-zinc-800">
          <h1 className="text-4xl font-extrabold text-white mb-8">🎉 Join Watch Party</h1>

          <div className="space-y-4 w-full max-w-sm">
            <div className="relative">
              <User className="absolute left-3 top-3 text-zinc-400" size={18} />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
              />
            </div>

            <div className="relative">
              <Key className="absolute left-3 top-3 text-zinc-400" size={18} />
              <input
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter Room ID"
              />
            </div>

            <button
              onClick={handleJoin}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              <LogIn size={18} />
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <Dialog open={true}>
          <DialogContent className="bg-zinc-900 border-pink-600 border-2 shadow-2xl text-white max-w-md mx-auto rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-pink-500 font-semibold text-center">
                🔒 Premium Access Required
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4 text-center">
              <p className="text-zinc-300">
                You need an active subscription plan to join a watch party.
              </p>
              <button
                onClick={() => navigate("/plans")}
                className="bg-pink-600 px-5 py-2 rounded-lg text-white hover:bg-pink-700 transition shadow-md"
              >
                View Plans
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default JoinRoom;
