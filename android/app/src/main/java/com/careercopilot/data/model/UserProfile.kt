package com.careercopilot.data.model

data class UserProfile(
    val uid: String,
    val email: String,
    val personalInfo: PersonalInfo,
    val masterProfile: MasterProfile,
    val preferences: Preferences,
    val created: Long,
    val updated: Long
)

data class PersonalInfo(
    val name: String,
    val phone: String,
    val location: String,
    val linkedIn: String
)

data class MasterProfile(
    val summary: String,
    val skills: List<String>,
    val experience: List<ExperienceItem>,
    val education: List<EducationItem>,
    val certifications: List<String>
)

data class ExperienceItem(
    val title: String,
    val company: String,
    val duration: String,
    val responsibilities: List<String>
)

data class EducationItem(
    val degree: String,
    val institution: String,
    val year: String
)

data class Preferences(
    val themeId: String,
    val targetRoles: List<String>
)
