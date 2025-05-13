# 1) Базовый образ
FROM python:3.11-slim

# 2) Рабочая директория
WORKDIR /robot

# 3) Устанавливаем минимальные системные зависимости для Playwright + сборки пакетов
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      build-essential \
      libnss3 \
      libatk-bridge2.0-0 \
      libgtk-3-0 \
      libx11-xcb1 \
      libxcomposite1 \
      libxdamage1 \
      libxrandr2 \
      libgbm1 \
      libasound2 \
      libpangocairo-1.0-0 \
      ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# 4) Скопировать и установить Python‑зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5) Установить только Chromium (не тянем Firefox/WebKit)
RUN playwright install chromium

# 6) Скопировать приложение
COPY prompt-generator.py .

# 7) Запуск приложения
CMD ["python", "-u", "prompt-generator.py"]
