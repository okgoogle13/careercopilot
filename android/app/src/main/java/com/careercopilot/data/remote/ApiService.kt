package com.careercopilot.data.remote

import com.careercopilot.data.model.GeneratedDocument
import com.careercopilot.data.model.UserProfile
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST

interface ApiService {

    @POST("api/v1/users/login")
    suspend fun login(@Header("Authorization") token: String): UserProfile

    @GET("api/v1/documents")
    suspend fun getDocuments(@Header("Authorization") token: String): List<GeneratedDocument>
}
