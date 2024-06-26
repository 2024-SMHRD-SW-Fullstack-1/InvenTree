package com.inven.tree;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.inven.tree.config.CaptchaConfig;

@Service
public class CaptchaService {

    private final String clientId;
    private final String clientSecret;

    @Autowired
    public CaptchaService(CaptchaConfig captchaConfig) {
        this.clientId = captchaConfig.getClientId();
        this.clientSecret = captchaConfig.getClientSecret();
    }

    public String getCaptchaKey() throws IOException {
        String code = "0"; // 키 발급시 0, 캡차 이미지 비교시 1로 세팅
        String apiURL = "https://openapi.naver.com/v1/captcha/nkey?code=" + code;

        HttpURLConnection con = connect(apiURL);
        con.setRequestMethod("GET");
        con.setRequestProperty("X-Naver-Client-Id", clientId);
        con.setRequestProperty("X-Naver-Client-Secret", clientSecret);

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return readBody(con.getInputStream());
        } else {
            return readBody(con.getErrorStream());
        }
    }

    public String getCaptchaImage(String key) throws IOException {
        String apiURL = "https://openapi.naver.com/v1/captcha/ncaptcha.bin?key=" + key;

        HttpURLConnection con = connect(apiURL);
        con.setRequestMethod("GET");
        con.setRequestProperty("X-Naver-Client-Id", clientId);
        con.setRequestProperty("X-Naver-Client-Secret", clientSecret);

        int responseCode = con.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            return saveImage(con.getInputStream());
        } else {
            return readBody(con.getErrorStream());
        }
    }

    private HttpURLConnection connect(String apiUrl) throws IOException {
        URL url = new URL(apiUrl);
        return (HttpURLConnection) url.openConnection();
    }

    private String readBody(InputStream body) throws IOException {
        InputStreamReader streamReader = new InputStreamReader(body);
        BufferedReader lineReader = new BufferedReader(streamReader);
        StringBuilder responseBody = new StringBuilder();
        String line;
        while ((line = lineReader.readLine()) != null) {
            responseBody.append(line);
        }
        return responseBody.toString();
    }

    private String saveImage(InputStream is) throws IOException {
        int read;
        byte[] bytes = new byte[1024];
        // 랜덤한 이름으로 파일 생성
        String filename = Long.valueOf(new Date().getTime()).toString();
        File file = new File("src/main/webapp/resources/captcha/" + filename + ".jpg");
        try (OutputStream outputStream = new FileOutputStream(file)) {
            file.createNewFile();
            while ((read = is.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }
            return file.getName();
        }
    }
}
