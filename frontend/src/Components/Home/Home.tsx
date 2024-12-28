// import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="h-screen-no-nav bg-gray-100 p-4">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Find Your Perfect Vet
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Connecting pet owners with trusted veterinarians in your area.
        </p>
      </header>

      <section className="my-8">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-4">
          Featured Vets
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src="../../public/doc3.png"
              alt="Vet 1"
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl font-bold mt-2">Dr. Jane Smith</h3>
            <p className="text-gray-600">Specialization: Surgery</p>
            <p className="text-gray-600">Location: New York, NY</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src="../../public/doc3.png"
              alt="Vet 2"
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl font-bold mt-2">Dr. John Doe</h3>
            <p className="text-gray-600">Specialization: Dentistry</p>
            <p className="text-gray-600">Location: Los Angeles, CA</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <img
              src="../../public/doc3.png"
              alt="Vet 3"
              className="w-full h-48 object-cover rounded-md"
            />
            <h3 className="text-xl font-bold mt-2">Dr. Emily Johnson</h3>
            <p className="text-gray-600">Specialization: General Practice</p>
            <p className="text-gray-600">Location: Chicago, IL</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-4">
          Our Services
        </h2>
        <ul className="list-disc list-inside text-gray-900">
          <li>Routine Check-ups</li>
          <li>Vaccinations</li>
          <li>Emergency Care</li>
          <li>Dental Services</li>
          <li>Pet Surgery</li>
          <li>Nutrition Counseling</li>
        </ul>
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-4">
          Testimonials
        </h2>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-gray-600 italic">
            "I found the best vet for my dog through this site! The process was
            easy and the vet was amazing!"
          </p>
          <p className="text-right text-gray-800 font-bold">- Sarah K.</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 mt-4">
          <p className="text-gray-600 italic">
            "Highly recommend! The vet was very caring and knowledgeable."
          </p>
          <p className="text-right text-gray-800 font-bold">- Mike L.</p>
        </div>
      </section>

      <section className="text-center my-8">
        <h2 className="text-3xl font-semibold text-blue-500 mb-4">
          Get Started Today!
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Sign up now to find the best veterinarians near you and ensure your
          pet's health and happiness.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Sign Up
        </button>
      </section>
    </div>
  );
}
