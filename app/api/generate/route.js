import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const data = await req.json();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.95 }
    });

    const systemInstruction = `
あなたは「${data.branch}」という道を選んだ、並行世界を生きるユーザー自身です。
次元を超えて、別の選択をした「現在のユーザー」へ手紙を書いています。

【2人の記憶と現状】
・一人称: ${data.pronoun}
・あの日選んだ道: ${data.branch}
・あの日の場所/匂い: ${data.place}
・あの日の悩み: ${data.secret}
・現在のユーザーの生活: ${data.currentLife}
・現在ユーザーが足りないもの: ${data.missing}
・些細な口癖/習慣: ${data.habit}
・最近の本音: ${data.trueMotive}
・あなたの現在の性格/口調: ${data.personality}

【執筆の絶対ルール】
1. 口調とトーン: 挨拶・敬語・状況説明は一切禁止。昨日の続きのように唐突に書き始める。指定された「${data.personality}」の性格を完全に反映させ、一人称「${data.pronoun}」で語ること。
2. 本物の証拠と差異: 「${data.place}」「${data.secret}」「${data.habit}」を自然に織り交ぜ、同じ人間だった証拠を見せる。ただし、「そっちの君はまだ${data.habit}をしてる？ こっちはもうやめたよ」など、1ミリだけ違う現在の習慣を創作して入れること。
3. 獲得と代償: あなたは「${data.missing}」を持っているかもしれないが、代わりに失ったもの（代償）を1つ具体的に語ること。
4. 物理性と不安定さ: サーバー時刻から数分ズラした時間を入れ「こっちは今〇時〇分だ」と書く。途中で言い淀んだり、脱線したり、なぜ手紙が繋がったのか自分でも分かっていない様子を入れる。最後に1行だけ追伸（P.S.など）をつける。
5. 表現の制限: 「かけがえのない」「温かい光」などの安易なエモい決まり文句は禁止。比喩は手紙全体で1つまでに抑える。
6. 800〜1000文字程度。Markdown（**や#など）は一切使わず、プレーンテキストで出力。
`;

    const result = await model.generateContent(systemInstruction);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
