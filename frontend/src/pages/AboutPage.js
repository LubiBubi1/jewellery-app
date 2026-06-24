import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gray-900 px-6 py-16 text-center">
        <span className="text-yellow-700 text-4xl block mb-4">◆</span>
        <h1 className="text-3xl font-bold text-white mb-3">About Oskar Jewellery</h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
          A family tradition of crafting exceptional jewellery since 2012. Every piece tells a story.
        </p>
      </div>

      {/* Our Story */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Oskar Jewellery was founded in 2012 by Bosko Bozinov, who believed that fine jewellery should be accessible to everyone without compromising on quality or beauty.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Over the decades, we have grown from a small workshop into a trusted jewellery destination,
              while keeping our commitment to handcrafted excellence and personalised service.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Today, we offer a wide range of rings, necklaces, bracelets and earrings, as well as
              professional jewellery repair and customisation services.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center">
            <span className="text-yellow-700 text-6xl">◆</span>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '✦', title: 'Craftsmanship', desc: 'Every piece is handcrafted by skilled artisans with decades of experience.' },
              { icon: '◆', title: 'Quality', desc: 'We use only certified precious metals and gemstones in all our products.' },
              { icon: '♡', title: 'Personal Service', desc: 'We take time to understand your needs and find the perfect piece for you.' },
            ].map((v) => (
              <div key={v.title} className="text-center p-6 bg-gray-50 rounded-xl">
                <span className="text-yellow-700 text-2xl block mb-3">{v.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact & Hours */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Visit Us</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-yellow-700 mt-0.5">📍</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                  <p className="text-sm text-gray-500">St. Kosta Susinov & Bul. Aleksandar Makedonski, Radovish, Macedonia</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-700 mt-0.5">📞</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">Phone</p>
                  <p className="text-sm text-gray-500">+386 1 234 5678</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-700 mt-0.5">✉</span>
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-500">info@oskarjewellery.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">Opening Hours</h2>
            <div className="space-y-2">
              {[
                { day: 'Monday — Friday', hours: '9:00 AM — 7:00 PM' },
                { day: 'Saturday', hours: '9:00 AM — 5:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ].map((item) => (
                <div key={item.day} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.day}</span>
                  <span className={item.hours === 'Closed' ? 'text-red-400' : 'text-gray-800 font-medium'}>{item.hours}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Follow Us</h3>
              <div className="flex gap-3">
                {['Instagram', 'Facebook', 'Pinterest'].map((s) => (
                  <span key={s}
                    className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:border-yellow-600 hover:text-yellow-700 cursor-pointer transition">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gray-900 rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to find your perfect piece?</h2>
          <p className="text-gray-400 text-sm mb-6">Browse our collection or visit us in store for a personalised experience.</p>
          <div className="flex justify-center gap-4">
            <Link to="/products"
              className="bg-yellow-700 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-sm font-medium transition">
              Shop Collection
            </Link>
            <Link to="/services"
              className="border border-gray-600 text-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg text-sm font-medium transition">
              Our Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;