import React, { useState } from "react";

/**
 * LandingPagePrecise.tsx
 * Place images dans public/assets:
 * - /assets/logo.png
 * - /assets/hero-machine.png
 * - /assets/doctor.png
 * - /assets/partner1.png ... partner4.png
 * - /assets/equip1.png equip2.png equip3.png
 * - /assets/ach1.jpg ... ach4.jpg
 * - /assets/client1.png client2.png client3.png
 * - /assets/monitor.png
 */
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
const Teams = () => {
  const [active, setActive] = useState("");

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/blog" },
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

  const images = [
    {
      src: "team1.jpg",
      title: "Formation en Chine",
      description:
        "Appareil utilisé pour mesurer l'activité électrique du cœur. Idéal pour les diagnostics cardiovasculaires.",
    },
    {
      src: "team2.jpg",
      title: "Formation en Chine",
      description:
        "Stérilise efficacement les instruments médicaux par vapeur sous pression. Utilisé dans tous les centres de santé.",
    },
    {
      src: "team4.jpg",
      title: "Formation en Chine",
      description:
        "Stérilise efficacement les instruments médicaux par vapeur sous pression. Utilisé dans tous les centres de santé.",
    },
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
            <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
              <span className="font-bold border-b-4 border-green-600 pb-1">
                Blog - Our Teams
              </span>
            </h2>{" "}
            <p className="text-gray-700 max-w-3xl mx-auto mb-12 text-justify">
              At METROCALIB, our team is comprised of dedicated professionals
              with diverse expertise in the biomedical field. We are passionate
              about delivering exceptional service and innovative solutions to
              enhance healthcare delivery. With a strong commitment to
              collaboration and continuous improvement, our experts work
              together to ensure that every project meets the highest standards
              of quality and efficiency. Together, we strive to empower
              healthcare institutions and contribute positively to patient care.
            </p>
            {/* grille 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((item, index) => (
                <motion.div
                  key={item.src}
                  className="w-full overflow-hidden rounded-lg shadow-lg bg-white flex flex-col items-center text-center p-4"
                  variants={imageVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-[#599E0E]">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 text-justify">
                    {item.description}
                  </p>
                </motion.div>
              ))}
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

export default Teams;
