export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 text-foreground">
      <h1 className="text-3xl font-extrabold mb-4 text-[#0f382c]">Contact Us</h1>
      <p className="text-muted-foreground mb-4">
        Have questions about the Green Collective platform, institutional challenges, or technical support? 
      </p>
      <p className="text-foreground font-semibold">
        Reach out to our team directly at: <a href="mailto:support@greencollective.ca" className="text-emerald-700 underline">support@greencollective.ca</a>
      </p>
    </main>
  );
}
