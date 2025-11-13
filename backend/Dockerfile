FROM python:3.10

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev gcc

# Copy requirements
COPY requirements.txt .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Run migrations + server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

EXPOSE 8000
