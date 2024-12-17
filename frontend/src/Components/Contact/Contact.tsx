// import React from "react";

export default function Contact() {
  return (
    <div className="h-screen-no-nav bg-gray-100 p-4">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-blue-600">
          Emergency Contact Information
        </h1>
        <p className="mt-2 text-lg text-gray-700">
          Keep this information handy for your pet's safety.
        </p>
      </header>

      <section className="my-8">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-4">
          Emergency Vet Clinics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">City Animal Hospital</h3>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
            <p className="text-gray-600">Address: 123 Main St, Anytown, USA</p>
            <p className="text-gray-600">Hours: 24/7</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">Emergency Pet Care</h3>
            <p className="text-gray-600">Phone: (987) 654-3210</p>
            <p className="text-gray-600">Address: 456 Elm St, Othertown, USA</p>
            <p className="text-gray-600">Hours: 24/7</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">
              Paws & Claws Veterinary Clinic
            </h3>
            <p className="text-gray-600">Phone: (555) 123-4567</p>
            <p className="text-gray-600">Address: 789 Oak St, Sometown, USA</p>
            <p className="text-gray-600">Hours: 24/7</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-bold">Animal Emergency Center</h3>
            <p className="text-gray-600">Phone: (444) 987-6543</p>
            <p className="text-gray-600">Address: 321 Pine St, Anycity, USA</p>
            <p className="text-gray-600">Hours: 24/7</p>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="text-3xl font-semibold text-blue-500 text-center mb-4">
          General Emergency Advice
        </h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Stay calm and assess the situation.</li>
          <li>Contact your emergency vet clinic immediately.</li>
          <li>
            If your pet is injured, try to keep them still and avoid moving them
            unless necessary.
          </li>
          <li>
            Keep a first aid kit for pets at home, including bandages,
            antiseptic wipes, and any necessary medications.
          </li>
          <li>
            Know the signs of common emergencies, such as difficulty breathing,
            excessive bleeding, or seizures.
          </li>
          <li>
            Have a plan for transportation to the vet in case of an emergency.
          </li>
          <li>Always keep your vet's contact information readily available.</li>
        </ul>
      </section>

      <section className="text-center my-8">
        <h2 className="text-3xl font-semibold text-blue-500 mb-4">
          Be Prepared!
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Emergencies can happen at any time. Make sure you are prepared to act
          quickly and effectively.
        </p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
          Learn More About Pet Care
        </button>
      </section>
    </div>
  );
}
