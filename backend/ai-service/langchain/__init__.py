"""Local shim for minimal langchain APIs used by this project.

This package provides a small implementation of the text splitter used in
`pdf_controller.py` to avoid pulling the full LangChain dependency which can
cause version conflicts in the environment.
"""
__all__ = ["text_splitter"]
