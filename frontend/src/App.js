import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import api, { setAuthToken } from "./api";
import CompanyMarketplace from "./components/CompanyMarketplace";
import ChatModal from "./components/ChatModal";
import FarmerDashboard from "./components/FarmerDashboard";
import Footer from "./components/Footer";
import MarketGraph from "./components/MarketGraph";
import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import PriceComparison from "./components/PriceComparison";
import ProtectedRoute from "./components/ProtectedRoute";
import TransportHub from "./components/TransportHub";
import UserProfile from "./components/UserProfile";
import Login from "./pages/Login";
import Register from "./pages/Register";

const TOKEN_KEY = "farmer_market_token";
const LANGUAGE_KEY = "farmer_market_language";

const COPY = {
  en: {
    navbar: {
      home: "Home",
      transportHub: "Transport Hub",
      login: "Login",
      register: "Register",
      farmerDashboard: "Farmer Dashboard",
      buyerRequests: "Buyer Requests",
      messages: "Messages",
      marketplace: "Marketplace",
      myDeals: "My Deals",
      logout: "Logout",
      brandTitle: "Zero Middleman Agri Marketplace",
      brandSubtitle: "Direct Farmer-to-Factory | Transparent Trade",
      english: "English",
      hindi: "Hindi",
    },
    home: {
      badge: "Zero Middleman",
      title: "Direct Farmer-to-Factory Marketplace",
      text: "Farmers sell directly to companies, verified buyers source faster, and every deal stays transparent.",
      stats: [
        { value: "0%", label: "Commission" },
        { value: "100%", label: "Direct Access" },
        { value: "24x7", label: "Marketplace" },
      ],
      verifiedBadge: "No Middleman Verified",
      verifiedTitle: "Farmers and crop supply in one direct marketplace",
      verifiedText: "Fresh produce, field-level sourcing, and direct factory demand brought together on one platform.",
      cropBadge: "Crop Network",
      cropTitle: "Better crop discovery with real supply visibility",
      cropText: "Explore grain quality, quantity, and location before placing a direct order. Every listing is made for transparent sourcing without middlemen.",
      cropMiniOneTitle: "Popular Crops",
      cropMiniOneText: "Wheat, Paddy, Maize, Mustard",
      cropMiniTwoTitle: "Why It Helps",
      cropMiniTwoText: "Faster matching with verified buyers",
      farmerBadge: "What Farmers Gain",
      farmerTitle: "Direct crop selling with better rate confidence",
      farmerText: "Farmers can list crop quantity, moisture, price, and location in one place. Companies can check available stock and place partial or full orders based on real demand.",
      farmerPoints: [
        {
          title: "Transparent pricing",
          text: "No hidden agent cuts between farmer and company.",
        },
        {
          title: "Live demand signals",
          text: "Buyer requests and direct conversation stay visible in one system.",
        },
        {
          title: "Smarter logistics choices",
          text: "Self pickup or platform delivery can be chosen per order.",
        },
      ],
      companyBadge: "Company Sourcing",
      companyTitle: "Companies can source faster with trusted farm-side data",
      companyText: "Procurement teams can search by crop, review available quantity, open a direct chat, and order only the quantity they need with editable delivery instructions.",
      companyPoints: [
        {
          title: "Order flexibility",
          text: "Buy 50 kg, 100 kg, or larger quantity based on current need.",
        },
        {
          title: "Quality confidence",
          text: "Moisture-based grading makes shortlisting easier.",
        },
        {
          title: "Direct communication",
          text: "Message the farmer before ordering when clarification is needed.",
        },
        {
          title: "Delivery control",
          text: "Choose self pickup or platform delivery for each transaction.",
        },
      ],
      factoryBadge: "Factory Ready",
      factoryTitle: "From farm to factory with faster decisions and stronger trust",
      factoryText: "The platform helps companies discover crop supply quickly while giving farmers a fairer route to the market.",
      factoryCards: [
        { label: "Verified", value: "Direct Deals" },
        { label: "Editable", value: "Delivery Notes" },
        { label: "Live", value: "Farmer Chat" },
      ],
      priceComparison: {
        badge: "Price Comparison",
        title: "More value without middlemen",
        middlemanRate: "Middleman Rate",
        directProfit: "Your Direct Profit",
        middlemanNote: "Traditional chain pricing with extra cuts.",
        directNote: "Direct factory selling keeps more value with the farmer.",
      },
    },
  },
  hi: {
    navbar: {
      home: "होम",
      transportHub: "ट्रांसपोर्ट हब",
      login: "लॉगिन",
      register: "रजिस्टर",
      farmerDashboard: "फार्मर डैशबोर्ड",
      buyerRequests: "बायर रिक्वेस्ट",
      messages: "मैसेज",
      marketplace: "मार्केटप्लेस",
      myDeals: "मेरे डील्स",
      logout: "लॉगआउट",
      brandTitle: "ज़ीरो मिडलमैन एग्री मार्केटप्लेस",
      brandSubtitle: "डायरेक्ट फार्मर-टू-फैक्ट्री | ट्रांसपेरेंट ट्रेड",
      english: "English",
      hindi: "हिंदी",
    },
    home: {
      badge: "ज़ीरो मिडलमैन",
      title: "डायरेक्ट फार्मर-टू-फैक्ट्री मार्केटप्लेस",
      text: "किसान सीधे कंपनियों को बेचते हैं, खरीदार तेजी से सोर्स करते हैं, और हर डील पारदर्शी रहती है।",
      stats: [
        { value: "0%", label: "कमीशन" },
        { value: "100%", label: "डायरेक्ट एक्सेस" },
        { value: "24x7", label: "मार्केटप्लेस" },
      ],
      verifiedBadge: "नो मिडलमैन वेरिफाइड",
      verifiedTitle: "एक ही प्लेटफॉर्म पर किसान और क्रॉप सप्लाई",
      verifiedText: "फ्रेश प्रोड्यूस, फील्ड-लेवल सोर्सिंग और डायरेक्ट फैक्ट्री डिमांड अब एक ही जगह पर।",
      cropBadge: "क्रॉप नेटवर्क",
      cropTitle: "रियल सप्लाई विजिबिलिटी के साथ बेहतर क्रॉप डिस्कवरी",
      cropText: "डायरेक्ट ऑर्डर करने से पहले ग्रेन क्वालिटी, क्वांटिटी और लोकेशन देखिए। हर लिस्टिंग पारदर्शी सोर्सिंग के लिए बनाई गई है।",
      cropMiniOneTitle: "पॉपुलर क्रॉप्स",
      cropMiniOneText: "गेहूं, धान, मक्का, सरसों",
      cropMiniTwoTitle: "फायदा",
      cropMiniTwoText: "वेरिफाइड बायर्स के साथ तेज़ मैचिंग",
      farmerBadge: "किसानों को क्या मिलता है",
      farmerTitle: "बेहतर रेट के साथ डायरेक्ट क्रॉप सेलिंग",
      farmerText: "किसान एक ही जगह पर क्वांटिटी, मॉइश्चर, प्राइस और लोकेशन लिस्ट कर सकते हैं। कंपनियां उपलब्ध स्टॉक देखकर अपनी जरूरत के हिसाब से ऑर्डर कर सकती हैं।",
      farmerPoints: [
        {
          title: "ट्रांसपेरेंट प्राइसिंग",
          text: "किसान और कंपनी के बीच कोई छुपा एजेंट कट नहीं।",
        },
        {
          title: "लाइव डिमांड सिग्नल",
          text: "बायर रिक्वेस्ट और डायरेक्ट बातचीत एक ही सिस्टम में दिखती है।",
        },
        {
          title: "स्मार्ट लॉजिस्टिक्स",
          text: "हर ऑर्डर में सेल्फ पिकअप या प्लेटफॉर्म डिलीवरी चुनी जा सकती है।",
        },
      ],
      companyBadge: "कंपनी सोर्सिंग",
      companyTitle: "कंपनियां भरोसेमंद फार्म डेटा के साथ तेजी से सोर्स कर सकती हैं",
      companyText: "प्रोक्योरमेंट टीम क्रॉप सर्च कर सकती है, उपलब्ध मात्रा देख सकती है, पहले चैट कर सकती है, और जितनी जरूरत हो उतना ऑर्डर कर सकती है।",
      companyPoints: [
        {
          title: "ऑर्डर फ्लेक्सिबिलिटी",
          text: "50 किलो, 100 किलो या उससे ज्यादा मात्रा जरूरत के हिसाब से खरीदें।",
        },
        {
          title: "क्वालिटी कॉन्फिडेंस",
          text: "मॉइश्चर-आधारित ग्रेडिंग से शॉर्टलिस्ट करना आसान होता है।",
        },
        {
          title: "डायरेक्ट कम्युनिकेशन",
          text: "ऑर्डर से पहले जरूरत हो तो किसान से चैट करें।",
        },
        {
          title: "डिलीवरी कंट्रोल",
          text: "हर ट्रांजैक्शन में सेल्फ पिकअप या प्लेटफॉर्म डिलीवरी चुनें।",
        },
      ],
      factoryBadge: "फैक्ट्री रेडी",
      factoryTitle: "फार्म से फैक्ट्री तक तेज़ फैसले और ज्यादा भरोसा",
      factoryText: "यह प्लेटफॉर्म कंपनियों को तेज़ी से क्रॉप सप्लाई ढूंढने में मदद करता है और किसानों को बेहतर रूट देता है।",
      factoryCards: [
        { label: "वेरिफाइड", value: "डायरेक्ट डील्स" },
        { label: "एडिटेबल", value: "डिलीवरी नोट्स" },
        { label: "लाइव", value: "फार्मर चैट" },
      ],
      priceComparison: {
        badge: "प्राइस कम्पैरिजन",
        title: "बिना मिडलमैन के ज्यादा वैल्यू",
        middlemanRate: "मिडलमैन रेट",
        directProfit: "आपका डायरेक्ट प्रॉफिट",
        middlemanNote: "पारंपरिक चेन में अतिरिक्त कट लगते हैं।",
        directNote: "डायरेक्ट फैक्ट्री सेलिंग से किसान के पास ज्यादा वैल्यू रहती है।",
      },
    },
  },
};

function HomePage({ language, marketInsights }) {
  const copy = COPY[language]?.home || COPY.en.home;
  return (
    <div className="px-4 py-8">
      <section className="space-y-6">
        <div className="home-hero rounded-[32px] p-8 shadow-[0_20px_60px_rgba(16,24,40,0.18)]">
          <div className="home-hero-copy max-w-xl rounded-[28px] p-6 backdrop-blur-sm">
            <p className="inline-flex rounded-full bg-[#f4ead7] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-700 home-badge">
              {copy.badge}
            </p>
            <h1 className="mt-6 text-5xl font-black leading-tight text-slate-900 home-title">
              {copy.title}
            </h1>
            <p className="mt-4 text-lg text-slate-700 home-text">
              {copy.text}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {copy.stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`home-stat-card rounded-3xl p-4 backdrop-blur-sm home-stat-card-${
                  index + 1
                }`}
              >
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="home-photo-card rounded-[32px] p-6">
          <div className="glass-panel max-w-md rounded-[28px] p-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
              {copy.verifiedBadge}
            </p>
            <h2 className="mt-3 text-3xl font-black leading-tight">
              {copy.verifiedTitle}
            </h2>
            <p className="mt-3 text-sm text-emerald-50">
              {copy.verifiedText}
            </p>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="home-feature-card home-feature-card-crop rounded-[32px] p-6 text-white">
            <div className="glass-panel max-w-lg rounded-[28px] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
                {copy.cropBadge}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight">
                {copy.cropTitle}
              </h2>
              <p className="mt-3 text-sm text-emerald-50">
                {copy.cropText}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="home-mini-card rounded-3xl p-4">
                  <p className="text-sm font-semibold text-amber-100">{copy.cropMiniOneTitle}</p>
                  <p className="mt-2 text-lg font-black">{copy.cropMiniOneText}</p>
                </div>
                <div className="home-mini-card rounded-3xl p-4">
                  <p className="text-sm font-semibold text-amber-100">{copy.cropMiniTwoTitle}</p>
                  <p className="mt-2 text-lg font-black">{copy.cropMiniTwoText}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-surface home-surface-card home-surface-farmer rounded-[32px] p-6">
            <p className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#1B5E20]">
              {copy.farmerBadge}
            </p>
            <h2 className="mt-5 text-3xl font-black text-slate-900">
              {copy.farmerTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {copy.farmerText}
            </p>
            <div className="mt-6 grid gap-4">
              {copy.farmerPoints.map((point) => (
                <div key={point.title} className="home-info-tile rounded-[24px] p-4">
                  <p className="text-sm font-semibold text-[#1B5E20]">{point.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="glass-surface home-surface-card home-surface-company rounded-[32px] p-6">
            <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a6400]">
              {copy.companyBadge}
            </p>
            <h2 className="mt-5 text-3xl font-black text-slate-900">
              {copy.companyTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {copy.companyText}
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {copy.companyPoints.map((point) => (
                <div key={point.title} className="home-info-tile rounded-[24px] p-4">
                  <p className="text-sm font-semibold text-[#9a6400]">{point.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{point.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="home-feature-card home-feature-card-company rounded-[32px] p-6 text-white">
            <div className="glass-panel max-w-lg rounded-[28px] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-100">
                {copy.factoryBadge}
              </p>
              <h2 className="mt-3 text-3xl font-black leading-tight">
                {copy.factoryTitle}
              </h2>
              <p className="mt-3 text-sm text-emerald-50">
                {copy.factoryText}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {copy.factoryCards.map((card) => (
                  <div key={card.value} className="home-mini-card rounded-3xl p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-amber-100">{card.label}</p>
                    <p className="mt-2 text-lg font-black">{card.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <PriceComparison
            content={{
              ...copy.priceComparison,
              middlemanValue: `Rs. ${marketInsights?.middlemanRate || 1800}`,
              directValue: `Rs. ${marketInsights?.directRate || 2200}`,
            }}
          />
          <MarketGraph marketInsights={marketInsights} />
        </div>
      </section>
    </div>
  );
}

function AppShell() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [language, setLanguage] = useState(localStorage.getItem(LANGUAGE_KEY) || "en");
  const [user, setUser] = useState(null);
  const [marketInsights, setMarketInsights] = useState(null);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [myCrops, setMyCrops] = useState([]);
  const [companyDeals, setCompanyDeals] = useState([]);
  const [farmerDeals, setFarmerDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    description: "",
    transactionId: "",
  });
  const [chatState, setChatState] = useState({
    isOpen: false,
    deal: null,
    role: "company",
  });

  const upsertDeal = (list, updatedDeal) => {
    const exists = list.some((deal) => deal._id === updatedDeal._id);
    if (!exists) {
      return [updatedDeal, ...list];
    }

    return list.map((deal) => (deal._id === updatedDeal._id ? updatedDeal : deal));
  };

  const refreshRoleData = async (targetUser) => {
    if (!targetUser) {
      return;
    }

    try {
      if (targetUser.role === "farmer") {
        const [myCropsResult, farmerDealsResult] = await Promise.allSettled([
          api.get("/crops/my"),
          api.get("/deals/farmer"),
        ]);

        if (myCropsResult.status === "fulfilled") {
          setMyCrops(myCropsResult.value.data);
        }

        if (farmerDealsResult.status === "fulfilled") {
          setFarmerDeals(farmerDealsResult.value.data);
        }
      }

      if (targetUser.role === "company") {
        const [availableResult, companyDealsResult] = await Promise.allSettled([
          api.get("/crops/available"),
          api.get("/deals/company"),
        ]);

        if (availableResult.status === "fulfilled") {
          setAvailableCrops(availableResult.value.data);
        }

        if (companyDealsResult.status === "fulfilled") {
          setCompanyDeals(companyDealsResult.value.data);
        }
      }
    } catch {
      // Silent polling failure; the visible error state is handled by primary actions.
    }
  };

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    const loadMarketInsights = async () => {
      try {
        const response = await api.get("/crops/market-insights");
        setMarketInsights(response.data);
      } catch {
        // keep previous insight data silently if backend is restarting
      }
    };

    loadMarketInsights();
    const intervalId = setInterval(loadMarketInsights, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setUser(null);
        setAvailableCrops([]);
        setMyCrops([]);
        setCompanyDeals([]);
        setFarmerDeals([]);
        return;
      }

      try {
        const profileResponse = await api.get("/auth/me");
        setUser(profileResponse.data.user);
        setError("");
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
        setError("Session expired. Please login again.");
      }
    };

    bootstrap();
  }, [token]);

  useEffect(() => {
    const loadRoleData = async () => {
      if (!user) {
        return;
      }

      try {
        setLoading(true);

        if (user.role === "farmer") {
          const [myCropsResult, farmerDealsResult] = await Promise.allSettled([
            api.get("/crops/my"),
            api.get("/deals/farmer"),
          ]);

          if (myCropsResult.status === "fulfilled") {
            setMyCrops(myCropsResult.value.data);
          } else {
            setMyCrops([]);
          }

          if (farmerDealsResult.status === "fulfilled") {
            setFarmerDeals(farmerDealsResult.value.data);
          } else {
            setFarmerDeals([]);
          }

          if (
            myCropsResult.status === "rejected" ||
            farmerDealsResult.status === "rejected"
          ) {
            setError("Some farmer dashboard data could not be loaded. Restart the backend and sign in again.");
          } else {
            setError("");
          }
        }

        if (user.role === "company") {
          const [availableResult, companyDealsResult] = await Promise.allSettled([
            api.get("/crops/available"),
            api.get("/deals/company"),
          ]);

          if (availableResult.status === "fulfilled") {
            setAvailableCrops(availableResult.value.data);
          } else {
            setAvailableCrops([]);
          }

          if (companyDealsResult.status === "fulfilled") {
            setCompanyDeals(companyDealsResult.value.data);
          } else {
            setCompanyDeals([]);
          }

          if (
            availableResult.status === "rejected" ||
            companyDealsResult.status === "rejected"
          ) {
            setError("Some company dashboard data could not be loaded. Restart the backend and sign in again.");
          } else {
            setError("");
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadRoleData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      refreshRoleData(user);
    }, 7000);

    return () => clearInterval(intervalId);
  }, [user]);

  const handleRegister = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      localStorage.setItem(TOKEN_KEY, response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setError("");
      navigate(response.data.user.role === "farmer" ? "/farmer" : "/company");
    } catch (err) {
      try {
        const fallbackLogin = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        localStorage.setItem(TOKEN_KEY, fallbackLogin.data.token);
        setToken(fallbackLogin.data.token);
        setUser(fallbackLogin.data.user);
        setError("");
        navigate(fallbackLogin.data.user.role === "farmer" ? "/farmer" : "/company");
      } catch {
        setError(
          err.response?.data?.message ||
            "Registration failed. Restart the backend and try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem(TOKEN_KEY, response.data.token);
      setToken(response.data.token);
      setUser(response.data.user);
      setError("");
      navigate(response.data.user.role === "farmer" ? "/farmer" : "/company");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", formData);
      setError("");
      setModalState({
        isOpen: true,
        title: "Password Updated",
        description: response.data.message || "Your password was reset successfully. You can login now.",
        transactionId: "",
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to reset password");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setUser(null);
    navigate("/");
  };

  const handleAddCrop = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/crops/add", formData);
      setMyCrops((current) => [response.data, ...current]);
      setError("");
      setModalState({
        isOpen: true,
        title: "Deal Ready",
        description: "Your crop listing is now live in the marketplace.",
        transactionId: "",
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add crop");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLockDeal = async (crop, orderForm) => {
    setLoading(true);
    try {
      const response = await api.post("/deals/lock", {
        cropId: crop._id,
        ...orderForm,
      });
      setCompanyDeals((current) => upsertDeal(current, response.data));
      setAvailableCrops((current) =>
        current
          .map((item) =>
            item._id === crop._id
              ? { ...item, availableQuantity: response.data.crop?.availableQuantity ?? 0 }
              : item
          )
          .filter((item) => (item.availableQuantity ?? item.quantity) > 0)
      );
      setError("");
      const deliveryLabel =
        orderForm.transportMode === "platform_delivery"
          ? "Platform Delivery"
          : "Company Self Pickup";
      setModalState({
        isOpen: true,
        title: "Deal Locked Successfully",
        description: `${crop.type} order placed for ${response.data.requestedQuantity} tons with ${deliveryLabel}. Platform fee: ${response.data.commissionPercent}%`,
        transactionId: response.data.transactionId,
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to lock deal");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (dealId, text) => {
    setLoading(true);
    try {
      const response = await api.post(`/deals/${dealId}/messages`, { text });
      setCompanyDeals((current) => upsertDeal(current, response.data));
      setFarmerDeals((current) => upsertDeal(current, response.data));
      setChatState((current) =>
        current.deal?._id === response.data._id
          ? { ...current, deal: response.data }
          : current
      );
      setError("");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send message");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleStartInquiry = async (crop) => {
    setLoading(true);
    try {
      const response = await api.post("/deals/inquiry", {
        cropId: crop._id,
        text: `Hello, I want to discuss your ${crop.type} listing before placing an order.`,
      });
      setCompanyDeals((current) => upsertDeal(current, response.data));
      setError("");
      setChatState({
        isOpen: true,
        deal: response.data,
        role: "company",
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to start conversation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRateDeal = async (dealId, ratingForm) => {
    setLoading(true);
    try {
      const response = await api.patch(`/deals/${dealId}/rating`, ratingForm);
      setCompanyDeals((current) => upsertDeal(current, response.data));
      setFarmerDeals((current) => upsertDeal(current, response.data));
      setChatState((current) =>
        current.deal?._id === response.data._id
          ? { ...current, deal: response.data }
          : current
      );
      setError("");
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save rating");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.patch("/auth/profile", profileData);
      setUser(response.data.user);
      setError("");
      setModalState({
        isOpen: true,
        title: "Profile Updated",
        description: "Your profile details were saved successfully.",
        transactionId: "",
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="site-shell">
      <Navbar
        user={user}
        onLogout={handleLogout}
        language={language}
        onLanguageChange={setLanguage}
        labels={COPY[language]?.navbar}
      />
      <Routes>
        <Route path="/" element={<HomePage language={language} marketInsights={marketInsights} />} />
        <Route path="/transport" element={<TransportHub />} />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to={user.role === "farmer" ? "/farmer" : "/company"} replace />
            ) : (
              <>
                {error ? (
                  <div className="mx-auto mt-6 max-w-7xl rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                ) : null}
                <Login
                  onSubmit={handleLogin}
                  onForgotPassword={handleForgotPassword}
                  loading={loading}
                />
              </>
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to={user.role === "farmer" ? "/farmer" : "/company"} replace />
            ) : (
              <>
                {error ? (
                  <div className="mx-auto mt-6 max-w-7xl rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                ) : null}
                <Register onSubmit={handleRegister} loading={loading} />
              </>
            )
          }
        />

        <Route element={<ProtectedRoute user={user} allowedRoles={["farmer"]} />}>
          <Route
            path="/farmer"
            element={
              <>
                {error ? (
                  <div className="mx-auto mt-6 max-w-7xl rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                ) : null}
                <FarmerDashboard
                  user={user}
                  myCrops={myCrops}
                  farmerDeals={farmerDeals}
                  onAddCrop={handleAddCrop}
                  onSendMessage={handleSendMessage}
                  marketInsights={marketInsights}
                  loading={loading}
                  activeView="overview"
                />
              </>
            }
          />
          <Route
            path="/farmer/requests"
            element={
              <FarmerDashboard
                user={user}
                myCrops={myCrops}
                farmerDeals={farmerDeals}
                onAddCrop={handleAddCrop}
                onSendMessage={handleSendMessage}
                marketInsights={marketInsights}
                loading={loading}
                activeView="interest"
              />
            }
          />
          <Route
            path="/farmer/messages"
            element={
              <FarmerDashboard
                user={user}
                myCrops={myCrops}
                farmerDeals={farmerDeals}
                onAddCrop={handleAddCrop}
                onSendMessage={handleSendMessage}
                marketInsights={marketInsights}
                loading={loading}
                activeView="messages"
              />
            }
          />
          <Route
            path="/farmer/profile"
            element={
              <UserProfile
                user={user}
                myCrops={myCrops}
                farmerDeals={farmerDeals}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
            }
          />
        </Route>

        <Route element={<ProtectedRoute user={user} allowedRoles={["company"]} />}>
          <Route
            path="/company"
            element={
              <>
                {error ? (
                  <div className="mx-auto mt-6 max-w-7xl rounded-2xl bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                ) : null}
                <CompanyMarketplace
                  availableCrops={availableCrops}
                  companyDeals={companyDeals}
                  onLockDeal={handleLockDeal}
                  onStartInquiry={handleStartInquiry}
                  onSendMessage={handleSendMessage}
                  onRateDeal={handleRateDeal}
                  marketInsights={marketInsights}
                  loading={loading}
                  activeView="market"
                />
              </>
            }
          />
          <Route
            path="/company/deals"
            element={
              <CompanyMarketplace
                availableCrops={availableCrops}
                companyDeals={companyDeals}
                onLockDeal={handleLockDeal}
                onStartInquiry={handleStartInquiry}
                onSendMessage={handleSendMessage}
                onRateDeal={handleRateDeal}
                marketInsights={marketInsights}
                loading={loading}
                activeView="deals"
              />
            }
          />
          <Route
            path="/company/messages"
            element={
              <CompanyMarketplace
                availableCrops={availableCrops}
                companyDeals={companyDeals}
                onLockDeal={handleLockDeal}
                onStartInquiry={handleStartInquiry}
                onSendMessage={handleSendMessage}
                onRateDeal={handleRateDeal}
                marketInsights={marketInsights}
                loading={loading}
                activeView="messages"
              />
            }
          />
          <Route
            path="/company/profile"
            element={
              <UserProfile
                user={user}
                companyDeals={companyDeals}
                onUpdateProfile={handleUpdateProfile}
                loading={loading}
              />
            }
          />
        </Route>
      </Routes>

      <Footer />

      <Modal
        isOpen={modalState.isOpen}
        title={modalState.title}
        description={modalState.description}
        transactionId={modalState.transactionId}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            description: "",
            transactionId: "",
          })
        }
      />
      <ChatModal
        isOpen={chatState.isOpen}
        deal={chatState.deal}
        currentRole={chatState.role}
        onClose={() =>
          setChatState({
            isOpen: false,
            deal: null,
            role: "company",
          })
        }
        onSendMessage={handleSendMessage}
        onRateDeal={handleRateDeal}
        loading={loading}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
