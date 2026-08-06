"use client"

import Image from "next/image"
import Link from "next/link"
import DesktopMenu from "./DesktopMenu.client"
import MobileMenu from "./MobileMenu.client"
import BookFlightButton from "./BookFlightButton"

export default function Navbar() {
  // Dark navy top nav (client brief §8) with a low-opacity champagne hairline.
  // Loader-driven hide/show still targets [data-site-navbar] from globals.css.
  // The logo PNG is dark navy, so it gets an off-white filter treatment on
  // this surface until the final logo arrives.
  return (
    <header
      data-site-navbar="true"
      className="fixed top-0 left-0 z-50 w-full border-b border-champagne/25 bg-navy transition-colors duration-500"
    >
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 md:h-[84px] lg:px-8"
      >
        <div className="w-10 sm:w-11 md:hidden" />

        <Link href="/" className="flex items-center">
          <Image
            src="/assets/images/Midline_Airlines.png"
            alt="Midline Aviation"
            width={150}
            height={40}
            sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 170px"
            className="h-10 w-auto sm:h-11 md:h-14 lg:h-16 [filter:brightness(0)_invert(0.93)_sepia(0.14)]"
            priority
          />
        </Link>

        <div className="hidden flex-1 justify-center md:flex">
          <DesktopMenu />
        </div>

        <div className="hidden md:flex md:items-center">
          <BookFlightButton />
        </div>

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </nav>
    </header>
  )
}
