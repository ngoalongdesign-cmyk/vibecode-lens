# VibeCode Lens QA Checklist

Mục tiêu bản clean trước khi đem đi demo: người lạ dùng trong 30 giây không bị cụt hứng.

## 20 case cần test

1. Logo / tên thương hiệu ở góc trên.
2. Navbar / thanh trên cùng.
3. Sidebar / thanh bên.
4. Menu item trong sidebar.
5. Account menu ở cuối sidebar.
6. Search input / ô tìm kiếm.
7. Chat composer / ô nhập chat ở dưới cùng.
8. Nút gửi / send button.
9. Nút đính kèm / plus button.
10. CTA button.
11. Card / thẻ nội dung.
12. Pricing section / bảng giá.
13. Pricing card / card gói giá.
14. Form / biểu mẫu.
15. Input / ô nhập liệu.
16. Modal / popup.
17. Text label / cụm chữ ngắn.
18. Paragraph / đoạn mô tả dài.
19. Image / avatar / thumbnail.
20. Section / khối nội dung lớn.

## Flow bắt buộc phải pass

- `Alt + Shift + L` bật/tắt được.
- Hover không lag, panel không tràn màn hình.
- Click khóa vùng, viền panel cam mỏng hiện đúng.
- Chip **Sửa nhanh** đổi câu prompt ngay.
- Nút random đổi bộ gợi ý khác.
- `C` copy câu hiện tại khi không focus input.
- `Esc` tắt Lens.
- **Không đúng? Đổi loại** không tràn pills.
- **Nhớ cho trang này** chỉ hiện sau khi đổi loại, rồi tự ẩn.
- Lần sau quay lại vùng đã nhớ, Lens ưu tiên loại đã lưu nhưng không hiện status gây rối.
- Xem kỹ thuật không tạo double scrollbar khó chịu.

## Tiêu chuẩn prompt

Prompt copy ra phải theo tinh thần:

> Sửa [tên thành phần] “[nội dung nếu có]” [vị trí nếu có] cho [ý định sửa].

Ví dụ:

- Sửa ô nhập chat “Hỏi bất kỳ điều gì” ở dưới cùng màn hình cho gọn hơn.
- Sửa khu vực tài khoản “Ngọa Long Plus” ở cuối sidebar bên trái cho rõ hơn.
- Cần đổi chữ của nút bấm “Nhận bản đầy đủ” thành: [...]
