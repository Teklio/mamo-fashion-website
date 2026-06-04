"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
    const [videoSrc, setVideoSrc] = useState<string>("");

    useEffect(() => {
        const getSrc = () => {
            const width = window.innerWidth;
            if (width < 768) {
                return "/assets/mobile.MOV";
            } else if (width < 1024) {
                return "/assets/tab.MOV";
            } else {
                return "/assets/desk.MOV";
            }
        };

        // Set the initial source on mount
        setVideoSrc(getSrc());

        const handleResize = () => {
            const currentSrc = getSrc();
            setVideoSrc((prev) => (prev !== currentSrc ? currentSrc : prev));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <section className="relative w-full h-[75vh] md:h-screen overflow-hidden flex items-center justify-center bg-black">
            {/* Background Video */}
            <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none">
                {videoSrc ? (
                    <video
                        key={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        src={videoSrc}
                        className="absolute top-1/2 left-1/2 min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover w-full h-full scale-[1.01]"
                    />
                ) : (
                    // Optional placeholder background during server side rendering or initial load
                    <div className="w-full h-full bg-black" />
                )}
                {/* Ambient Overlay for dark contrast and premium feel */}
                <div className="absolute inset-0 bg-linear-to-b from-black/50 via-black/25 to-black/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center select-none">
                <h1 className="text-white text-5xl md:text-7xl font-serif tracking-normal leading-[1.1] mb-8 font-light animate-fade-in-up">
                    Endless Escape
                </h1>

                <div className="animate-fade-in-up-delayed">
                    <Link
                        href="/shop"
                        className="group relative inline-flex rounded-xl items-center justify-center px-14 py-4 border border-white/40 hover:border-white text-[10px] md:text-xs tracking-[0.25em] text-white font-medium bg-black/10 backdrop-blur-sm transition-all duration-500 overflow-hidden"
                    >
                        {/* Slide up background effect */}
                        <span className="absolute inset-0 w-full h-full bg-white scale-y-0 origin-bottom group-hover:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <span className="relative z-10 group-hover:text-black transition-colors duration-500">
                            DISCOVER COLLECTION
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}


