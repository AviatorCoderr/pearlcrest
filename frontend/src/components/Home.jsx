import React from "react";
import Navbar from "./Navbar";
import Showcase from "./Showcase";
import Pillarmem from "./Pillars";
import Features from "./Features";
import Footer from "./Footer";
function Home(){
    return (
        <div>
            <Navbar />
            <Showcase />
            <Pillarmem />
            <Features />
            <Footer />
        </div>
    )
}

export default Home;