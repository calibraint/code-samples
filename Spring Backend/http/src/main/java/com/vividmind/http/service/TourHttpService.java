package com.vividmind.http.service;

import com.vividmind.http.config.APIConfiguration;
import com.vividmind.http.dto.TourResponse;
import org.springframework.stereotype.Service;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

import java.io.IOException;

@Service
public class TourHttpService implements APIConfiguration {

    private RepositoryInterface service;

    public TourHttpService() {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(APIConfiguration.API_BASE_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        service = retrofit.create(RepositoryInterface.class);
    }

    public Response<TourResponse> getTours() throws IOException {
        Call<TourResponse> retrofitCall = service.refreshTours();

        Response<TourResponse> response = retrofitCall.execute();

        assert response.body() != null;
        return response;
    }
}
