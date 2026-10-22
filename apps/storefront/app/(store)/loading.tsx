export default function StoreLoading() {
  return (
    <div className="store-loading" role="status" aria-live="polite">
      <span className="eyebrow no-rule">JSB Sons</span>
      <p>Opening the wardrobe</p>
      <span className="store-loading-line" aria-hidden="true" />
    </div>
  )
}
