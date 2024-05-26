'use client'

import React, { useState, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

// 秒数を00:00形式に変換
function formatSeconds(seconds: number) {
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
}

export default function Generator({
  content,
  activityId,
}: {
  content: string
  activityId: string
}) {
  const [count, setCount] = useState(30)
  const [totalTime, setTotalTime] = useState(0)
  const [token, setToken] = useState(content)
  const limit = 60 * 5 // 5分

  useEffect(() => {
    async function createToken() {
      const response = await fetch('/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activityId: activityId,
        }),
      })
      const data = await response.json()
      return data.token
    }

    if (count > 0) {
      const timer = setTimeout(() => {
        setCount(count - 1)
        setTotalTime(totalTime + 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (totalTime < limit) {
      createToken().then((newToken) => {
        setToken(newToken)
        setCount(30)
      })
    }
  }, [count, activityId, content, totalTime, limit])

  if (totalTime >= limit) {
    return (
      <>
        <div className="text-center text-xl font-semibold">Timeout</div>
        <div className="text-center text-sm">Please refresh the page.</div>
      </>
    )
  }

  return (
    <>
      <QRCodeCanvas
        value={`${process.env.NEXT_PUBLIC_BASE_URL}/attend/${token}`}
        size={256}
        bgColor={'#FFF'}
        fgColor={'#000'}
        level={'L'}
        includeMargin={true}
        className="max-w-full object-contain"
      />
      <div className="text-center text-sm" style={{ wordBreak: 'break-all' }}>
        {token}
      </div>
      <div>
        {count >= 0 && (
          <div className="text-center text-xl font-semibold">{formatSeconds(count)}</div>
        )}
      </div>
    </>
  )
}
