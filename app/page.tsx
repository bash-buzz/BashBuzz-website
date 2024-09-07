'use client'

import { Button } from "@/components/ui/button"
import { Download, Github, Check, Menu, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Home() {
  const [isDownloading, setIsDownloading] = useState(false)
  const [welcomeText, setWelcomeText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const fullText = "Welcome to BashBuzz."

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.3 // Increased threshold to 30% so that animations only trigger when more of the element is visible
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetElement = entry.target as HTMLElement;
          targetElement.classList.remove('animate-fade-in-up');
          void targetElement.offsetWidth; // Trigger reflow
          targetElement.classList.add('animate-fade-in-up');
        }
      })
    }, observerOptions)

    // Only target elements that require scrolling animations
    const scrollElements = document.querySelectorAll('.animate-on-scroll');
    scrollElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const typingInterval = 7;
    const deletingInterval = 4;
    const pauseInterval = 200;
    const longPauseInterval = 2000; // Increased pause before deleting
    let hasLongPaused = false; // Track if the long pause has been applied
  
    const typeEffect = () => {
      const currentLength = welcomeText.length;
  
      if (!isDeleting && currentLength < fullText.length) {
        setWelcomeText(fullText.slice(0, currentLength + 1));
        timer = setTimeout(typeEffect, typingInterval);
      } else if (!isDeleting && currentLength === fullText.length && !hasLongPaused) {
        // Apply the long pause once after reaching full text
        hasLongPaused = true;
        timer = setTimeout(typeEffect, longPauseInterval);
      } else if (!isDeleting && currentLength === fullText.length) {
        setIsDeleting(true);
        timer = setTimeout(typeEffect, deletingInterval);
      } else if (isDeleting && currentLength > 0) {
        setWelcomeText(fullText.slice(0, currentLength - 1));
        timer = setTimeout(typeEffect, deletingInterval);
      } else if (currentLength === 0) {
        setIsDeleting(false);
        hasLongPaused = false; // Reset for the next cycle
        timer = setTimeout(typeEffect, pauseInterval);
      }
    };
  
    timer = setTimeout(typeEffect, pauseInterval);
  
    return () => {
      clearTimeout(timer);
    };
  }, [welcomeText, isDeleting]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
    }, 3000); // Reset after 3 seconds
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const scrollToMain = () => {
    const mainSection = document.getElementById('main-section');
    if (mainSection) {
      mainSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-green-700">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-green-900 bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60 animate-on-scroll">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={scrollToMain}>
            <Image
              src="https://i.imgur.com/bxSliZ3.png"
              alt="BashBuzz Logo"
              width={24}
              height={24}
              className="animate-fade-in"
            />
            <span className="font-bold text-green-700">BashBuzz</span>
          </div>
          <button className="sm:hidden text-green-700" onClick={toggleMenu} aria-label="Toggle menu">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <nav className={`absolute left-0 right-0 top-14 bg-black/95 sm:bg-transparent sm:static sm:flex transition-all duration-300 ease-in-out ${menuOpen ? 'flex flex-col' : 'hidden'} sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 sm:p-0`}>
            <Link href="#features" className="text-green-700 hover:text-green-500" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="#about" className="text-green-700 hover:text-green-500" onClick={() => setMenuOpen(false)}>About Us</Link>
            <Button
              className="bg-green-700 hover:bg-green-600 active:bg-green-500 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => {
                handleDownload();
                setMenuOpen(false);
              }}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <Check className="mr-2 h-4 w-4 animate-bounce" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {isDownloading ? "Coming Soon!" : "Download"}
            </Button>
          </nav>
        </div>
      </header>

      <main id="main-section" className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Image
                src="https://i.imgur.com/bxSliZ3.png"
                alt="BashBuzz Logo"
                width={100}
                height={100}
                className="shadow-lg animate-fade-in-up"
              />
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-green-700">
                  {welcomeText}
                  <span className="animate-blink">|</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-green-600 md:text-xl animate-fade-in-up">
                  The social media platform for terminal lovers. Connect, share, and engage through your command line.
                </p>
              </div>
              <Button
                className="bg-green-700 hover:bg-green-600 active:bg-green-500 text-black shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-in-up"
                size="lg"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <Check className="mr-2 h-4 w-4 animate-bounce" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isDownloading ? "Coming Soon!" : "Download Now"}
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-green-950 animate-on-scroll">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-green-700 mb-8 animate-fade-in-up">Features</h2>
            <ul className="mt-6 grid gap-6 md:grid-cols-2">
              {[
                { title: "Command-line Interface", description: "Interact with your social network using familiar terminal commands." },
                { title: "Proper and Secure Authorization System", description: "Your credentials are hashed and secured in a secure server." }
              ].map((feature, index) => (
                <li key={index} className="flex items-start space-x-4 animate-fade-in-up">
                  <Image
                    src="https://i.imgur.com/bxSliZ3.png"
                    alt="BashBuzz Logo"
                    width={24}
                    height={24}
                  />
                  <div>
                    <h3 className="font-bold text-green-600">{feature.title}</h3>
                    <p className="text-green-700">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 animate-on-scroll">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-green-700 animate-fade-in-up">About Us</h2>
            <div className="grid gap-12 md:grid-cols-2">
              {[
                {
                  name: "Spral",
                  role: "Full-stack developer",
                  description: "Full-stack web developer with 5 years of experience and internships at Harvard and NASA. With his expertise, Spral brings the backend (express.js web server) to BashBuzz.",
                  imageSrc: "https://i.imgur.com/49jiuJr.png",
                  link: "https://spral.dev",
                  github: "https://github.com/spraldev"
                },
                {
                  name: "Laveden",
                  role: "Hacker",
                  description: "A decent hacker that is great at coding and math. Laveden's favorite tools are nikto, metasploit, and bettercap. Laveden brings the frontend to BashBuzz (and part of the website).",
                  imageSrc: "https://cdn.discordapp.com/avatars/1140762247770148986/cd5da73f42abde47c464ed8670b2c332.webp?size=240",
                  link: "https://youareanidiot.cc",
                  github: "https://github.com/LavedenC1"
                }
              ].map((dev, index) => (
                <div key={index} className="flex flex-col items-center text-center animate-fade-in-up">
                  <Image
                    alt={dev.name}
                    className="rounded-full mb-4 shadow-lg border-4 border-green-700"
                    height={150}
                    src={dev.imageSrc}
                    style={{
                      aspectRatio: "150/150",
                      objectFit: "cover",
                    }}
                    width={150}
                  />
                  <Link href={dev.link}>
                    <h3 className="text-xl font-bold text-green-600 hover:underline">{dev.name}</h3>
                  </Link>
                  <p className="text-green-700 mt-2">{dev.description}</p>
                  <div className="flex space-x-4 mt-4">
                    <Link href={dev.github} className="text-green-700 hover:text-green-500">
                      <Github className="h-6 w-6" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-green-950 animate-on-scroll">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={scrollToMain}>
              <Image
                src="https://i.imgur.com/bxSliZ3.png"
                alt="BashBuzz Logo"
                width={24}
                height={24}
              />
              <span className="font-bold text-green-700">BashBuzz</span>
            </div>
            <p className="text-center text-sm text-green-700">
              © 2023 BashBuzz. All rights reserved.
            </p>
            <nav className="flex gap-4 sm:gap-6">
              <Link className="text-sm hover:underline underline-offset-4 text-green-700" href="#">
                Terms of Service
              </Link>
              <Link className="text-sm hover:underline underline-offset-4 text-green-700" href="#">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  )
}
