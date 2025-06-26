from langchain_huggingface import HuggingFaceEmbeddings

class EmbeddingService:
    def __init__(self, model_name="BAAI/bge-base-en-v1.5"):
        self.model_name = model_name
        self.embedding_model = HuggingFaceEmbeddings(
            model_name=model_name,
            encode_kwargs={'normalize_embeddings': True}
        )

    def get_embedding(self, query):
        try:
            embedding = self.embedding_model.embed_query(query)

            print(
                f"Successfully generated embedding for query: '{query[:15]}...' using model: '{self.model_name}'")
            return embedding

        except Exception:
            print(f"Error generating embedding for query: '{query[:15]}' with model: '{self.model_name}'")
            raise
