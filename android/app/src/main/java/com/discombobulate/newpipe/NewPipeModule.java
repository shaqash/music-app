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
import org.schabi.newpipe.extractor.stream.StreamExtractor;
import org.schabi.newpipe.extractor.stream.StreamType;
import org.schabi.newpipe.extractor.stream.VideoStream;
import org.schabi.newpipe.extractor.stream.AudioStream;
import org.schabi.newpipe.extractor.exceptions.ExtractionException;
import org.schabi.newpipe.extractor.localization.Localization;
import org.schabi.newpipe.extractor.downloader.Downloader;
import org.schabi.newpipe.extractor.downloader.Request;
import org.schabi.newpipe.extractor.downloader.Response;
import org.schabi.newpipe.extractor.MediaFormat;
import org.schabi.newpipe.extractor.services.youtube.linkHandler.YoutubeSearchQueryHandlerFactory;
import org.schabi.newpipe.extractor.search.SearchInfo;
import org.schabi.newpipe.extractor.search.SearchExtractor;
import org.schabi.newpipe.extractor.InfoItem;
import org.schabi.newpipe.extractor.stream.StreamInfoItem;
import org.schabi.newpipe.extractor.Image;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import okhttp3.OkHttpClient;
import okhttp3.MediaType;
import okhttp3.RequestBody;
import java.util.ArrayList;

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
            
            List<Image> thumbnails = streamInfo.getThumbnails();
            if (!thumbnails.isEmpty()) {
                String thumbnailUrl = thumbnails.get(0).getUrl();
                if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                    result.putString("thumbnailUrl", thumbnailUrl);
                }
            }
            
            // Get video streams
            WritableArray videoStreams = Arguments.createArray();
            for (VideoStream stream : streamInfo.getVideoStreams()) {
                WritableMap streamMap = Arguments.createMap();
                streamMap.putString("url", stream.getUrl());
                streamMap.putString("resolution", stream.getResolution());
                streamMap.putString("format", stream.getFormat().name());
                videoStreams.pushMap(streamMap);
            }
            result.putArray("videoStreams", videoStreams);
            
            // Get audio streams
            WritableArray audioStreams = Arguments.createArray();
            for (AudioStream stream : streamInfo.getAudioStreams()) {
                WritableMap streamMap = Arguments.createMap();
                streamMap.putString("url", stream.getUrl());
                streamMap.putInt("averageBitrate", stream.getAverageBitrate());
                streamMap.putString("format", stream.getFormat().name());
                audioStreams.pushMap(streamMap);
            }
            result.putArray("audioStreams", audioStreams);
            
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

    @ReactMethod
    public void getAudioStreamInfo(String url, Promise promise) {
        try {
            StreamingService youtubeService = NewPipe.getService(0); // 0 is YouTube
            StreamExtractor extractor = youtubeService.getStreamExtractor(url);
            extractor.fetchPage();
            
            StreamInfo streamInfo = StreamInfo.getInfo(extractor);
            
            WritableMap result = Arguments.createMap();
            
            // Basic stream information
            result.putString("title", streamInfo.getName());
            result.putString("uploaderName", streamInfo.getUploaderName());
            result.putDouble("duration", streamInfo.getDuration());
            
            // Get all available audio streams
            WritableArray audioStreams = Arguments.createArray();
            List<AudioStream> streams = streamInfo.getAudioStreams();
            
            for (AudioStream stream : streams) {
                WritableMap streamMap = Arguments.createMap();
                streamMap.putString("url", stream.getUrl());
                streamMap.putInt("averageBitrate", stream.getAverageBitrate());
                streamMap.putString("format", stream.getFormat().name());
                
                // Additional audio-specific information
                streamMap.putInt("bandwidth", stream.getBitrate());
                if (stream.getFormat() == MediaFormat.M4A) {
                    streamMap.putString("codec", "aac");
                } else if (stream.getFormat() == MediaFormat.WEBMA) {
                    streamMap.putString("codec", "opus");
                }
                
                audioStreams.pushMap(streamMap);
            }
            result.putArray("audioStreams", audioStreams);
            
            // Add stream metadata
            WritableMap metadata = Arguments.createMap();
            metadata.putString("category", streamInfo.getCategory());
            metadata.putDouble("startPosition", streamInfo.getStartPosition());
            metadata.putString("streamType", streamInfo.getStreamType().toString());
            result.putMap("metadata", metadata);
            
            promise.resolve(result);
        } catch (ExtractionException | IOException e) {
            promise.reject("AUDIO_EXTRACTION_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void searchYoutube(String query, Promise promise) {
        try {
            StreamingService youtubeService = NewPipe.getService(0); // 0 is YouTube
            YoutubeSearchQueryHandlerFactory searchHandler = YoutubeSearchQueryHandlerFactory.getInstance();
            SearchExtractor searchExtractor = youtubeService.getSearchExtractor(query);
            searchExtractor.fetchPage();
            
            SearchInfo searchInfo = SearchInfo.getInfo(searchExtractor);
            
            WritableArray results = Arguments.createArray();
            searchInfo.getRelatedItems().forEach(item -> {
                if (item instanceof StreamInfoItem) {
                    StreamInfoItem streamItem = (StreamInfoItem) item;
                    WritableMap resultMap = Arguments.createMap();
                    resultMap.putString("title", streamItem.getName());
                    resultMap.putString("url", streamItem.getUrl());
                    
                    // Get thumbnail URL from the stream item
                    List<Image> thumbnails = streamItem.getThumbnails();
                    if (!thumbnails.isEmpty()) {
                        String thumbnailUrl = thumbnails.get(0).getUrl();
                        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                            resultMap.putString("thumbnailUrl", thumbnailUrl);
                        }
                    }
                    
                    results.pushMap(resultMap);
                }
            });
            
            promise.resolve(results);
        } catch (Exception e) {
            promise.reject("SEARCH_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void getRelatedVideos(String url, Promise promise) {
        try {
            StreamingService youtubeService = NewPipe.getService(0); // 0 is YouTube
            StreamExtractor extractor = youtubeService.getStreamExtractor(url);
            extractor.fetchPage();
            
            StreamInfo streamInfo = StreamInfo.getInfo(extractor);
            WritableArray results = Arguments.createArray();
            
            // Get related items from the stream info
            streamInfo.getRelatedItems().forEach(item -> {
                if (item instanceof StreamInfoItem) {
                    StreamInfoItem streamItem = (StreamInfoItem) item;
                    WritableMap resultMap = Arguments.createMap();
                    resultMap.putString("title", streamItem.getName());
                    resultMap.putString("url", streamItem.getUrl());
                    
                    // Get thumbnail URL from the stream item
                    List<Image> thumbnails = streamItem.getThumbnails();
                    if (!thumbnails.isEmpty()) {
                        String thumbnailUrl = thumbnails.get(0).getUrl();
                        if (thumbnailUrl != null && !thumbnailUrl.isEmpty()) {
                            resultMap.putString("thumbnailUrl", thumbnailUrl);
                        }
                    }
                    
                    results.pushMap(resultMap);
                }
            });
            
            promise.resolve(results);
        } catch (Exception e) {
            promise.reject("RELATED_VIDEOS_ERROR", e.getMessage());
        }
    }
} 