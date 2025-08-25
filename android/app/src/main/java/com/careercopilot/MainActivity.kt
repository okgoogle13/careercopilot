package com.careercopilot

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.careercopilot.ui.navigation.AppNavigation
import com.careercopilot.ui.theme.CareerCopilotTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            CareerCopilotTheme {
                AppNavigation()
            }
        }
    }
}
