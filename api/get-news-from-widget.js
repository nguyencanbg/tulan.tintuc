// api/get-news-from-widget.js
module.exports = async (req, res) => {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  const widgetUrl = 'https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin';
  
  try {
    const response = await fetch(widgetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'vi,en-US;q=0.9,en;q=0.8',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    
    // Parse HTML lấy danh sách bài viết
    const news = [];
    // Tìm các thẻ <a> có href chứa "/tin-tuc-su-kien/-/details/" và class "title"
    const regex = /<a\s+[^>]*href="([^"]+)"[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/a>/gi;
    let match;
    while ((match = regex.exec(html)) !== null && news.length < 10) {
      let link = match[1];
      let title = match[2].trim();
      if (link.startsWith('/')) link = 'https://tulan.bacninh.gov.vn' + link;
      news.push({ title, link });
    }
    
    // Nếu không tìm thấy, thử tìm tất cả thẻ a có chứa "/tin-tuc-su-kien/-/details/"
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
    
    if (news.length === 0) {
      // Fallback: trả về HTML gốc để debug (tạm thời)
      return res.status(200).json({ success: false, error: 'Không tìm thấy bài viết', html: html.substring(0, 500) });
    }
    
    res.status(200).json({ success: true, data: news });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
