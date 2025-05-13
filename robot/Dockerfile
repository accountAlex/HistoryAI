FROM python:3.11-slim

# Устанавливаем рабочую директорию
WORKDIR /robot

# Устанавливаем только базовые зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Копируем файл зависимостей и устанавливаем Python-зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем приложение
COPY prompt-generator.py .

# Запуск
CMD ["python", "-u", "prompt-generator.py"]
