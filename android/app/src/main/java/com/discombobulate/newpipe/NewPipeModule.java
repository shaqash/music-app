package com.discombobulate.newpipe;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import org.schabi.newpipe.extractor.NewPipe;
import org.schabi.newpipe.extractor.StreamingService;
import org.schabi.newpipe.extractor.services.youtube.YoutubeService;
import org.schabi.newpipe.extractor.stream.StreamInfo;
import org.schabi.newpipe.extractor.stream.VideoStream;
import org.schabi.newpipe.extractor.exceptions.ExtractionException;
import org.schabi.newpipe.extractor.localization.Localization;
import org.schabi.newpipe.extractor.downloader.Downloader;
import org.schabi.newpipe.extractor.downloader.Request;
import org.schabi.newpipe.extractor.downloader.Response;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import okhttp3.OkHttpClient;
import okhttp3.MediaType;
import okhttp3.RequestBody;

public class NewPipeModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private static final OkHttpClient HTTP_CLIENT = new OkHttpClient.Builder().build();
    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");

    private static class CustomDownloader extends Downloader {
        @Override
        public Response execute(Request request) throws IOException {
            okhttp3.Request.Builder requestBuilder = new okhttp3.Request.Builder()
                .url(request.url());

            // Handle request body for POST requests
            if (request.httpMethod().equals("POST")) {
                RequestBody requestBody = request.dataToSend() != null ?
                    RequestBody.create(request.dataToSend(), JSON) :
                    RequestBody.create("", null);
                requestBuilder.method(request.httpMethod(), requestBody);
            } else {
                requestBuilder.method(request.httpMethod(), null);
            }

            Map<String, List<String>> headers = request.headers();
            for (Map.Entry<String, List<String>> header : headers.entrySet()) {
                String key = header.getKey();
                List<String> values = header.getValue();
                if (values != null && !values.isEmpty()) {
                    requestBuilder.addHeader(key, values.get(0));
                }
            }

            okhttp3.Response response = HTTP_CLIENT.newCall(requestBuilder.build()).execute();
            String responseBody = response.body() != null ? response.body().string() : "";
            String latestUrl = response.request().url().toString();

            return new Response(
                response.code(),
                response.message(),
                response.headers().toMultimap(),
                responseBody,
                latestUrl
            );
        }
    }

    public NewPipeModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
        // Initialize NewPipe with custom downloader and default localization
        NewPipe.init(new CustomDownloader(), Localization.DEFAULT);
    }

    @Override
    public String getName() {
        return "NewPipeModule";
    }

    @ReactMethod
    public void getStreamInfo(String url, Promise promise) {
        try {
            StreamingService youtubeService = NewPipe.getService(0); // 0 is YouTube
            StreamInfo streamInfo = StreamInfo.getInfo(youtubeService, url);
            
            WritableMap result = Arguments.createMap();
            result.putString("title", streamInfo.getName());
            result.putString("uploaderName", streamInfo.getUploaderName());
            result.putString("description", streamInfo.getDescription().getContent());
            result.putInt("viewCount", (int) streamInfo.getViewCount());
            
            // Get video streams
            WritableArray streams = Arguments.createArray();
            for (VideoStream stream : streamInfo.getVideoStreams()) {
                WritableMap streamMap = Arguments.createMap();
                streamMap.putString("url", stream.getUrl());
                streamMap.putString("resolution", stream.getResolution());
                streamMap.putString("format", stream.getFormat().name());
                streams.pushMap(streamMap);
            }
            result.putArray("videoStreams", streams);
            
            promise.resolve(result);
        } catch (ExtractionException | IOException e) {
            promise.reject("EXTRACTION_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getVideoId(String url, Promise promise) {
        try {
            StreamingService youtubeService = NewPipe.getService(0);
            String videoId = youtubeService.getStreamLHFactory().getId(url);
            promise.resolve(videoId);
        } catch (Exception e) {
            promise.reject("ID_EXTRACTION_ERROR", e.getMessage());
        }
    }
} 