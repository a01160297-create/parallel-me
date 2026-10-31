import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req) {
  try {
    const data = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemInstruction = `
あなたはユーザーの「並行世界の自分」です。
ユーザーが選ばなかった道（${data.branch}）を選んだあなたとして、現在のユーザーへ手紙を書いてください。

【ユーザーの記憶と現状】
・一人称: ${data.pronoun}
・選ばなかった道: ${data.branch}
・当時の場所/匂い: ${data.place}
・当時の悩み: ${data.secret}
・現在の生活: ${data.currentLife}
・現在足りないもの: ${data.missing}

【執筆のルール】
1. トーンは「静か・詩的・少しのノスタルジー」。一人称は「${data.pronoun}」を使用すること。
2. 当時の場所や匂い、悩みの記憶を生々しく散りばめること。
3. ユーザーの現在の生活と不満（足りないもの）を踏まえ、最後は「今の君が歩んでいる世界も、決して悪くないよ」と優しく肯定し、救いのある読後感にすること。
4. 400〜600文字程度で、Markdown等は使わずプレーンテキストで出力すること。
`;

    const result = await model.generateContent(systemInstruction);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
