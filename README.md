# Similar Document Template Matching for Fraud Detection Using Node.js

## Introduction

This repository contains the source code for a document template matching algorithm designed to automate document processing and enhance fraud detection capabilities in the healthcare domain. The project addresses the challenge faced by organizations like Bajaj Finserv Health Ltd., which manage a high volume of medical invoices, prescriptions, and lab reports from various providers and customers.

## Project Goals

- Automate document processing tasks (text extraction, layout analysis)
- Identify similar document templates across diverse formats
- Analyze discrepancies within similar templates for potential fraud detection

## Technical Stack

### Back-End:

- Node.js (core scripting language)
- Express.js (web framework for handling requests and responses)
- MongoDB (database for storing document metadata)
- Mongoose (MongoDB object modeling tool)
- Multer (middleware for handling file uploads)
- Express MongoDB Sanitize (middleware for preventing NoSQL injection attacks)

### Computer Vision Libraries (Optional):

- Tesseract.js: Optical Character Recognition (OCR) for text extraction
- ImageMagick: Image manipulation, template matching, layout analysis

## Project Functionality

- User Interface (Optional): Users can upload documents and select document types (invoice, prescription, lab report).
- Input Validation: The system validates the uploaded file format and size.
- Feature Extraction:
  - Text Extraction: Tesseract.js extracts text content from the uploaded document using OCR.
  - Layout Analysis: ImageMagick analyzes the document layout, potentially identifying visual elements.
  - Feature Vector Creation: Extracted text, layout information, and visual elements (if applicable) are combined into a feature vector representing the document.
- Template Matching (SIFT): The document's feature vector is compared against pre-defined template representations for each document type using SIFT in ImageMagick. A similarity score is calculated based on the comparison.
- Match Evaluation:
  - High Similarity: Documents with a high similarity score exceeding a predefined threshold proceed to fraud analysis.
  - Low Similarity: Documents with low similarity scores are likely not matches and the user is notified.
- Fraud Analysis (High Similarity): Critical regions specific to the document type (e.g., patient details in prescriptions) are analyzed for discrepancies.
- Fraud Detection: Significant discrepancies flag the document for further manual review as potential fraud.
- Display Results: The user is shown the outcome:
  - Successful match with the specific template type (if applicable).
  - No match found.
  - Flagged for potential fraud review (if applicable).

## Benefits

- Reduced Manual Processing Time: Automates document processing tasks, freeing up staff resources.
- Improved Accuracy: Consistent and automated template matching reduces human error in document classification.
- Enhanced Fraud Detection: Identifies potential fraudulent claims based on template discrepancies.
- Scalability and Adaptability: Designed for diverse document formats and can be expanded to include machine learning models for automatic classification or handling complex variations.

## Requirements

This project requires the following Node.js modules:

- Express
- Multer
- Mongoose
- Express MongoDB Sanitize

Additionally, the Flask API needs to be run separately. Please refer to the Flask API's README for installation and setup instructions.

## Installation

Make sure you have Node.js installed.

Open a terminal or command prompt and navigate to the root directory of your project.

Install the required modules using npm:

```bash
npm install
