import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/api/axiosInstance";

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [currentPlanPrice, setCurrentPlanPrice] = useState(0); 
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.id;

  
useEffect(() => {
  const fetchPlansAndUserPlan = async () => {
    try {
      console.log("👤 Current User:", user);
      console.log("🆔 Extracted userId:", userId);

      // ✅ Fetch all plans
      const plansRes = await axiosInstance.get("/api/payment/plans");
      const allPlans = plansRes.data;
      console.log("📄 All Plans:", allPlans);

      // ✅ Fetch user plan
      const userPlanRes = await axiosInstance.get(`/api/payment/user-plan/${userId}`);
      const userPlanData = userPlanRes.data;
      console.log("📦 User Plan:", userPlanData);

      const userPlanPrice = userPlanData?.plan?.price || 0;
      setCurrentPlanPrice(userPlanPrice);

      // ✅ Filter only higher-priced plans
      const filteredPlans = allPlans.filter((plan) => plan.price > userPlanPrice);

      console.log("✅ Filtered Plans (greater than current):", filteredPlans);
      setPlans(filteredPlans);
    } catch (err) {
      console.error("❌ Error loading plans or user plan:", err);
    }
  };

  if (userId) {
    fetchPlansAndUserPlan();
  }
}, [userId]);




  const loadPayPal = (plan) => {
    if (document.getElementById(`paypal-script-${plan._id}`)) return;

    const script = document.createElement("script");
    script.id = `paypal-script-${plan._id}`;
    script.src =
      "https://www.paypal.com/sdk/js?client-id=AdIDtynWvxkp65A9SNYBcoqJ2-wNM1XI52NSPrl_LeEIARbid8S00mMG93HQnzhNGEYV4u3GJrnIG2wk&currency=USD";

    script.onload = () => {
      window.paypal
        .Buttons({
          createOrder: (data, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: { value: plan.price.toString() },
                },
              ],
            }),
          onApprove: (data, actions) =>
            actions.order.capture().then(() => {
              fetch(`${import.meta.env.VITE_API_BASE_URL}/api/payment/capture-payment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, planId: plan._id }),
              })
                .then((res) => res.json())
                .then(() => navigate("/success"))
                .catch((err) =>
                  alert("Payment succeeded but saving failed: " + err.message)
                );
            }),
          onError: (err) => console.error("❌ PayPal error:", err),
        })
        .render(`#paypal-button-${plan._id}`);
    };

    script.onerror = (err) =>
      console.error("❌ Failed to load PayPal script:", err);

    document.body.appendChild(script);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upgrade Your Subscription</h2>
      {plans.length === 0 ? (
        <p className="text-gray-600">You already have the highest plan available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="border rounded shadow-md p-4 text-center">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-gray-700 mb-2">${plan.price}</p>
              <p className="text-sm text-gray-500 mb-4">
                {plan.durationInDays} days access
              </p>
              <div id={`paypal-button-${plan._id}`} className="mb-2" />
              <button
                onClick={() => loadPayPal(plan)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Pay Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Plans;
