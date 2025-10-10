export function convertMoneyToString(amount:number) {
    const ones = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const tens = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];
    const thousands = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

    let words = '';
    let i = 0;

    // Chuyển đổi số thành chuỗi
    let numStr = String(amount);

    // Tính số lượng hàng ngàn trong số
    let numThousands = Math.ceil(numStr.length / 3);

    // Vòng lặp từ hàng ngàn đến hàng đơn vị để chuyển đổi giá trị tiền thành chuỗi
    if (amount > 0) {
        while (i < numThousands) {
            // Lấy 3 chữ số cuối cùng của số và chuyển đổi thành chuỗi
            let part = numStr.slice(-3);
            numStr = numStr.slice(0, -3);
            let partWords = '';

            // Lấy số hàng trăm, chục, đơn vị của 3 chữ số và chuyển đổi thành chuỗi
            let partNum = parseInt(part);
            if (partNum !== 0) {
                let hundredsDigit = Math.floor(partNum / 100);
                let tensDigit = Math.floor((partNum % 100) / 10);
                let onesDigit = partNum % 10;
                if (hundredsDigit !== 0) {
                    partWords += ones[hundredsDigit] + ' trăm ';
                }
                if (tensDigit === 0 && onesDigit !== 0) {
                    partWords += ones[onesDigit];
                } else if (tensDigit === 1 && onesDigit !== 0) {
                    partWords += 'mười ' + ones[onesDigit];
                } else if (tensDigit === 1 && onesDigit === 0) {
                    partWords += 'mười ';
                } else if (tensDigit > 1 && onesDigit === 0) {
                    partWords += tens[tensDigit];
                } else if (tensDigit > 1 && onesDigit !== 0) {
                    partWords += tens[tensDigit] + ' ' + ones[onesDigit];
                } else if (hundredsDigit === 0 && tensDigit === 0 && onesDigit === 0 && i === 0) {
                    partWords += 'không';
                }
            }
            if (partWords !== '') {
                partWords += ' ' + thousands[i];
            }
            words = partWords + ' ' + words;
            i++;
        };

        words = words.charAt(0).toUpperCase() + words.slice(1);
        words = words.trim();
    };
    if (amount == 0) {
        words = 'Không'
    };
    if (amount < 0) {
        words = convertMoneyToString(Math.abs(amount));
        words = 'Âm ' + words;
    };
    return words;
};