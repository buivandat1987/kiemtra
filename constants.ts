
import { Subject } from './types';

export const SUBJECT_TOPICS: Record<Subject, { hk1: string[], hk2: string[] }> = {
  'Toán': {
    hk1: [
      "Ôn tập số tự nhiên, phân số, hỗn số (Bài 1 - 5)",
      "Số thập phân. Viết số đo dưới dạng số thập phân (Bài 6 - 10)",
      "So sánh số thập phân (Bài 11 - 12)",
      "Phép cộng, phép trừ số thập phân (Bài 13 - 15)",
      "Phép nhân số thập phân (Bài 16 - 20)",
      "Phép chia số thập phân (Bài 21 - 29)",
      "Hình tam giác, hình thang, hình tròn (Bài 31 - 34)",
      "Ôn tập học kì 1 (Bài 35)"
    ],
    hk2: [
      "Tỉ số và tỉ số phần trăm (Bài 36 - 41)",
      "Thể tích và đơn vị đo thể tích: cm3, dm3, m3 (Bài 45 - 48)",
      "Diện tích xung quanh, toàn phần và Thể tích HHCN, HLP (Bài 49 - 53)",
      "Số đo thời gian và các phép tính với số đo thời gian (Bài 56 - 58)",
      "Vận tốc, Quãng đường, Thời gian trong chuyển động đều (Bài 59 - 62)",
      "Thống kê và biểu đồ hình quạt tròn (Bài 63 - 64)",
      "Xác suất thực nghiệm (Bài 65)",
      "Ôn tập cuối năm: Số học, Hình học, Đo lường, Chuyển động (Bài 68 - 75)"
    ]
  },
  'Tiếng Việt': {
    hk1: [
      "Chủ điểm 1: Thế giới tuổi thơ (Đại từ, Kể chuyện sáng tạo, Báo cáo công việc)",
      "Chủ điểm 2: Thiên nhiên kì thú (Từ đồng nghĩa, Từ đa nghĩa, Tả phong cảnh)",
      "Chủ điểm 3: Trên con đường học tập (Từ điển, Dấu gạch ngang, Giới thiệu nhân vật/Cảm xúc câu chuyện)",
      "Chủ điểm 4: Nghệ thuật muôn màu (Điệp từ/ngữ, Kết từ, Cảm xúc bài thơ/Nhân vật hoạt hình)",
      "Kiến thức: Danh từ, động từ, tính từ (Ôn tập)",
      "Kiến thức: Đại từ & Luyện tập sử dụng đại từ",
      "Kiến thức: Từ đồng nghĩa & Từ đa nghĩa",
      "Kiến thức: Sử dụng từ điển & Dấu gạch ngang",
      "Kiến thức: Biện pháp Điệp từ, điệp ngữ & Kết từ"
    ],
    hk2: [
      "Chủ điểm 5: Vì cuộc sống thanh bình (Câu ghép, Tả người)",
      "Chủ điểm 6: Nhân hậu – Chính trực (Nối câu ghép bằng quan hệ từ, Tả đồ vật/con vật)",
      "Chủ điểm 7: Trái Đất của chúng mình (Liên kết câu, Báo cáo thảo luận)",
      "Kiến thức: Câu ghép và các cách nối câu ghép",
      "Kiến thức: Nối câu ghép bằng quan hệ từ & Cặp quan hệ từ",
      "Kiến thức: Liên kết câu bằng cách lặp từ ngữ & Thay thế từ ngữ",
      "Kiến thức: Ôn tập về dấu câu (Dấu phẩy, dấu hai chấm, dấu ngoặc kép)",
      "Viết: Bài văn tả người (Trọng tâm)",
      "Viết: Bài văn tả đồ vật hoặc con vật (Nâng cao)"
    ]
  },
  'Lịch sử và Địa lí': {
    hk1: [
      "Địa lí: Vị trí địa lí, lãnh thổ, vùng biển Việt Nam",
      "Địa lí: Địa hình, khoáng sản, khí hậu, sông ngòi Việt Nam",
      "Lịch sử: Nước Văn Lang, Âu Lạc",
      "Lịch sử: Đấu tranh giành độc lập thời Bắc thuộc",
      "Lịch sử: Xây dựng đất nước thời Lý, Trần, Hậu Lê"
    ],
    hk2: [
      "Lịch sử: Triều Nguyễn và cuộc kháng chiến chống Pháp (đến 1945)",
      "Lịch sử: Giai đoạn 1945 - 1975 (Kháng chiến chống Pháp và Mỹ)",
      "Lịch sử: Công cuộc đổi mới và xây dựng đất nước",
      "Địa lí: Các nước láng giềng và Khu vực Đông Nam Á",
      "Địa lí: Các châu lục và đại dương trên thế giới"
    ]
  },
  'Khoa học': {
    hk1: [
      "Thành phần, vai trò của đất & Bảo vệ môi trường đất",
      "Hỗn hợp và dung dịch",
      "Sự biến đổi hoá học của chất",
      "Sự sinh sản và phát triển của thực vật có hoa",
      "Sự sinh sản và nuôi con của động vật"
    ],
    hk2: [
      "Năng lượng Mặt Trời, năng lượng gió và nước chảy",
      "Năng lượng điện và sử dụng điện an toàn, tiết kiệm",
      "Môi trường và tài nguyên thiên nhiên",
      "Tác động của con người đến môi trường và biện pháp bảo vệ",
      "Ôn tập: Sử dụng năng lượng và bảo vệ môi trường"
    ]
  },
  'Tin học': {
    hk1: [
      "Máy tính và đời sống: Giải quyết vấn đề với sự trợ giúp của máy tính",
      "Tìm kiếm thông tin trên Internet: Cách tìm kiếm hiệu quả",
      "Tổ chức, lưu trữ và quản lý tệp, thư mục",
      "Soạn thảo văn bản và trình chiếu: Định dạng, chèn hình ảnh/bảng"
    ],
    hk2: [
      "Đạo đức, pháp luật và văn hoá trong môi trường số",
      "Lập trình Scratch: Biến, câu lệnh điều kiện, câu lệnh lặp",
      "Lập trình Scratch: Tạo chương trình có âm thanh, hình ảnh động",
      "An toàn thông tin cá nhân và quy tắc ứng xử trên mạng"
    ]
  },
  'Công nghệ': {
    hk1: [
      "Công nghệ và đời sống: Vai trò, lợi ích của công nghệ",
      "Sử dụng điện thoại và các thiết bị số: An toàn và văn minh",
      "Thiết kế sản phẩm công nghệ đơn giản",
      "Tìm hiểu quy trình thiết kế kỹ thuật trong thực tiễn"
    ],
    hk2: [
      "Lắp ráp mô hình kỹ thuật: Xe cần cẩu, xe ben, máy bay...",
      "Trồng hoa và cây cảnh trong chậu: Kỹ thuật gieo hạt, chăm sóc",
      "Nuôi cá cảnh: Quy trình chuẩn bị bể, chọn giống và cho ăn",
      "An toàn khi sử dụng các thiết bị công nghệ trong gia đình"
    ]
  }
};

export const SYSTEM_PROMPT = `Bạn là một trợ lý chuyên gia giáo dục tiểu học tại Việt Nam, am hiểu sâu sắc về:
1. Sách giáo khoa các môn học lớp 5 bộ "Kết nối tri thức với cuộc sống".
2. Thông tư 27/2020/TT-BGDĐT về đánh giá học sinh tiểu học (Ma trận 4 mức độ).

Nhiệm vụ của bạn là soạn đề kiểm tra dựa trên Môn học, Học kỳ và Mạch kiến thức được yêu cầu. 
Yêu cầu về nội dung:
- Mức 1: Nhận biết (40%).
- Mức 2: Thông hiểu (30%).
- Mức 3: Vận dụng (20%).
- Mức 4: Vận dụng sáng tạo (10%).
- Cấu trúc: Kết hợp Trắc nghiệm và Tự luận phù hợp đặc thù môn học.
- Ngôn ngữ: Trong sáng, chuẩn xác theo thuật ngữ chuyên môn của sách Kết nối tri thức.

Đặc biệt lưu ý cho môn Tiếng Việt:
- Phần I (Đọc hiểu): BẮT BUỘC phải có 1 văn bản (đoạn văn hoặc bài thơ) ngắn, súc tích, mang ý nghĩa giáo dục. Các câu hỏi mức 1, 2, 3 phải khai thác nội dung văn bản và kiến thức Tiếng Việt (như từ đồng nghĩa, đại từ, câu ghép...) theo chủ điểm được chọn.
- Phần II (Viết/Tập làm văn): Đưa ra đề bài phù hợp với mạch kiến thức (Ví dụ: Tả phong cảnh, Kể chuyện sáng tạo, Tả người...).

Định dạng phản hồi: Trả về dữ liệu JSON chính xác theo cấu trúc yêu cầu.`;
