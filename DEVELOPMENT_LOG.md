# 開発ログ & ロードマップ

## プロジェクト情報

- **プロジェクト名**: イベントチェックインシステム
- **開始日**: 2024-11-20
- **技術スタック**: Next.js 14, TypeScript, Prisma, SQLite, TailwindCSS
- **リポジトリ**: /Users/mashimaro/Action/event-checkin

---

## 開発完了内容

### Phase 1: プロジェクトセットアップ ✅

**完了日**: 2024-11-20

- [x] Next.js 14プロジェクト作成（TypeScript + TailwindCSS）
- [x] Gitリポジトリ初期化
- [x] 依存関係インストール
  - prisma, @prisma/client
  - qrcode, html5-qrcode
  - jspdf, uuid, bcryptjs
  - next-auth, clsx

**Gitコミット**:
```
d025e9b - Initial Next.js project setup
```

---

### Phase 2: データベース設計 ✅

**完了日**: 2024-11-20

- [x] Prismaスキーマ定義
  - Event モデル
  - Participant モデル
  - CheckInLog モデル
- [x] SQLiteデータベースセットアップ
- [x] マイグレーション実行
- [x] インデックス設定（qrToken, eventId）

**Gitコミット**:
```
cfdf425 - Add Prisma schema and database setup
```

**データベーススキーマ**:
```prisma
Event (イベント)
  - id: UUID
  - name: String
  - date: DateTime
  - location: String
  - participants: Relation

Participant (参加者)
  - id: UUID
  - eventId: FK
  - name: String
  - email: String
  - company: String (optional)
  - qrToken: String (unique, indexed)
  - checkedIn: Boolean
  - checkedInAt: DateTime (nullable)

CheckInLog (チェックイン履歴)
  - id: UUID
  - participantId: FK
  - checkedInAt: DateTime
  - deviceInfo: String (optional)
```

---

### Phase 3: コアユーティリティ ✅

**完了日**: 2024-11-20

- [x] Prismaクライアントセットアップ (`lib/db.ts`)
- [x] QRコード生成ユーティリティ (`lib/qr.ts`)
  - generateQRToken(): SHA256ハッシュ生成
  - generateQRCode(): QR画像生成
  - verifyQRToken(): トークン検証
- [x] 共通ユーティリティ (`lib/utils.ts`)
  - cn(): クラス名結合
  - formatDate(): 日付フォーマット
  - calculateCheckInRate(): チェックイン率計算

**Gitコミット**:
```
2119cf4 - Add core utilities
```

---

### Phase 4: API実装 ✅

**完了日**: 2024-11-20

#### イベントAPI (`/api/events`)
- [x] GET - イベント一覧取得（統計付き）
- [x] POST - イベント作成

#### 参加者API (`/api/participants`)
- [x] GET - 参加者一覧取得（イベントIDでフィルタ）
- [x] POST - 参加者作成（QRトークン自動生成）

#### QRコードAPI (`/api/qr`)
- [x] GET - 個別QRコード生成
- [x] POST - 一括QRコード生成

#### チェックインAPI (`/api/checkin`)
- [x] POST - チェックイン実行（トランザクション処理）
- [x] GET - チェックイン統計取得

**Gitコミット**:
```
eeeec60 - Add API routes for events, participants, QR, and checkin
```

**セキュリティ対策**:
- QRトークン: UUID + SHA256ハッシュ化
- 重複チェックイン防止: トランザクション使用
- エラーハンドリング: すべてのAPIでtry-catch

---

### Phase 5: UI実装 ✅

**完了日**: 2024-11-20

#### ホームページ (`/`)
- [x] ランディングページデザイン
- [x] チェックイン/管理画面へのナビゲーション
- [x] 機能一覧表示
- [x] レスポンシブデザイン

#### チェックインページ (`/checkin`)
- [x] QRスキャナーコンポーネント
  - html5-qrcodeライブラリ統合
  - カメラアクセス処理
  - リアルタイムスキャン
- [x] チェックイン結果表示
  - 成功画面（参加者情報表示）
  - エラー画面（エラーメッセージ表示）
- [x] スキャン再開機能

#### 管理画面 (`/admin`)
- [x] イベント管理
  - イベント作成フォーム
  - イベント選択ドロップダウン
  - イベント統計表示（総参加者、チェックイン済み、率）
- [x] 参加者管理
  - 参加者追加フォーム
  - 参加者一覧テーブル
  - チェックインステータス表示
  - QRコード表示機能（新しいウィンドウで開く）
- [x] リアルタイムダッシュボード

**Gitコミット**:
```
b77a35f - Add homepage and QR scanner check-in page
c9a8fc3 - Add admin dashboard
```

**UIデザイン**:
- TailwindCSSでモダンなデザイン
- ダークモード対応
- モバイルファースト
- 直感的なユーザーインターフェース

---

### Phase 6: ドキュメント整備 ✅

**完了日**: 2024-11-20

- [x] README.md - 完全なセットアップガイド
- [x] SYSTEM_FLOW.md - システム導線とフロー図
- [x] DEVELOPMENT_LOG.md - このファイル
- [x] コード内コメント

**Gitコミット**:
```
e0fdd9e - Add comprehensive README
```

---

### Phase 7: バグ修正 & 最適化 ✅

**完了日**: 2024-11-20

- [x] TypeScript型エラー修正
  - events API: event パラメータ型追加
  - qr API: participant パラメータ型追加
- [x] Prismaクライアント生成
- [x] Git履歴整理

**Gitコミット**:
```
58562a5 - Add TypeScript type annotations for API routes
```

---

## 現在の機能一覧

### ✅ 実装済み機能

1. **イベント管理**
   - イベント作成
   - イベント一覧表示
   - イベント選択

2. **参加者管理**
   - 参加者登録（手動）
   - 参加者一覧表示
   - 参加者情報表示

3. **QRコード**
   - 一意なQRコード自動生成
   - 個別QRコード表示
   - QRコード印刷対応

4. **チェックイン**
   - QRコードスキャン
   - リアルタイムチェックイン
   - 重複チェックイン防止
   - チェックイン履歴記録

5. **ダッシュボード**
   - 総参加者数表示
   - チェックイン済み数表示
   - チェックイン率表示
   - リアルタイム更新

---

## 未実装機能（今後の拡張）

### 🔜 優先度: 高

#### 1. CSV一括インポート
**概要**: 参加者情報をCSVファイルで一括登録

**実装内容**:
- CSVアップロードフォーム
- CSVパース処理
- バリデーション
- 一括QRコード生成
- エラーレポート

**想定工数**: 3-4時間

**実装場所**:
- `/admin` ページに「CSV インポート」ボタン追加
- `/api/participants/import` エンドポイント作成

**CSVフォーマット例**:
```csv
name,email,company
山田太郎,yamada@example.com,株式会社サンプル
佐藤花子,sato@example.com,テスト株式会社
```

---

#### 2. QRコードPDF一括ダウンロード
**概要**: 全参加者のQRコードを1つのPDFにまとめてダウンロード

**実装内容**:
- jsPDFライブラリ使用
- 複数QRコードをPDF化
- A4サイズで印刷最適化（1ページに6人分）
- 参加者名とQRコードを両方表示

**想定工数**: 2-3時間

**実装場所**:
- `/admin` ページに「PDF一括ダウンロード」ボタン追加
- クライアントサイドでPDF生成

**PDFレイアウト案**:
```
┌─────────────────────────────────┐
│  山田太郎                       │
│  yamada@example.com             │
│  ┌─────────┐                    │
│  │ QR Code │                    │
│  └─────────┘                    │
├─────────────────────────────────┤
│  佐藤花子                       │
│  ...                            │
└─────────────────────────────────┘
```

---

#### 3. メール送信機能
**概要**: QRコードを参加者にメールで自動送信

**実装内容**:
- メール送信ライブラリ統合（SendGrid / Resend）
- HTMLメールテンプレート作成
- QRコード画像をメールに埋め込み
- 個別送信 & 一括送信

**想定工数**: 4-5時間

**必要な環境変数**:
```env
EMAIL_API_KEY=xxx
EMAIL_FROM=noreply@example.com
```

**メールテンプレート案**:
```html
<h1>イベント参加のご案内</h1>
<p>山田太郎様</p>
<p>【イベント名】にご参加いただきありがとうございます。</p>
<p>以下のQRコードを当日受付でご提示ください。</p>
<img src="qrcode_image" />
<p>日時: 2024-01-01 10:00</p>
<p>場所: 東京会議室</p>
```

---

### 🔜 優先度: 中

#### 4. 認証システム
**概要**: 管理画面へのアクセス制御

**実装内容**:
- NextAuth.js統合
- ログイン画面
- セッション管理
- 管理者ロール

**想定工数**: 3-4時間

**認証プロバイダー案**:
- メール + パスワード
- Google OAuth
- GitHub OAuth

---

#### 5. 参加者編集・削除機能
**概要**: 登録済み参加者の情報を編集・削除

**実装内容**:
- 編集フォーム
- DELETE APIエンドポイント
- PUT APIエンドポイント
- 確認ダイアログ

**想定工数**: 2-3時間

---

#### 6. チェックイン履歴ビューア
**概要**: チェックインログの詳細表示

**実装内容**:
- チェックイン時刻一覧
- デバイス情報表示
- タイムライン表示
- CSVエクスポート

**想定工数**: 2-3時間

---

### 🔜 優先度: 低

#### 7. 検索・フィルタ機能
**概要**: 参加者リストの検索とフィルタリング

**実装内容**:
- 名前検索
- メール検索
- 会社名検索
- チェックイン状態でフィルタ
- ページネーション

**想定工数**: 2-3時間

---

#### 8. データエクスポート
**概要**: 参加者データとチェックイン履歴をCSVでエクスポート

**実装内容**:
- 参加者一覧CSV
- チェックイン履歴CSV
- 統計レポートPDF

**想定工数**: 2-3時間

---

#### 9. リアルタイム更新
**概要**: WebSocketでリアルタイム更新

**実装内容**:
- Socket.io統合
- チェックイン時に管理画面を自動更新
- ダッシュボードのリアルタイム統計

**想定工数**: 4-5時間

---

#### 10. PWA対応
**概要**: オフラインでも動作するPWA化

**実装内容**:
- Service Worker
- オフラインキャッシング
- ホーム画面追加
- プッシュ通知

**想定工数**: 3-4時間

---

## 技術的改善項目

### パフォーマンス最適化
- [ ] 画像最適化（next/image）
- [ ] コード分割（dynamic import）
- [ ] データベースクエリ最適化
- [ ] キャッシング戦略（React Query / SWR）

### セキュリティ強化
- [ ] CSRF保護
- [ ] XSS対策
- [ ] SQLインジェクション対策（Prismaで既に対策済み）
- [ ] Rate Limiting
- [ ] HTTPS強制（本番環境）

### テスト
- [ ] ユニットテスト（Vitest）
- [ ] E2Eテスト（Playwright）
- [ ] API テスト
- [ ] 統合テスト

### インフラ
- [ ] PostgreSQL移行（本番環境）
- [ ] Vercelデプロイ
- [ ] CI/CD パイプライン
- [ ] モニタリング（Sentry）
- [ ] ログ管理

---

## デプロイロードマップ

### ステージング環境
- [ ] Vercel プレビューデプロイメント設定
- [ ] PostgreSQL（Vercel Postgres）接続
- [ ] 環境変数設定
- [ ] テストデータ投入

### 本番環境
- [ ] カスタムドメイン設定
- [ ] SSL証明書
- [ ] データベースバックアップ設定
- [ ] エラー監視（Sentry）
- [ ] パフォーマンス監視

---

## 既知の問題

### 🐛 バグ
なし（現時点）

### ⚠️ 制限事項
1. **認証なし**: 管理画面にアクセス制限がない
2. **単一イベント**: 複数イベントの同時チェックインに対応していない
3. **オフライン非対応**: インターネット接続必須

---

## 開発環境

### 必要なツール
- Node.js 18+
- npm または yarn
- Git
- エディタ（VSCode推奨）

### 開発サーバー起動
```bash
cd event-checkin
npm run dev
```

### Prisma Studio（DBビューア）
```bash
npx prisma studio
```

### データベースリセット
```bash
npx prisma migrate reset
```

---

## Git ブランチ戦略

現在: **main** ブランチのみ

今後の提案:
```
main (本番)
  ├── develop (開発)
  │   ├── feature/csv-import
  │   ├── feature/email-notification
  │   └── feature/authentication
  └── hotfix/xxx (緊急修正)
```

---

## コミットメッセージ規約

現在使用している規約:
```
feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
refactor: リファクタリング
test: テスト追加
chore: その他の変更
```

例:
```
feat: Add CSV import functionality
fix: Fix duplicate check-in issue
docs: Update README with deployment guide
```

---

## 次回開発セッションの TODO

### 最優先
1. [ ] CSV一括インポート機能実装
2. [ ] QRコードPDF一括ダウンロード実装
3. [ ] 認証システム追加

### 中優先
4. [ ] メール送信機能実装
5. [ ] 参加者編集・削除機能
6. [ ] チェックイン履歴ビューア

### 低優先
7. [ ] テスト追加
8. [ ] Vercelデプロイ
9. [ ] ドキュメント拡充

---

## 開発履歴サマリー

| 日付 | フェーズ | 内容 | コミット数 |
|------|---------|------|-----------|
| 2024-11-20 | Phase 1-7 | 初回MVP完成 | 6 commits |

**総開発時間**: 約4-5時間
**総コミット数**: 6
**総行数**: ~2000行（コメント含む）

---

このドキュメントは開発の進捗に応じて継続的に更新してください。
次回開発時は、このファイルを参照して作業を再開してください。
