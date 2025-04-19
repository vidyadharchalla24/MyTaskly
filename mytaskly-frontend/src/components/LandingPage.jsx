import { useState } from "react";
import { Link } from "react-router-dom";
import { images, aboutHighlights, features, testimonials, contactInfo } from "../data";
import PricingPlansSection from "./PricingPlansSection";

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Form Submitted:", formData);
    alert("Your Feedback is submitted");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="font-[Poppins]">
      {/* Home Section */}
      <section
        id="home"
        className=" mt-5 pt-6 shadow-lg  rounded-2xl container min-h-5 flex items-center justify-center bg-[#23486A] text-white p-8 mx-auto"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6">
            <h1 className="text-4xl font-bold">
              <span className="block">Great software is</span>
              <span className="block text-5xl mt-2 text-[#EFB036]">
                built by great teams
              </span>
            </h1>
            <h3 className="text-lg mt-4">
              We help build and manage a team of world-class developers to bring
              your vision to life.
            </h3>
            <div className="mt-6 space-x-4">
              <Link
                to="/signup"
                className="inline-block mt-6 px-6 py-3 bg-[#EFB036] text-white font-semibold rounded-lg shadow-md  transition-all"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 p-6 flex justify-center">
            <img
              src={images.home}
              alt="Illustration of developers working"
              className="w-full max-w-lg rounded-lg"
            />
          </div>
        </div>
      </section>
      
      <section id="about" className="py-16 bg-[#3B6790] mt-9">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-center text-white">
              About <span className="text-[#EFB036]">Us</span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <img
                src={images.about}
                alt="Task Management Illustration"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">
                Stay Organized, Stay{" "}
                <span className="text-[#EFB036]">Productive</span>
              </h3>
              <p className="text-lg text-white mt-4 leading-relaxed">
                The <strong>Personal Goal Tracker</strong> is your all-in-one
                solution for managing tasks, tracking progress, and staying
                focused on your goals.
              </p>
              <div className="mt-6 space-y-4">
                {aboutHighlights.map(({ id, text }) => (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-[#EFB036] text-xl">&#10004;</span>
                    <p className="text-white">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-[#4C7B8B] mb-12">Key Features</h2>
          {features.map(
            ({ id, title, description, quote, image, reverse }, index) => (
              <div
                key={id}
                className={`flex flex-col md:flex-row ${
                  reverse ? "md:flex-row-reverse" : ""
                } items-center gap-8 mt-16 p-8 rounded-lg shadow-lg ${
                  index % 2 === 0 ? "bg-[#3B6790]" : "bg-[#23486A]"
                }`}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full md:w-1/2 h-auto max-h-64 object-cover rounded-lg shadow-md"
                />
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-4 text-white">{description}</p>
                  <blockquote className="mt-4 p-4 border-l-4 border-[#EFB036] italic text-white">
                    {quote}
                  </blockquote>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section id="pricing" className="py-16 bg-[#4C7B8B]">
        <PricingPlansSection />
      </section>

      <section id="testimonials" className="py-16 bg-gray-50 text-[Poppins] min-h-[450px]">
        <div className="container mx-auto text-center px-4 md:px-16">
          <h2 className="text-3xl font-bold text-[#23486A]">
            What Our Users Say
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#3B6790] p-6 rounded-lg shadow-lg  min-h-[200px] "
              >
                <p className="text-white  mt-5">
                  "{testimonial.quote}"
                </p>
                <h4 className="mt-4 font-semibold text-white">
                  {testimonial.name}
                </h4>
                <p className="text-white text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className=" py-16 bg-[#3B6790] rounded-lg shadow-lg">
        <h2 className="text-3xl text-white font-bold text-center mb-12">
          Contact Us
        </h2>
        <div className="container bg-white mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3 rounded-lg overflow-hidden p-10 flex flex-col gap-6 ">
            <iframe
              width="100%"
              height="300"
              className="rounded-lg"
              title="map"
              src={contactInfo.mapUrl}
            ></iframe>
            <div className="p-6 rounded-lg shadow-md text-indigo-600">
              <h2 className="text-xl text-[#23486A] font-semibold">Contact Information</h2>
              <p className="mt-3 text-[#23486A]">{contactInfo.address}</p>
              <p className="mt-2 text-[#23486A]">
                Email:{" "}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-[#23486A]"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p className="mt-2 text-[#23486A]">Phone: {contactInfo.phone}</p>
            </div>
          </div>
          <div className="md:w-1/3 p-8 rounded-lg shadow-lg bg-[#23486A]">
            <h2 className="text-2xl font-semibold text-white">Send us a message</h2>
            <p className="text-white mt-2">We'd love to hear from you!</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 text-black rounded border border-gray-600 focus:ring-2 focus:ring-indigo-400"
              />
              
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 text-black rounded border border-gray-600 focus:ring-2 focus:ring-indigo-400"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 text-black rounded border border-gray-600 focus:ring-2 focus:ring-indigo-400"
              ></textarea>
              <button
                type="submit"
                className="w-full py-3 bg-[#EFB036] rounded-lg text-white font-semibold"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
