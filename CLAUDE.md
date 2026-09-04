# M's BAR（エムズバー）サイト制作 CLAUDE.md

飲食業向け制作ルールは [飲食業.md](飲食業.md)、共通ルールは [共通ルール.md](共通ルール.md) に準拠する。
以下は本案件の確定情報。

## 案件情報

- 店名：M's BAR（エムズバー）／カラオケバー
- 目的：店舗の信頼性向上とブランド化（ローカルSEO・LINE集客）
- 強み：スタッフ 佐々木隆介さんの「人と人を繋げる」スキル。経営者は店舗内でWIN-WINな関係を構築する方針
- 住所：〒820-0041 福岡県飯塚市飯塚3-14 のやまビル2F（左）
- 電話：080-8713-9969
- 営業時間：20:00〜LAST／定休日：日曜日
- 料金：女性 3,000円／男性 4,000円（60分 飲み放題・歌い放題）
- 初回来店特典：延長60分無料
- 公式LINE ID：@369zmuan（リンクは https://line.me/R/ti/p/%40369zmuan）
- Instagram：https://www.instagram.com/msbar.iizuka
- スタッフ：Machiko（ママ）／佐々木隆介（店長）※写真は assets/img/staff-*.jpg
- ロゴはヘッダー・フッターとも透過版 assets/img/logo-gold.png を使用（ヒーローは正方形版 logo.jpg）

## デザイン

- 世界観：ピンクグリッター×ゴールド（ロゴ画像 assets/img/logo.jpg 準拠）
- カラーパレット（カラー.jpeg 準拠）：
  - メイン #D95B96／ダーク #A64166／ライト #F299C2
  - ゴールド #F2D479／ディープゴールド #F2B872
- フォント：見出し Noto Serif JP＋Cinzel（欧文）、本文 Noto Sans JP
- ブレークポイント：375px／768px／1024px（モバイルファースト）

## 構成

- 静的サイト：index.html＋assets/{css,img,js}
- 画像は英語ファイル名・最大幅1200px・圧縮済み
- ローカル確認：`.claude/launch.json` の msbar-site（PowerShell製簡易サーバー、port 8033。Node/Python未インストール環境のため）

## 注意事項

- 酒類提供のため「20歳未満の飲酒禁止」表記をフッターに必ず残す
- 料金・営業時間を変更する場合は index.html 内の構造化データ（JSON-LD）と meta description も併せて更新する
