"use client";

export function LocationMap() {
  return (
    <div className="aspect-square bg-background overflow-hidden">
      <iframe
        src="https://maps.google.com/maps?q=580%2020th%20Street,%20San%20Francisco,%20CA%2094107&t=&z=17&ie=UTF8&iwloc=&output=embed"
        width="100%"
        height="100%"
        style={{
          border: 0,
          filter: "grayscale(100%) invert(1) brightness(1.2) contrast(1.2)",
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Event Location - Y Combinator"
      />
    </div>
  );
}
