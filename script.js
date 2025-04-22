document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('input[name="symbol"]');
    const decideBtn = document.getElementById('decide-btn');
    const selectionCount = document.getElementById('selection-count');
    const copyMessage = document.getElementById('copy-message');
    
    // チェックボックスの状態を監視
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectionCount);
    });
    
    // 決定ボタンのクリックイベント
    decideBtn.addEventListener('click', copyKimarijiToClipboard);
    
    // 選択数の更新と決定ボタンの有効/無効切り替え
    function updateSelectionCount() {
        const selectedCheckboxes = document.querySelectorAll('input[name="symbol"]:checked');
        const selectedCount = selectedCheckboxes.length;
        selectionCount.textContent = `選択された記号: ${selectedCount}/5`;
        
        if (selectedCount === 5) {
            decideBtn.disabled = false;
        } else {
            decideBtn.disabled = true;
        }
    }
    
    // 選択された札の決まり字をクリップボードにコピー
    function copyKimarijiToClipboard() {
        const selectedSymbols = Array.from(document.querySelectorAll('input[name="symbol"]:checked'))
            .map(checkbox => checkbox.value);
        
        let allKimarijis = [];
        
        // 選択された記号に対応する札の決まり字を取得
        selectedSymbols.forEach(symbol => {
            const fudaInfo = fudakigoulist.find(item => item.kigou === symbol);
            
            if (fudaInfo) {
                const kimarijis = fudaInfo.fuda.split(' ');
                allKimarijis = allKimarijis.concat(kimarijis);
            }
        });
        
        // 決まり字をスペース区切りの文字列に変換
        const kimarijiText = allKimarijis.join(' ');
        
        // クリップボードにコピー
        copyTextToClipboard(kimarijiText);
    }
    
    // テキストをクリップボードにコピーする関数
    function copyTextToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showCopyMessage('決まり字をコピーしました！');
                })
                .catch(err => {
                    showCopyMessage('コピーに失敗しました: ' + err);
                });
        } else {
            // フォールバック（古いブラウザ向け）
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                const successful = document.execCommand('copy');
                if (successful) {
                    showCopyMessage('決まり字をコピーしました！');
                } else {
                    showCopyMessage('コピーに失敗しました');
                }
            } catch (err) {
                showCopyMessage('コピーに失敗しました: ' + err);
            }
            
            document.body.removeChild(textArea);
        }
    }
    
    // コピー完了メッセージを表示する関数
    function showCopyMessage(message) {
        copyMessage.textContent = message;
        copyMessage.classList.add('show');
        
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 3000);
    }
});
