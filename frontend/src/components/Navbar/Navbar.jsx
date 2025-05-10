import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null); // Reference for the mobile menu

  const links = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "admin Profile", link: "/profile" },
  ];

  // Implementing slice to hide cart
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  //removal of about page if logout
  if (isLoggedIn === false) {
    links.splice(1, 1); // Remove "AboutUs", "Profile" links if not logged in
  }
  //removal of about page if login
  if (isLoggedIn === true) {
    links.splice(1, 1); // Remove "Aboutus", "Profile" links if not logged
  }

  if (isLoggedIn === false) {
    links.splice(2, 3); // Remove "Cart", "Profile" links if not logged in
  }

  //removing admin profile from user view
  if (isLoggedIn === true && role === "user") {
    links.splice(4, 1);
  }

  //removing cart and user profile from admin views
  if (isLoggedIn === true && role === "admin") {
    links.splice(2, 2);
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev); // Toggle the mobile menu state
  };

  // Close the mobile menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-zinc-800 text-white px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433749.png"
            alt="logo"
          />
          <span className="text-2xl font-semibold">BookHeaven</span>
        </Link>
        <div className="nav-links-bookheaven flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((item, i) => (
              <div className="flex items-center" key={item.title}>
                {" "}
                {/* Use item.title as key */}
                {item.title === "Profile" || item.title === "admin Profile" ? (
                  <Link
                    to={item.link}
                    className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300"
                    key={i}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Link
                    to={item.link}
                    className="hover:text-blue-500 transition-all duration-300"
                  >
                    {item.title}{" "}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:flex gap-4">
            {isLoggedIn === false && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-center h-10 pt-2 text-white"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc-500 text-white transition-all duration-300 text-center h-10 pt-2"
                  onClick={() => setMobileMenuOpen(false)} // Close menu on link click
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          <button
            className="text-white text-2xl hover:text-zinc-400 md:hidden"
            onClick={toggleMobileMenu}
          >
            <FaGripLines />
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef} // Attach the ref to the mobile menu
        className={`bg-zinc-800 w-full z-40 flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen ? "max-h-screen" : "max-h-0 overflow-hidden"
        }`}
      >
        {links.map((item, index) => (
          <Link
            to={item.link}
            className="text-white text-xl hover:text-pink-500 transition-all duration-300 py-2 border-b border-zinc-600 flex items-center justify-center"
            key={index} // Use item.title as key
            onClick={() => setMobileMenuOpen(false)} // Close menu on link click
          >
            {item.title}
          </Link>
        ))}
        <div className="flex flex-col mb-4">
          {isLoggedIn === false && (
            <>
              <Link
                to="/login"
                className="px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300 text-center h-10 pt-2 text-white"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 bg-blue-500 rounded hover:bg-white hover:text-zinc text-white transition-all duration-300 text-center h-10 pt-2"
                onClick={() => setMobileMenuOpen(false)} // Close menu on link click
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
