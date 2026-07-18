const reviews = [
  { name: 'Anita R.', quote: 'Finally a disposable plate that doesn\u2019t feel like a compromise.' },
  { name: 'Vikram S.', quote: 'Used it for a 200-guest wedding — zero sogginess, zero guilt.' },
  { name: 'Priya M.', quote: 'Our dairy farmer picks up the used plates every week now.' },
  { name: 'Rohit K.', quote: 'Sturdier than I expected for something made of wheat bran.' },
  { name: 'Sneha T.', quote: 'The honeycomb design actually holds up under heavy curry.' },
];

export default function ReviewsMarquee() {
  const loop = [...reviews, ...reviews];
  return (
    <section className="py-16 overflow-hidden bg-wheat-gold/10">
      <h2 className="text-center text-3xl font-display font-bold text-bran-brown mb-10">What People Are Saying</h2>
      <div className="flex w-max animate-marquee">
        {loop.map((r, i) => (
          <div
            key={i}
            className="w-72 mx-4 bg-white rounded-2xl p-6 border border-bran-brown/10 flex-shrink-0"
          >
            <p className="text-bran-brown/80 text-sm italic">"{r.quote}"</p>
            <p className="mt-3 font-semibold text-bran-brown text-sm">— {r.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
