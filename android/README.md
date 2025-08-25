# CareerCopilot Android Application

This is the starter template for the native Android version of the CareerCopilot application. It is built using modern Android development tools and practices, and it is designed to communicate with the existing FastAPI backend.

## Technologies Used

*   **Language:** [Kotlin](https://kotlinlang.org/)
*   **UI Toolkit:** [Jetpack Compose](https://developer.android.com/jetpack/compose)
*   **Architecture:** MVVM (Model-View-ViewModel) with Clean Architecture principles.
*   **Dependency Injection:** [Hilt](https://dagger.dev/hilt/)
*   **Networking:** [Retrofit](https://square.github.io/retrofit/) for type-safe HTTP requests.
*   **Navigation:** [Navigation Compose](https://developer.android.com/jetpack/compose/navigation)
*   **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)

## Project Structure

The project is organized into the following main packages:

*   `com.careercopilot`
    *   `data`: Contains data models, and the remote API service definition.
        *   `model`: Kotlin data classes representing the data structures.
        *   `remote`: Retrofit API service interface.
    *   `di`: Hilt dependency injection modules.
    *   `repository`: Repository classes that abstract the data sources.
    *   `ui`: Jetpack Compose UI elements, including screens, navigation, and themes.
        *   `screens`: Composable functions for each screen of the app.
        *   `navigation`: The navigation graph for the app.
        *   `theme`: The application's theme and color scheme.

## How to Build and Run

1.  **Open the project:** Open the `android` directory in Android Studio.
2.  **Sync Gradle:** Let Android Studio sync the Gradle files and download the necessary dependencies.
3.  **Set up Firebase:**
    *   You will need to create a Firebase project and add an Android app to it.
    *   Download the `google-services.json` file from your Firebase project settings and place it in the `android/app` directory.
4.  **Configure the Backend URL:**
    *   In `android/app/src/main/java/com/careercopilot/di/AppModule.kt`, replace the placeholder `"https://your-backend-api.com/"` with the actual URL of your deployed FastAPI backend.
5.  **Run the app:** Select a device or emulator and run the app from Android Studio.

## Next Steps

This starter template provides a solid foundation for the Android app. The next steps would be to:

*   Implement the actual logic for user authentication with Firebase.
*   Implement the ViewModel for each screen to handle UI state and business logic.
*   Fetch and display data from the backend in the UI.
*   Build out the remaining features as described in the solution design document.
