// api/get-oa-posts.js
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Lấy Access Token từ biến môi trường (sẽ cài sau)
    const accessToken = process.env.ZALO_ACCESS_TOKEN;
    if (!accessToken) {
        return res.status(500).json({ success: false, error: "Missing ZALO_ACCESS_TOKEN" });
    }
    
    const oaId = "155482019626526050";
    const url = `https://graph.zalo.me/v2.0/oa/getfeed?oa_id=${oaId}&limit=10&access_token=${accessToken}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        // Trả về mảng bài viết (tuỳ cấu trúc response của Zalo)
        if (data.data && Array.isArray(data.data)) {
            res.status(200).json({ success: true, data: data.data });
        } else {
            res.status(200).json({ success: false, error: "No data" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
}