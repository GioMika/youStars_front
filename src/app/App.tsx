import './styles/index.scss'
import {useTheme} from "app/provider/lib_lib/useTheme";
import React, {Suspense} from "react";
import {BrowserRouter} from "react-router-dom";
import {Routes, Route} from "react-router-dom";
import {CreateAccountAsync} from "../pages/CreatedAccount";
import {LoginFormAsync} from "../pages/LoginForm";
import {StepsAsync} from "../pages/Steps";
import Managers from "../pages/Managers/ui/Managers";
import Test from "../widgets/Test/Test";
import {Header} from "../widgets/Header";
import { className } from './provider/lib_lib/classNames/classNames';

function App() {
    const {theme} = useTheme()
    return (
        <div className={className('app', {}, [theme])}>
            <Suspense fallback={''}>
            <BrowserRouter>
                    {/*<Header/>*/}
                    <Routes>
                        <Route path={'/'} element={<LoginFormAsync/>}/>
                        <Route path="/create-account/:role" element={<CreateAccountAsync />} />
                        <Route path={'/test'} element={<Test/>}/>
                        <Route path={'/steps'} element={<StepsAsync/>}/>
                        <Route path={'/projects_user'} element={<Managers/>}/>
                    </Routes>
            </BrowserRouter>
            </Suspense>
        </div>
    );
}

export default App;
