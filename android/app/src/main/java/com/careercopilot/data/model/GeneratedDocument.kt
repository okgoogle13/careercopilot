package com.careercopilot.data.model

data class GeneratedDocument(
    val id: String,
    val userId: String,
    val type: String, // 'resume' | 'cover_letter' | 'ksc'
    val jobTitle: String,
    val company: String,
    val atsScore: Int,
    val theme: String,
    val status: String, // 'draft' | 'final'
    val downloadUrl: String,
    val created: Long
)
