import Image from "next/image"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import { Reveal } from "@/components/reveal"
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  ReturnIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons"
import { getCatalog, getCategories } from "@/lib/api"
import { STORE } from "@/lib/store"

const worldImages: Record<string, string> = {
  uniforms: "/products/13065308.jpg",
  "casual-daily": "/products/15451683.jpg",
  party: "/products/13153053.jpg",
  formal: "/products/5872320.jpg",
  ethnic: "/products/13266800.jpg",
}

const marquee = [
  "Uniforms",
  "Everyday",
  "Occasion",
  "Formal",
  "Ethnic",
  "Made in Gurugram",
]

export default async function HomePage() {
  const catalog = await getCatalog()
  const categories = getCategories(catalog)
  const newArrivals = catalog.filter((product) => product.metadata?.is_new)
  const featured = (newArrivals.length >= 4 ? newArrivals : catalog).slice(0, 4)
  const occasion =
    catalog.find((product) => product.handle === "blue-hour-gown") ?? catalog[0]

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-kicker">
            <span className="eyebrow no-rule">Autumn / Winter 2026</span>
            <span className="eyebrow no-rule">Gurugram</span>
          </div>

          <h1 className="hero-title">
            <span>Dress</span>
            <span className="hero-indent">
              for <em>the</em>
            </span>
            <span className="hero-outline">life</span>
            <span>
              you&apos;re <em>building.</em>
            </span>
          </h1>

          <div className="hero-intro">
            <span className="eyebrow">The new uniform</span>
            <p>
              Clothes with a point of view. Considered silhouettes, honest
              fabrics and the kind of ease that lets you get on with the day.
            </p>
          </div>

          <div className="hero-actions">
            <Link href="/shop" className="button button-dark">
              Shop the collection <ArrowRightIcon />
            </Link>
            <Link href="/#worlds" className="text-link">
              Find your world <ArrowUpRightIcon />
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image hero-image-main">
            <Image
              src="/products/13065308.jpg"
              alt="JSB Sons tailored blazer"
              fill
              priority
              sizes="(max-width: 900px) 76vw, 44vw"
            />
          </div>
          <div className="hero-image hero-image-small">
            <Image
              src="/products/13153053.jpg"
              alt="JSB Sons occasion gown"
              fill
              priority
              sizes="(max-width: 900px) 45vw, 22vw"
            />
          </div>
          <div className="hero-stamp">
            New
            <br />
            Edit
            <br />
            01
          </div>
          <div className="hero-vertical">
            <span>Cloth · form · function</span>
          </div>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((group) => (
            <span key={group}>
              {marquee.map((item) => (
                <span key={`${group}-${item}`}>
                  <b>✦</b> {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="section">
        <Reveal>
          <div className="section-head">
            <span className="eyebrow">01 / The new edit</span>
            <h2>
              New week. <em>New uniform.</em>
            </h2>
            <Link href="/shop?sort=newest" className="text-link">
              View all {catalog.length} pieces <ArrowUpRightIcon />
            </Link>
          </div>
        </Reveal>

        <div className="product-grid">
          {featured.map((product, index) => (
            <Reveal key={product.id} delay={index * 80}>
              <ProductCard product={product} index={index} priority={index < 2} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="worlds-section" id="worlds">
        <Reveal>
          <div className="worlds-head">
            <h2>
              Five worlds.
              <br />
              <em>One wardrobe.</em>
            </h2>
            <p>
              From the first bell to the last dance. Build a wardrobe that moves
              between the rooms of your life without missing a beat.
            </p>
          </div>
        </Reveal>

        <div className="world-list">
          {categories.map((category, index) => {
            const image =
              worldImages[category.handle] ?? "/products/13065308.jpg"

            return (
              <Reveal key={category.id} delay={index * 50}>
                <Link
                  href={`/shop?category=${category.handle}`}
                  className="world-row"
                >
                  <span className="world-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="world-image">
                    <Image
                      src={image}
                      alt={category.name}
                      fill
                      sizes="130px"
                    />
                  </span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="world-action">
                    Explore <ArrowUpRightIcon />
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      <section className="house-section" id="house">
        <Reveal className="house-images">
          <div className="house-image-a">
            <Image
              src="/products/13266800.jpg"
              alt="JSB Sons ethnic wear"
              fill
              sizes="(max-width: 900px) 70vw, 35vw"
            />
          </div>
          <div className="house-image-b">
            <Image
              src="/products/5872320.jpg"
              alt="JSB Sons formal tailoring"
              fill
              sizes="(max-width: 900px) 49vw, 24vw"
            />
          </div>
          <div className="house-sticker">
            Made
            <br />
            in
            <br />
            India
            <br />
            since &apos;98
          </div>
        </Reveal>

        <Reveal className="house-copy" delay={140}>
          <span className="eyebrow">02 / The house</span>
          <h2>
            Cut close.
            <br />
            Worn <em>easy.</em>
          </h2>
          <p>
            JSB Sons began in a small Gurugram workroom with a simple belief: what
            you wear should make the day feel more possible. Three decades later,
            we still cut every collection with the same intention — precise
            enough to matter, relaxed enough to live in.
          </p>
          <div className="house-facts">
            <div>
              <strong>05</strong>
              <span>worlds, one wardrobe</span>
            </div>
            <div>
              <strong>19</strong>
              <span>pieces in the edit</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>made in India</span>
            </div>
          </div>
          <Link href="/shop" className="text-link" style={{ marginTop: 42, alignSelf: "flex-start" }}>
            Read the collection notes <ArrowUpRightIcon />
          </Link>
        </Reveal>
      </section>

      <section className="visit-section" id="visit">
        <Reveal className="visit-copy">
          <span className="eyebrow">03 / The shop</span>
          <h2>
            Come <em>see</em> the cloth.
          </h2>
          <p>
            Our counter in Sadar Bazar carries the full collection. Walk in,
            feel the fabric, and take home the piece that fits the day.
          </p>
          <div className="visit-details">
            <div>
              <span className="eyebrow no-rule">The address</span>
              <p>
                {STORE.addressLines[0]},
                <br />
                {STORE.addressLines[1]},
                <br />
                {STORE.addressLines[2]}
              </p>
            </div>
            <div>
              <span className="eyebrow no-rule">Talk to us</span>
              <p>
                <a href={`tel:${STORE.phone}`}>{STORE.phoneDisplay}</a>
              </p>
            </div>
          </div>
          <div className="visit-actions">
            <a
              href={STORE.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="button button-dark"
            >
              Get directions <ArrowUpRightIcon />
            </a>
            <a
              href={STORE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              See us on Google <ArrowUpRightIcon />
            </a>
          </div>
        </Reveal>

        <Reveal className="visit-map" delay={120}>
          <iframe
            title={`${STORE.name} on Google Maps`}
            src={STORE.embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="visit-map-caption">
            <span>Sadar Bazar, Gurugram</span>
            <span>
              {STORE.latitude}° N · {STORE.longitude}° E
            </span>
          </div>
        </Reveal>
      </section>

      <section className="occasion-section">
        <Reveal className="occasion-copy">
          <span className="eyebrow" style={{ color: "rgba(242,236,224,.55)" }}>
            The occasion edit
          </span>
          <h2>
            After
            <em>hours.</em>
          </h2>
          <p>
            A little drama, a lot of ease. Floor-sweeping silhouettes and
            jewel-toned shine for the nights that ask you to arrive.
          </p>
          <Link
            href="/shop?category=party"
            className="button button-light"
          >
            Enter the evening <ArrowRightIcon />
          </Link>
        </Reveal>
        <Reveal className="occasion-image" delay={140}>
          <Image
            src="/products/13153053.jpg"
            alt="The Occasion Edit"
            fill
            sizes="(max-width: 900px) 100vw, 48vw"
          />
          <div className="occasion-caption">
            <span>{occasion?.title ?? "Blue Hour Gown"}</span>
            <span>Look 06 / Party</span>
          </div>
        </Reveal>
      </section>

      <div className="service-strip">
        <Reveal className="service-item">
          <TruckIcon />
          <div>
            <strong>Sent with care</strong>
            <p>Free shipping over ₹4,999. Dispatched within 24–48 hours.</p>
          </div>
        </Reveal>
        <Reveal className="service-item" delay={110}>
          <ReturnIcon />
          <div>
            <strong>Seven-day returns</strong>
            <p>Changed your mind? Send it back within seven days.</p>
          </div>
        </Reveal>
        <Reveal className="service-item" delay={220}>
          <ShieldIcon />
          <div>
            <strong>Made to last</strong>
            <p>Considered fabrics, honest construction, GST invoice included.</p>
          </div>
        </Reveal>
      </div>
    </>
  )
}
