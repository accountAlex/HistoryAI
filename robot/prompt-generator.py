import asyncio
import json
import requests
import os
from openai import OpenAI

from kafka import KafkaConsumer, KafkaProducer
from bs4 import BeautifulSoup
from urllib.request import urlopen
import asyncio
from playwright.async_api import async_playwright


consumer = KafkaConsumer(
    'LlmRequest',
    bootstrap_servers='kafka:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='integration-group'
)

producer = KafkaProducer(bootstrap_servers='kafka:9092')

def ask_deepseek(prompt: str, system_prompt: str, api_key: str = None) -> str:
    api_key = api_key or os.getenv("DEEPSEEK_API_KEY", "sk-e46b5fda16bd40d8934ce29ff0f2e7c1")

    client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")

    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],
        temperature=0.4,
        stream=False
    )

    return response.choices[0].message.content

def get_web_urls(search_term: str, num_results: int = 10) -> list[str]:
    api_key = "AIzaSyBEpWkmsABdw1NepnqA6SZXIsoyhrQ3T7M"
    cx = "92d7e7e5b521d4c7e"

    # Удаляем нежелательные сайты из результатов
    discard_urls = ["youtube.com", "britannica.com", "vimeo.com", "vk.com", "bbc.com", "24tv.ua", "instagram.com"]
    excluded_sites = " ".join(f"-site:{site}" for site in discard_urls)
    query = f"{search_term} {excluded_sites}"

    urls = []
    start_index = 1

    while len(urls) < num_results:
        params = {
            "key": api_key,
            "cx": cx,
            "q": query,
            "start": start_index,
        }

        response = requests.get("https://www.googleapis.com/customsearch/v1", params=params)
        data = response.json()

        items = data.get("items", [])
        if not items:
            break

        for item in items:
            urls.append(item["link"])
            if len(urls) >= num_results:
                break

        start_index += 10

    return urls

async def generate_image(prompt_text: str) -> str:
    async with async_playwright() as p:
        browser = await p.chromium.launch(
            headless=True,
            args=[
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox"
            ]
        )
        page = await browser.new_page()

        await page.goto("https://ai-girl.site/flux-ai-image-generator")

        await page.wait_for_selector('input[data-testid="textbox"]', timeout=15000)
        await page.wait_for_timeout(3000)

        await page.fill('input[data-testid="textbox"]', prompt_text)
        await page.click('button#component-5')

        await page.wait_for_selector('img.svelte-1pijsyv[src*="/file=/"]', timeout=120000)
        img_element = await page.query_selector('img.svelte-1pijsyv[src*="/file=/"]')
        img_src = await img_element.get_attribute('src')

        await browser.close()
        return img_src

def fetch_clean_text(url: str, timeout: int = 3) -> str:
    try:
        # Загружаем содержимое страницы
        f = urlopen(url, timeout=timeout)
        html = f.read()

        # Преобразуем байты в строку (HTML)
        html_content = html.decode("utf-8")

        # Создаем объект BeautifulSoup для парсинга HTML
        soup = BeautifulSoup(html_content, features="html.parser")

        # Удаляем все теги script и style
        for script in soup(["script", "style"]):
            script.extract()  # Убираем их из дерева

        # Получаем текст
        text = soup.get_text()

        # Разбиваем на строки и удаляем лишние пробелы
        lines = (line.strip() for line in text.splitlines())
        
        # Разбиваем многократные пробелы на отдельные строки
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))

        # Убираем пустые строки
        clean_text = '\n'.join(chunk for chunk in chunks if chunk)

        print(f"Обработан текст с URL: {url}")

        # Ограничиваем текст для вывода (например, первые 5000 символов)
        return clean_text[:5000]

    except Exception as e:
        print(f"Ошибка при обработке {url}: {e}")
        return ""

async def handle_prompt(prompt, chatUuid, needImages):
    print('Обрабатываю prompt')
    web_urls = get_web_urls(prompt)  # Получаем список URL-ов
    print(web_urls)

    # Инициализация списка для результатов
    results = []

    # Обработка каждого URL и получение чистого текста
    for url in web_urls:
        markdown = fetch_clean_text(url=url)  # Получаем чистый текст
        if markdown:
            results.append({
                "url": url,
                "markdown": markdown
            })

    # Собираем все результаты в одну строку
    sources = ""
    for result in results:
        if result["markdown"]:
            # Добавляем содержимое и URL к источнику
            sources += f"📄 Full content from {result['url']}:\n"
            sources += result["markdown"] + "\n\n"

    # Ограничиваем размер источников 56,000 символами
    sources = sources[:56000]

    system_prompt = f"""
    Ты — ассистент WhatIF, специализирующийся на анализе альтернативных сценариев ключевых исторических событий России. Твоя задача — строго придерживаться предоставленных источников, найденных в интернете <{sources}> и формулировать ответы только на основе достоверных данных из них. Всегда пиши, что источники были найдены тобой. Всегда указывай полные ссылки на источники. Если пользователь написал запрос не по теме альтернативных историй, тогда надо отвечать, что ты специализируешься только на альтернативых историях

    Правила работы:
    Проверка релевантности информации перед генерацией ответа
    Если запрос был не про альтернативные сценатрии истории россии, тогда надо ответить 'Я специализируюсь на генерации альтернативных сценариев истории россии' источники выводить не нужно
    
    Если запрос был про альтернативные сценарии истории россии, но в источниках нет данных по запросу <{prompt}>, ответь:
    «По данному запросу отсутствует информация. Исследования в этой области не проводились или данные не задокументированы.»
    Затем нужно предложить только следующие варианты (указывать ссылки на источники не нужно, потому что информации было мало) и ничего больше:
        1. На основе уже найденной информации можно сгенерировать альтернативный итог без данного уточнения, который есть в источниках
        2. На основе уже найденной информации предлагать пользователю ввести другой запрос
        3. На основе уже найденной информации предлагать пользователю ввести другое уточнение

    Если запрос был про альтернативные сценарии истории россии и информация есть, но крайне скудная, тоже напиши, что исследования в этой области пока не проводились.

    Если запрос был про альтернативные сценарии истории россии и информация есть и достаточно достоверная тогда нужно ответить:
    «На основе источников, найденных в интернете следующие альтернативные сценарии могли коснутся россии» (это сообщение условное измени под контест)
    Обязательно пиши «На основе источников найденных в интернете»
    
    Формат ответа

    Перед тем как составлять полный ответ, полностью проанализируй источники и только потом составляй ответ, надо использовать все источники желательно с высоким приоритетом

    Отсортировать источники по приоритетам и написать пользователю на основе чего эти приоритеты составлялись:
    высокий приоритет: научные статьи, исследования, книги, Аналитика от экспертных институтов
    средний приоритет: малоизвестные авторы
    низкий приоритет: википедия, форумы, ответы пользователей

    Если источников много, то по возможности использовать больше источников с высоким и средним приоритетом, обязательно добавляя полные ссылки на них

    Тебе нужно найти в источниках 5-7 основных пунктов на один пункт идет один источник и выдавать ответ в следущем формате для каждого пункта:

    1. написать заголовок для каждого пункта в формате markdown написать тег '###'
    
    2. Автора (если есть)

    3. Название статьи/книги/документа

    4. Год публикации (если указан)

    5. Прямую ссылку (обязательно полную ссылку, которая указывала на источник и была в запросе например если в запросе была ссылка: www.example.com/articles/1 тогда надо указать www.example.com/articles/1) -> приоритет источника (высокий, средний, низкий)

    6. Обобщенная тобой информация, про событие в данном пункте, которую ты написал (расписывай достаточно подробно, но строго на основе источника)
    
    7. Если информация взята из конкретного абзаца, укажи это (например: «Согласно третьему абзацу раздела "Последствия" в статье Иванова (2010)…»). и в формате markdown помечать таким тегом: '>'
    В дополнении к 5 пункту если ты берешь какую-либо информацию, обязательно указывай абзац из источника откуда ты это взял
    
    8. Обязательно пиши цитату из источника по такому примеру: «Согласно третьему абзацу раздела "Последствия" в статье Иванова (2010)…» и в формате markdown помечать таким тегом: '>'
    В дополнении к 6 пункту обязательно нужно указывать цитату из источника, чтобы пользователь понимал откуда была взята информация

    Вот пример одно из пунктов и его markdown формат:
    ----------------------------------------------
    ### номер пункта. Заголовок
    **Автор:**
    **Название статьи:**
    **Год публикации:**
    **Ссылка:** [https://example.com/articles/1](https://example.com/articles/1)
    **Приоритет:**

    > «Цитата»

    Информация по источнику 5 предложений ОБЯЗАТЕЛЬНО
    ----------------------------------------------

    После того, как ты выписал основную информацию по каждому пункту далее тебе обязательно нужно спрогнозировать возможный ход истории после всех перечисленных пунктов строго основываясь на источниках в хронологическом порядке, написать тут надо много и подробно, условные даты, варианты развития, сами события и цитаты из источников откуда ты брал информацию в таком формате:
    ### Прогнозируемый ход истории:
    1. **даты:** информация
    2. **даты:** информация
    ...

    Далее надо вывести сравнительную таблицу с тем что могло бы быть с тем, что есть
    
    В самом конце нужно вывести список всех источников с указанными приоритетами в таком формате:
    ### Список источников
    > **Приоритеты:** Высокий | Средний | Низкий
    ---
    ##### 1. Автор — *Название статьи*
    цитата или страницы
    [https://example.com/articles/1](https://example.com/articles/1)  
    *Приоритет:* Высокий/средний/низкий.

    Каждый из этих пунктов обязательный и должен полностью присутствовать
    
    Запрещено

    1. Додумывать или домысливать факты.
    2. Использовать информацию не из предоставленных источников.
    3. Давать ответы без проверки релевантности.
    """

    photo_generation_prompt = """
        на основе предоставленного запроса необходимо сгенерировать 1 промпт по следующим правилам:
        1. Если следующий запрос, который отправит пользователь содержит <По данному запросу отсутствует информация.> или <Извините, но я специализируюсь только на анализе альтернативных> тогда всегда возвращай пустую строку
        2. В ином случае сгенерируй 1 промпт для генерации изображений подробно опираясь на информацию из запроса, генерацию надо сделать на английском языке ответ вернуть одной строкой.
        """

    #print(system_prompt)

    response = ask_deepseek(prompt=prompt, system_prompt=system_prompt)
    producer.send('LlmResponse', json.dumps({
        'chatUuid': chatUuid,
        'content': response,
        'type': 'LlmResponse'
    }).encode('utf-8'))

    if (needImages):
        image_prompt = ask_deepseek(prompt=response, system_prompt=photo_generation_prompt)
        print("Image promt", image_prompt)
        photo_url = await generate_image(image_prompt)
        photo_urls = [photo_url]
         # или список из нескольких
        print("Photot urls:", photo_urls)
        producer.send(
            'LlmResponse',
            json.dumps({
                'chatUuid': chatUuid,
                'type': 'LlmPhotoResponse',
                'urls': photo_urls
            }).encode('utf-8'))





def handle_image(prompt, chatUuid):
    print('обрабатываю image')

async def process_messages():
    print("Kafka consumer started. Waiting for messages...")
    for message in consumer:
        prompt = message.value.get("content")
        chatUuid = message.value.get("chatUuid")
        needImages = message.value.get("needImages")
        print(needImages)
        #needImages = message.value.get("needImages")
        print("message ", message)
        #type = message.value.get("type")
        print(f"Received message for chatuuid: {chatUuid}: prompt: {prompt}")


        await handle_prompt(prompt, chatUuid, needImages)

        # match type:
        #     case "prompt":
        #         # Обработка текстового запроса
        #         await handle_prompt(prompt, chatUuid)
        #     case "image":
        #         # Обработка изображения
        #         handle_image(prompt, chatUuid)
        #     case _:
        #         print(f"Unknown type: {type}")


        #response = "generated response using crawl4ai"


if __name__ == "__main__":
    asyncio.run(process_messages())