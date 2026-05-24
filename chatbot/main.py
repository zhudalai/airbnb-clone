from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

app = FastAPI(title="民泊AI客服", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MINPAKU_KB = """
## よくある質問

Q: チェックイン・チェックアウト時間は？
A: チェックインは15:00〜22:00、チェックアウトは11:00までです。

Q: キャンセルポリシーは？
A: 到着日から48時間前まで無料キャンセル可能です。48時間を過ぎた場合は宿泊料金の50%がキャンセル料として発生します。

Q: 駐車場はありますか？
A: 物件によります。各物件ページの「設備・アメニティ」をご確認ください。事前にお問い合わせいただければ、空き状況をお答えします。

Q: ペットは同伴可能ですか？
A: ペット可の物件もございます。検索フィルターで「ペット可」をお選びください。別途ペット料金（1泊¥2,000）がかかる場合があります。

Q: WiFiは使えますか？
A: 全物件で無料WiFiをご利用いただけます。

Q: タオルやシャンプーはありますか？
A: はい。バスタオル、フェイスタオル、シャンプー、コンディショナー、ボディーソープを用意しています。

Q: 近くにコンビニやスーパーはありますか？
A: 物件の所在地ページにお店の情報を掲載しています。不明な場合はお気軽にお問い合わせください。

Q: 領収書は発行できますか？
A: はい。予約確認メールに領収書ダウンロードリンクが含まれています。別途必要な場合はお知らせください。
"""


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


@app.get("/")
async def root():
    return {"status": "ok", "service": "民泊AI客服", "version": "1.0.0"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY", "")

    if not api_key:
        # Fallback: return a mock reply when no API key is configured
        return ChatResponse(
            reply=f"【モック応答】申し訳ございません。現在AIチャットサーバーは設定中です。"
                  f"ご質問: 「{request.message}」を受け取りました。"
                  f"お急ぎの場合はお電話（03-XXXX-XXXX）でお問い合わせください。"
        )

    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "google/gemini-2.0-flash-001",
                "messages": [
                    {
                        "role": "system",
                        "content": f"あなたは民泊プラットフォーム「民泊マーケティング」のカスタマーサポートです。"
                                   f"以下のFAQに基づいて日本語で丁寧に回答してください。"
                                   f"FAQにない質問には、一般的な民泊の知識で答えてください。"
                                   f"\n{MINPAKU_KB}",
                    },
                    {"role": "user", "content": request.message},
                ],
                "temperature": 0.7,
                "max_tokens": 500,
            },
        )
        data = response.json()

    reply = data["choices"][0]["message"]["content"]
    return ChatResponse(reply=reply)


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
