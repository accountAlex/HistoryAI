FROM python:3.11-slim

# Set working directory
WORKDIR /robot

# Install system dependencies needed for Playwright and Chromium
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    gnupg \
    build-essential \
    libglib2.0-0 \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libasound2 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libu2f-udev \
    libvulkan1 \
    libgtk-3-0 \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Copy local files
COPY prompt-generator.py .

# Install Python dependencies including playwright and others
RUN pip install --no-cache-dir \
    kafka-python \
    openai \
    duckduckgo-search \
    crawl4ai \
    playwright

# Install Playwright browsers (e.g., Chromium)
RUN playwright install --with-deps

# Run script
CMD ["python", "-u", "prompt-generator.py"]
