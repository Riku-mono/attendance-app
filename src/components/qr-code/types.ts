import { Html5QrcodeScanType } from 'html5-qrcode'
import { Html5QrcodeCameraScanConfig, Html5QrcodeConfigs } from 'html5-qrcode/esm/html5-qrcode'

export interface Html5QrcodeScannerConfig extends Html5QrcodeCameraScanConfig, Html5QrcodeConfigs {
  rememberLastUsedCamera?: boolean | undefined
  supportedScanTypes: Array<Html5QrcodeScanType> | []
}
