from typing import List


class RecursiveCharacterTextSplitter:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = int(chunk_size)
        self.chunk_overlap = int(chunk_overlap)

    def split_text(self, text: str) -> List[str]:
        """A very small splitter that chunks text by sliding window.

        This is intentionally simple but sufficient for indexing large PDF text in
        this project. It avoids heavy LangChain dependency.
        """
        if not text:
            return []

        text = text.strip()
        if len(text) <= self.chunk_size:
            return [text]

        chunks = []
        start = 0
        step = self.chunk_size - self.chunk_overlap
        while start < len(text):
            end = start + self.chunk_size
            chunks.append(text[start:end])
            start += step
        return chunks
