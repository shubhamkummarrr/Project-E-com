import pickle
from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent

df = pd.read_pickle(BASE_DIR / "products_df.pkl")

with open(BASE_DIR / "cosine_sim.pkl", "rb") as f:
    cosine_sim = pickle.load(f)

def recommend_products(product_id, top_n=5):
    if product_id not in df['product_id'].values:
        return []
    
    df['img_link'] = df['img_link'].str.replace(
        r"/images/W/WEBP_[^/]+",
        "",
        regex=True
    )

    # 2️⃣ Remove FMwebp marker if present
    df['img_link'] = df['img_link'].str.replace(
        r"_FMwebp_",
        "_",
        regex=True
    )

    # 3️⃣ Ensure proper .jpg ending
    df['img_link'] = df['img_link'].str.replace(
        r"(?<!\.jpg)$",
        ".jpg",
        regex=True
    )

    product_index = df.index[df['product_id'] == product_id][0]

    similarity_scores = list(enumerate(cosine_sim[product_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)

    similarity_scores = similarity_scores[1: top_n + 1]
    product_indices = [i[0] for i in similarity_scores]

    return df.iloc[product_indices].to_dict(orient="records")
