import React from "react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Showcase from "./Showcase";
import Pillarmem from "./Pillars";
import Features from "./Features";
import Footer from "./Footer";
import MeetDev from "./MeetDeveloper";
import Reviews from "./Reviews";

function Home() {
  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const marqueeVariants = {
    animate: {
      x: ["100%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 20,
          ease: "linear",
        },
      },
    },
  };

  const rotateVariants = {
    hidden: { rotate: -90, opacity: 0 },
    visible: { rotate: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const scaleUpVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const slideInLeftVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const slideInRightVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div>
      {/* Fixed Navbar */}
      <Navbar />

      {/* Scrolling Notice Bar */}
      <motion.div
        className="bg-yellow-300 text-black py-2 border-b border-gray-400 overflow-hidden" // mt-16 to account for fixed navbar height
        initial="hidden"
        whileInView="visible"
        variants={containerVariants}
      >
        <motion.div
          className="flex items-center whitespace-nowrap space-x-10"
          variants={marqueeVariants}
          animate="animate"
        >
          <a href="/votereg" className="font-bold">
            Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
          </a>
          <a href="/votereg" className="font-bold">
            Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
          </a>
          <a href="/votereg" className="font-bold">
            Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
          </a>
        </motion.div>
      </motion.div>

      {/* Showcase Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={childVariants}>
          <Showcase />
        </motion.div>
      </motion.div>

      {/* Pillars Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={rotateVariants}>
          <Pillarmem />
        </motion.div>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={scaleUpVariants}>
          <Reviews />
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={slideInLeftVariants}>
          <Features />
        </motion.div>
      </motion.div>

      {/* Meet Developer Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={slideInRightVariants}>
          <MeetDev />
        </motion.div>
      </motion.div>

      {/* Map and Landmarks Section */}
      <motion.div
        className="m-auto flex flex-col md:flex-row items-center gap-8 p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Google Map Embed */}
        <motion.div className="w-full md:w-1/2" variants={childVariants}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.0372797605446!2d85.28538487352036!3d23.350663904008446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e164c8ab1781%3A0x6d17478859a521!2sPearl%20Crest%20Apartment!5e0!3m2!1sen!2sin!4v1715569743437!5m2!1sen!2sin"
            width="100%"
            height="300"
            allowFullScreen=""
            loading="lazy"
            className="rounded-lg shadow-md"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>

        {/* Nearby Landmarks */}
        <motion.div className="w-full md:w-1/2" variants={childVariants}>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Nearby Landmarks</h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">Railway Station: 5Km</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">Airport: 7.8Km</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">Rajbhawan: 5Km</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">High Court: 9Km</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">Kutchery: 6Km</span>
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
              <span className="text-lg text-gray-700">Main Road: 6Km</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.div variants={childVariants}>
          <Footer />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;