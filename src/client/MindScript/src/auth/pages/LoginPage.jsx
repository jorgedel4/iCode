import React from 'react'
import { useMemo } from 'react'
import { AuthLayout } from '../layout/AuthLayout'
import { Link as RouterLink } from "react-router-dom"
import { Button, Checkbox, Alert, FormControl, FormControlLabel, FormGroup, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Typography } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from '../../hooks/useForm';
import { useDispatch, useSelector } from 'react-redux';
import { checkingAuthentication } from '../../store/auth/thunks';
import { startGoogleSignIn, startLoginWithEmailPassword } from '../../store/auth';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //To avoid double authentication
  const { status, errorMessage } = useSelector(state => state.auth);
  console.log(status);

  //Authentication Redux Hook useForm
  const dispatch = useDispatch();

  const { email, password, onInputChange } = useForm({
    email: '',
    password: '123123'
  });

  const isAuthenticated = useMemo(() => status === 'checking', [status])

  //Esta es la función que hace el submit de las credenciales
  const onSubmit = (event) => {
    event.preventDefault();
    // console.log({ email, password })
    dispatch(startLoginWithEmailPassword({ email, password }));
  }

  const onGoogleSignIn = () => {
    console.log('onGoogleSignIn');
    dispatch(startGoogleSignIn());
  }


  return (
    <AuthLayout title='LoginPage'>
      <form onSubmit={onSubmit}>
        <Grid container>
          <Grid item xs={12} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }}>
              <InputLabel sx={{
                color: 'appDark.text',
                '&.Mui-focused': {
                  color: 'appDark.text' //change label color
                }
              }}>Correo</InputLabel>
              <OutlinedInput
                type="email"
                label="Correo"
                placeholder="A00000000@tec.mx"
                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}

                //AUTH
                name='email'
                value={email}
                onChange={onInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }} >
              <InputLabel sx={{
                color: 'appDark.text',
                '&.Mui-focused': {
                  color: 'appDark.text' //change label color
                }
              }}>Contraseña</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      sx={{ color: 'appDark.icon' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
                placeholder="****"
                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}

                //AUTH
                name='password'
                value={password}
                onChange={onInputChange}
              />
            </FormControl>
          </Grid>

          {/* Esta es la alerta del inicio de sesión con Firebase */}
          <Grid item xs={12} display={!!errorMessage ? '' : 'none'}
          sx={{mt:1}}>
            <Alert severity='error'>{errorMessage}</Alert>
          </Grid>

          <Grid item sx={{ mt: 1 }}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox sx={{
                  color: 'appDark.box',
                  '&.Mui-checked': {
                    color: 'appDark.button', // change filled color when checked
                  }
                }} />
                }
                label="Recuérdame"
                sx={{ color: 'appDark.text' }}
              />
            </FormGroup>
          </Grid>

        </Grid>

        <Grid container direction="column" alignContent="center" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/auth/resetpassword" sx={{ color: 'appDark.link' }}>¿Olvidaste tu contraseña?</Link>
        </Grid>

        <Grid container direction="column" alignContent="center" sx={{ mt: 1 }}>
          <Link component={RouterLink} to="/auth/register" sx={{ color: 'appDark.link' }}>¿Aún no tienes cuenta? Registrate</Link>
        </Grid>

        <Grid container direction="column" spacing={1} alignContent="center" sx={{ mt: 1, mb: 1 }}>

          <Grid item>
            <Button disabled={isAuthenticated} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button' }} onClick={onSubmit}>
              Iniciar Sesión
            </Button>
            {/* <Button disabled={isAuthenticated} type="submit" variant="contained" sx={{ backgroundColor: 'appDark.button' }} onClick={onGoogleSignIn} >
              google
            </Button> */}
          </Grid>
        </Grid>

      </form>
    </AuthLayout>
  )
}