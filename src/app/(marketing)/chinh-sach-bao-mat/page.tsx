import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Chính Sách Bảo Mật",
  description:
    "Tìm hiểu về cách SafeEdu thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
  openGraph: {
    title: "Chính Sách Bảo Mật",
    description:
      "Tìm hiểu về cách SafeEdu thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
    url: "https://www.safe-edu.site/chinh-sach-bao-mat",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Privacy Policy",
      },
    ],
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-[#8BC34A] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Chính Sách Bảo Mật
          </h1>
          {/* <div className="flex items-center text-sm">
            <Link className="hover:underline" href="/">
              Trang chủ
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Chính sách bảo mật</span>
          </div> */}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <h2 className="text-2xl font-bold mb-4">
              Chính Sách Lưu Trữ Dữ Liệu
            </h2>
            <p>
              Nhà Cung Cấp Dịch Vụ sẽ lưu giữ dữ liệu do Người Dùng Cung Cấp
              trong thời gian bạn sử dụng Ứng Dụng và trong một khoảng thời gian
              hợp lý sau đó. Nếu bạn muốn họ xóa Dữ Liệu do Người Dùng Cung Cấp
              mà bạn đã cung cấp thông qua Ứng Dụng, vui lòng liên hệ với họ qua
              địa chỉ thangtvb.dev@gmail.com và họ sẽ phản hồi trong một khoảng
              thời gian hợp lý.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Trẻ Em</h2>
            <p>
              Nhà Cung Cấp Dịch Vụ không sử dụng Ứng Dụng để cố ý thu thập dữ
              liệu hoặc tiếp thị đến trẻ em dưới 13 tuổi.
            </p>
            <p>
              Ứng Dụng không hướng đến bất kỳ ai dưới 13 tuổi. Nhà Cung Cấp Dịch
              Vụ không cố ý thu thập thông tin nhận dạng cá nhân từ trẻ em dưới
              13 tuổi. Trong trường hợp Nhà Cung Cấp Dịch Vụ phát hiện ra rằng
              một trẻ em dưới 13 tuổi đã cung cấp thông tin cá nhân, Nhà Cung
              Cấp Dịch Vụ sẽ ngay lập tức xóa thông tin này khỏi máy chủ của họ.
              Nếu bạn là phụ huynh hoặc người giám hộ và bạn biết rằng con bạn
              đã cung cấp cho chúng tôi thông tin cá nhân, vui lòng liên hệ với
              Nhà Cung Cấp Dịch Vụ (thangtvb.dev@gmail.com) để họ có thể thực
              hiện các hành động cần thiết.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Bảo Mật</h2>
            <p>
              Nhà Cung Cấp Dịch Vụ quan tâm đến việc bảo vệ tính bảo mật của
              thông tin của bạn. Nhà Cung Cấp Dịch Vụ cung cấp các biện pháp bảo
              vệ vật lý, điện tử và thủ tục để bảo vệ thông tin mà Nhà Cung Cấp
              Dịch Vụ xử lý và duy trì.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Thay Đổi</h2>
            <p>
              Chính Sách Bảo Mật này có thể được cập nhật theo thời gian vì bất
              kỳ lý do nào. Nhà Cung Cấp Dịch Vụ sẽ thông báo cho bạn về bất kỳ
              thay đổi nào đối với Chính Sách Bảo Mật bằng cách cập nhật trang
              này với Chính Sách Bảo Mật mới. Bạn nên tham khảo Chính Sách Bảo
              Mật này thường xuyên để biết bất kỳ thay đổi nào, vì việc tiếp tục
              sử dụng được coi là chấp thuận tất cả các thay đổi.
            </p>

            <Separator className="my-8" />

            <p className="font-medium text-center">
              Chính sách bảo mật này có hiệu lực từ ngày 20-02-2025
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Sự Đồng Ý Của Bạn</h2>
            <p>
              Bằng cách sử dụng Ứng Dụng, bạn đồng ý với việc xử lý thông tin
              của bạn như được nêu trong Chính Sách Bảo Mật này hiện tại và như
              được chúng tôi sửa đổi.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào liên quan đến quyền riêng tư khi sử
              dụng Ứng Dụng, hoặc có câu hỏi về các thực tiễn của chúng tôi, vui
              lòng liên hệ với Nhà Cung Cấp Dịch Vụ qua email tại
              thangtvb.dev@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
