import React from "react";

const Pieds = () => {
  return (
    <div>
      <footer className="bg-gradient-to-r from-white via-white/70 to-white/90 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Metrocalib" className="h-10" />
            </div>
            <p className="text-gray-700 text-sm mb-4">
              “Your Partner in Biomedical Excellence”
              <br />
              <span className="font-medium">Introduction:</span> Welcome to
              METROCALIB, your trusted African biomedical specialist. We provide
              top-tier medical equipment and unparalleled service to ensure
              every healthcare facility operates optimally. Discover how we can
              elevate your healthcare standards.
            </p>
            <div className="flex space-x-4 text-gray-600 text-lg">
              <i className="fab fa-facebook"></i>
              <i className="fab fa-google-plus"></i>
              <i className="fab fa-twitter"></i>
              <i className="fab fa-reddit"></i>
              <i className="fab fa-pinterest"></i>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="hover:text-green-600 cursor-pointer">› Home</li>
              <li className="hover:text-green-600 cursor-pointer">› About</li>
              <li className="hover:text-green-600 cursor-pointer">
                › Services
              </li>
              <li className="hover:text-green-600 cursor-pointer">
                › Portfolio
              </li>
              <li className="hover:text-green-600 cursor-pointer">
                › Services
              </li>
              <li className="hover:text-green-600 cursor-pointer">› Quote</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
            <p className="text-sm">
              <span className="font-semibold text-green-600">Address:</span>{" "}
              Bastos II, derrière usine , Yaoundé, Cameroun
            </p>
            <p className="text-sm">
              <span className="font-semibold text-green-600">Email:</span>{" "}
              sinfo@metrocalib.com
            </p>
            <p className="text-sm">
              <span className="font-semibold text-green-600">Phone:</span>{" "}
              (+237)222-211-913
            </p>
            <p className="text-sm">
              <span className="font-semibold text-green-600">Bp:</span> 13686
              YDE
            </p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Newsletter</h3>
            <p className="text-sm text-gray-700 mb-3">
              Stay always in touch! Subscribe to our newsletter.
            </p>
            <div className="flex flex-col sm:flex-row gap-0">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-full border bg-white border-gray-300 focus:outline-none"
              />
              <button className="px-1 py-1 border-0 bg-[#599E0E]   border-black rounded-lg text-sm font-medium hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="bg-[#599E0E] text-white text-center py-4 text-sm font-medium">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 px-6">
            <div className="flex flex-wrap justify-center gap-6">
              <a href="#" className="hover:underline text-white">
                Home
              </a>
              <a href="#" className="hover:underline text-white">
                Terms
              </a>
              <a href="#" className="hover:underline text-white">
                Privacy
              </a>
              <a href="#" className="hover:underline text-white">
                Company
              </a>
              <a href="#" className="hover:underline text-white">
                Support
              </a>
            </div>
            <p>Copyright 2025 metrocalib.com All Rights Reserved</p>
          </div>
        </div>

        {/* Languages */}
        {/*   <div className="flex justify-end gap-2 p-4">
              <button className="border border-blue-500 text-blue-500 px-3 py-1 rounded">
                Français
              </button>
              <button className="border border-green-500 text-green-500 px-3 py-1 rounded">
                Español
              </button>
              <button className="border border-yellow-500 text-yellow-500 px-3 py-1 rounded">
                Deutsch
              </button>
              <button className="border border-gray-500 text-gray-700 px-3 py-1 rounded">
                English
              </button>
            </div> */}
      </footer>
    </div>
  );
};

export default Pieds;
