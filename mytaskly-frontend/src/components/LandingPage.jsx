import { useState } from "react";
import { Link } from "react-router-dom";
import { images, aboutHighlights, features, pricingPlans, testimonials, contactInfo } from "../data";

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
    console.log("Form Submitted:", formData);
    alert("Your Feedback is submitted");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div>
      {/* Home Section */}
      <section
        id="home"
        className="flex items-center justify-center min-h-screen bg-[#162436] text-white"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-6">
            <h1 className="text-4xl font-bold">
              <span className="block">Great software is</span>
              <span className="block text-5xl mt-2 text-pink-400">
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
                className="inline-block mt-6 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-all"
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
      
      <section id="about" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              About <span className="text-purple-600">Us</span>
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
              <h3 className="text-2xl font-bold text-gray-800">
                Stay Organized, Stay{" "}
                <span className="text-purple-600">Productive</span>
              </h3>
              <p className="text-lg text-gray-700 mt-4 leading-relaxed">
                The <strong>Personal Goal Tracker</strong> is your all-in-one
                solution for managing tasks, tracking progress, and staying
                focused on your goals.
              </p>
              <div className="mt-6 space-y-4">
                {aboutHighlights.map(({ id, text }) => (
                  <div key={id} className="flex items-center gap-3">
                    <span className="text-purple-600 text-xl">✔️</span>
                    <p className="text-gray-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          {features.map(
            ({ id, title, description, quote, image, reverse }, index) => (
              <div
                key={id}
                className={`flex flex-col md:flex-row ${
                  reverse ? "md:flex-row-reverse" : ""
                } items-center gap-8 mt-16 p-8 rounded-lg shadow-lg ${
                  index % 2 === 0 ? "bg-indigo-100" : "bg-purple-100"
                }`}
              >
                <img
                  src={image}
                  alt={title}
                  className="w-full md:w-1/2 h-auto max-h-64 object-cover rounded-lg shadow-md"
                />
                <div className="md:w-1/2">
                  <h3 className="text-xl font-semibold">{title}</h3>
                  <p className="mt-4 text-gray-700">{description}</p>
                  <blockquote className="mt-4 p-4 border-l-4 border-purple-600 italic text-gray-800">
                    {quote}
                  </blockquote>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      <section id="pricing" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">Pricing Plans</h2>
          <p className="text-gray-600 mt-2">
            Choose a plan that fits your personal or team workflow needs.
          </p>

          <div className="mt-8 flex flex-col md:flex-row justify-center gap-6">
            {pricingPlans.map(({ id, title, price, description, features }) => (
              <div key={id} className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-3xl font-bold">{price}</p>
                <p className="text-gray-600">{description}</p>
                <ul className="mt-4 text-gray-700 text-left space-y-2">
                  {features.map((feature, index) => (
                    <li key={index}>✔ {feature}</li>
                  ))}
                </ul>
                <button className="mt-6 px-6 py-2 bg-blue-500 text-white rounded">
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-50  min-h-[450px]">
        <div className="container mx-auto text-center px-4 md:px-16">
          <h2 className="text-3xl font-bold text-gray-800">
            What Our Users Say
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg  min-h-[200px] "
              >
                <p className="text-gray-700 italic mt-5">
                  "{testimonial.quote}"
                </p>
                <h4 className="mt-4 font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className=" py-16 bg-gray-100">
        <h2 className="text-3xl text-black font-bold text-center mb-12">
          Contact Us
        </h2>
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-2/3 rounded-lg overflow-hidden p-10 flex flex-col gap-6">
            <iframe
              width="100%"
              height="300"
              className="rounded-lg"
              title="map"
              src={contactInfo.mapUrl}
            ></iframe>
            <div className="p-6 rounded-lg shadow-md text-indigo-600">
              <h2 className="text-xl font-semibold">Contact Information</h2>
              <p className="mt-3">{contactInfo.address}</p>
              <p className="mt-2">
                Email:{" "}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-indigo-600"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p className="mt-2">Phone: {contactInfo.phone}</p>
            </div>
          </div>
          <div className="md:w-1/3 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold">Send us a message</h2>
            <p className="text-gray-400 mt-2">We'd love to hear from you!</p>
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
                className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white font-semibold"
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
