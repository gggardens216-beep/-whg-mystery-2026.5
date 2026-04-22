import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Compass,
  HelpCircle,
  KeyRound,
  MapPin,
  Send,
} from 'lucide-react'
import mapImage from './assets/map.png'

const ZONE_COORDS = {
  'Zone A: 吉田観賞魚': { top: '33%', left: '40%' },
  'Zone B: GGガーデンズ': { top: '39%', left: '60%' },
  'Zone C: Gardens Marché': { top: '58%', left: '57%' },
  'Zone D: Au coju': { top: '54%', left: '40%' },
  '最終地点: 水の丘': { top: '47%', left: '52%' },
}

const PUZZLES = [
  { id: 1, zone: 'Zone A: 吉田観賞魚', title: '第一の鍵：始まりの年', description: 'この水の丘の歴史は古い。大正10年、初代・吉田定一がこの地に養殖場を開業したのが全ての始まりだ。大正10年は西暦何年だろうか？数字4桁で答えよ。', hint: '大正10年は西暦『1921』年だよ。', answer: '1921', color: 'text-blue-600 border-blue-200' },
  { id: 2, zone: 'Zone A: 吉田観賞魚', title: '第二の鍵：青き紋章', description: '吉田観賞魚のシンボルマーク（ロゴ）を見てみよう。二つの青い水滴が交わり、ある『水辺の生き物』の姿を描いている。漢字一文字で答えよ。', hint: '池の中を優雅に泳いでいる生き物だよ。', answer: '魚', color: 'text-blue-600 border-blue-200' },
  { id: 3, zone: 'Zone B: GGガーデンズ', title: '第三の鍵：緑の屋根', description: 'グリーンギャラリーガーデンズへ進もう。ここの緑色のロゴマークは、植物を寒さから守り育てる「ある建物」の形をしている。漢字二文字で答えよ。', hint: 'ガラス張りで暖かい部屋のこと。「〇〇室」', answer: '温室', color: 'text-green-600 border-green-200' },
  { id: 4, zone: 'Zone B: GGガーデンズ', title: '第四の鍵：時を刻む花', description: 'アンティーク家具が並ぶエリアで、一番大きな時計を探せ。その時計の短針が「3」を指している時、英語で「3」は何と言う？カタカナ3文字で答えよ。', hint: 'ワン、ツー、〇〇〇。', answer: 'スリー', color: 'text-green-600 border-green-200' },
  { id: 5, zone: 'Zone C: Gardens Marché', title: '第五の鍵：黄金の恵み', description: '地元八王子の恵みが集まるマルシェ。ここの黄色いロゴマークは、ある栄養満点な「食べ物」の形をモチーフにしている。漢字一文字で答えよ。', hint: 'コーヒー〇〇、大豆、などと言う時の漢字だよ。', answer: '豆', color: 'text-yellow-600 border-yellow-200' },
  { id: 6, zone: 'Zone C: Gardens Marché', title: '第六の鍵：大地のパレット', description: 'マルシェに並ぶ新鮮な野菜たち。サラダの彩りに欠かせない、真っ赤で丸い定番野菜は？カタカナ3文字で答えよ。', hint: 'トから始まる3文字の野菜だよ。', answer: 'トマト', color: 'text-yellow-600 border-yellow-200' },
  { id: 7, zone: 'Zone D: Au coju', title: '第七の鍵：休息の合言葉', description: 'レストラン『Au coju』へ。この不思議な名前は、多摩地域の方言で「農作業の合間の一休み」を意味する言葉から来ている。ひらがな4文字で答えよ。', hint: 'そのまま「おこじゅ」と入力して。', answer: 'おこじゅ', color: 'text-purple-600 border-purple-200' },
  { id: 8, zone: 'Zone D: Au coju', title: '第八の鍵：癒しの香り', description: '歩き疲れたらテラス席で一休み。ケーキと一緒に楽しむ、焙煎した豆から淹れる黒くて香り高い飲み物は？カタカナ4文字で答えよ。', hint: 'コから始まる4文字の飲み物。', answer: 'コーヒー', color: 'text-purple-600 border-purple-200' },
  { id: 9, zone: '最終地点: 水の丘', title: '第九の鍵：丘の真実', description: 'ここまで集めた記憶をたどろう。魚が泳ぐ水、茂る緑。この場所全体を『〇〇〇〇ヒルガーデン』と呼ぶ。〇に入るカタカナ4文字は？', hint: '英語で水を意味する言葉だよ。', answer: 'ウォーター', color: 'text-stone-600 border-stone-200' },
  { id: 10, zone: '2046年からの通信', title: '真実の鍵', description: '全ての欠片が集まった。時を動かす最後の鍵、それはこの冒険を始めた「あなたの名前」だ。入力して封印を解け。', hint: '最初に登録した名前を入力して。', answer: 'USER_NAME', color: 'text-red-600 border-red-200' },
]

const normalize = (v) => v.trim().replace(/\s+/g, '')

function App() {
  const [screen, setScreen] = useState('prologue')
  const [userName, setUserName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [message, setMessage] = useState('')

  const puzzle = PUZZLES[currentPuzzleIndex]

  const solvedZones = useMemo(() => {
    const zones = new Set(PUZZLES.slice(0, currentPuzzleIndex).map((p) => p.zone))
    return zones
  }, [currentPuzzleIndex])

  const handleStart = () => {
    if (!nameInput.trim()) {
      setMessage('名前を入力してください。')
      return
    }
    setUserName(nameInput.trim())
    setMessage('')
    setScreen('map')
  }

  const handleSubmitAnswer = () => {
    const expected = puzzle.answer === 'USER_NAME' ? userName : puzzle.answer
    if (normalize(answerInput) !== normalize(expected)) {
      setMessage('答えが違うようです。もう一度探してみよう。')
      return
    }

    setMessage('正解！次の鍵へ進もう。')
    setAnswerInput('')
    setShowHint(false)

    if (currentPuzzleIndex === PUZZLES.length - 1) {
      setScreen('ending')
      return
    }

    setCurrentPuzzleIndex((v) => v + 1)
    setScreen('map')
  }

  if (screen === 'prologue') {
    return (
      <main className="h-[100dvh] w-full flex flex-col overflow-hidden bg-gradient-to-b from-cyan-50 to-blue-100 px-4 py-6 text-slate-800">
        <div className="mx-auto flex h-full w-full max-w-sm flex-col rounded-3xl bg-white/90 p-6 shadow-lg">
          <div className="mb-4 flex items-center gap-2 text-cyan-700">
            <Compass size={20} />
            <p className="text-sm font-medium">Water Hill Garden</p>
          </div>
          <h1 className="text-2xl font-bold leading-tight">水の丘 時巡りミステリー</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            あなたは2046年から届いた通信を受け取り、この庭園の記憶を辿ることになった。まずは冒険者の名前を登録しよう。
            <br />
          Water Hill Garden の記憶はあなたに託された。
        </p>

          <div className="mt-6 space-y-3">
            <label htmlFor="player-name" className="text-sm font-medium text-slate-700">
              あなたの名前
            </label>
            <input
              id="player-name"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none ring-cyan-200 transition focus:ring"
              placeholder="例: ひかり"
            />
            {message ? <p className="text-sm text-red-600">{message}</p> : null}
            <button
              onClick={handleStart}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-base font-semibold text-white transition active:scale-[0.99]"
            >
              <KeyRound size={18} />
              冒険を始める
            </button>
          </div>
        </div>
      </main>
    )
  }

  if (screen === 'map') {
    const currentZone = puzzle.zone
    return (
      <main className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-100 px-4 py-6 text-slate-800">
        <div className="mx-auto flex h-full w-full max-w-sm flex-col rounded-3xl bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-cyan-700">探索マップ</p>
            <p className="text-xs text-slate-500">{currentPuzzleIndex + 1} / {PUZZLES.length}</p>
          </div>

          <div
            className="relative mb-4 flex-1 rounded-2xl border border-cyan-100 bg-[#f5f1e6]"
            style={{
              backgroundImage: `url(${mapImage})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          >
            {Object.entries(ZONE_COORDS).map(([zone, pos]) => {
              const isCurrent = zone === currentZone
              const isSolved = solvedZones.has(zone)

              return (
                <div
                  key={zone}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div
                    className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full border text-xs ${
                      isCurrent
                        ? 'border-cyan-500 bg-cyan-600 text-white'
                        : isSolved
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-slate-300 bg-white text-slate-500'
                    }`}
                  >
                    {isSolved ? <CheckCircle2 size={16} /> : <MapPin size={14} />}
                  </div>
                  <p className="mt-1 w-24 -translate-x-1/3 text-[10px] leading-tight text-slate-700">{zone}</p>
                </div>
              )
            })}
          </div>

          <div className={`rounded-xl border bg-white p-3 ${puzzle.color}`}>
            <p className="text-xs font-semibold">次の目的地</p>
            <p className="mt-1 text-sm font-bold">{puzzle.zone}</p>
            <p className="mt-1 text-xs text-slate-700">{puzzle.title}</p>
          </div>

          <button
            onClick={() => setScreen('play')}
            className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
          >
            この謎に挑戦する
          </button>
        </div>
      </main>
    )
  }

  if (screen === 'play') {
    return (
      <main className="h-[100dvh] w-full flex flex-col overflow-hidden bg-amber-50 px-4 py-6 text-slate-800">
        <div className="mx-auto flex h-full w-full max-w-sm flex-col rounded-3xl bg-white p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <button onClick={() => setScreen('map')} className="rounded-lg p-1 text-slate-500" aria-label="マップへ戻る">
              <ArrowLeft size={18} />
            </button>
            <p className="text-xs text-slate-500">鍵 {puzzle.id}</p>
          </div>

          <div className={`rounded-xl border p-4 ${puzzle.color}`}>
            <p className="text-sm font-bold">{puzzle.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{puzzle.description}</p>
          </div>

          <button
            onClick={() => setShowHint((v) => !v)}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
          >
            <HelpCircle size={16} />
            ヒントを{showHint ? '隠す' : '表示'}
          </button>

          {showHint ? <p className="mt-2 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">{puzzle.hint}</p> : null}

          <div className="mt-4 space-y-3">
            <input
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-base outline-none ring-cyan-200 transition focus:ring"
              placeholder="答えを入力"
            />
            {message ? <p className="text-sm text-rose-600">{message}</p> : null}
            <button
              onClick={handleSubmitAnswer}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-base font-semibold text-white"
            >
              <Send size={16} />
              回答する
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-[100dvh] w-full flex flex-col overflow-hidden bg-gradient-to-b from-slate-900 to-cyan-950 px-4 py-6 text-white">
      <div className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-cyan-900 bg-black/20 p-6 text-center">
        <CheckCircle2 size={36} className="text-emerald-400" />
        <h2 className="mt-4 text-2xl font-bold">封印解除成功</h2>
        <p className="mt-3 text-sm leading-relaxed text-cyan-100">
          {userName}、すべての鍵を解き明かした！
          <br />
          Water Hill Garden の記憶はあなたに託された。
        </p>
        <button
          onClick={() => {
            setScreen('prologue')
            setCurrentPuzzleIndex(0)
            setAnswerInput('')
            setShowHint(false)
            setMessage('')
          }}
          className="mt-6 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900"
        >
          もう一度遊ぶ
        </button>
      </div>
    </main>
  )
}

export default App
