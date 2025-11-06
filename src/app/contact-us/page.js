'use client';
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState({ loading: false, success: null, error: null });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">Contact Pixilify</h1>
        <p className="text-sm text-gray-600 mb-6">Have a question, partnership idea, or need support? Drop us a message.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3"
              placeholder="Tell us how we can help"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <button
              className="inline-flex items-center justify-center rounded-full px-6 py-2 bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              disabled={status.loading}
            >
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>

            <button
              type="button"
              onClick={() => setForm({ name: '', email: '', message: '' })}
              className="inline-flex items-center justify-center rounded-full px-4 py-2 border border-gray-200 text-sm"
            >
              Reset
            </button>
          </div>

          {status.error && <p className="text-sm text-red-600">{status.error}</p>}
          {status.success && <p className="text-sm text-green-600">{status.success}</p>}
        </form>

        <div className="mt-8 border-t pt-6 text-sm text-gray-600">
          <p><strong>Email:</strong> support@pixilify.com</p>
          <p className="mt-1"><strong>Address:</strong> 123 Pixilify Lane, Imagetown</p>
        </div>
      </div>
    </div>
  );
}