'use client'

import { Html5QrcodeSupportedFormats } from 'html5-qrcode'
import { Html5QrcodeScanType } from 'html5-qrcode/esm/core'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFetchCameras } from './useFetchCameras'
import {
  HtmlQrcodeAdvancedPlugin,
  IHtmlQrcodePluginForwardedRef,
} from './Html5QrcodeAdvancedPlugin'
import { Button } from '../ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface IInfoProps {
  title: string
}

export const Info: React.FC<IInfoProps> = ({ title }: IInfoProps) => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2">
    <h6>{title}</h6>
  </div>
)

const CONFIG = {
  fps: 1,
  qrbox: { width: 256, height: 256 },
  aspectRatio: 1.0,
  formatsToSupport: [Html5QrcodeSupportedFormats.CODE_128, Html5QrcodeSupportedFormats.QR_CODE],
  rememberLastUsedCamera: true,
  supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
}

const QRCODE_REGION = 'ADVANCED_EXAMPLE_QRCODE_REGION'

export function QRCodeReader() {
  const {
    fetchCameras,
    state: { loading, error, cameraDevices },
  } = useFetchCameras()
  const [isPaused, setIsPaused] = useState(false)
  const router = useRouter()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

  const onCodeScanned = useCallback(
    (code: string) => {
      console.log('Code scanned:', code)
      if (code.startsWith(baseUrl + '/attend/')) {
        toast.success('QR code scanned successfully')
        router.push(code)
      } else {
        toast.error('Invalid QR code')
      }
    },
    [baseUrl, router]
  )
  useEffect(() => {
    fetchCameras()
  }, [])
  const ref = useRef<IHtmlQrcodePluginForwardedRef>(null)
  const [selectedCameraId, setSelectedCameraId] = useState<string | undefined>(undefined)
  if (loading) {
    return <Info title="Detecting available cameras" />
  }
  if (error) {
    return <Info title="Failed to detect cameras" />
  }
  if (cameraDevices.length === 0) {
    return <Info title="No available cameras" />
  }
  return (
    <div className="flex flex-col gap-2">
      <HtmlQrcodeAdvancedPlugin
        ref={ref}
        config={CONFIG}
        onCodeScanned={onCodeScanned}
        qrcodeRegionId={QRCODE_REGION}
        cameraId={selectedCameraId || cameraDevices[0].id}
        className="h-full w-full overflow-hidden rounded-lg"
      />
      <Button
        onClick={() => {
          if (ref.current) {
            if (isPaused) {
              ref.current.resume()
            } else {
              ref.current.pause()
            }
            setIsPaused(!isPaused)
          }
        }}
      >
        {isPaused ? 'Resume' : 'Pause'}
      </Button>
      <Button asChild variant="outline">
        <Link href="/home">Back to Home</Link>
      </Button>
      {cameraDevices.length > 1 && (
        <select
          defaultValue={cameraDevices[0].id}
          onChange={(event) => {
            setSelectedCameraId(event.target.value)
          }}
        >
          {cameraDevices.map((device) => (
            <option key={device.id} value={device.id} label={device.label} />
          ))}
        </select>
      )}
    </div>
  )
}
