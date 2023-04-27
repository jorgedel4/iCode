import { Route, Routes, Navigate } from "react-router-dom"
import { AuthRoutes } from "../auth/routes/AuthRoutes"
import { AppRoutes } from "../app/routes/AppRoutes"
import { CheckingAuth } from "../ui/components/CheckingAuth"
import { useCheckAuth } from "../hooks"

export const AppRouter = () => {

  const {status} = useCheckAuth();

  if (status === 'checking') {
    return <CheckingAuth />
  }

  return (
    <Routes>

      {/* {
        (status === 'authenticated') */}
          ? <Route path="/*" element={<AppRoutes />} />
          : <Route path="/auth/*" element={<AuthRoutes />} />
      {/* } */}

    </Routes>
  )
}
