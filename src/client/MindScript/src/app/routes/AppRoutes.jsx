import { Navigate, Routes, Route } from "react-router-dom"
import { AppPage } from "../pages/AppPage"
import { SHomePage, SModulesPage, PHomePage, ARequest, PModulesPage, MultiOpt, PManage, PProfile, SProfile } from "../pages"
import { WorkEnv } from "../pages/student/WorkEnv"
import { AManage } from "../pages"
import { ASyllabus } from "../pages/admin/ASyllabus"
import { PDashboard } from "../pages/professor/PDashboard"

export const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={ <AppPage /> } />
        <Route path="student/home" element={ <SHomePage /> } />        
        <Route path="student/modules" element={ <SModulesPage /> } />
        <Route path="student/modules/:group/:course" element={ <SModulesPage /> } />
        <Route path="student/workenv" element={ <WorkEnv /> } />
        <Route path="student/multiopt" element={ <MultiOpt /> } />
        <Route path="student/profile" element={ <SProfile /> } />
        <Route path="professor/home" element={ <PHomePage /> } />
        <Route path="professor/modules" element={ <PModulesPage /> } />
        <Route path="professor/modules/:group/:course" element={ <PModulesPage /> } />
        <Route path="professor/management" element={ <PManage /> } />
        <Route path="professor/management/:group/:course" element={ <PManage /> } />
        <Route path="professor/dashboard" element={ <PDashboard /> } />
        <Route path="professor/profile" element={ <PProfile /> } />
        <Route path="admin/management" element={ <AManage /> } />
        <Route path="admin/syllabus" element={ <ASyllabus /> } />        
        <Route path="admin/request" element={ <ARequest /> } />
        <Route path="/*" element={ <Navigate to="/" /> } />

    </Routes>

  )
}
