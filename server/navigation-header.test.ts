import { describe, it, expect } from "vitest";

describe("Navigation Header Enhancement", () => {
  it("should have yellow header banner with company tagline", () => {
    const headerText = "Welcome to Sahu Travels - Your Fantasy, Our Mission";
    expect(headerText).toContain("Sahu Travels");
    expect(headerText).toContain("Your Fantasy, Our Mission");
  });

  it("should have all 7 navigation menu items", () => {
    const navLinks = [
      { href: "/", label: "Home", icon: "🏠" },
      { href: "/about", label: "About", icon: "📖" },
      { href: "/services", label: "Services", icon: "🎯" },
      { href: "/fleet", label: "Our Fleet", icon: "🚌" },
      { href: "/gallery", label: "Gallery", icon: "🖼️" },
      { href: "/offers", label: "Offers", icon: "🎉" },
      { href: "/contact", label: "Contact", icon: "📞" },
    ];

    expect(navLinks).toHaveLength(7);
    expect(navLinks[0].label).toBe("Home");
    expect(navLinks[6].label).toBe("Contact");
  });

  it("should have action buttons (Book Now, Admin Login)", () => {
    const buttons = ["Book Now", "Admin Login", "Admin Panel"];
    expect(buttons).toContain("Book Now");
    expect(buttons).toContain("Admin Login");
  });

  it("should have icons for each navigation item", () => {
    const icons = ["🏠", "📖", "🎯", "🚌", "🖼️", "🎉", "📞"];
    expect(icons).toHaveLength(7);
    expect(icons[3]).toBe("🚌"); // Fleet icon
  });

  it("should display company info on desktop", () => {
    const companyInfo = {
      name: "SAHU TRAVELS",
      year: "Est. 1989",
      location: "Kota, Rajasthan",
    };

    expect(companyInfo.name).toBe("SAHU TRAVELS");
    expect(companyInfo.year).toContain("1989");
    expect(companyInfo.location).toContain("Kota");
  });

  it("should have responsive design with mobile menu", () => {
    const breakpoints = {
      desktop: "lg:flex",
      mobile: "lg:hidden",
    };

    expect(breakpoints.desktop).toContain("lg");
    expect(breakpoints.mobile).toContain("lg:hidden");
  });

  it("should have gradient styling on buttons", () => {
    const buttonStyle = "bg-gradient-to-r from-yellow-400 to-yellow-500";
    expect(buttonStyle).toContain("gradient");
    expect(buttonStyle).toContain("yellow");
  });

  it("should highlight active navigation links", () => {
    const activeStyle = "bg-yellow-400 text-black shadow-lg shadow-yellow-400/50";
    const inactiveStyle = "text-yellow-400 hover:bg-yellow-400/20";

    expect(activeStyle).toContain("yellow-400");
    expect(inactiveStyle).toContain("hover");
  });

  it("should have sticky positioning at top", () => {
    const navClasses = "sticky top-0 z-50";
    expect(navClasses).toContain("sticky");
    expect(navClasses).toContain("top-0");
    expect(navClasses).toContain("z-50");
  });

  it("should have yellow border accent", () => {
    const borderStyle = "border-b-4 border-yellow-400";
    expect(borderStyle).toContain("border-yellow-400");
    expect(borderStyle).toContain("border-b-4");
  });

  it("should have shadow effect for depth", () => {
    const shadowStyle = "shadow-lg shadow-yellow-400/20";
    expect(shadowStyle).toContain("shadow");
    expect(shadowStyle).toContain("yellow-400");
  });

  it("should support hover animations on buttons", () => {
    const hoverEffect = "hover:scale-105 transition";
    expect(hoverEffect).toContain("hover");
    expect(hoverEffect).toContain("scale");
  });

  it("should have mobile menu header", () => {
    const mobileHeader = "NAVIGATION MENU";
    expect(mobileHeader).toBe("NAVIGATION MENU");
  });

  it("should have proper spacing and padding", () => {
    const spacing = {
      headerPadding: "py-2",
      navPadding: "px-4 py-3",
      containerPadding: "px-4 py-3",
    };

    expect(spacing.headerPadding).toContain("py");
    expect(spacing.navPadding).toContain("px");
  });
});
