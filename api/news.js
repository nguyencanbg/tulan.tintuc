const axios = require("axios");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const widgetUrl = "https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin";

  // Dùng proxy để tránh timeout
  const url = "https://api.allorigins.win/raw?url=" + encodeURIComponent(widgetUrl);

  try {
    const response = await axios.get(url, {
      timeout: 15000
    });

    const html = response.data;

    const news = [];

    // Regex đúng theo cấu trúc /news/-/details/
    const regex = /<a[^>]+href="([^"]*\/news\/-\/details\/[^"]+)"[^>]*>(.*?)<\/a>/gi;

    let match;
    while ((match = regex.exec(html)) !== null && news.length < 5) {
      let link = match[1];
      let title = match[2].replace(/<[^>]+>/g, "").trim();

      if (title.length < 10) continue;

      if (link.startsWith("/")) {
        link = "https://tulan.bacninh.gov.vn" + link;
      }

      news.push({ title, link });
    }

    if (news.length === 0) {
      return res.status(200).json({
        success: false,
        message: "Không lấy được tin",
        html_preview: html.substring(0, 1000)
      });
    }

    res.status(200).json({
      success: true,
      data: news
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
