import { QRCodeReader } from '@/components/qr-code/QR-code-reader'

export default function QrScanPage() {
  return (
    <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-96 -translate-y-8 gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Scan QR Code</h1>
            <p className="text-balance text-muted-foreground">Scan the QR code to attend</p>
          </div>
          <div className="h-[384px] w-full rounded-lg bg-muted-foreground/30">
            <QRCodeReader />
          </div>
        </div>
      </div>
    </div>
  )
}
