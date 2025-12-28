// 🎭 MÔ PHỎNG EMAIL SERVICE (Không gửi email thực)

// Hàm gửi email nhắc nhở sắp hạn (MÔ PHỎNG)
const sendReminderEmail = async (to, memberName, bookTitle, dueDate, daysLeft) => {
  const dueDateFormatted = new Date(dueDate).toLocaleDateString('vi-VN');
  
  console.log('\n📧 ========== MÔ PHỎNG: NHẮC NHỞ SẮP HẠN ==========');
  console.log(`👤 Người nhận: ${memberName}`);
  console.log(`📧 Email: ${to}`);
  console.log(`📖 Sách: ${bookTitle}`);
  console.log(`📅 Hạn trả: ${dueDateFormatted}`);
  console.log(`⏰ Còn lại: ${daysLeft} ngày`);
  console.log('⚠️  Nội dung: Nhắc nhở trả sách, phạt 5.000 VNĐ/ngày nếu quá hạn');
  console.log('================================================\n');
  
  // Giả vờ gửi thành công
  return true;
};

// Hàm gửi email quá hạn (MÔ PHỎNG)
const sendOverdueEmail = async (to, memberName, bookTitle, dueDate, daysOverdue, fine) => {
  const dueDateFormatted = new Date(dueDate).toLocaleDateString('vi-VN');
  
  console.log('\n⚠️  ========== MÔ PHỎNG: CẢNH BÁO QUÁ HẠN ==========');
  console.log(`👤 Người nhận: ${memberName}`);
  console.log(`📧 Email: ${to}`);
  console.log(`📖 Sách: ${bookTitle}`);
  console.log(`📅 Hạn trả: ${dueDateFormatted}`);
  console.log(`⏰ Quá hạn: ${daysOverdue} ngày`);
  console.log(`💰 Tiền phạt: ${fine.toLocaleString('vi-VN')} VNĐ`);
  console.log('⚠️  Nội dung: Cảnh báo khẩn cấp quá hạn, yêu cầu trả sách ngay');
  console.log('==================================================\n');
  
  // Giả vờ gửi thành công
  return true;
};

module.exports = {
  sendReminderEmail,
  sendOverdueEmail
};