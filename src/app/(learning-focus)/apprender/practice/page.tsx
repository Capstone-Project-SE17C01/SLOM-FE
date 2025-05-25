import React from "react";

export default function CourseDashboardPage() {
  return (
    <div className="flex min-h-screen bg-[#FFFCF3]">
      {/* Main Content */}

      <div className="flex-1 flex flex-col">
        {/* Main Section */}

        <main className="flex-1 overflow-y-auto p-8">
          {/* Placeholder cho các block: ProgressBar, ScoreSummary, ActivityCard, Banner, Image */}
          <div className="max-w-4xl mx-auto">
            {/* ProgressBar */}
            <div className="mb-6">
              <div className="text-lg font-semibold">
                Tiếng Hàn - Cấp độ{" "}
                <span className="inline-block bg-yellow-400 text-white rounded-full px-2">
                  1
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-1">Tới cấp độ 2</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className="bg-yellow-400 h-2.5 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
              <div className="flex justify-between text-sm font-medium">
                <span>40/100</span>
              </div>
            </div>
            {/* ScoreSummary */}
            <div className="bg-yellow-300 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center">
                <div className="font-bold text-lg">Điểm của tôi</div>
                <div className="font-bold text-lg">40 đ</div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="font-semibold">Học từ mới</div>
                  <div className="text-sm text-gray-600">
                    10 Các từ đã thành thạo
                  </div>
                  <div className="text-sm text-gray-600">0 Đã bắt đầu học</div>
                  <div className="font-bold text-right mt-2">40 đ</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">Nghe các từ đã học</div>
                  <div className="text-sm text-gray-600">
                    0 Video mới đã xem
                  </div>
                  <div className="text-sm text-gray-600">0 Đã xem lại</div>
                  <div className="font-bold text-right mt-2">0 đ</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold">Dùng các từ đã học</div>
                  <div className="text-sm text-gray-600">
                    0 Đối thoại đã hoàn thành
                  </div>
                  <div className="text-sm text-gray-600">0 Đã xem lại</div>
                  <div className="font-bold text-right mt-2">0 đ</div>
                </div>
              </div>
            </div>
            {/* ActivityCard */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow flex items-center justify-between">
              <div className="font-semibold">Hoạt động của tôi</div>
              <button className="text-yellow-500 font-bold">&gt;</button>
            </div>
            {/* BannerStartLearning */}
            <div className="bg-[#1B2A3A] rounded-xl p-6 flex items-center justify-between mb-6">
              <div className="text-white">
                <div className="font-bold text-lg mb-2">Học từ mới</div>
                <div className="text-sm">Tiếp tục: Giải mã bảng chữ cái</div>
              </div>
              <button className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-lg">
                Bắt đầu
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
