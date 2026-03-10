import { Navigate, Route, Routes } from 'react-router-dom';
import type { FeatureFlagState } from '../config/featureFlags';
import { FeaturesRouter } from '../router/FeaturesRouter';
import { ScreensRouter } from '../router/ScreensRouter';
import { AppLayout } from './layout';

export interface AppRoutesProps {
  initialFlags?: Partial<FeatureFlagState>;
}

export function AppRoutes({ initialFlags }: AppRoutesProps) {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          path="/"
          element={
            <Navigate
              replace
              to="/login"
            />
          }
        />
        {ScreensRouter({ flags: initialFlags })}
        {FeaturesRouter()}
        <Route
          path="*"
          element={
            <Navigate
              replace
              to="/login"
            />
          }
        />
      </Route>
    </Routes>
  );
}
