import React from "react";
import Hero from "./components/hero";
import Features from "./components/features";
import Services from "./components/services";
import GetService from "./Pages/getService";
import Virtual from "./components/Virtual";
import Faq from "./components/Faq";
import Reviews from "./components/review";


export default function FakeRoot(){
    return (
        <>
            <Hero/>
            <Features/>
            <Services/>
            <GetService/>
            <Virtual/>
            <Faq/>
            <Reviews/>
        </>    
    )
}