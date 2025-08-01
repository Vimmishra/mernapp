import React from "react";
import Plans from "@/components/plan";

const Plan = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 tracking-wide text-pink-500 animate-pulse">
          Choose Your Plan
        </h1>

        <p className="text-gray-300 mb-12 text-lg sm:text-xl">
          Unlock unlimited access to premium movies, features & community tools by subscribing to a plan below.
        </p>

        <div className="bg-zinc-900 bg-opacity-60 p-6 rounded-2xl shadow-lg backdrop-blur-md">
          <Plans />
        </div>
      </div>
    </div>
  );
};

export default Plan;
