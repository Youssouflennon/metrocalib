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

const Equipment = () => {
  const [active, setActive] = useState("");

  const cardVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const cards = [
    {
      title: "Sale",
      text: "METROCALIB, the paramedical sales specialist, offers a wide range of first aid products, emergency medical equipment, and COVID-19 response equipment.",
    },
    {
      title: "Advice",
      text: "METROCALIB listens attentively to any potential problems our customers may have. We therefore provide advice on the use of your equipment, the sale of our products, and the company's responsibility regarding the use of these products.",
    },
    {
      title: "Maintenance",
      text: "After purchasing a device through our company, we provide maintenance if requested by the organization through our team of qualified technicians. The maintenance contract is based on the agreement between both parties.",
    },
  ];

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/blog" },
  ];

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
            <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
              <span className="font-bold border-b-4 border-green-600 pb-1">
                Our Medical Equipment
              </span>
            </h2>

            <p className="mb-14 text-center">
              Discover some of our high-quality medical equipment, designed to
              improve healthcare.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Carte 1 */}
              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="vent.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Electrocardiographe
                </h3>
                <p className="text-gray-700">
                  Mesure l’activité électrique du cœur. Idéal pour diagnostics
                  cardiovasculaires.
                </p>
              </motion.div>

              {/* Carte 2 */}
              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="equip6.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Autoclave Médical
                </h3>
                <p className="text-gray-700 ">
                  Stérilise efficacement les instruments médicaux par vapeur
                  sous pression.
                </p>
              </motion.div>

              {/* Carte 3 */}
              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="vent3.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Oxymètre de Pouls
                </h3>
                <p className="text-gray-700">
                  Mesure la saturation en oxygène du sang, essentiel pour
                  réanimation.
                </p>
              </motion.div>

              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="vent.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Electrocardiographe
                </h3>
                <p className="text-gray-700">
                  Mesure l’activité électrique du cœur. Idéal pour diagnostics
                  cardiovasculaires.
                </p>
              </motion.div>

              {/* Carte 2 */}
              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="equip6.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Autoclave Médical
                </h3>
                <p className="text-gray-700">
                  Stérilise efficacement les instruments médicaux par vapeur
                  sous pression.
                </p>
              </motion.div>

              {/* Carte 3 */}
              <motion.div
                className="p-6 rounded-lg flex flex-col items-center justify-center shadow text-center"
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: false, amount: 0.2 }}
              >
                <img
                  src="vent3.png"
                  alt="Illustration Services"
                  className="w-80 h-80 object-contain"
                />
                <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                  Oxymètre de Pouls
                </h3>
                <p className="text-gray-700">
                  Mesure la saturation en oxygène du sang, essentiel pour
                  réanimation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold  mb-12 text-center">
                To Get More Information
              </h2>
              <p className="my-4 text-center">
                Our dedicated team is here to answer your questions and provide
                personalized support, helping you make informed decisions for
                your healthcare facility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.title}
                    className="p-6 rounded-lg shadow"
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    viewport={{ once: false, amount: 0.2 }}
                  >
                    <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                      {card.title}
                    </h3>
                    <p className="text-gray-700 mb-4 font-bold">{card.text}</p>
                    <a href="#" className="text-[#599E0E] font-semibold">
                      Learn More &gt;
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative w-full hidden lg:block">
              <img
                src="M4.png"
                alt="Illustration Services"
                className=" object-contain animate-pulse"
                style={{
                  position: "absolute",
                  top: -450,
                  right: -220,
                  width: "320px", // équivalent w-80
                  height: "550px", // équivalent h-80
                  objectFit: "contain",
                  animation: "pulse 2s infinite",
                }}
              />
            </div>
          </div>
        </section>

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

export default Equipment;
