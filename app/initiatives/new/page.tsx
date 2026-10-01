import InitiativeForm from '@/components/InitiativeForm';
import Link from 'next/link';

export default function NewInitiativePage() {
  return (
    <main className="min-h-screen bg-white text-[#102f26] pb-24">
      {/* Editorial Page Header */}
      <section className="border-b border-[#102f26]/10 bg-[#f1f6f2]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-20 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#39705d]">
              Platform Submission · Community Portal
            </p>
            <Link
              href="/initiatives"
              className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#526760] hover:text-[#102f26]"
            >
              ← Back to Initiatives
            </Link>
          </div>
          <h1 className="max-w-4xl text-3xl font-medium tracking-[-0.04em] md:text-5xl text-[#102f26]">
            Propose a New Community Initiative
          </h1>
          <p className="mt-4 max-w-xl text-base text-[#526760] md:text-lg">
            Submit a regional project, urban restoration program, or policy campaign to integrate with institutional carbon tracking and community action hubs.
          </p>
        </div>
      </section>

      {/* Form Container Section */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
        <div className="p-8 border border-[#102f26]/15 bg-[#f1f6f2]">
          <InitiativeForm />
        </div>
      </section>
    </main>
  );
}
