export default async function handler(req, res) {
    const query = typeof req.query.q === "string" && req.query.q.trim()
        ? req.query.q.trim()
        : "Kanye West";

    const params = new URLSearchParams({
        q: query,
        from: "2026-07-30",
        sortBy: "publishedAt",
        language: "en",
        pageSize: "9",
        apiKey: process.env.NEWS_API_KEY
    });

    try {
        const response = await fetch(`https://newsapi.org/v2/everything?${params}`);
        const data = await response.json();

        if (!response.ok || data.status !== "ok") {
            return res.status(response.status || 500).json({
                status: "error",
                message: data.message || "News request failed"
            });
        }

        return res.status(200).json(data);
    } catch {
        return res.status(500).json({
            status: "error",
            message: "News request failed"
        });
    }
}
