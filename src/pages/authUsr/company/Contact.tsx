import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../../components/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import Pieds from "../componenet/Pieds";
import { useI18nStore } from "src/store/i18n/i18nStore";
import { useTranslation } from "src/hooks/useTranslation";
const Contact = () => {
  const [active, setActive] = useState("");

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/blog" },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const menuItemsCompany = [
    { name: "About", href: "/about" },
    { name: "Some Equipment", href: "/equipment" },
    { name: "Facilities", href: "/facilities" },
    { name: "Consumable", href: "/consumable" },
    { name: "Our Teams", href: "/teams" },
    { name: "Contact", href: "/contact" },
  ];

  const { language, setLanguage } = useI18nStore();

  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full font-sans">
      <div className="fixed bottom-4 right-4 z-50">
        <div className="flex gap-2 p-4">
          <button
            onClick={() => setLanguage("fr")}
            className=" border bg-white border-blue-500 text-blue-500 px-3 py-1 rounded-full hover:bg-blue-50 transition-colors"
          >
            Français
          </button>
          <button
            onClick={() => setLanguage("en")}
            className="bg-white border border-gray-500 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors"
          >
            English
          </button>
          <button className="bg-white border border-green-500 text-green-500 px-3 py-1 rounded-full hover:bg-green-50 transition-colors">
            Español
          </button>
        </div>
      </div>
      <div className="container mx-auto px-14">
        <header className="">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo à 50% */}
            <div className="flex-1 basis-1/2">
              <motion.img
                src="logoMetro.png"
                alt="Hero equipment"
                className="w-full h-32 md:h-40 lg:h-60 object-contain"
                initial={{ opacity: 0, scale: 0.8, y: -30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                viewport={{ once: false, amount: 0.3 }}
              />
            </div>

            {/* Menu desktop - caché sur mobile */}
            <nav className="hidden md:flex space-x-6 items-center flex-1 basis-1/2 justify-end">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setActive(item.name)}
                  className={`font-bold transition-colors ${
                    active === item.name
                      ? "text-[#599E0E]"
                      : "text-gray-700 hover:text-green-500"
                  }`}
                >
                  {item.name}
                </a>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger className="font-semibold transition-colors bg-transparent border-0">
                  <span className="flex gap-1 items-center font-bold">
                    Company
                    <ChevronDown size={16} />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {menuItemsCompany.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="transition-colors text-gray-800"
                    >
                      <DropdownMenuItem className="flex flex-col justify-start items-start gap-2">
                        {item.name}
                      </DropdownMenuItem>
                    </a>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>

            {/* Menu mobile - hamburger */}
            <div className="md:hidden flex-1 basis-1/2 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2 rounded-md text-gray-700 hover:text-green-500 hover:bg-gray-100 transition-colors">
                  <Menu size={24} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 mr-4">
                  {menuItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setActive(item.name)}
                    >
                      <DropdownMenuItem
                        className={`flex flex-col justify-start items-start gap-2 ${
                          active === item.name
                            ? "text-[#599E0E] bg-green-50"
                            : "text-gray-800"
                        }`}
                      >
                        {item.name}
                      </DropdownMenuItem>
                    </a>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-gray-500 text-sm font-semibold">
                    Company
                  </DropdownMenuLabel>
                  {menuItemsCompany.map((item) => (
                    <a key={item.name} href={item.href}>
                      <DropdownMenuItem className="flex flex-col justify-start items-start gap-2 text-gray-800">
                        {item.name}
                      </DropdownMenuItem>
                    </a>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <h2 className="text-5xl font-bold mb-12 text-center">
              Get In Touch
            </h2>

            <p className="mb-14 text-center">
              We’d love to hear from you! For inquiries, consultations, or to
              learn more about our services, please contact us at: 📞 ‪(+237)
              673 186 728‬ Home ~ Contact
            </p>

            <div className="flex justify-center items-center bg-gray-50">
              <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-5xl">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Colonne gauche */}
                  <div className="flex flex-col space-y-4">
                    <input
                      type="text"
                      placeholder="Enter Your Name:"
                      className="w-full rounded-full border bg-white border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="email"
                      placeholder="Enter Your Email:"
                      className="w-full rounded-full bg-white border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      placeholder="Subject:"
                      className="w-full rounded-full bg-white border border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  {/* Colonne droite */}
                  <div className="flex flex-col space-y-4">
                    <textarea
                      placeholder="Add Comment:"
                      rows={5}
                      className="w-full rounded-2xl border bg-white border-gray-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    ></textarea>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-full transition"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 ">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            {/* Colonne gauche : ta section Services */}
            <div>
              <h2 className="text-3xl font-bold text-[#599E0E] mb-12 text-center">
                Contact with us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Digital Marketing */}
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div>
                    <img
                      src="service-icon1.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    Location{" "}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    Bastos II, derrière usine, Yaoundé.
                  </p>
                </motion.div>

                {/* Content Marketing */}
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div>
                    <img
                      src="service-icon2.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    Phone:
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    (+237)222-211-913 WhatsApp +237 73186728
                  </p>
                </motion.div>

                {/* Google Ads */}
                <motion.div
                  className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <div>
                    <img
                      src="service-icon3.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-1">
                    Email{" "}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    info@metrocalib.com
                  </p>

                  <p className="text-gray-700 mb-4 font-bold">
                    info@metrocalib.com
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Colonne droite : Image avec effet */}
          </div>
        </section>

        <section>
          <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden w-full max-w-4xl">
              {/* En-tête */}
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">
                  📍 Notre localisation
                </h2>
                <p className="text-sm text-gray-500">
                  Venez nous rendre visite à notre siège.
                </p>
              </div>

              {/* Carte */}
              <div className="w-full h-96">
                <iframe
                  title="map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3979.7328531929533!2d11.5021!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bcf9f4444b2c5%3A0x2db7dd93d7d5a1b2!2sYaound%C3%A9!5e0!3m2!1sfr!2scm!4v1700000000000!5m2!1sfr!2scm"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-b-2xl"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center my-12">
          <div className="flex justify-center">
            <img src="file-icon.png" alt="Hero equipment" className="my-4" />
          </div>
          <h3 className="text-2xl font-bold text-[#599E0E] mb-4">
            Have a Project in mind?
          </h3>
          <button className="bg-[#599E0E] text-white px-8 py-3 rounded-lg hover:bg-[#599E0E]">
            Let’s get to Work
          </button>
        </div>
        {/* Footer */}
        <motion.footer
          className="bg-[#599E0E] text-white  rounded-lg mb-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.2 }}
        >
          <Pieds />
        </motion.footer>
      </div>
    </div>
  );
};

export default Contact;
