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
import { useNavigate } from "react-router-dom";
import Pieds from "../componenet/Pieds";
import { useI18nStore } from "src/store/i18n/i18nStore";
import { useTranslation } from "src/hooks/useTranslation";

const Facilities = () => {
  const [active, setActive] = useState("");

  const navigate = useNavigate();

  const imageVariant = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  };

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Production", href: "/production" },
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

  const images = [
    "creation.jpg",
    "creation1.jpg",
    "creation2.jpg",
    "creation3.jpg",
  ];

  const items = [
    {
      title: "MRI SCANNER",
      points: [
        "MRI Canon Central Hospital of Yaoundé.",
        "MRI Canon Central Hospital of Douala.",
        "MRI Canon Central Hospital of Garoua.",
        "SIEMENS 128-SLICE CT-SCANNER at Laquintinie Hospital of Douala.",
        "REMOTELY-CONTROLLED X-RAY TABLE at Laquintinie Hospital of Douala.",
      ],
      image: "projet.jpg", // remplace par ton image
    },
    {
      title: "DIALYSES CENTER",
      points: [
        "Laquintinie Hospital of Douala.",
        "General Hospital of Douala.",
        "Regional Annex Hospital of Kousseri.",
        "Regional Hospital of Maroua.",
        "Regional Hospital of Garoua.",
        "Regional Hospital of Buea.",
      ],
      image: "dialyse.jpg",
    },
    {
      title: "MEDICAL OXYGEN PLANTS",
      points: [
        "Oxygen plant at Laquintinie Hospital of Douala.",
        "Oxygen plant at General Hospital of Douala.",
        "Oxygen plant at Regional Hospital of Garoua.",
      ],
      image: "equip11.jpg",
    },

    {
      title: "AUTOCLAVES: Delivered to the General Hospital of Douala",
      points: [
        "One 500-liter single-door AUTOCLAVES.",
        "One 500-liter double-door AUTOCLAVES.",
      ],
      image: "equip9.jpg",
    },
    {
      title: "ONGOING PROJECTS",
      points: [
        "Dialyse Center at Yagoua Regional Annex Hospital.",
        "Dialyse Center at Mokolo Regional Annex Hospital.",
        "Canon 32-slice CT-Scanner at Douala Military Hospital.",
      ],
      image: "instalation.jpg",
    },
  ];

  const fadeVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

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

        <section className="py-20 container mx-auto px-6 space-y-20">
          <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
            <span className="font-bold border-b-4 border-green-600 pb-1">
              {t("facil.ities")}
            </span>
          </h2>

          <p className="text-center my-5">
           {t("boss.man")}
          </p>
          {items.map((item, i) => (
            <motion.div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-2 items-center gap-10 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              variants={fadeVariant}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.8, delay: 0.2 * i }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Texte */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {item.title}
                </h2>
                <ul className="space-y-2">
                  {item.points.map((point, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">✔</span>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <motion.img
                src={item.image}
                alt={item.title}
                className="rounded-lg shadow-lg w-full object-cover"
                variants={fadeVariant}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 0.8, delay: 0.2 * i + 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
              />
            </motion.div>
          ))}
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12">
              <span className="text-[#1aafc9e2]"> Our</span> Achievements
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-12 text-justify">
             {t("only.meet")}
            </p>

            {/* grille 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {images.map((src, index) => (
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
           {t("project.in")}
          </h3>
          <button
            onClick={() => navigate("/project")}
            className="bg-[#599E0E] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 mt-8"
          >
          {t("zot.to")}
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

export default Facilities;
