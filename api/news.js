// api/news.js
const axios = require("axios");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const url = "https://tulan.bacninh.gov.vn/widget/web/phuong-tu-lan/trang-chu/-/newsbycategory_WAR_bacninhportlet_INSTANCE_mWsBUpKPjGin";

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept-Language": "vi,en-US;q=0.9",
      },
      timeout: 10000
    });

    const html = response.data;

    const news = [];

    const regex = /<a[^>]+href="([^"]*\/tin-tuc-su-kien\/-\/details\/[^"]+)"[^>]*>(.*?)<\/a>/gi;

    let match;
    while ((match = regex.exec(html)) !== null && news.length < 5) {
      let link = match[1];
      let title = match[2].replace(/<[^>]+>/g, "").trim();

      if (link.startsWith("/")) {
        link = "https://tulan.bacninh.gov.vn" + link;
      }

      news.push({ title, link });
    }

    // DEBUG nếu không có dữ liệu
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
    console.error("ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
