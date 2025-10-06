import React, { useState } from "react";

import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../../components/components/ui/dropdown-menu";
import { ChevronDown, Menu } from "lucide-react";
import Pieds from "./componenet/Pieds";
import { useI18nStore } from "src/store/i18n/i18nStore";
import { useTranslation } from "src/hooks/useTranslation";

const Blog = () => {
  const [active, setActive] = useState("Blog");

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

  const images = ["blog9.jpg", "blog10.jpg"];

  const imagess = ["blog1.jpg", "blog.jpg", "blog2.jpg", "blog11.jpg"];

  const imagesss = ["blog14.jpg", "blog13.jpg", "blog15.jpg", "blog3.jpg"];

  const imagessss = ["equip10.jpg", "projet2.jpg", "blogf4.jpg"];

  const imagesssss = ["team4.jpg", "blog.jpg", "team2.jpg"];

  const imagessssss = [
    { src: "facbook.png", link: "https://facebook.com" },
    { src: "instagram.jpg", link: "https://instagram.com" },
    { src: "x.jpg", link: "https://x.com" },
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

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-semibold text-gray-700 mb-12 text-center">
              <span className="font-bold border-b-4 border-green-600 pb-1">
                Blog
              </span>
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-12">
              METROCALIB is a leading biomedical company in Africa, specializing
              in the sale of medical equipment and providing comprehensive
              services to healthcare facilities. Our mission is to enhance
              healthcare standards through quality products and expert support.
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-9 mb-1">
              {imagess.map((src, index) => (
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

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mt-4 mb-1">
              {imagesss.map((src, index) => (
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

        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-[#599E0E] mb-8">
              Découvrez notre vidéo
            </h2>

            <video
              src="/ma_video.mp4"
              controls
              className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
            />
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6 text-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 mb-1">
              {imagessss.map((src, index) => (
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

        <section className="bg-gradient-to-r from-green-100 to-blue-100 py-20 my-14">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12 text-center">
              Meet Our Team
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-12">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {imagesssss.map((src, index) => (
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

        <section className="py-20 my-14">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12 text-center">
              Our platforms
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto mb-12">
              Here are the digital solutions we offer to you, contact us
            </p>

            {/* grille 2 colonnes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {imagessssss.map((item, index) => (
                <motion.div
                  key={item.src}
                  className="w-full h-70 overflow-hidden rounded-lg"
                  variants={imageVariant}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: false, amount: 0.2 }}
                >
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    <img
                      src={item.src}
                      alt={`logo-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </a>
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

export default Blog;
