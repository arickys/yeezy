export default function handler(req, res) {
    const userAgent = req.headers["user-agent"] || "";

    const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(
            userAgent
        );

    if (mobile) {
        res.setHeader("Cache-Control", "no-store");
        res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#08090b">
<title>unYZY [UNAVAILABLE]</title>

<style>
@font-face{
font-family:Yeezy;
src:url("/fonts/yeezy_tstar-regular-webfont.woff") format("woff");
font-weight:400;
}

@font-face{
font-family:Yeezy;
src:url("/fonts/yeezy_tstar-bold.webfont.woff") format("woff");
font-weight:700;
}

*{
box-sizing:border-box;
}

html,
body{
margin:0;
width:100%;
height:100%;
}

body{
overflow:hidden;
background:
radial-gradient(
circle at 50% 35%,
rgba(255,255,255,.075),
transparent 31%
),
radial-gradient(
circle at 50% 100%,
rgba(255,255,255,.025),
transparent 45%
),
#08090b;
color:#f5f5f6;
font-family:Yeezy,Arial,sans-serif;
-webkit-font-smoothing:antialiased;
}

body:before{
content:"";
position:fixed;
inset:0;
pointer-events:none;
background:
linear-gradient(
rgba(255,255,255,.012) 1px,
transparent 1px
),
linear-gradient(
90deg,
rgba(255,255,255,.012) 1px,
transparent 1px
);
background-size:80px 80px;
opacity:.3;
mask-image:linear-gradient(
to bottom,
rgba(0,0,0,.7),
transparent 80%
);
}

.page{
width:100%;
height:100%;
display:flex;
align-items:center;
justify-content:center;
padding:28px;
}

.content{
width:min(540px,100%);
display:flex;
flex-direction:column;
align-items:center;
text-align:center;
}

.logo-wrap{
position:relative;
width:145px;
height:145px;
display:flex;
align-items:center;
justify-content:center;
margin-bottom:34px;
}

.glow{
position:absolute;
width:80%;
height:55%;
border-radius:50%;
background:rgba(255,255,255,.09);
filter:blur(60px);
}

.logo{
position:relative;
z-index:2;
width:100%;
height:100%;
object-fit:contain;
filter:
drop-shadow(0 25px 55px rgba(0,0,0,.65))
drop-shadow(0 0 45px rgba(255,255,255,.06));
animation:float 5s ease-in-out infinite;
}

@keyframes float{
0%,100%{
transform:translateY(0);
}
50%{
transform:translateY(-7px);
}
}

.label{
margin-bottom:11px;
color:#646a73;
font-size:9px;
font-weight:700;
letter-spacing:2px;
text-transform:uppercase;
}

h1{
margin:0;
font-size:clamp(30px,8vw,48px);
line-height:.95;
letter-spacing:-2.5px;
font-weight:700;
}

p{
max-width:390px;
margin:16px 0 0;
color:#747a83;
font-size:12px;
line-height:1.65;
}

.button{
margin-top:27px;
height:41px;
padding:0 19px;
display:inline-flex;
align-items:center;
justify-content:center;
border:1px solid rgba(255,255,255,.12);
border-radius:9px;
background:rgba(255,255,255,.035);
color:#d9dade;
text-decoration:none;
font-size:11px;
font-weight:700;
transition:
transform .2s ease,
background .2s ease,
border-color .2s ease;
}

.button:hover{
transform:translateY(-2px);
background:rgba(255,255,255,.075);
border-color:rgba(255,255,255,.2);
}

@media(prefers-reduced-motion:reduce){
.logo{
animation:none;
}

.button{
transition:none;
}
}
</style>
</head>

<body>

<main class="page">

<div class="content">

<div class="logo-wrap">

<div class="glow"></div>

<img
class="logo"
src="/assets/LOGO2.png"
alt="unYZY"
>

</div>

<div class="label">
Desktop Only
</div>

<h1>
unYZY isn't available here.
</h1>

<p>
This archive is designed for desktop screens and isn't currently supported on phones or tablets.
</p>

<a class="button" href="/">
Return Home
</a>

</div>

</main>

</body>
</html>
        `);

        return;
    }

    const path = req.url.split("?")[0];

    if (path === "/downloads") {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        res.sendFile("downloads.html", {
            root: process.cwd()
        });
        return;
    }

    if (path === "/updates") {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        res.sendFile("updates.html", {
            root: process.cwd()
        });
        return;
    }

    res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    res.sendFile("index.html", {
        root: process.cwd()
    });
}