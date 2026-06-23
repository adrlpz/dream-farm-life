// DialogUI.tsx — NPC dialog box with typewriter effect
import { useState, useEffect, useRef } from 'react'
import type { NpcDef, DialogLine, DialogChoice } from '../data/npcs'

interface DialogUIProps {
  npc: NpcDef
  dialog: DialogLine[]
  questInfo?: {
    available: { id: string; name: string; description: string }[]
    completable: { id: string; name: string }[]
  }
  onChoice: (choice: DialogChoice) => void
  onStartQuest: (questId: string) => void
  onCompleteQuest: (questId: string) => void
  onClose: () => void
}

export function DialogUI({ npc, dialog, questInfo, onChoice, onStartQuest, onCompleteQuest, onClose }: DialogUIProps) {
  const [lineIndex, setLineIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const timerRef = useRef<number>()

  const currentLine = dialog[lineIndex]

  // Typewriter effect
  useEffect(() => {
    if (!currentLine) return
    const text = currentLine.text
    setDisplayedText('')
    setIsTyping(true)
    let i = 0

    const tick = () => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1))
        i++
        timerRef.current = window.setTimeout(tick, 30)
      } else {
        setIsTyping(false)
      }
    }
    tick()

    return () => clearTimeout(timerRef.current)
  }, [lineIndex, currentLine])

  const handleClick = () => {
    if (isTyping) {
      // Skip typewriter
      clearTimeout(timerRef.current)
      setDisplayedText(currentLine?.text ?? '')
      setIsTyping(false)
      return
    }

    // If no choices, advance to next line
    if (!currentLine?.choices || currentLine.choices.length === 0) {
      if (lineIndex < dialog.length - 1) {
        setLineIndex(lineIndex + 1)
      } else {
        onClose()
      }
    }
  }

  const handleChoice = (choice: DialogChoice) => {
    if (choice.questId) {
      onStartQuest(choice.questId)
    }
    if (choice.nextLine === -1) {
      onClose()
    } else {
      setLineIndex(choice.nextLine)
    }
    onChoice(choice)
  }

  if (!currentLine) {
    // End of dialog — show quest options if available
    return (
      <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 z-50">
        <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{npc.portrait}</span>
            <div>
              <div className="text-white font-bold">{npc.name}</div>
              <div className="text-gray-400 text-sm">{npc.role}</div>
            </div>
          </div>

          {questInfo?.completable && questInfo.completable.length > 0 && (
            <div className="mb-3">
              {questInfo.completable.map(q => (
                <button
                  key={q.id}
                  onClick={() => onCompleteQuest(q.id)}
                  className="w-full bg-green-700 hover:bg-green-600 text-white rounded-lg px-3 py-2 mb-1 text-sm text-left transition-colors"
                >
                  ✅ Complete: {q.name}
                </button>
              ))}
            </div>
          )}

          {questInfo?.available && questInfo.available.length > 0 && (
            <div className="mb-3">
              {questInfo.available.map(q => (
                <button
                  key={q.id}
                  onClick={() => onStartQuest(q.id)}
                  className="w-full bg-yellow-700 hover:bg-yellow-600 text-white rounded-lg px-3 py-2 mb-1 text-sm text-left transition-colors"
                >
                  📜 {q.name}
                </button>
              ))}
            </div>
          )}

          <button onClick={onClose} className="w-full text-gray-400 hover:text-white text-sm py-1">
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute inset-x-0 bottom-4 flex justify-center px-4 z-50" onClick={handleClick}>
      <div className="bg-gray-900/95 border border-gray-700 rounded-2xl p-4 max-w-lg w-full cursor-pointer">
        {/* Speaker */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{currentLine.speaker === 'npc' ? npc.portrait : '🧑‍🌾'}</span>
          <div className="text-white font-bold">
            {currentLine.speaker === 'npc' ? npc.name : 'You'}
          </div>
        </div>

        {/* Text */}
        <div className="text-gray-200 text-sm leading-relaxed min-h-[2rem]">
          {displayedText}
          {isTyping && <span className="animate-pulse">▌</span>}
        </div>

        {/* Choices */}
        {!isTyping && currentLine.choices && currentLine.choices.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {currentLine.choices.map((choice, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); handleChoice(choice) }}
                className="bg-gray-800 hover:bg-gray-700 text-white rounded-lg px-3 py-2 text-sm text-left transition-colors border border-gray-600 hover:border-gray-500"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Continue hint */}
        {!isTyping && (!currentLine.choices || currentLine.choices.length === 0) && (
          <div className="text-gray-500 text-xs mt-2 text-right">
            Click to continue ▸
          </div>
        )}
      </div>
    </div>
  )
}
