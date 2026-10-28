'use client';

import { useState, useTransition } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    startTransition(async () => {
      const { error } = await supabase
        .from('contact_inquiries')
        .insert([{ name, email, message, status: 'unread' }]);

      if (error) {
        console.error('Supabase error:', error);
        setErrorMessage('Failed to send message. Please try again later.');
      } else {
        setSubmitted(true);
      }
    });
  }

  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24 lg:px-12">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
            Inquiries · Collaboration · Support
          </p>
          <h1 className="max-w-4xl text-4xl font-medium tracking-[-0.04em] md:text-6xl text-[#102f26]">
            Get in touch
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Connect with our team regarding institutional programs, research methodology, or technical support.
          </p>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d]">
              Direct Channels
            </p>
            <h2 className="mt-4 text-3xl font-medium tracking-tight">
              We welcome institutional partnerships and community inquiries.
            </h2>
            <p className="mt-4 text-sm text-[#526760] leading-relaxed">
              If you are organizing a campus challenge or integrating Green Collective into a sustainability program, reach out directly.
            </p>

            <div className="mt-10 space-y-6 border-t border-[#102f26]/15 pt-8 font-mono text-xs">
              <div>
                <span className="uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                  General Support &amp; Inquiries
                </span>
                <span className="text-[#102f26] text-sm">support@greencollective.ca</span>
              </div>
              <div>
                <span className="uppercase tracking-[0.18em] text-[#39705d] block mb-1">
                  Institutional Programs
                </span>
                <span className="text-[#102f26] text-sm">partnerships@greencollective.ca</span>
              </div>
            </div>
          </div>

          <div className="border border-[#102f26]/15 bg-[#f1f6f2] p-8 md:p-10 flex flex-col justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#39705d] mb-6">
              Send a message
            </p>

            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#102f26]/10 text-[#102f26] mb-2 font-mono">
                  ✓
                </div>
                <h3 className="text-xl font-medium tracking-tight text-[#102f26]">Message received</h3>
                <p className="text-sm text-[#526760] max-w-sm mx-auto">
                  Thank you for reaching out. Your inquiry has been securely logged and our team will review it shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#102f26] mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 bg-white border border-[#102f26]/20 font-sans text-sm text-[#102f26] focus:outline-none focus:border-[#102f26]"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#102f26] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 bg-white border border-[#102f26]/20 font-sans text-sm text-[#102f26] focus:outline-none focus:border-[#102f26]"
                    placeholder="address@mail.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#102f26] mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 bg-white border border-[#102f26]/20 font-sans text-sm text-[#102f26] focus:outline-none focus:border-[#102f26]"
                    placeholder="Describe your inquiry..."
                  />
                </div>

                {errorMessage && (
                  <p className="font-mono text-xs text-red-600">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-4 bg-[#102f26] hover:bg-[#102f26]/90 text-white font-mono text-[10px] uppercase tracking-[0.18em] transition disabled:opacity-50"
                >
                  {isPending ? 'Sending...' : 'Send Message →'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
