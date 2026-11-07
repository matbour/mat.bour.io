---
name: Condo AI lab
summary: I chair the board of my building's co-owners and run its work with AI agents. It's where I practice RAG and agent design on real, messy data.
stack: [TypeScript, Bun, MCP, Claude, Ollama, bge-m3, SQLite, OAuth 2.1]
year: 2026
until: present
order: 11
---

The building I live in is a condominium of three buildings over a shared underground car park. As president of its _conseil syndical_, the board elected to oversee the property manager, I deal with invoices, quotes, contracts, leaks and a long list of contractors. I run most of it with agents.

- **Ingestion:** the property manager's extranet is a dump of badly named, misfiled PDFs. A Bun pipeline downloads all 578 documents, runs OCR, classifies each one (invoice, quote, contract, meeting minutes…), splits bundled scans, normalizes supplier names and stores everything in SQLite with full-text search.
- **Retrieval:** every document is chunked with its metadata as a header (contextual retrieval), then embedded locally with bge-m3 on Ollama: 3,262 chunks. Ask "when was the car park's fire equipment replaced?" and it finds the 2018 invoice, even though the question shares no words with it. An evaluation set of 22 questions (hit@5, MRR) keeps it honest: plain semantic search beat hybrid search with FTS5 and reciprocal rank fusion.
- **Agents:** an MCP server with 18 tools, served over HTTP with OAuth 2.1 so each board member signs in with their own extranet account. Claude agents combine it with the board's WhatsApp group, where we debate and vote, and a Notion task tracker. They keep track of every open quote request and follow up when a contractor goes quiet, check invoices against the history, and draft letters to the property manager that cite the law.
- **Documents:** scripts generate the board's formal notes, annotated photo reports for building defects, and the fire evacuation plans for the halls and the car park.
