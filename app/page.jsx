"use client";
import { useState, useEffect } from "react";

export default function ParallelLetter() {
  const [formData, setFormData] = useState({
    pronoun: "", branch: "", place: "", secret: "", currentLife: "", missing: "", habit: "", trueMotive: "", personality: "達観・静か（落ち着いたトーン）"
  });
  const [status, setStatus] = useState("idle"); 
  const [letterText, setLetterText] = useState("");
  const [displayedText, setDisplayedText] = useState("");

  // ★ここを変更：文字の表示速度をゆっくり（150ms）にしました
  useEffect(() => {
    if (status === "reading" && letterText) {
      let i = 0;
      setDisplayedText("");
      const timer = setInterval(() => {
        setDisplayedText(letterText.slice(0, i));
        i++;
        if (i > letterText.length) clearInterval(timer);
      }, 150); 
      return () => clearInterval(timer);
    }
  }, [status, letterText]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("receiving");
    
    setTimeout(() => {
      setStatus((prev) => prev === "receiving" ? "tuning" : prev);
    }, 2000);
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.text) {
        setLetterText(data.text);
        setStatus("arrived");
        setTimeout(() => setStatus("reading"), 1500);
      } else {
        setStatus("idle");
        alert("手紙の受信に失敗しました。しばらく待ってから再度お試しください。");
      }
    } catch (error) {
      console.error(error);
      setStatus("idle");
      alert("通信エラーが発生しました。");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] text-gray-300 font-sans p-6 py-12 flex flex-col items-center justify-center selection:bg-gray-700">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Zen+Kurenaido&display=swap');
        .font-letter { font-family: 'Zen Kurenaido', sans-serif; }
        .paper-texture {
          background-color: #e9e2d0;
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}</style>

      <div className="w-full max-w-xl relative">
        {status === "idle" && (
          <div className="animate-fade-in mb-12 text-center space-y-4">
            <h1 className="text-2xl tracking-[0.2em] text-gray-200 font-light">Parallel Letter</h1>
            <p className="text-xs tracking-widest text-gray-400 leading-loose">
              もしもあの日、違う道を選んでいたら。<br />
              別の選択をした「並行世界のあなた」から、<br />
              現在のあなたへ手紙が届きます。
            </p>
          </div>
        )}

        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in pb-12">
            <div className="space-y-6">
              {[
                { name: "pronoun", label: "普段のあなたの、一人称は？", placeholder: "俺、私、僕など" },
                { name: "branch", label: "あの日、選ばなかった道は？", placeholder: "あの会社を辞めなかったら、あの人に告白していたら" },
                { name: "place", label: "その時、どこにいた？ 何の匂いがした？", placeholder: "夏の夕暮れの教室、湿ったアスファルトの匂い" },
                { name: "secret", label: "あの日、誰にも言えなかった悩みは？", placeholder: "本当は一人になるのが怖かった" },
                { name: "habit", label: "あなたの些細な口癖や習慣は？", placeholder: "緊張すると前髪を触る、「まぁいっか」と言う" },
                { name: "currentLife", label: "今のあなたは、どんな生活をしている？", placeholder: "東京で営業職をしている。猫を飼っている" },
                { name: "missing", label: "今、何が足りない気がする？", placeholder: "熱中できること、誰かからの承認" },
                { name: "trueMotive", label: "誰にも言ってない、最近の小さな本音は？", placeholder: "本当は少し休みたい" }
              ].map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="text-sm text-gray-400 mb-2 tracking-wider">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    className="bg-transparent border-b border-gray-700 focus:border-gray-400 outline-none py-2 text-gray-200 transition-colors placeholder-gray-700 text-sm"
                    placeholder={field.placeholder}
                  />
                </div>
              ))}

              <div className="flex flex-col pt-2">
                <label className="text-sm text-gray-400 mb-2 tracking-wider">並行世界のあなたの性格は？</label>
                <select
                  name="personality"
                  value={formData.personality}
                  onChange={handleChange}
                  className="bg-[#0f1115] border-b border-gray-700 focus:border-gray-400 outline-none py-2 text-gray-200 transition-colors cursor-pointer text-sm"
                >
                  <option value="達観・静か（落ち着いたトーン）">達観・静か（落ち着いたトーン）</option>
                  <option value="情熱的・自信家（少し強気なトーン）">情熱的・自信家（少し強気なトーン）</option>
                  <option value="シニカル・皮肉屋（ぶっきらぼうだが優しいトーン）">シニカル・皮肉屋（ぶっきらぼうだが優しいトーン）</option>
                  <option value="メランコリック・後悔（少し翳りのあるトーン）">メランコリック・後悔（少し翳りのある切ないトーン）</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full mt-16 py-4 text-sm tracking-widest text-gray-500 hover:text-gray-200 transition-colors duration-500 border border-gray-800 hover:border-gray-600 rounded-sm"
            >
              時空を繋ぐ
            </button>
          </form>
        )}

        {(status === "receiving" || status === "tuning" || status === "arrived") && (
          <div className="h-[60vh] flex flex-col items-center justify-center text-gray-400 tracking-[0.3em] text-sm animate-pulse z-50">
            {status === "receiving" && "……受信中"}
            {status === "tuning" && "波長を合わせています"}
            {status === "arrived" && "届きました"}
          </div>
        )}

        {status === "reading" && (
          <div className="animate-fade-in-up mt-8">
            <div className="paper-texture text-gray-800 p-8 md:p-12 shadow-2xl rounded-sm -rotate-[0.5deg] leading-[2.2] tracking-wide font-letter text-lg min-h-[500px]">
              <div className="whitespace-pre-wrap">{displayedText}</div>
            </div>
            <div className="mt-12 mb-8 text-center">
              <p className="text-xs text-gray-600 tracking-[0.2em]">この手紙は、この一度しか届きません</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
