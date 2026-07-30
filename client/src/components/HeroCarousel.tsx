import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  ctaLink?: string;
}

const defaultSlides: Slide[] = [
  {
    id: 1,
    title: "Experience Luxury Travel",
    subtitle: "Premium bus services across Rajasthan and beyond",
    image: "https://images.unsplash.com/photo-1599751676097-8b2ba9e5e4d8?w=1200&h=600&fit=crop",
    cta: "Book Your Journey",
    ctaLink: "/booking",
  },
  {
    id: 2,
    title: "Comfort Redefined",
    subtitle: "AC and Non-AC buses with world-class amenities",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
    cta: "Explore Fleet",
    ctaLink: "/fleet",
  },
  {
    id: 3,
    title: "Your Fantasy - Our Mission",
    subtitle: "Trusted by over 2000+ clients since 1989",
    image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&h=600&fit=crop",
    cta: "Learn Our Story",
    ctaLink: "/about",
  },
  {
    id: 4,
    title: "Safe & Reliable",
    subtitle: "GPS-enabled buses with 24/7 customer support",
    image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop",
    cta: "Contact Us",
    ctaLink: "/contact",
  },
];

interface HeroCarouselProps {
  slides?: Slide[];
}

export default function HeroCarousel({ slides = defaultSlides }: HeroCarouselProps) {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const displaySlides = slides && slides.length > 0 ? slides : defaultSlides;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, displaySlides.length]);

  const goToSlide = (index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const handleCtaClick = (ctaLink?: string) => {
    if (ctaLink) {
      setLocation(ctaLink);
    }
  };

  return (
    <div
      className="relative w-full h-[480px] sm:h-[550px] md:h-[620px] lg:h-[680px] max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Yellow Accent Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              {/* Badge */}
              <div className="mb-6 inline-block px-6 py-2 bg-yellow-400 text-black font-bold rounded-full text-sm md:text-base animate-slideInDown">
                Slide {index + 1} of {displaySlides.length}
              </div>

              {/* Title */}
              <h2
                className={`text-4xl md:text-6xl font-bold text-white mb-4 max-w-4xl transition-all duration-500 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {slide.title}
              </h2>

              {/* Subtitle */}
              <p
                className={`text-lg md:text-2xl text-gray-200 mb-8 max-w-2xl transition-all duration-500 delay-100 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {slide.subtitle}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => handleCtaClick(slide.ctaLink)}
                className={`px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold rounded-lg transition-all duration-500 delay-200 transform hover:scale-105 ${
                  index === currentSlide
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "bg-yellow-400 w-8 h-3"
                : "bg-white/50 hover:bg-white/75 w-3 h-3"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 px-4 py-2 bg-black/50 border border-yellow-400 rounded-lg text-white font-bold text-sm md:text-base">
        {currentSlide + 1} / {displaySlides.length}
      </div>

      {/* Gradient Divider at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
    </div>
  );
}
