//코드 동작하게 최소한만 수정한 코드
const cors = require("cors");
const fetch = require("node-fetch");

var express = require("express");
var app = express();
var client_id = "sFFJbHM5h_DLHn_E5qOH";
var client_secret = "Tx1BG4oxPQ";
var state = "RAMDOM_STATE-anyword";
var redirectURI = encodeURI("http://localhost:8081/secure");
var api_url = "";

app.use(cors());

app.get("/naverlogin", function (req, res) {
    api_url =
        "https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=" +
        client_id +
        "&redirect_uri=" +
        redirectURI +
        "&state=" +
        state;
    res.writeHead(200, { "Content-Type": "text/html;charset=utf-8" });
    res.end(
        "<a href='" +
        api_url +
        "'><img height='50' src='https://ndevthumb-phinf.pstatic.net/20240328_198/17115883494735spOD_PNG/T8ahNFGIcZ1c20240328101229.png'/></a>"
    );
});
app.get("/callback", async function (req, res) {
    const code = req.query.code;
    const state = req.query.state;
    const api_url =
        "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=" +
        client_id +
        "&client_secret=" +
        client_secret +
        "&redirect_uri=" +
        redirectURI +
        "&code=" +
        code +
        "&state=" +
        state;
    // var request = require("request");
    // var options = {
    //   url: api_url,
    //   headers: {
    //     "X-Naver-Client-Id": client_id,
    //     "X-Naver-Client-Secret": client_secret,
    //   },
    // };
    // request.get(options, function (error, response, body) {
    //   if (!error && response.statusCode == 200) {
    //     res.writeHead(200, { "Content-Type": "text/json;charset=utf-8" });

    //     res.end(body);
    //     console.log("body", body);
    //   } else {
    //     res.status(response.statusCode).end();
    //     console.log("error = " + response.statusCode);
    //   }
    // });

    const response = await fetch(api_url, {
        headers: {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
        },
    });

    const tokenRequest = await response.json();

    //3단계: access_token으로 사용자 정보 받아오기
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://openapi.naver.com/v1/nid/me";

        const data = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const userData = await data.json();

        //사용자 정보 콘솔로 받아오기 -> DB에 저장해야 합니다.

        console.log("userData:"+ userData);
        this.$router.push({
            name: 'App',
            // key: value
            params: { token : userData }
        })

    }

    return res.send("DB에 저장하고 랜드페이지로 redirect ");
});

app.listen(3000, function () {
    console.log("http://localhost:3000/naverlogin app listening on port 3000!");
});