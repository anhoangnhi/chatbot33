const { GoogleSpreadsheet } = require('google-spreadsheet');

const SHEET_ID = process.env.SHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

async function getQnAResponse(userInput) {
  console.log('[GS] Bắt đầu xử lý truy vấn Google Sheet...');

  const doc = new GoogleSpreadsheet(SHEET_ID);
  console.log('[GS] Tạo doc thành công');

  try {
    console.log('[GS] Đang xác thực với tài khoản dịch vụ...');
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY
    });

    console.log('[GS] Đã xác thực, đang load dữ liệu...');
    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    console.log(`[GS] Đọc ${rows.length} dòng từ Sheet`);

    const matched = rows.find((row) => {
      const keyword = row['Câu hỏi']?.toLowerCase().trim();
      return keyword && userInput.toLowerCase().includes(keyword);
    });

    return matched ? matched['Trả lời mẫu'] : '🤖 Xin lỗi, tôi chưa có câu trả lời phù hợp.';
  } catch (error) {
    console.error('[GS ❌] Lỗi xác thực hoặc xử lý:', error);
    throw new Error('Lỗi xác thực Google Sheet');
  }
}

module.exports = { getQnAResponse };
