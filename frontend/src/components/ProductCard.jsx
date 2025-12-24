import React, { useState } from 'react'

const ProductCard = ({ product = {}, onAddToCart, onView, onEdit }) => {
  // normalize backend keys and fallback to friendly names
  const name = product.product_name || product.title || 'Untitled Product'
  const image = product.img_link || product.image || null
  const priceClean = product.discounted_price_clean ?? (product.price ? Number(product.price) : null)
  const discountedPriceStr = product.discounted_price || (priceClean ? `₹${priceClean}` : null)
  const actualPriceStr = product.actual_price || product.actual_price_str || null
  const discount = product.discount_percentage || product.discount || null
  const rating = Number(product.rating) || null
  const ratingCount = product.rating_count_clean || product.rating_count || null
  const [hover, setHover] = useState(false)


  const styles = {
    card: {
      width: 320,
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, Roboto, Arial, sans-serif'
    },
    imgWrap: { height: 200, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    badge: { position: 'absolute', left: 10, top: 10, background: '#a544efff', color: '#fff', padding: '4px 8px', borderRadius: 6, fontSize: 12 },
    img: { maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' },
    body: { padding: 14, display: 'flex', flexDirection: 'column', gap: 8 },
    title: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: '1.4em',
      height: '2.8em',        // 2 lines
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    meta: { display: 'flex', gap: 8, alignItems: 'center', color: '#6b7280', fontSize: 13 },
    priceRow: { display: 'flex', alignItems: 'baseline', gap: 8 },
    priceNew: { fontSize: 18, fontWeight: 800, color: '#0f172a' },
    priceOld: { textDecoration: 'line-through', color: '#9ca3af', fontSize: 13 },
    aboutList: { margin: 0, paddingLeft: 16, color: '#374151', fontSize: 13 },
    tags: { display: 'flex', gap: 6, flexWrap: 'wrap' },
    tag: { background: '#f3f4f6', color: '#374151', padding: '4px 8px', borderRadius: 6, fontSize: 12 },
    footer: { display: 'flex', gap: 8, padding: 12, borderTop: '1px solid #f3f4f6', background: '#fff', justifyContent: 'flex-end' },
    btn: { padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer' },
    primary: { background: '#111827', color: '#fff' },
    secondary: { background: '#fff', border: '1px solid #e5e7eb', color: '#111827' },
    hoverOverlay: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      left: 'auto',
      display: 'flex',
      justifyContent: 'flex-end',
      pointerEvents: hover ? 'auto' : 'none',
      transition: 'transform 180ms ease, opacity 180ms ease',
      transform: hover ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.9)',
      opacity: hover ? 1 : 0,
      zIndex: 30,
    },
    circleBtn: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: 'none',
      cursor: 'pointer',
      color: '#fff',
      background: 'linear-gradient(135deg,#06b6d4 0%,#2563eb 100%)',
      boxShadow: '0 8px 20px rgba(37,99,235,0.18)',
      transition: 'transform 160ms ease, box-shadow 160ms ease',
    },
    smallLink: { fontSize: 13, color: '#2563eb', textDecoration: 'none' }
  }

  const handleAdd = () => onAddToCart && onAddToCart(product)
  const handleView = () => onView && onView(product)
  const handleEdit = () => onEdit && onEdit(product)

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.card} aria-label={name}>
        <div style={styles.imgWrap} role="button">
          {discount ? <div style={styles.badge}>{discount}</div> : null}
          {image ? (
            // eslint-disable-next-line jsx-a11y/img-redundant-alt
            <img src={image} alt={`Image of ${name}`} style={styles.img} />
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="4" fill="#f3f4f6" />
                <path d="M4 17l4-5 3 4 5-7 4 7H4z" fill="#e5e7eb" />
              </svg>
              <div style={{ fontSize: 13, marginTop: 8 }}>No image</div>
            </div>
          )}
        </div>

        <div style={styles.body}>
          <div style={styles.title}>{name}</div>

          <div style={styles.meta}>
            {rating ? <div>{'★'.repeat(Math.floor(rating))} {rating}</div> : null}
            {ratingCount ? <div>• {ratingCount} ratings</div> : null}
          </div>

          <div style={styles.priceRow}>
            {discountedPriceStr ? <div style={styles.priceNew}>{discountedPriceStr}</div> : null}
            {actualPriceStr ? <div style={styles.priceOld}>{actualPriceStr}</div> : null}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          </div>
        </div>

      </div>

      <div style={styles.hoverOverlay}>
        <button
          aria-label="Add to cart"
          onClick={handleAdd}
          style={{
            ...styles.circleBtn,
            transform: hover ? 'scale(1.03)' : 'scale(0.96)',
            boxShadow: hover ? '0 12px 28px rgba(37,99,235,0.22)' : styles.circleBtn.boxShadow,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.4" fill="white" />
            <circle cx="18" cy="20" r="1.4" fill="white" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default ProductCard