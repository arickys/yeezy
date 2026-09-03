const REDIRECT_TO_HOME = false;

export default function handler(req, res) {
    if (!REDIRECT_TO_HOME) {
        return res.status(200).json({
            redirect: false
        });
    }

    const path = req.url.split("?")[0];

    if (path === "/") {
        return res.status(200).json({
            redirect: false
        });
    }

    res.writeHead(307, {
        Location: "/"
    });

    res.end();
}