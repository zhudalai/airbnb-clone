import httpx
import asyncio

async def test():
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "http://localhost:8000/api/chat",
            json={"message": "チェックイン時間は？"},
        )
        print("Status:", r.status_code)
        print("Body:", r.text)

asyncio.run(test())
