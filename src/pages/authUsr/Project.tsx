import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Pieds from "./componenet/Pieds";
import { useTranslation } from "src/hooks/useTranslation";
import { useI18nStore } from "src/store/i18n/i18nStore";

const Project = () => {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/blog" },
  ];
  const [active, setActive] = useState("Projects");

  const navigate = useNavigate();

  const images = [
    {
      src: "projet2.jpg",
      title:
        "Équipement médical 7Dialysis Center at General Hospital of Douala",
      description: "Installation biomédicale moderne",
    },
    {
      src: "equip7.jpg",
      title: "Autoclave delivered to General Hospital of Douala 7",
      description: "Outil essentiel pour diagnostics",
    },
    {
      src: "equip8.jpg",
      title:
        "Équipement médical 8Supply and installation of a medical oxygen centre at the General Hospital of Douala (2023)",
      description: "Solution innovante en santé",
    },
    {
      src: "equip10.jpg",
      title:
        "The construction and equipment of the hemodialysis center at General hospital of Douala, October 2023",
      description: "Technologie avancée de mesure",
    },
    {
      src: "equip11.jpg",
      title:
        "Supply and installation of a medical oxygen centre at the General Hospital of Douala (2023)",
      description: "Matériel de haute précision",
    },
    {
      src: "serv1.png",
      title:
        "Canon Aquillon start 32-silce Scanner to be installed at Douala Military Hospital",
      description: "Expertise en maintenance biomédicale",
    },
    {
      src: "team3.jpg",
      title:
        "Équipement médical 13Generators and dialysis chairs installed at the dialysis center of General Hospital in Douala",
      description: "Des experts à votre service",
    },
    {
      src: "projet3.jpg",
      title:
        "Installation of the water treatment room of dialysis at the dialysis center of the Kousseri Regional Annex Hopital.",
      description: "Solution complète pour hôpitaux",
    },
  ];

  const images1 = [
    "creation.jpg",
    "creation1.jpg",
    "creation2.jpg",
    "creation3.jpg",
  ];

  const imageVariant = {
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

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12">
              <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
                <span className="font-bold border-b-4 border-green-600 pb-1">
                  {t("our.project")}
                </span>
              </h2>
            </h2>

            <p className="text-gray-700 max-w-3xl mx-auto mb-12">
              {t("unique.how")}
            </p>

            {/* grille 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images.map((item, index) => (
                <motion.div
                  key={item.src}
                  className="relative w-full h-80 overflow-hidden rounded-lg group"
                  variants={imageVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  {/* Image */}
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 rounded-b-xl"
                  />

                  {/* Overlay texte */}
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition duration-500">
                    <h3 className="text-white text-lg font-bold mb-2">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-28 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12">
              <span className="text-[#1aafc9e2]"> </span>
              {t("ou.partners")}
            </h2>

            <div className="overflow-hidden">
              <div className="flex animate-marquee space-x-12">
                <img
                  src="logo-minsante.png"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
                <img
                  src="OIP (2).png"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
                <img
                  src="dialife.jpeg"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
                <img
                  src="Siemens-Logo.png"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
                {/* Répète pour boucle continue */}
                <img
                  src="logo-minsante.png"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
                <img
                  src="OIP (2).png"
                  alt="Hero equipment"
                  className="h-24 object-contain"
                />
              </div>
            </div>
          </div>

          <style>
            {`
      .animate-marquee {
        display: flex;
        animation: marquee 20s linear infinite;
      }
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
    `}
          </style>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12">
              <span className="text-[#1aafc9e2]"> </span>
              {t("bio.achieve")}
            </h2>

            <p className="text-gray-700 max-w-3xl mx-auto mb-12"></p>
            {t("at.needs")}

            {/* grille 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images1.map((src, index) => (
                <motion.div
                  key={src}
                  className="w-full h-70 overflow-hidden rounded-lg"
                  variants={imageVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <img
                    src={src}
                    alt="Hero equipment"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <div className="text-center my-12">
          <div className="flex justify-center">
            <img src="file-icon.png" alt="Hero equipment" className="my-4" />
          </div>
          <h3 className="text-2xl font-bold text-[#599E0E] mb-4">
            {t("have.mind")}
          </h3>
          <button
            onClick={() => navigate("/project")}
            className="bg-[#599E0E] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 mt-8"
          >
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

export default Project;
