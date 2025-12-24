import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useProductPageQuery,
    useRecommendProductQuery,
} from "../services/userAuthApi";

const ProductPage = () => {
    const { id } = useParams(); // this is product_id
    const navigate = useNavigate();

    const { data: fetchedProduct, isLoading } = useProductPageQuery(id);
    const { data: recommendedProducts } = useRecommendProductQuery(id);

    const INITIAL_VISIBLE = 4;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
    const [expanded, setExpanded] = useState(false);

    // Carousel states
    const carouselRef = useRef(null);
    const trackRef = useRef(null);
    const [itemsPerView, setItemsPerView] = useState(INITIAL_VISIBLE);
    const [index, setIndex] = useState(0); // current left-most visible item index
    const CARD_WIDTH = 200; // px
    const GAP = 16; // px

    // Scroll to top when product changes
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const truncate = (text = "", max = 45) =>
        text.length > max ? text.slice(0, max) + "..." : text;

    const fallback = {
        product_id: "fallback",
        product_name:
            "Wayona Nylon Braided USB to Lightning Fast Charging and Data Sync Cable",
        img_link:
            "https://m.media-amazon.com/images/I/51UsScvHQNL._SX300_SY300_QL70_.jpg",
        discounted_price: "₹399",
        actual_price: "₹1,099",
        discount_percentage: "64%",
        rating: "4.2",
        rating_count: 24269,
        categories: "Computers & Accessories",
        about_product:
            "Fast Charging | Durable Cable | High Compatibility | 12 Months Warranty",
        review_title: ["Good", "Worth it"],
        review_content: ["Nice product", "Value for money"],
    };


    const product = fetchedProduct || fallback;

    const recommendations = Array.isArray(recommendedProducts)
        ? recommendedProducts
            .filter((r) => r.product_id && r.product_id !== id)
            .map((r) => ({
                product_id: r.product_id,
                product_name:
                    r.product_name || r.product_name_clean || "Untitled Product",
                img_link: r.img_link || fallback.img_link,
                discounted_price:
                    r.discounted_price_clean
                        ? `₹${r.discounted_price_clean}`
                        : "N/A",
                actual_price: r.actual_price || "",
                discount_percentage: r.discount_percentage || "",
                rating: r.rating || null,
            }))
        : [];

    const reviewTitles = Array.isArray(product.review_title)
        ? product.review_title
        : String(product.review_title || "").split("|");

    const reviewContents = Array.isArray(product.review_content)
        ? product.review_content
        : String(product.review_content || "").split("|");

    const styles = {
        page: {
            padding: 40,
            fontFamily: "Arial, sans-serif",
            background: "#f9fafb",
        },
        topSection: {
            display: "flex",
            gap: 40,
            background: "#fff",
            padding: 30,
            borderRadius: 12,
            marginBottom: 30,
        },
        image: {
            width: 300,
            objectFit: "contain",
        },
        info: {
            flex: 1,
        },
        rating: {
            margin: "10px 0",
            color: "#374151",
        },
        priceBox: {
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "12px 0",
        },
        discounted: {
            fontSize: 26,
            fontWeight: "bold",
        },
        actual: {
            textDecoration: "line-through",
            color: "#6b7280",
        },
        off: {
            color: "#16a34a",
            fontWeight: "bold",
        },
        category: {
            color: "#6b7280",
            marginBottom: 20,
        },
        cartBtn: {
            padding: "12px 22px",
            background: "#111827",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
        },
        section: {
            background: "#fff",
            padding: 25,
            borderRadius: 12,
            marginBottom: 30,
        },
        review: {
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 0",
        },
        recommendOuter: {
            overflow: "hidden",
            position: "relative",
            marginTop: 12,
        },
        recommendTrack: {
            display: "flex",
            gap: GAP,
            transition: "transform 500ms ease",
            willChange: "transform",
        },
        card: {
            background: "#f9fafb",
            padding: 12,
            borderRadius: 10,
            textAlign: "center",
            cursor: "pointer",
            transition: "transform 0.2s",
            flex: "0 0 200px",
            width: CARD_WIDTH,
            maxWidth: CARD_WIDTH,
        },
        carouselBtn: {
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.95)",
            border: "1px solid #e5e7eb",
            padding: "8px 10px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
        },
        prevBtn: {
            left: 8,
        },
        nextBtn: {
            right: 8,
        },
        cardTitle: {
            fontSize: 13,
            fontWeight: 500,
            minHeight: 34,
            lineHeight: "1.2em",
        },
        cardPriceRow: {
            display: "flex",
            justifyContent: "center",
            gap: 6,
            marginTop: 6,
            alignItems: "center",
        },
        cardActual: {
            textDecoration: "line-through",
            color: "#6b7280",
            fontSize: 12,
        },
        cardOff: {
            color: "#16a34a",
            fontSize: 12,
            fontWeight: 600,
        },
        ratingSmall: {
            fontSize: 12,
            color: "#374151",
            marginBottom: 4,
        },
        showMoreBtn: {
            marginTop: 20,
            padding: "10px 18px",
            borderRadius: 8,
            border: "1px solid #111827",
            background: "#fff",
            cursor: "pointer",
            fontWeight: 600,
        },
    };

    // compute transform for track
    const maxIndex = Math.max(0, recommendations.length - itemsPerView);
    const trackTransform = `translateX(-${index * (CARD_WIDTH + GAP)}px)`;

    useEffect(() => {
        // measure items per view based on container width
        function measure() {
            const el = carouselRef.current;
            if (!el) return;
            const w = el.clientWidth;
            const per = Math.max(1, Math.floor((w + GAP) / (CARD_WIDTH + GAP)));
            setItemsPerView(per);
        }

        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    useEffect(() => {
        // reset index when items or per-view changes
        setIndex((i) => Math.min(i, Math.max(0, recommendations.length - itemsPerView)));
    }, [recommendations.length, itemsPerView]);

    const handleNext = () => {
        setIndex((i) => Math.min(i + itemsPerView, maxIndex));
    };

    const handlePrev = () => {
        setIndex((i) => Math.max(i - itemsPerView, 0));
    };

    return (
        <div style={styles.page}>
            {/* PRODUCT TOP */}

            <div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {/* FULL PRODUCT PAGE JSX HERE */}
                    </>
                )}
            </div>

            <div style={styles.topSection}>
                <img src={product.img_link} alt="" style={styles.image} />

                <div style={styles.info}>
                    <h2>{product.product_name}</h2>

                    <div style={styles.rating}>
                        ⭐ {product.rating} (
                        {(product.rating_count || 0).toLocaleString()} ratings)
                    </div>

                    <div style={styles.priceBox}>
                        <span style={styles.discounted}>
                            {product.discounted_price}
                        </span>
                        <span style={styles.actual}>{product.actual_price}</span>
                        <span style={styles.off}>
                            {product.discount_percentage} OFF
                        </span>
                    </div>

                    <p style={styles.category}>{product.categories}</p>

                    <button style={styles.cartBtn}>Add to Cart</button>
                </div>
            </div>

            {/* ABOUT */}
            <div style={styles.section}>
                <h3>About this product</h3>
                <ul>
                    {String(product.about_product)
                        .split("|")
                        .map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                </ul>
            </div>

            {/* REVIEWS */}
            <div style={styles.section}>
                <h3>Customer Reviews</h3>
                {reviewTitles.map((title, index) => (
                    <div key={index} style={styles.review}>
                        <strong>{title}</strong>
                        <p>{reviewContents[index] || ""}</p>
                    </div>
                ))}
            </div>

            {/* RECOMMENDATIONS */}
            <div style={styles.section}>
                <h3>You may also like</h3>

                <div style={styles.recommendOuter} ref={carouselRef}>
                    <div
                        ref={trackRef}
                        style={{ ...styles.recommendTrack, transform: trackTransform }}
                    >
                        {recommendations.map((item, idx) => (
                            <div
                                key={item.product_id}
                                style={styles.card}
                                onClick={() => navigate(`/productpage/${item.product_id}`)}
                            >
                                <img
                                    src={item.img_link}
                                    alt={item.product_name}
                                    style={{
                                        width: "100%",
                                        height: 120,
                                        objectFit: "contain",
                                    }}
                                />

                                {item.rating && (
                                    <div style={styles.ratingSmall}>
                                        ⭐ {item.rating}
                                    </div>
                                )}

                                <p style={styles.cardTitle}>
                                    {truncate(item.product_name)}
                                </p>

                                <div style={styles.cardPriceRow}>
                                    <strong>{item.discounted_price}</strong>
                                    {item.actual_price && (
                                        <span style={styles.cardActual}>
                                            {item.actual_price}
                                        </span>
                                    )}
                                </div>

                                {item.discount_percentage && (
                                    <div style={styles.cardOff}>
                                        {item.discount_percentage} OFF
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {recommendations.length > itemsPerView && (
                        <>
                            {index > 0 && (
                                <button
                                    style={{ ...styles.carouselBtn, ...styles.prevBtn, border: "2px solid black" }}
                                    onClick={handlePrev}
                                >
                                    ‹
                                </button>
                            )}

                            {index < maxIndex && (
                                <button
                                    style={{ ...styles.carouselBtn, ...styles.nextBtn, border: "2px solid black" }}
                                    onClick={handleNext}
                                >
                                    ›
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
