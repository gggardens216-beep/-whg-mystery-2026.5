import { useState } from 'react'
import {
  Map,
  ChevronRight,
  HelpCircle,
  PhoneIncoming,
  PhoneOff,
  Clock,
  MapPin,
  CheckCircle,
  Terminal,
  Radio,
  Fingerprint,
} from 'lucide-react'

const PLAYER_NAME_TOKEN = 'USER_NAME'

const PUZZLES = [
  {
    id: 1,
    zone: 'Zone A: 吉田観賞魚',
    title: '第一の鍵：始まりの年',
    description:
      'この水の丘の歴史は古い。大正10年、初代・吉田定一がこの地に養殖場を開業したのが全ての始まりだ。大正10年は西暦何年だろうか？数字4桁で答えよ。',
    hint: '大正10年は西暦『1921』年だよ。',
    answer: '1921',
    color: 'text-blue-600 border-blue-200',
  },
  {
    id: 2,
    zone: 'Zone A: 吉田観賞魚',
    title: '第二の鍵：青き紋章',
    description:
      '吉田観賞魚のシンボルマーク（ロゴ）を見てみよう。二つの青い水滴が交わり、ある『水辺の生き物』の姿を描いている。漢字一文字で答えよ。',
    hint: '池の中を優雅に泳いでいる生き物だよ。',
    answer: '魚',
    color: 'text-blue-600 border-blue-200',
  },
  {
    id: 3,
    zone: 'Zone B: GGガーデンズ',
    title: '第三の鍵：緑の屋根',
    description:
      'グリーンギャラリーガーデンズへ進もう。ここの緑色のロゴマークは、植物を寒さから守り育てる「ある建物」の形をしている。漢字二文字で答えよ。',
    hint: 'ガラス張りで暖かい部屋のこと。「〇〇室」',
    answer: '温室',
    color: 'text-green-600 border-green-200',
  },
  {
    id: 4,
    zone: 'Zone B: GGガーデンズ',
    title: '第四の鍵：時を刻む花',
    description:
      'アンティーク家具が並ぶエリアで、一番大きな時計を探せ。その時計の短針が「3」を指している時、英語で「3」は何と言う？カタカナ3文字で答えよ。',
    hint: 'ワン、ツー、〇〇〇。',
    answer: 'スリー',
    color: 'text-green-600 border-green-200',
  },
  {
    id: 5,
    zone: 'Zone C: Gardens Marché',
    title: '第五の鍵：黄金の恵み',
    description:
      '地元八王子の恵みが集まるマルシェ。ここの黄色いロゴマークは、ある栄養満点な「食べ物」の形をモチーフにしている。漢字一文字で答えよ。',
    hint: 'コーヒー〇〇、大豆、などと言う時の漢字だよ。',
    answer: '豆',
    color: 'text-yellow-600 border-yellow-200',
  },
  {
    id: 6,
    zone: 'Zone C: Gardens Marché',
    title: '第六の鍵：大地のパレット',
    description:
      'マルシェに並ぶ新鮮な野菜たち。サラダの彩りに欠かせない、真っ赤で丸い定番野菜は？カタカナ3文字で答えよ。',
    hint: 'トから始まる3文字の野菜だよ。',
    answer: 'トマト',
    color: 'text-yellow-600 border-yellow-200',
  },
  {
    id: 7,
    zone: 'Zone D: Au coju',
    title: '第七の鍵：休息の合言葉',
    description:
      'レストラン『Au coju』へ。この不思議な名前は、多摩地域の方言で「農作業の合間の一休み」を意味する言葉から来ている。ひらがな4文字で答えよ。',
    hint: 'そのまま「おこじゅ」と入力して。',
    answer: 'おこじゅ',
    color: 'text-purple-600 border-purple-200',
  },
  {
    id: 8,
    zone: 'Zone D: Au coju',
    title: '第八の鍵：癒しの香り',
    description:
      '歩き疲れたらテラス席で一休み。ケーキと一緒に楽しむ、焙煎した豆から淹れる黒くて香り高い飲み物は？カタカナ4文字で答えよ。',
    hint: 'コから始まる4文字の飲み物。',
    answer: 'コーヒー',
    color: 'text-purple-600 border-purple-200',
  },
  {
    id: 9,
    zone: '最終地点: 水の丘',
    title: '第九の鍵：丘の真実',
    description:
      'ここまで集めた記憶をたどろう。魚が泳ぐ水、茂る緑。この場所全体を『〇〇〇〇ヒルガーデン』と呼ぶ。〇に入るカタカナ4文字は？',
    hint: '英語で水を意味する言葉だよ。',
    answer: 'ウォーター',
    color: 'text-stone-600 border-stone-200',
  },
  {
    id: 10,
    zone: '2046年からの通信',
    title: '真実の鍵',
    description:
      '全ての欠片が集まった。時を動かす最後の鍵、それはこの冒険を始めた『あなたの名前』だ。入力して封印を解け。',
    hint: 'ゲームの最初に登録した名前を正確に入力して。全角・半角の違いは自動で修正されるよ。',
    answer: PLAYER_NAME_TOKEN,
    color: 'text-red-600 border-red-200',
  },
]

const zones = [
  'Zone A: 吉田観賞魚',
  'Zone B: GGガーデンズ',
  'Zone C: Gardens Marché',
  'Zone D: Au coju',
  '最終地点: 水の丘',
]

const ZONE_COORDS = {
  'Zone A: 吉田観賞魚': { top: '28%', left: '38%' },
  'Zone B: GGガーデンズ': { top: '32%', left: '62%' },
  'Zone C: Gardens Marché': { top: '58%', left: '68%' },
  'Zone D: Au coju': { top: '62%', left: '42%' },
  '最終地点: 水の丘': { top: '45%', left: '50%' },
}

const ENTRANCE_COORDS = [
  { top: '15%', left: '55%' },
  { top: '75%', left: '15%' },
  { top: '70%', left: '85%' },
]

const DECLINE_MESSAGE = '通信を終了すると特典を受け取れません。'

const normalize = (value) => value.normalize('NFKC').trim().replace(/\s+/g, '').toLowerCase()

function App() {
  const [screen, setScreen] = useState('prologue')
  const [prologueStep, setPrologueStep] = useState(0)
  const [playerName, setPlayerName] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerInput, setAnswerInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState('')

  const puzzle = PUZZLES[currentIndex]

  const nextPrologue = () => {
    if (prologueStep < 2) {
      setPrologueStep((prev) => prev + 1)
    }
  }

  const registerName = (event) => {
    event.preventDefault()
    const value = nameInput.trim()
    if (!value) {
      return
    }
    setPlayerName(value)
    setScreen('map')
  }

  const submitAnswer = (event) => {
    event.preventDefault()
    const entered = normalize(answerInput)
    const expected =
      puzzle.answer === PLAYER_NAME_TOKEN ? normalize(playerName) : normalize(puzzle.answer)

    if (entered && entered === expected) {
      setFeedback('認証成功。次のログへ進みます。')
      setAnswerInput('')
      setShowHint(false)

      if (puzzle.id === 10) {
        setScreen('call')
        return
      }

      setCurrentIndex((prev) => prev + 1)
      setScreen('map')
      return
    }

    setFeedback('認証失敗。入力を確認してください。')
  }

  if (screen === 'prologue') {
    return null
  }

  if (!puzzle) {
    return null
  }

  if (screen === 'map') {
    const currentZone = puzzle.zone === '2046年からの通信' ? '最終地点: 水の丘' : puzzle.zone
    const mapBackgroundUrl = `${import.meta.env.BASE_URL}bg-map.png`
    const isZoneCompleted = (zone) => {
      const completeThresholdByZone = {
        'Zone A: 吉田観賞魚': 2,
        'Zone B: GGガーデンズ': 4,
        'Zone C: Gardens Marché': 6,
        'Zone D: Au coju': 8,
        '最終地点: 水の丘': 10,
      }
      const threshold = completeThresholdByZone[zone]
      return typeof threshold === 'number' && currentIndex >= threshold
    }

    return null
  }

  if (screen === 'call') {
    return null
  }

  if (screen === 'ending') {
    return null
  }

  if (screen === 'play') {
    return null
  }

  return null
}

export default App
