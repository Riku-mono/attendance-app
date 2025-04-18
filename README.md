## はじめに

期限付きトークンによる、自動更新のQRコードまたは、固定URLによる出席方法が選べる出席管理アプリ

トークンを node-cache で一定時間保持することにより、出席時のデータベースアクセス回数を減らした

![slide](./readme_img/slide.png)

| 発行 | 出席 |
| ---- | ---- |
| <img src="./readme_img/publish.png" width="200" /> | <img src="./readme_img/scan.png" width="200" /> |

## シーケンス図

### 活動作成 - QR(オフライン活動など)

```mermaid
sequenceDiagram
	participant Creator
	participant System
	participant Database

	Creator->>System: 出欠ルームを作成
	activate System
	System->>Database: 出欠ルーム情報を保存
	activate Database
	Database-->>System: 出欠ルームIDを返す
	deactivate Database
	System-->>Creator: 出欠ルームが作成されました
	deactivate System

	Creator-->>System: ルームのQRページをリクエスト
	activate System
	alt 開始時間10分前 && 終了時間まで
		loop Creatorとのセッションがある間
			System-->>Database:ルーム情報を取得
			activate Database
			Database-->>System:ルーム情報を返す
			deactivate Database
			Note over System:ハッシュを作成
			Note over System:{roomId・ハッシュ・expire}を保持
			System-->>Creator:ハッシュを返す
			Note over Creator:ハッシュからQRコードを生成
			Creator-->>System:有効時間を待って再リクエスト
		end
	else それ以外
		System-->>Creator:生成時間外です
	end
	deactivate System
```

### 活動作成 - URL(オンライン活動など)

```mermaid
sequenceDiagram
    participant Creator
    participant System
    participant Database

    Creator->>System: 出欠ルームを作成
    activate System
    System->>Database: 出欠ルーム情報を保存
    activate Database
    Database-->>System: 出欠ルームIDを返す
    deactivate Database
    System-->>Creator: 出欠ルームが作成されました
    deactivate System

    Creator-->>System: ルームの出欠URLをリクエスト
    activate System
    System-->>Creator: URLを返す
    deactivate System
```

### 出席処理 - QR

```mermaid
sequenceDiagram
	participant User
	participant System
	participant Database

	User->>System: QRコードをスキャン
	activate System
	Note over System:ハッシュが有効であるか確認
	alt 有効である場合
		System->>Database: QRコードから出欠情報を検索
		activate Database
		Database-->>System: 出欠情報を返す
		deactivate Database
		Note over System: 出欠情報を確認
		alt 出席済みの場合
			System-->>User: 出席済みです
		else 未出席の場合
			System->>Database: 出欠記録を保存
			activate Database
			Database-->>System: 出欠記録IDを返す
			deactivate Database
			System-->>User: 出欠が記録されました
		end
	else 無効である場合
	System-->>User: QRコードが無効です
	end
	deactivate System
```

### 出席処理 - URL

```mermaid
sequenceDiagram
	participant User
	participant System
	participant Database

	User->>System: 出欠URLをクリック
	activate System
	alt URLが有効である場合
		System->>Database: 出欠情報を取得
		activate Database
		Database-->>System: 出欠情報を返す
		deactivate Database
		Note over System: 出欠情報を確認
		alt 出席済みの場合
			System-->>User: 出席済みです
		else 未出席の場合
			System->>Database: 出欠記録を保存
			activate Database
			Database-->>System: 出欠記録IDを返す
			deactivate Database
			System-->>User: 出欠が記録されました
		end
	else URLが無効である場合
		System-->>User: 出欠URLが無効です
	end
	deactivate System
```

## Get Started

### 1. 依存環境のインストール

```bash
$ npm i
```

### 2. 環境変数ファイルを作成

```
# ./.env.local

NEXT_PUBLIC_BASE_URL = "http://localhost:3000"
LOCAL_DATABASE_URL=

# GitHub OAuth認証用（組織で作成）
AUTH_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=

# 許可するGitHub組織名を入力
PUBLIC_GITHUB_ORG=

# build 時に必要 Error[UntrustedHost: Host must be trusted]用
NEXTAUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=http://localhost:3000
```

### 3. Prisma Schema を DBに合わせて変更

#### Local PostgreSQL を使用する場合

以下のように変更

```
# prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("LOCAL_DATABASE_URL")
}
```

### 4. マイグレーション及びシードデータ

#### データベースのマイグレーション

```bash
$ npx prisma generate && npx prisma db push
```

#### シードデータの挿入

以下のようなキャンパスデータが必要となる。
キャンパス情報を基に出席対象者を分けている。

```
# prisma/seed.ts

...
  const campus = await prisma.campus.createMany({
    data: [
      { name: 'Fukakusa', color: '#649360' },
      { name: 'Seta', color: '#3CA6A6' },
      { name: 'Omiya', color: '#9E76B4' },
    ],
  })
...

```

```bash
$ npx prisma db seed
```

### 5. 起動

```bash
$ npm run dev
```
