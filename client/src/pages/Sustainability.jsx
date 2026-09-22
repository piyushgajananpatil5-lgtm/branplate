import { ArrowRight, Leaf, Recycle, Sprout } from 'lucide-react';

const steps = [
  { icon: Sprout, title: 'Local by-product', text: 'We start with agricultural by-products that already exist in the food system.' },
  { icon: Leaf, title: 'Made for meals', text: 'The material is shaped into sturdy, food-safe tableware for everyday events and catering.' },
  { icon: Recycle, title: 'Useful after use', text: 'Return used plates to cattle feed or compost instead of sending them to landfill.' },
];

export default function Sustainability() {
  return (
    <main>
      <section className="bg-bran-brown px-6 py-20 text-cream md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-wheat-gold">From field to feast, back to earth</p>
          <h1 className="max-w-3xl text-5xl font-display font-bold leading-tight md:text-7xl">Better tableware should leave something useful behind.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-cream/75">BranEco turns agricultural by-products into dependable disposable tableware, then keeps those materials in a useful cycle after the meal.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-green">Our process</p>
          <h2 className="mt-3 text-3xl font-display font-bold text-bran-brown md:text-4xl">A simple material story.</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <article key={title} className="relative border-t-2 border-wheat-gold pt-6">
              <span className="text-sm font-semibold text-bran-brown/45">0{index + 1}</span>
              <Icon className="mt-6 text-leaf-green" size={30} aria-hidden="true" />
              <h3 className="mt-5 text-xl font-bold text-bran-brown">{title}</h3>
              <p className="mt-2 leading-7 text-bran-brown/65">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-bran-brown/10 bg-wheat-gold/10 px-6 py-16 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-green">For growing teams</p>
            <h2 className="mt-3 text-3xl font-display font-bold text-bran-brown">Need a responsible supply for your next event?</h2>
          </div>
          <a href="/quote" className="inline-flex shrink-0 items-center gap-2 font-semibold text-bran-brown hover:text-leaf-green">Get a quote <ArrowRight size={18} /></a>
        </div>
      </section>
    </main>
  );
}