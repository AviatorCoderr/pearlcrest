import React from "react";
import Navbar from "./Navbar";
import Showcase from "./Showcase";
import Pillarmem from "./Pillars";
import Features from "./Features";
import Footer from "./Footer";
import MeetDev from "./MeetDeveloper"
import Reviews from "./Reviews";
function Home(){
    return (
        <div>
            <Navbar />
            <Showcase />
            <Pillarmem />
            <Reviews />
            <Features />
            <MeetDev />
            <Footer />
        </div>
    )
}

export default Home;