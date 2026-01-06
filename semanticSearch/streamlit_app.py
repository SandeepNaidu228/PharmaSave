import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from rapidfuzz import fuzz

st.set_page_config(page_title="Smart Medicine Search")

df = pd.read_csv("medicine_dataset_search.csv")

vectorizer = TfidfVectorizer()
tfidf_matrix = vectorizer.fit_transform(df["search_text"])

def smart_search(user_query):
    user_query = user_query.lower()

    user_vector = vectorizer.transform([user_query])
    nlp_scores = cosine_similarity(user_vector, tfidf_matrix)[0]

    fuzzy_scores = df["medicine_name"].apply(
        lambda x: fuzz.partial_ratio(user_query, x.lower()) / 100
    )

    df["final_score"] = (0.7 * nlp_scores) + (0.3 * fuzzy_scores)

    return (
        df[df["final_score"] > 0.1]
        .sort_values("final_score", ascending=False)
        .drop_duplicates("medicine_name")
    )

st.title("Smart Medical Search System")
st.warning("Educational use only. Not medical advice.")

query = st.text_input("Search symptoms or medicine name:")

if query:
    result = smart_search(query)
    st.dataframe(result)
