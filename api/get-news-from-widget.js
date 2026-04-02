// api/get-news-from-widget.js
export default async function handler(req, res) {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const widgetUrl = 'https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin';
  
  try {
    // 1. Fetch nội dung widget
    const response = await fetch(widgetUrl);
    const html = await response.text();
    
    // 2. Parse HTML để lấy danh sách bài viết
    // Dùng regex đơn giản (có thể dùng cheerio nếu muốn chính xác hơn)
    const news = [];
    // Tìm các thẻ <a> có href chứa "/tin-tuc-su-kien/-/details/" và có class chứa "title"
    const regex = /<a\s+[^>]*href="([^"]+)"[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null && news.length < 10) {
      let link = match[1];
      let title = match[2].trim();
      // Đảm bảo link tuyệt đối
      if (link.startsWith('/')) link = 'https://tulan.bacninh.gov.vn' + link;
      news.push({ title, link });
    }
    
    // Nếu không tìm thấy, thử tìm theo cấu trúc khác (dùng selector đơn giản hơn)
    if (news.length === 0) {
      const altRegex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
      while ((match = altRegex.exec(html)) !== null && news.length < 10) {
        let link = match[1];
        let title = match[2].trim();
        if (link.includes('/tin-tuc-su-kien/-/details/') && title.length > 10) {
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
}
