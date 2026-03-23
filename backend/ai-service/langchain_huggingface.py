"""Lightweight shim providing HuggingFaceEmbeddings used by the project.

This avoids pulling in the full `langchain-huggingface` package which caused
langchain-core version conflicts in the environment. It uses `sentence-transformers`
under the hood and exposes the minimal methods expected by the codebase:
 - embed_documents(list[str]) -> list[list[float]]
 - embed_query(str) -> list[float]

The class is intentionally simple and synchronous to match how it's used in the
project. It lazy-loads heavy dependencies (torch, sentence_transformers).
"""
from typing import List, Optional, Any
import os


class HuggingFaceEmbeddings:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2", model_kwargs: Optional[dict] = None, encode_kwargs: Optional[dict] = None):
        self.model_name = model_name
        self.model_kwargs = model_kwargs or {}
        self.encode_kwargs = encode_kwargs or {}
        self._model = None

    def _load_model(self):
        if self._model is None:
            try:
                # sentence-transformers in this project is used with PyTorch only.
                # Prevent transformers from importing TF/Keras paths that can fail
                # when Keras 3 is installed without tf-keras compatibility package.
                os.environ.setdefault("TRANSFORMERS_NO_TF", "1")
                os.environ.setdefault("USE_TF", "0")
                from sentence_transformers import SentenceTransformer
            except Exception as e:
                raise ImportError(
                    "Failed to import sentence-transformers. Root cause: "
                    f"{type(e).__name__}: {e}. "
                    "If this mentions Keras/tf_keras, install tf-keras or keep Transformers on PyTorch-only path."
                ) from e

            # SentenceTransformer accepts device via kwargs in the model instantiation
            kwargs = dict(self.model_kwargs or {})
            # Some users pass device in model_kwargs; keep it if present
            self._model = SentenceTransformer(self.model_name, **kwargs)

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        """Embed a list of documents and return list of vectors.

        This method is synchronous and will load the model on first call.
        """
        self._load_model()
        encode_kwargs = dict(self.encode_kwargs or {})
        # Ensure numpy output for easier conversion
        vectors = self._model.encode(texts, convert_to_numpy=True, **encode_kwargs)
        # Convert numpy arrays to Python lists
        return [vec.tolist() for vec in vectors]

    def embed_query(self, text: str) -> List[float]:
        """Embed a single query string and return a vector."""
        self._load_model()
        encode_kwargs = dict(self.encode_kwargs or {})
        vec = self._model.encode([text], convert_to_numpy=True, **encode_kwargs)[0]
        return vec.tolist()
