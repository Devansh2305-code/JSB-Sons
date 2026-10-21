"use client"

import Image from "next/image"
import { useState } from "react"

export function ProductGallery({
  images,
  title,
}: {
  images: { id: string; url: string }[]
  title: string
}) {
  const gallery = images.length ? images : [{ id: "fallback", url: "/products/13065308.jpg" }]
  const [active, setActive] = useState(gallery[0])

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image
          src={active.url}
          alt={title}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 55vw"
        />
        <span className="gallery-counter">
          {String(gallery.findIndex((image) => image.id === active.id) + 1).padStart(2, "0")} /{" "}
          {String(gallery.length).padStart(2, "0")}
        </span>
      </div>
      {gallery.length > 1 ? (
        <div className="product-gallery-thumbs">
          {gallery.map((image, index) => (
            <button
              key={image.id}
              type="button"
              className={active.id === image.id ? "is-active" : ""}
              onClick={() => setActive(image)}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`${title} alternate view ${index + 1}`}
                fill
                sizes="120px"
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
