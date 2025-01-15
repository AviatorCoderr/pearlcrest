import React from "react";
import Navbar from "./Navbar";
import Showcase from "./Showcase";
import Pillarmem from "./Pillars";
import Features from "./Features";
import Footer from "./Footer";
import MeetDev from "./MeetDeveloper";
import Reviews from "./Reviews";

function Home() {
    return (
        <div>
            <Navbar />
            {/* Scrolling Notice Bar */}
            <div className="bg-yellow-300 text-black py-2 border-b border-gray-400 overflow-hidden relative">
                <div className="flex items-center animate-marquee whitespace-nowrap space-x-10">
                    <a href="/votereg" className="font-bold">
                    Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
                    </a>
                    <a href="/votereg" className="font-bold">
                    Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
                    </a>
                    <a href="/votereg" className="font-bold">
                    Pearl Crest Society Elections 2025 are going to be held soon. Stay updated! Click here for more details.
                    </a>
                </div>
            </div>

            <Showcase />
            <Pillarmem />
            <Reviews />
            <Features />
            <MeetDev />
            <div className="m-auto flex justify-center flex-col md:flex-row items-center md:items-start gap-5 p-5 border border-gray-300 shadow-md rounded-lg">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3663.0372797605446!2d85.28538487352036!3d23.350663904008446!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e164c8ab1781%3A0x6d17478859a521!2sPearl%20Crest%20Apartment!5e0!3m2!1sen!2sin!4v1715569743437!5m2!1sen!2sin"
                    width="100%"
                    height="300"
                    allowFullScreen=""
                    loading="lazy"
                    className="rounded-lg"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-semibold mb-2">Nearby Landmarks</h3>
                    <ul className="list-disc pl-5">
                        <li className="mb-1">Railway Station: 5Km</li>
                        <li className="mb-1">Airport: 7.8Km</li>
                        <li className="mb-1">Rajbhawan: 5Km</li>
                        <li className="mb-1">High Court: 9Km</li>
                        <li className="mb-1">Kutchery: 6Km</li>
                        <li className="mb-1">Main Road: 6Km</li>
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Home;
