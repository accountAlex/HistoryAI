import asyncio
import json
import os

from kafka import KafkaConsumer, KafkaProducer
from openai import OpenAI
from duckduckgo_search import DDGS

from crawl4ai import AsyncWebCrawler, BrowserConfig, CacheMode, CrawlerRunConfig
from crawl4ai.content_filter_strategy import BM25ContentFilter
from crawl4ai.markdown_generation_strategy import DefaultMarkdownGenerator
from crawl4ai.models import CrawlResult


consumer = KafkaConsumer(
    'LlmRequest',
    bootstrap_servers='kafka:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8')),
    auto_offset_reset='earliest',
    enable_auto_commit=True,
    group_id='integration-group'
)

producer = KafkaProducer(bootstrap_servers='kafka:9092')


def get_web_urls(search_term: str, num_results: int = 10) -> list[str]:
    discard_urls = ["youtube.com", "britannica.com", "vimeo.com", "vk.com", "bbc.com", "24tv.ua"]
    for url in discard_urls:
        search_term += f" -site:{url}"
    results = DDGS().text(search_term, max_results=num_results)
    return [r["href"] for r in results]


async def crawl_webpages(urls: list[str], prompt: str) -> list[CrawlResult]:
    bm25_filter = BM25ContentFilter(user_query=prompt, bm25_threshold=1.2)
    md_generator = DefaultMarkdownGenerator(content_filter=bm25_filter)

    crawler_config = CrawlerRunConfig(
        markdown_generator=md_generator,
        excluded_tags=["nav", "footer", "header", "form", "img", "a"],
        only_text=True,
        exclude_social_media_links=True,
        keep_data_attributes=False,
        cache_mode=CacheMode.BYPASS,
        remove_overlay_elements=True,
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
        page_timeout=10000,
    )

    browser_config = BrowserConfig(headless=True, text_mode=True, light_mode=True)

    async with AsyncWebCrawler(config=browser_config) as crawler:
        results = await crawler.arun_many(urls, config=crawler_config)
        return results


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


async def process_messages():
    print("Kafka consumer started. Waiting for messages...")
    for message in consumer:
        prompt = message.value.get("content")
        chatUuid = message.value.get("chatUuid")
        print(f"Received message for chatuuid {chatUuid}: {prompt}")

        response = "AI"

        producer.send('LlmResponse', json.dumps({
            'chatUuid': chatUuid,
            'content': response
        }).encode('utf-8'))


if __name__ == "__main__":
    asyncio.run(process_messages())