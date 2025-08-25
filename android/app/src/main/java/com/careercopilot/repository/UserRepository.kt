package com.careercopilot.repository

import com.careercopilot.data.model.UserProfile
import com.careercopilot.data.remote.ApiService
import javax.inject.Inject

class UserRepository @Inject constructor(private val apiService: ApiService) {

    suspend fun getUserProfile(token: String): UserProfile {
        return apiService.login(token)
    }
}
