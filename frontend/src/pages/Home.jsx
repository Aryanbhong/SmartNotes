import { useNavigate } from "react-router-dom";
import { CheckCircle, PenTool, Star, Upload, Share2, Search } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <PenTool size={22} />,
      title: "Quick Note Creation",
      desc: "Create and organize notes effortlessly with tags and categories.",
    },
    {
      icon: <Star size={22} />,
      title: "Favorites & Pinning",
      desc: "Pin or favorite notes for instant access to your most important ideas.",
    },
    {
      icon: <Search size={22} />,
      title: "Smart Search & Filters",
      desc: "Find your notes instantly with advanced search and tag filters.",
    },
    {
      icon: <Upload size={22} />,
      title: "OCR Text Extraction",
      desc: "Upload images and extract text automatically with OCR technology.",
    },
    {
      icon: <Share2 size={22} />,
      title: "Share & Collaborate",
      desc: "Generate shareable links or invite others to collaborate on notes.",
    },
    {
      icon: <CheckCircle size={22} />,
      title: "Offline Support",
      desc: "Create notes offline and sync them automatically when back online.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
     
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-blue-300">SmartNotes</span>
        </h1>
        <p className="text-lg max-w-2xl mb-6">
          SmartNotes is your all-in-one note-taking platform designed to boost productivity.
          From AI summaries to OCR text extraction, we make your work easier and smarter.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-800 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Signup
          </button>
        </div>
      </section>

    
      <section className="bg-white text-gray-800 py-16 px-6 rounded-t-3xl shadow-inner">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Why Choose <span className="text-blue-700">SmartNotes?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-50 p-6 rounded-xl shadow-md border border-transparent hover:border-blue-400 hover:shadow-xl hover:-translate-y-2 hover:scale-105 transition-all duration-300"
              >
                <div className="text-blue-600 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-700">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

  
      <section className="py-16 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Ready to make note-taking smarter?
        </h3>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1"
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;
