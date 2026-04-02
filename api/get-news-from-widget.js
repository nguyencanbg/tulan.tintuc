// api/get-news-from-widget.js
module.exports = async (req, res) => {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const widgetUrl = 'https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin';
  
  try {
    // 1. Lấy HTML từ widget
    const response = await fetch(widgetUrl);
    const html = await response.text();
    
    // 2. Parse HTML để lấy danh sách bài viết
    const news = [];
    // Tìm tất cả thẻ <a> có href chứa "/tin-tuc-su-kien/-/details/"
    const regex = /<a\s+[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null && news.length < 10) {
      let link = match[1];
      let title = match[2].trim();
      // Chỉ lấy những link dạng tin tức
      if (link.includes('/tin-tuc-su-kien/-/details/') && title.length > 10) {
        // Đảm bảo link tuyệt đối
        if (link.startsWith('/')) link = 'https://tulan.bacninh.gov.vn' + link;
        news.push({ title, link });
      }
    }
    
    // Nếu không tìm thấy, thử với cấu trúc class cụ thể hơn
    if (news.length === 0) {
      const altRegex = /<a\s+class="[^"]*title[^"]*"\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
      while ((match = altRegex.exec(html)) !== null && news.length < 10) {
        let link = match[1];
        let title = match[2].trim();
        if (link.includes('/tin-tuc-su-kien/-/details/')) {
          if (link.startsWith('/')) link = 'https://tulan.bacninh.gov.vn' + link;
          news.push({ title, link });
        }
      }
    }
    
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
