import { singInWithGoogle, registerUserWithEmailPassword, loginWithEmailPassword} from "../../firebase/providers";
import { checkingCredentials, logout, login } from "./authSlice"

//Esta función va a cambiar el estado checking 
export const checkingAuthentication = (email, password) => {
    return async (dispatch) => {
        dispatch(checkingCredentials());
    }
}

//para la de google es LOMISMO de las 4 a las 8
export const startGoogleSignIn = () => {
    return async (dispatch) => {

        dispatch(checkingCredentials());

        const result = await singInWithGoogle();

        console.log({ result })

        if (result.ok == 'Failed to collect user data') {
            dispatch(logout(result.errorMessage));
        } else {
            dispatch(login(result))
        }

    }
}


//create user con email y password
export const startCreatingUserWithEmailPassword = ({ id, email, password, displayName }) => {
    return async (dispatch) => {
        dispatch(checkingCredentials());

        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailPassword({ id, email, password, displayName })
        // console.log(resp);
        if (!ok) return dispatch(logout({errorMessage}))

        dispatch(login({ uid, displayName, email, photoURL, errorMessage}));
        console.log(logout(errorMessage))
    }
}

//Login CON EMAIL Y PASSWORD
export const startLoginWithEmailPassword = ({ email, password }) => {
    return async (dispatch) => {

        //Se hace este dispatch para controlar el estado de non auth checkin auth
        dispatch(checkingCredentials());

        const result = await loginWithEmailPassword({email,password});

        console.log({ result })

        if (!result.ok) {
            dispatch(logout(result));
        } else {
            dispatch(login(result))
        }

    }
}