import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Điều Khoản & Điều Kiện",
  description:
    "Tìm hiểu về các điều khoản và điều kiện khi sử dụng ứng dụng SafeEdu.",
  openGraph: {
    title: "Điều Khoản & Điều Kiện",
    description:
      "Tìm hiểu về các điều khoản và điều kiện khi sử dụng ứng dụng SafeEdu.",
    url: "https://www.safe-edu.site/dieu-khoan",
    images: [
      {
        url: "/images/logo/logo.png",
        width: 800,
        height: 600,
        alt: "SafeEdu Terms and Conditions",
      },
    ],
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <div className="bg-[#8BC34A] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Điều Khoản & Điều Kiện
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            <p>
              Các điều khoản và điều kiện này áp dụng cho ứng dụng SafeEdu (sau
              đây gọi là &quot;Ứng Dụng&quot;) dành cho thiết bị di động được
              tạo bởi Trần Văn Bảo Thắng (sau đây gọi là &quot;Nhà Cung Cấp Dịch
              Vụ&quot;) như một dịch vụ Miễn phí.
            </p>

            <Separator className="my-8" />

            <p>
              Khi tải xuống hoặc sử dụng Ứng Dụng, bạn tự động đồng ý với các
              điều khoản sau đây. Chúng tôi khuyên bạn nên đọc kỹ và hiểu rõ các
              điều khoản này trước khi sử dụng Ứng Dụng. Nghiêm cấm sao chép,
              sửa đổi Ứng Dụng, bất kỳ phần nào của Ứng Dụng, hoặc thương hiệu
              của chúng tôi. Không được phép cố gắng trích xuất mã nguồn của Ứng
              Dụng, dịch Ứng Dụng sang các ngôn ngữ khác, hoặc tạo các phiên bản
              phái sinh. Tất cả các thương hiệu, bản quyền, quyền cơ sở dữ liệu
              và các quyền sở hữu trí tuệ khác liên quan đến Ứng Dụng vẫn thuộc
              về Nhà Cung Cấp Dịch Vụ.
            </p>

            <Separator className="my-8" />

            <p>
              Nhà Cung Cấp Dịch Vụ cam kết đảm bảo rằng Ứng Dụng có ích và hiệu
              quả nhất có thể. Vì vậy, họ có quyền sửa đổi Ứng Dụng hoặc tính
              phí cho các dịch vụ của họ bất cứ lúc nào và vì bất kỳ lý do gì.
              Nhà Cung Cấp Dịch Vụ đảm bảo với bạn rằng bất kỳ khoản phí nào cho
              Ứng Dụng hoặc dịch vụ của nó sẽ được thông báo rõ ràng cho bạn.
            </p>

            <Separator className="my-8" />

            <p>
              Ứng Dụng lưu trữ và xử lý dữ liệu cá nhân mà bạn đã cung cấp cho
              Nhà Cung Cấp Dịch Vụ để cung cấp Dịch Vụ. Bạn có trách nhiệm duy
              trì tính bảo mật của điện thoại và quyền truy cập vào Ứng Dụng.
              Nhà Cung Cấp Dịch Vụ khuyên bạn không nên jailbreak hoặc root điện
              thoại của bạn, việc này liên quan đến việc loại bỏ các hạn chế và
              giới hạn phần mềm do hệ điều hành chính thức của thiết bị bạn áp
              đặt. Những hành động như vậy có thể khiến điện thoại của bạn bị
              nhiễm phần mềm độc hại, vi-rút, chương trình độc hại, làm tổn hại
              đến các tính năng bảo mật của điện thoại, và có thể dẫn đến việc
              Ứng Dụng không hoạt động chính xác hoặc không hoạt động.
            </p>

            <Separator className="my-8" />

            <p>
              Xin lưu ý rằng Ứng Dụng sử dụng các dịch vụ của bên thứ ba có Điều
              Khoản và Điều Kiện riêng. Dưới đây là các liên kết đến Điều Khoản
              và Điều Kiện của các nhà cung cấp dịch vụ bên thứ ba được Ứng Dụng
              sử dụng:
            </p>

            <ul>
              <li>
                <Link
                  className="text-[#8BC34A] hover:underline"
                  href="https://policies.google.com/terms"
                  target="_blank"
                >
                  Google Play Services
                </Link>
              </li>
              <li>
                <Link
                  className="text-[#8BC34A] hover:underline"
                  href="https://expo.io/terms"
                  target="_blank"
                >
                  Expo
                </Link>
              </li>
            </ul>

            <Separator className="my-8" />

            <p>
              Xin lưu ý rằng Nhà Cung Cấp Dịch Vụ không chịu trách nhiệm về một
              số khía cạnh nhất định. Một số chức năng của Ứng Dụng yêu cầu kết
              nối internet hoạt động, có thể là Wi-Fi hoặc do nhà cung cấp mạng
              di động của bạn cung cấp. Nhà Cung Cấp Dịch Vụ không thể chịu
              trách nhiệm nếu Ứng Dụng không hoạt động hết công suất do thiếu
              truy cập Wi-Fi hoặc nếu bạn đã sử dụng hết dung lượng dữ liệu của
              mình.
            </p>

            <Separator className="my-8" />

            <p>
              Nếu bạn đang sử dụng ứng dụng bên ngoài khu vực Wi-Fi, xin lưu ý
              rằng các điều khoản thỏa thuận của nhà cung cấp mạng di động của
              bạn vẫn áp dụng. Do đó, bạn có thể phải trả phí cho nhà cung cấp
              di động của bạn cho việc sử dụng dữ liệu trong thời gian kết nối
              với ứng dụng, hoặc các khoản phí của bên thứ ba khác. Khi sử dụng
              ứng dụng, bạn chấp nhận trách nhiệm đối với bất kỳ khoản phí nào
              như vậy, bao gồm cả phí dữ liệu chuyển vùng nếu bạn sử dụng ứng
              dụng bên ngoài lãnh thổ của bạn (tức là khu vực hoặc quốc gia) mà
              không tắt chuyển vùng dữ liệu. Nếu bạn không phải là người thanh
              toán hóa đơn cho thiết bị mà bạn đang sử dụng ứng dụng, họ giả
              định rằng bạn đã nhận được sự cho phép từ người thanh toán hóa
              đơn.
            </p>

            <Separator className="my-8" />

            <p>
              Tương tự, Nhà Cung Cấp Dịch Vụ không thể luôn luôn chịu trách
              nhiệm về việc bạn sử dụng ứng dụng. Ví dụ, bạn có trách nhiệm đảm
              bảo rằng thiết bị của bạn vẫn được sạc pin. Nếu thiết bị của bạn
              hết pin và bạn không thể truy cập Dịch Vụ, Nhà Cung Cấp Dịch Vụ
              không thể chịu trách nhiệm.
            </p>

            <Separator className="my-8" />

            <p>
              Về trách nhiệm của Nhà Cung Cấp Dịch Vụ đối với việc bạn sử dụng
              ứng dụng, điều quan trọng cần lưu ý là mặc dù họ cố gắng đảm bảo
              rằng nó được cập nhật và chính xác mọi lúc, họ vẫn phụ thuộc vào
              các bên thứ ba để cung cấp thông tin cho họ để họ có thể cung cấp
              cho bạn. Nhà Cung Cấp Dịch Vụ không chịu trách nhiệm pháp lý đối
              với bất kỳ tổn thất nào, trực tiếp hoặc gián tiếp, mà bạn gặp phải
              do hoàn toàn dựa vào chức năng này của ứng dụng.
            </p>

            <Separator className="my-8" />

            <p>
              Nhà Cung Cấp Dịch Vụ có thể muốn cập nhật ứng dụng tại một thời
              điểm nào đó. Ứng dụng hiện có sẵn theo yêu cầu của hệ điều hành
              (và đối với bất kỳ hệ thống bổ sung nào mà họ quyết định mở rộng
              tính khả dụng của ứng dụng) có thể thay đổi, và bạn sẽ cần tải
              xuống các bản cập nhật nếu bạn muốn tiếp tục sử dụng ứng dụng. Nhà
              Cung Cấp Dịch Vụ không đảm bảo rằng họ sẽ luôn cập nhật ứng dụng
              để nó phù hợp với bạn và/hoặc tương thích với phiên bản hệ điều
              hành cụ thể được cài đặt trên thiết bị của bạn. Tuy nhiên, bạn
              đồng ý luôn chấp nhận các bản cập nhật cho ứng dụng khi được cung
              cấp cho bạn. Nhà Cung Cấp Dịch Vụ cũng có thể muốn ngừng cung cấp
              ứng dụng và có thể chấm dứt việc sử dụng nó bất cứ lúc nào mà
              không cần thông báo chấm dứt cho bạn. Trừ khi họ thông báo cho bạn
              điều ngược lại, khi có bất kỳ sự chấm dứt nào, (a) các quyền và
              giấy phép được cấp cho bạn trong các điều khoản này sẽ kết thúc;
              (b) bạn phải ngừng sử dụng ứng dụng, và (nếu cần thiết) xóa nó
              khỏi thiết bị của bạn.
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">
              Thay Đổi Đối Với Các Điều Khoản và Điều Kiện Này
            </h2>
            <p>
              Nhà Cung Cấp Dịch Vụ có thể cập nhật định kỳ Điều Khoản và Điều
              Kiện của họ. Do đó, bạn được khuyên nên xem lại trang này thường
              xuyên để biết bất kỳ thay đổi nào. Nhà Cung Cấp Dịch Vụ sẽ thông
              báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Điều Khoản và
              Điều Kiện mới trên trang này.
            </p>

            <Separator className="my-8" />

            <p className="font-medium text-center">
              Các điều khoản và điều kiện này có hiệu lực từ ngày 20-02-2025
            </p>

            <Separator className="my-8" />

            <h2 className="text-2xl font-bold mb-4">Liên Hệ Với Chúng Tôi</h2>
            <p>
              Nếu bạn có bất kỳ câu hỏi hoặc đề xuất nào về Điều Khoản và Điều
              Kiện, vui lòng không ngần ngại liên hệ với Nhà Cung Cấp Dịch Vụ
              tại thangtvb.dev@gmail.com.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
