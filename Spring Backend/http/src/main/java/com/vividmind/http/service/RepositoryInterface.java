package com.vividmind.http.service;

import com.vividmind.http.dto.TourResponse;
import retrofit2.Call;
import retrofit2.http.GET;

public interface RepositoryInterface {

    @GET("pocketguide/_test/store_en.v2.gz")
    Call<TourResponse> refreshTours();
}
