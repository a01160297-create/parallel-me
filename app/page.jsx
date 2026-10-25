"use client";

import { useState, useEffect } from "react";

export default function ParallelMe() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pronoun: "", branch: "", place: "", secret: "", currentLife: "", missing: ""
  });
  const [letter, setLetter] = useState("");
  const [displayedLetter, setDisplayedLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // タイプライター風の文字送り
  useEffect(() => {
    if (step === 3 && letter) {
      let i = 0;
      const timer = setInterval(() => {
        setDisplayedLetter(letter.substring(0, i));
        i++;
        if (i > letter.length) clearInterval(timer);
      }, 80);
      return () => clearInterval(timer);
    }
  }, [step, letter]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setLetter(data.text);
      setStep(3); // 手紙表示画面へ
    } catch (error) {
      alert("通信エラーが発生しました。");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-serif flex flex-col items-center p-6 selection:bg-slate-700">
      <main className="w-full max-w-xl z-10 flex flex-col items-center mt-12 mb-20">
        
        {step === 1 && (
          <div className="w-full flex flex-col items-center opacity-0 animate-[fadeIn_2s_ease-in_forwards]">
            <h1 className="text-3xl tracking-widest mb-12 text-slate-100 font-light">Parallel Me</h1>
            <p className="text-sm text-slate-400 mb-12 text-center leading-loose">
              並行世界は、存在します。<br/>
              選ばなかった道を歩むあなたと、<br/>少しだけ話をしてみませんか。
            </p>
            <button
              onClick={() => setStep(2)}
              className="px-8 py-3 border border-slate-600 rounded text-slate-300 hover:bg-slate-800 transition-colors tracking-widest text-sm"
            >
              通信を開始する
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col gap-8 opacity-0 animate-[fadeIn_1s_ease-in_forwards]">
            <p className="text-center text-slate-400 text-xs tracking-widest mb-4">-- 記憶の同期プロセス --</p>
            
            <div className="space-y-6">
              {[
                { label: "1. あなたの一人称は？", key: "pronoun", placeholder: "私 / 僕 / 俺" },
                { label: "2. もしあの時、別の道を選んでいたら？", key: "branch", placeholder: "例: 吹奏楽部ではなく帰宅部だったら" },
                { label: "3. 当時、よく入り浸っていた場所や匂いは？", key: "place", placeholder: "例: 錆びたフェンスのある駐輪場" },
                { label: "4. 当時、誰にも言えなかった小さな悩みは？", key: "secret", placeholder: "例: 自分が空っぽに思えたこと" },
                { label: "5. 今のあなたは、どんな日々を送っていますか？", key: "currentLife", placeholder: "例: 毎日パソコンに向かって仕事をしている" },
                { label: "6. 今の生活で、ふと「足りないな」と感じるものは？", key: "missing", placeholder: "例: 心から熱中できる時間" }
              ].map((q, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  <label className="text-sm text-slate-300">{q.label}</label>
                  <input
                    type="text"
                    placeholder={q.placeholder}
                    className="p-3 bg-slate-800/50 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-slate-500 text-sm"
                    onChange={(e) => setFormData({ ...formData, [q.key]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="mt-8 px-8 py-4 border border-slate-500 rounded text-slate-200 hover:bg-slate-800 transition-colors tracking-widest text-sm disabled:opacity-50"
            >
              {isLoading ? "微弱な信号を受信中..." : "手紙を受信する"}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="w-full flex flex-col items-center opacity-0 animate-[fadeIn_2s_ease-in_forwards]">
            <p className="text-xs text-slate-500 mb-8 tracking-widest animate-pulse">... Incoming message from another timeline ...</p>
            <div className="w-full bg-slate-800/30 p-8 rounded border border-slate-700 shadow-2xl">
              <p className="font-serif leading-[2.5] text-slate-300 whitespace-pre-wrap text-[15px]">
                {displayedLetter}
              </p>
            </div>
            
            {displayedLetter === letter && (
              <div className="mt-12 opacity-0 animate-[fadeIn_2s_ease-in_forwards]">
                <button onClick={() => setStep(1)} className="text-xs text-slate-500 tracking-widest hover:text-slate-300 transition-colors">
                  通信を切断する
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
