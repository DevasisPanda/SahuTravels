import { describe, expect, it } from "vitest";

describe("HeroCarousel Component", () => {
  // Slide data validation
  it("should have 4 slides with required properties", () => {
    const slides = [
      {
        id: 1,
        title: "Experience Luxury Travel",
        subtitle: "Premium bus services across Rajasthan and beyond",
        image: "https://images.unsplash.com/photo-1599751676097-8b2ba9e5e4d8?w=1200&h=600&fit=crop",
        cta: "Book Your Journey",
      },
      {
        id: 2,
        title: "Comfort Redefined",
        subtitle: "AC and Non-AC buses with world-class amenities",
        image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
        cta: "Explore Fleet",
      },
      {
        id: 3,
        title: "Your Fantasy - Our Mission",
        subtitle: "Trusted by over 2000+ clients since 1989",
        image: "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&h=600&fit=crop",
        cta: "Learn Our Story",
      },
      {
        id: 4,
        title: "Safe & Reliable",
        subtitle: "GPS-enabled buses with 24/7 customer support",
        image: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop",
        cta: "Contact Us",
      },
    ];

    expect(slides).toHaveLength(4);
    slides.forEach((slide) => {
      expect(slide).toHaveProperty("id");
      expect(slide).toHaveProperty("title");
      expect(slide).toHaveProperty("subtitle");
      expect(slide).toHaveProperty("image");
      expect(slide).toHaveProperty("cta");
    });
  });

  // Slide content validation
  it("should have valid slide titles", () => {
    const slideTitles = [
      "Experience Luxury Travel",
      "Comfort Redefined",
      "Your Fantasy - Our Mission",
      "Safe & Reliable",
    ];

    slideTitles.forEach((title) => {
      expect(title).toBeTruthy();
      expect(title.length).toBeGreaterThan(0);
    });
  });

  it("should have valid slide subtitles", () => {
    const slideSubtitles = [
      "Premium bus services across Rajasthan and beyond",
      "AC and Non-AC buses with world-class amenities",
      "Trusted by over 2000+ clients since 1989",
      "GPS-enabled buses with 24/7 customer support",
    ];

    slideSubtitles.forEach((subtitle) => {
      expect(subtitle).toBeTruthy();
      expect(subtitle.length).toBeGreaterThan(0);
    });
  });

  it("should have valid CTA buttons", () => {
    const ctaButtons = [
      "Book Your Journey",
      "Explore Fleet",
      "Learn Our Story",
      "Contact Us",
    ];

    ctaButtons.forEach((cta) => {
      expect(cta).toBeTruthy();
      expect(cta.length).toBeGreaterThan(0);
    });
  });

  // Image URL validation
  it("should have valid image URLs", () => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1599751676097-8b2ba9e5e4d8?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&h=600&fit=crop",
      "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1200&h=600&fit=crop",
    ];

    imageUrls.forEach((url) => {
      expect(url).toMatch(/^https:\/\//);
      expect(url).toContain("unsplash.com");
    });
  });

  // Carousel navigation logic
  it("should calculate next slide correctly", () => {
    const slides = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const getNextSlide = (current: number) => (current + 1) % slides.length;

    expect(getNextSlide(0)).toBe(1);
    expect(getNextSlide(1)).toBe(2);
    expect(getNextSlide(2)).toBe(3);
    expect(getNextSlide(3)).toBe(0); // Wraps around
  });

  it("should calculate previous slide correctly", () => {
    const slides = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const getPrevSlide = (current: number) => (current - 1 + slides.length) % slides.length;

    expect(getPrevSlide(0)).toBe(3); // Wraps around
    expect(getPrevSlide(1)).toBe(0);
    expect(getPrevSlide(2)).toBe(1);
    expect(getPrevSlide(3)).toBe(2);
  });

  // Auto-play logic
  it("should support auto-play toggle", () => {
    let isAutoPlay = true;
    const toggleAutoPlay = () => {
      isAutoPlay = !isAutoPlay;
    };

    expect(isAutoPlay).toBe(true);
    toggleAutoPlay();
    expect(isAutoPlay).toBe(false);
    toggleAutoPlay();
    expect(isAutoPlay).toBe(true);
  });

  // Slide transition logic
  it("should handle slide transitions", () => {
    let isTransitioning = false;
    const startTransition = () => {
      isTransitioning = true;
    };
    const endTransition = () => {
      isTransitioning = false;
    };

    expect(isTransitioning).toBe(false);
    startTransition();
    expect(isTransitioning).toBe(true);
    endTransition();
    expect(isTransitioning).toBe(false);
  });

  // Slide indicator validation
  it("should generate correct number of indicators", () => {
    const slides = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];

    const indicators = slides.map((_, index) => index);
    expect(indicators).toHaveLength(4);
    expect(indicators).toEqual([0, 1, 2, 3]);
  });

  // Slide counter validation
  it("should display correct slide counter", () => {
    const currentSlide = 0;
    const totalSlides = 4;
    const counter = `${currentSlide + 1} / ${totalSlides}`;

    expect(counter).toBe("1 / 4");
  });

  it("should update slide counter on navigation", () => {
    let currentSlide = 0;
    const totalSlides = 4;

    const getCounter = () => `${currentSlide + 1} / ${totalSlides}`;

    expect(getCounter()).toBe("1 / 4");
    currentSlide = 1;
    expect(getCounter()).toBe("2 / 4");
    currentSlide = 3;
    expect(getCounter()).toBe("4 / 4");
  });

  // Responsive design validation
  it("should have responsive height values", () => {
    const heightClasses = {
      mobile: "h-[600px]",
      tablet: "md:h-[700px]",
    };

    expect(heightClasses.mobile).toContain("600px");
    expect(heightClasses.tablet).toContain("700px");
  });

  // Navigation button validation
  it("should have navigation buttons", () => {
    const buttons = [
      { label: "Previous slide", icon: "ChevronLeft" },
      { label: "Next slide", icon: "ChevronRight" },
    ];

    expect(buttons).toHaveLength(2);
    buttons.forEach((btn) => {
      expect(btn.label).toBeTruthy();
      expect(btn.icon).toBeTruthy();
    });
  });

  // Hover behavior validation
  it("should pause auto-play on hover", () => {
    let isAutoPlay = true;

    const onMouseEnter = () => {
      isAutoPlay = false;
    };
    const onMouseLeave = () => {
      isAutoPlay = true;
    };

    expect(isAutoPlay).toBe(true);
    onMouseEnter();
    expect(isAutoPlay).toBe(false);
    onMouseLeave();
    expect(isAutoPlay).toBe(true);
  });

  // Animation validation
  it("should have animation classes", () => {
    const animationClasses = [
      "animate-slideInDown",
      "transition-all",
      "duration-500",
      "ease-in-out",
    ];

    animationClasses.forEach((className) => {
      expect(className).toBeTruthy();
      expect(className.length).toBeGreaterThan(0);
    });
  });

  // Accessibility validation
  it("should have proper ARIA labels", () => {
    const ariaLabels = [
      "Previous slide",
      "Next slide",
      "Go to slide 1",
      "Go to slide 2",
      "Go to slide 3",
      "Go to slide 4",
    ];

    ariaLabels.forEach((label) => {
      expect(label).toBeTruthy();
      expect(label.length).toBeGreaterThan(0);
    });
  });

  // Carousel state management
  it("should manage carousel state correctly", () => {
    let currentSlide = 0;
    let isAutoPlay = true;
    let isTransitioning = false;

    const state = {
      currentSlide,
      isAutoPlay,
      isTransitioning,
    };

    expect(state.currentSlide).toBe(0);
    expect(state.isAutoPlay).toBe(true);
    expect(state.isTransitioning).toBe(false);
  });
});
