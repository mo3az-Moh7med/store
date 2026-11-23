"use client";

import { useState } from "react";

export default function Gallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="img placeholder" role="img" aria-label={name}>
        <span>{name}</span>
      </div>
    );
  }

  return (
    <div className="gallery">
      <img src={images[active]} alt={name} className="img" />
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              className={`thumb${i === active ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
