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

const Service = () => {
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/service" },
    { name: "Projects", href: "/project" },
    { name: "Blog", href: "/blog" },
  ];
  const [active, setActive] = useState("Services");

  const navigate = useNavigate();

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
                  {t(item.name)}
                </a>
              ))}

              <DropdownMenu>
                <DropdownMenuTrigger className="font-semibold transition-colors bg-transparent border-0">
                  <span className="flex gap-1 items-center font-bold">
                    {t("Company")}
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

        <section className="py-15 ">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            {/* Colonne gauche : ta section Services */}
            <div>
              <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
                <span className="font-bold border-b-4 border-green-600 pb-1">
                  {t("services")}
                </span>
              </h2>
              <p className="text-justify my-28">{t("equipment.use")}</p>
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
                      src="digital-marketing-icon.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    {t("supply")}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold text-justify">
                    {t("patient.care")}
                  </p>
                  <a href="#" className="text-[#599E0E] font-semibold">
                    {t("learn")} &gt;
                  </a>
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
                      src="marketing-icon.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    {t("training")}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold text-justify">
                    {t("ad.ensuring")}
                  </p>

                  <a href="#" className="text-[#599E0E] font-semibold">
                    {t("le.mo")}
                  </a>
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
                      src="ads-icon.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    {t("main.ten")}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold text-justify">{t("off.er")}</p>
                  <a href="#" className="text-[#599E0E] font-semibold">
                    {t("l.mor")}
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Colonne droite : Image avec effet */}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-100 to-blue-100 py-16 my-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            {/* Image animée (de la droite) */}

            {/* Texte animé (de la gauche) */}
            <motion.div
              className="flex-1"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.2 }} // une seule fois
            >
              <div className="max-w-xl mx-auto p-8">
                <img
                  src="sloution-box-right-img.png"
                  alt="Hero equipment"
                  className="rounded-lg my-2"
                />
                <h2 className="text-3xl font-bold  mb-6">
                  {t("stake.holders")}
                </h2>
                <p className="text-gray-700 text-justify">{t("goal.meet")}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex items-center justify-center"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.2 }} // se rejoue à chaque scroll
            >
              <img
                src="M1.png"
                alt="Hero equipment"
                className="max-w-xs w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </section>

        <section className="py-16 my-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            {/* Image animée (de la droite) */}

            <motion.div
              className="flex-1 flex items-center justify-center"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.2 }} // se rejoue à chaque scroll
            >
              <img
                src="serv2.jpg"
                alt="Hero equipment"
                className="rounded-tl-full rounded-tr-lg my-2"
              />
            </motion.div>

            {/* Texte animé (de la gauche) */}
            <motion.div
              className="flex-1"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.2 }} // une seule fois
            >
              <div className="max-w-xl mx-auto p-8">
                <img
                  src="diamond-icon.png"
                  alt="Hero equipment"
                  className="rounded-lg my-2"
                />
                <h2 className="text-2xl font-bold  mb-6">
                  {" "}
                  {t("with.create")}
                </h2>
                <p className="text-gray-700 text-justify">{t("in.inspire")}</p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-100 to-blue-100 py-16 my-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            {/* Image animée (de la droite) */}

            {/* Texte animé (de la gauche) */}
            <motion.div
              className="flex-1"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.2 }} // une seule fois
            >
              <div className="max-w-xl mx-auto p-8">
                <img
                  src="help-right-icon.png"
                  alt="Hero equipment"
                  className="rounded-lg my-2"
                />
                <h2 className="text-3xl font-bold  mb-6"> {t("ex.now")}</h2>
                <p className="text-gray-700 text-justify">{t("mak.com")}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 flex items-center justify-center"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.2 }} // se rejoue à chaque scroll
            >
              <img
                src="serv3.jpg"
                alt="Hero equipment"
                className="rounded-tl-full rounded-tr-lg my-2"
              />
            </motion.div>
          </div>
        </section>

        <section className="bg-gray-100 py-16">
          <div className="max-w-6xl mx-auto px-6 text-center">
            {/* Titre */}
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 ">
              <span className="border-b-4 border-green-600 pb-1">
                {t("our.operational")}
              </span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-12 text-justify">
              {t("to.rig")}
            </p>

            {/* Grille */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Card 1 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  1.
                  {t("au.dit")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("sm.ile")}</li>
                  <li> {t("dia.gn")} </li>
                  <li> {t("cu.st")} </li>
                </ul>
              </div>

              {/* Card 2 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  2. {t("pro.cu")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("with.ce")} </li>
                  <li> {t("ex.pe")} </li>
                  <li> {t("con.trol")} </li>
                </ul>
              </div>

              {/* Card 3 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  3.
                  {t("de.li")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("se.cure")} </li>
                  <li> {t("tr.re")} </li>
                  <li> {t("t.re")} </li>
                </ul>
              </div>

              {/* Card 4 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  4.
                  {t("ta.in")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("ha.nd")} </li>
                  <li> {t("us.er")} </li>
                  <li> {t("ce.ti")} </li>
                </ul>
              </div>

              {/* Card 5 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  5.
                  {t("su.po")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("te.na")} </li>
                  <li> {t("com.tuer")} </li>
                  <li> {t("re.te")} </li>
                </ul>
              </div>

              {/* Card 6 */}
              <div className="bg-white shadow-md rounded-xl p-6 text-left">
                <h3 className="text-green-600 font-semibold text-lg mb-3">
                  6.
                  {t("fe.ba")}
                </h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>{t("cu.to")} </li>
                  <li> {t("re.vie")} </li>
                  <li> {t("pro.cess")} </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center my-12">
          <div className="flex justify-center">
            <img src="file-icon.png" alt="Hero equipment" className="my-4" />
          </div>
          <h3 className="text-2xl font-bold text-[#599E0E] mb-4">
            {t("have.mi")}
          </h3>
          <button
            onClick={() => navigate("/project")}
            className="bg-[#599E0E] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 mt-8"
          >
            {t("wor.to")}
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

export default Service;
