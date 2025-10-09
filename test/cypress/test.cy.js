describe('顧客情報入力フォームのテスト', () => {
  it('顧客情報を入力して送信し、成功メッセージを確認する', () => {
    cy.visit('/shota_nishinaga/customer/add.html'); // テスト対象のページにアクセス

    // テストデータの読み込み
    cy.fixture('customerData').then((data) => {
      // フォームの入力フィールドにテストデータを入力
      const uniqueContactNumber = `03-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
      cy.get('#companyName').type(data.companyName);
      cy.get('#industry').type(data.industry);
      cy.get('#contact').type(uniqueContactNumber);
      cy.get('#location').type(data.location);
    });

    // フォームの送信
    cy.get('#customer-form').submit();

    cy.window().then((win) => {
    // windowのalertをスタブ化し、エイリアスを設定
      cy.stub(win, 'alert').as('alertStub');
    });

    //確認画面で確定を押す
    cy.contains('button','確定').click();

    cy.get('@alertStub').should('have.been.calledOnceWith', '顧客情報が正常に保存されました。');

    // フォームがリセットされたことを確認
    cy.get('#companyName').should('have.value', '');
    cy.get('#industry').should('have.value', '');
    cy.get('#contact').should('have.value', '');
    cy.get('#location').should('have.value', '');
    cy.wait(5000);
  });

  it('削除ボタンが効くかどうか', () => {
    cy.visit('/shota_nishinaga/customer/list.html');//一覧表示に遷移

    let linkText; // 変数を定義

    cy.get('tr').contains('td', '1')
      .parent('tr')
      .find('a')
      .invoke('text')         // a要素のテキストを取得
      .then((text) => {
        linkText = text.trim();   // 変数にセット（前後の空白除去）
        cy.log('リンクの文字列:', linkText); // デバッグ表示

        cy.contains('tr', '1')   // tdに「1」を含む行を探す
          .find('a')             // その行内のa要素を探す
          .click();              // リンクをクリック

        cy.contains('button','削除').click();

        cy.contains(linkText).should('not.exist');
      });

  })

  it('更新機能が効くかどうか', () => {
    cy.visit('/shota_nishinaga/customer/list.html');//一覧表示に遷移
    
    cy.contains('tr', '1')   // tdに「1」を含む行を探す
      .find('a')             // その行内のa要素を探す
      .click();              // リンクをクリック

    cy.contains('button','更新').click();

    cy.get('input[name="companyName"]').clear();
    cy.get('input[name="companyName"]').type('cypress最高!');
    cy.contains('button','確認').click();

    cy.contains('button','確定').click();

    cy.get('table tr')      // すべてのtrを取得
      .last()               // 一番最後のtrを選択
      .find('a')            // そのtr内のa要素を取得
      .should('have.text', 'cypress最高!');
  })
});