# AI Resume Builder - Backend API

FastAPI backend with MongoDB for AI-powered resume building, parsing, and optimization.

## Features

- 🔐 JWT Authentication (register, login, verify)
- 📄 PDF Resume Parsing (PyMuPDF/pdfplumber + OpenAI)
- 🏢 Company Research & Analysis
- ✨ AI-Powered Resume Optimization
- 📑 PDF Generation (Jinja2 + WeasyPrint)
- ☁️ Cloud Storage (Cloudinary/S3)
- ⚡ Async/Await with Motor
- 🔄 Background Tasks Support

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI app entry point
│   ├── config/
│   │   └── settings.py         # Configuration & environment variables
│   ├── database/
│   │   └── connection.py       # MongoDB connection
│   ├── models/
│   │   ├── user_model.py       # User Pydantic models
│   │   └── resume_model.py     # Resume Pydantic models
│   ├── routes/
│   │   ├── auth.py             # Authentication routes
│   │   ├── resume.py           # Resume routes
│   │   ├── company.py          # Company research routes
│   │   └── pdf.py              # PDF routes (placeholder)
│   ├── controllers/
│   │   ├── auth_controller.py  # Auth business logic
│   │   ├── resume_controller.py # Resume business logic
│   │   └── company_controller.py # Company research logic
│   ├── services/
│   │   ├── ai_service.py       # OpenAI integration
│   │   ├── parser_service.py   # PDF parsing
│   │   └── pdf_service.py      # PDF generation
│   ├── utils/
│   │   ├── jwt_handler.py      # JWT utilities
│   │   └── storage.py          # Cloud storage (Cloudinary/S3)
│   └── templates/
│       ├── resume_ats.html     # ATS-friendly template
│       └── resume_modern.html  # Modern template
├── requirements.txt
├── .env.example
└── README.md
```

## Installation

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB:**
Make sure MongoDB is running locally or update `MONGODB_URL` in `.env`

## Configuration

Update `.env` file with:

- **MongoDB URL**: `mongodb://localhost:27017` (or your MongoDB Atlas URL)
- **OpenAI API Key**: Get from https://platform.openai.com/
- **Cloud Storage**: Either Cloudinary or AWS S3 credentials
- **JWT Secret**: Use a strong secret key in production

## Running the Server

```bash
# Development
uvicorn app.main:app --reload --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API Documentation: http://localhost:8000/docs

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (requires auth)

### Resume

- `POST /resume/parse` - Upload and parse PDF resume
- `POST /resume/generate` - Generate optimized resume
- `POST /resume/pdf` - Generate PDF from resume

### Company

- `POST /company/research` - Research company and get hiring preferences

## Usage Examples

### Register User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### Parse Resume
```bash
curl -X POST "http://localhost:8000/resume/parse" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf"
```

### Generate Optimized Resume
```bash
curl -X POST "http://localhost:8000/resume/generate" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "company_name=Google" \
  -F "job_description=Software Engineer..." \
  -F "resume_style=ats"
```

### Research Company
```bash
curl -X POST "http://localhost:8000/company/research" \
  -F "company_name=Google" \
  -F "job_description=Software Engineer position..."
```

## Database Models

### User
- `user_id` (ObjectId)
- `name`
- `email`
- `hashed_password`
- `profile_info` (dict)
- `saved_resumes` (array of resume IDs)
- `created_at`

### Resume
- `resume_id` (ObjectId)
- `user_id`
- `uploaded_file_url`
- `parsed_data` (JSON)
- `company_name`
- `job_description`
- `company_research` (JSON)
- `generated_resume` (JSON)
- `pdf_url`
- `created_at`

## Technologies

- **FastAPI**: Modern Python web framework
- **MongoDB + Motor**: Async database
- **OpenAI API**: AI-powered parsing and optimization
- **PyMuPDF/pdfplumber**: PDF text extraction
- **Jinja2**: HTML templating
- **WeasyPrint**: HTML to PDF conversion
- **Cloudinary/S3**: Cloud file storage
- **JWT**: Authentication
- **Pydantic**: Data validation

## Production Considerations

1. Use environment variables for all secrets
2. Set up proper CORS origins
3. Use MongoDB Atlas for production database
4. Configure rate limiting
5. Set up logging and monitoring
6. Use HTTPS
7. Implement proper error handling
8. Add request validation
9. Set up backup strategies
10. Monitor API usage and costs

## License

MIT

