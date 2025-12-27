import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// Note: Ensure addToCart and PLACEHOLDER_IMG are imported if they are in another file

const ProductCard = ({ product = {} }) => {
  const dispatch = useDispatch();
  const [hover, setHover] = useState(false);

  // 1. Data Normalization (Only keeping what is actually rendered)
  const name = product.product_name || product.title || 'Untitled Product';
  const image = product.img_link || product.image || null;
  const discountedPriceStr = product.discounted_price || (product.price ? `₹${product.price}` : null);
  const actualPriceStr = product.actual_price || product.actual_price_str || null;
  const discount = product.discount_percentage || product.discount || null;
  const rating = Number(product.rating) || null;
  const ratingCount = product.rating_count_clean || product.rating_count || null;
  const [isAdded, setIsAdded] = useState(false);

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
      height: '2.8em',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
    },
    meta: { display: 'flex', gap: 8, alignItems: 'center', color: '#6b7280', fontSize: 13 },
    priceRow: { display: 'flex', alignItems: 'baseline', gap: 8 },
    priceNew: { fontSize: 18, fontWeight: 800, color: '#0f172a' },
    priceOld: { textDecoration: 'line-through', color: '#9ca3af', fontSize: 13 },
    hoverOverlay: {
      position: 'absolute',
      bottom: 14,
      right: 14,
      display: 'flex',
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
    }
  };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={styles.card} aria-label={name}>
        <div style={styles.imgWrap}>
          {discount && <div style={styles.badge}>{discount}</div>}
          {image ? (
            <img src={image} alt={name} style={styles.img} />
          ) : (
            <div style={{ textAlign: 'center', color: '#9ca3af' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <div style={{ fontSize: 12, marginTop: 4 }}>No image</div>
            </div>
          )}
        </div>

        <div style={styles.body}>
          <div style={styles.title}>{name}</div>

          <div style={styles.meta}>
            {rating && <div>{'★'.repeat(Math.floor(rating))} {rating}</div>}
            {ratingCount && <div>• {ratingCount} ratings</div>}
          </div>

          <div style={styles.priceRow}>
            {discountedPriceStr && <div style={styles.priceNew}>{discountedPriceStr}</div>}
            {actualPriceStr && <div style={styles.priceOld}>{actualPriceStr}</div>}
          </div>
        </div>
      </div>

      <div style={styles.hoverOverlay}>
        <button
          aria-label="Add to cart"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsAdded(true);
            dispatch({
              type: 'cart/addToCart',
              payload: {
                id: product.product_id,
                product_name: name,
                img_link: image,
                discounted_price: Number(String(discountedPriceStr).replace(/[^0-9.]/g, '')) || 0,
              }
            });
            // 3. Reset icon after 1.5 seconds
            setTimeout(() => setIsAdded(false), 1500);
          }}
          style={{
            ...styles.circleBtn,
            // Dynamic styles for the animation
            transform: isAdded ? 'scale(1.2)' : hover ? 'scale(1.05)' : 'scale(1)',
            background: isAdded ? '#2f48b4ff' : styles.circleBtn.background, // Green on success
            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy effect
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
  );
};

export default ProductCard;