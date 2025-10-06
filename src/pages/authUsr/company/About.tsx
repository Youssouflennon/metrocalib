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

const About = () => {
  const [active, setActive] = useState("");

  const navigate = useNavigate();

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
                About Us
              </span>
            </h2>{" "}
            <p className="text-gray-700 max-w-3xl mx-auto mb-12">
              Founded in 2016 and located in Yaoundé Bastos, METROCALIB is a
              dedicated biomedical company committed to enhancing healthcare in
              Cameroon. With a focus on quality, local expertise, and global
              standards, we strive to be the go-to partner for healthcare
              institutions, ensuring they have the best equipment and support
              available. Home ~ About
            </p>
            {/* grille 2 colonnes */}
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-100 to-blue-100 py-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 flex items-center justify-center">
              <img
                src="About1.png"
                alt="Hero equipment"
                className="max-w-xs w-full h-auto object-contain animate-bounce"
              />
            </div>

            <div className="flex-1">
              <div>
                <img
                  src="sloution-box-right-img.png"
                  alt="Hero equipment"
                  className="rounded-lg my-2"
                />
              </div>
              <h2 className="text-3xl font-bold text-[#599E0E] mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-700 mb-4">
                We’d love to hear from you! For inquiries, consultations, or to
                learn more about our services, please contact us at: 📞
              </p>
              <p className="text-2xl font-bold text-[#599E0E]">
                (+237) 673 186 728
              </p>
              <button
                onClick={() => navigate("/contact")}
                className="bg-[#599E0E] text-white px-8 py-3 rounded-full font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 mt-8"
              >
                Contact us
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 ">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            {/* Colonne gauche : ta section Services */}
            <div>
              <h2 className="text-3xl font-bold text-[#599E0E] mb-12 text-center">
                What We Do
              </h2>

              <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                At METROCALIB, we offer comprehensive services tailored to meet
                the needs of healthcare professionals. Our core offerings
                include the supply of certified medical devices, expert
                installation, and ongoing maintenance with 24/7 emergency
                support. We also provide essential training and consulting to
                empower your staff with the skills needed for effective medical
                equipment use.
              </p>
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
                    Equipment Supply
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    We provide high-quality, certified medical devices from
                    renowned global manufacturers, ensuring that healthcare
                    facilities have access to the latest technology and
                    equipment needed for optimal patient care.
                  </p>
                  <a href="#" className="text-[#599E0E] font-semibold">
                    Learn More &gt;
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
                      src="service-icon2.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    Installation & Maintenance{" "}
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    Our dedicated team offers expert installation and ongoing
                    maintenance services, including 24/7 emergency support, to
                    ensure that all medical equipment operates smoothly and
                    efficiently, minimizing downtime.
                  </p>
                  <a href="#" className="text-[#599E0E] font-semibold">
                    Learn More &gt;
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
                      src="service-icon3.png"
                      alt="Hero equipment"
                      className="rounded-lg my-2"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-[#599E0E] mb-3">
                    Training & Consulting
                  </h3>
                  <p className="text-gray-700 mb-4 font-bold">
                    We empower healthcare professionals through comprehensive
                    training programs and technical consulting, enhancing staff
                    skills and ensuring effective utilization of medical
                    equipment for improved healthcare outcomes.
                  </p>
                  <a href="#" className="text-[#599E0E] font-semibold">
                    Learn More &gt;
                  </a>
                </motion.div>
              </div>
            </div>

            {/* Colonne droite : Image avec effet */}
            <div className="relative w-full hidden lg:block">
              <img
                src="M3.png"
                alt="Illustration Services"
                className=" object-contain animate-pulse"
                style={{
                  position: "absolute",
                  top: -450,
                  right: -220,
                  width: "320px", // équivalent w-80
                  height: "520px", // équivalent h-80
                  objectFit: "contain",
                  animation: "pulse 2s infinite",
                }}
              />
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-green-100 to-blue-100 py-16">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
            <motion.div
              className="flex-1  font-bold text-2xl"
              initial={{ x: -200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, amount: 0.2 }} // une seule fois
            >
              <div>
                1. Our maintenance department, composed of engineers and
                technicians, operates Monday to Friday from 9:00 a.m. to 5:00
                p.m., and during weekends in case of major emergencies.{" "}
              </div>

              <div>
                2. Our technicians carry out interventions using vehicles
                equipped with all necessary equipment.{" "}
              </div>

              <div>
                3. We deliver our machines from the best Western countries in
                the shortest possible time.
              </div>

              <div>
                4. After each intervention, a technical report is sent to the
                customer, specifying the nature of any follow-up needed, which
                can be carried out by the company chosen by the customer.
              </div>

              <div>
                5. Our engineering team is available 24/7, both physically and
                by phone, to guide hospital staff.
              </div>
            </motion.div>
            {/* Image animée (de la droite) */}
            <motion.div
              className="flex-1 flex items-center justify-center"
              initial={{ x: 200, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.2 }} // se rejoue à chaque scroll
            >
              <video
                src="/ma_video.mp4"
                controls
                className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
              />
            </motion.div>

            {/* Texte animé (de la gauche) */}
          </div>
        </section>

        <section className="py-28 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#599E0E] mb-12">
              <span className="text-[#1aafc9e2]"> Our</span> Partners
            </h2>

            <p className="mb-12">
              We collaborate with leading global manufacturers and esteemed
              healthcare institutions to bring you the highest quality medical
              equipment and services.
            </p>

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

        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-1 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#599E0E] mb-12 text-center">
                To Get More Information
              </h2>
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

export default About;
