import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // ランダムな会社名、連絡先、所在地を生成
  const randomCompanyName = `テスト会社_${Math.random().toString(36).substring(7)}`;
  const randomContact = `連絡先_${Math.random().toString(36).substring(7)}`;
  const randomLocation = `所在地_${Math.random().toString(36).substring(7)}`;

  await page.goto('http://dev.marathon.rplearn.net/shota_nishinaga/customer/add.html');
  await page.getByRole('textbox', { name: '会社名:' }).fill(randomCompanyName);
  await page.getByRole('textbox', { name: '業種:' }).fill('IT');
  await page.getByRole('textbox', { name: '連絡先:' }).fill(randomContact);
  await page.getByRole('textbox', { name: '所在地:' }).fill(randomLocation);
  await page.getByRole('button', { name: '確認' }).click();

  // add-confirm.htmlに遷移したことを確認
  await expect(page.getByRole('heading', { name: '入力内容の確認' })).toBeVisible();

  // ダイアログ（alert）をハンドル
  page.once('dialog', async dialog => {
    expect(dialog.message()).toBe('顧客情報が正常に保存されました。');
    await dialog.accept();
  });

  // 確定ボタンをクリック
  await page.getByRole('button', { name: '確定' }).click();

  // add.htmlにリダイレクトされるのを待つ
  await page.waitForURL('**/add.html');

  // 一覧へ移動
  await page.getByRole('link', { name: '一覧へ' }).click();
  await page.waitForURL('**/list.html');

  // 作成した会社名をクリック
  await page.getByRole('link', { name: randomCompanyName }).click();


  // 詳細ページで会社名が表示されていることを確認
  await expect(page.getByRole('cell', { name: randomCompanyName })).toBeVisible();
});