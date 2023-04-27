import React from 'react'
import { useMemo, useState } from 'react';
import { Link as RouterLink } from "react-router-dom"
import { Alert, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, Link, OutlinedInput, Typography } from "@mui/material"
import { FormatUnderlined, Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from '../../hooks/useForm';
import { AuthLayout } from "../layout/AuthLayout"
import { useDispatch, useSelector } from 'react-redux';
import { startCreatingUserWithEmailPassword } from '../../store/auth';

export const RegisterPage = () => {

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  
  const formData = {
    displayName: '',
    id: '',
    email: '',
    campus: '',
    password: '',
    confirmation: '',

  }

  const formValidations = { //personalizado del tutorial, hay herramientas externas para hacer validaciones
    //son arreglos, 1 param es el valor que ingresa el user, el segundo es el mensaje de error por si no se cumple la validacion, se las vamos a pasar a la función de useForm
    //si una de estas no se cumple el formulario no va a ser válido
    id: [(value) => value.includes('A0') || value.includes('L0'), 'Ingresa tu matrícula o nómina'], //deben ser los mismos nombres del objeto del formulario
    email: [(value) => value.includes('@tec.mx'), 'Debes entrar con tu correo institucional'], //deben ser los mismos nombres del objeto del formulario
    password: [(value) => value.length >= 6, 'El password debe de tener al menos 6 caracteres'],
    confirmation: [(value) => value === password, 'Tu confirmación es diferente a tu contraseña'],
    displayName: [(value) => value.length >= 1, 'Tu nombre es requerido'],
    campus: [(value) => value === value.toUpperCase(), 'Ingresa las 3 primeras letras de tu campus en mayúscula'],

  }

  const dispatch = useDispatch();

  const [formSubmitted, setFormSubmitted] = useState(false);


  const { status, errorMessage } = useSelector(state => state.auth);
  //Para que no puedan dar submit mientras esta en estado checking se bloquean los botones
  const isCheckingAuthentication = useMemo(() => status === 'checking', [status]);

  const { displayName, id, email, campus, password, confirmation, onInputChange, formState,
    isFormValid, campusValid, emailValid, passwordValid, displayNameValid, idValid, confirmationValid } = useForm(formData, formValidations);

  //Validación bien: null mal:mensaje de error del arreglo
  // console.log(displayNameValid);
  // console.log(emailValid);

  const onSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    // console.log(formState);
    if (!isFormValid) return;
    dispatch(startCreatingUserWithEmailPassword(formState));
  }


  return (
    <AuthLayout title="Registro">
      {/* <h1>FormValid: {isFormValid ? 'Valido': 'Nel'}</h1> */}
      {/* <h1>idvalid: {idValid ? 'Valido': 'No válido'}</h1> */}
      <form onSubmit={onSubmit}>
        <Grid container justifyContent="center">
          {/* Name*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }}>
              <InputLabel
                required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Nombre</InputLabel>
              <OutlinedInput
                required
                type="text"
                label="Nombre"
                placeholder="Dan Perez"
                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}
                //Validation
                name="displayName"
                value={displayName}
                onChange={onInputChange}
                error={!!displayNameValid && formSubmitted}

              />
            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{displayNameValid}</FormHelperText>}
            </Grid>
          </Grid>

          {/* ID*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }}>
              <InputLabel
                // required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Matrícula/Nómina</InputLabel>
              <OutlinedInput
                required
                type="text"
                label="Matrícula/Nómina"
                placeholder="A000000000/L00000000"


                //Validation
                name="id"
                value={id} //A0XXXX
                onChange={onInputChange}
                error={!!idValid && formSubmitted}


                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}
              />

            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{idValid}</FormHelperText>}
            </Grid>
          </Grid>

          {/* Correo*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }}>
              <InputLabel
                required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Correo</InputLabel>
              <OutlinedInput
                required
                type="email"
                label="Correo"
                placeholder="A000000000@tec.mx"
                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}

                //Validation
                name="email"
                value={email}
                onChange={onInputChange}
                error={!!emailValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{emailValid}</FormHelperText>}
            </Grid>
          </Grid>

          {/* Campus*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }}>
              <InputLabel
                required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Campus</InputLabel>
              <OutlinedInput
                required
                type="text"
                label="Campus"
                placeholder="Puebla"
                sx={{
                  color: 'appDark.text',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color on hover
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'appDark.box', //change border color when focused
                  },
                }}

                //Validation
                name="campus"
                value={campus}
                onChange={onInputChange}
                error={!!campusValid && formSubmitted}
              />
            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{campusValid}</FormHelperText>}
            </Grid>
          </Grid>

          {/* Contraseña*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }} >
              <InputLabel
                required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Contraseña</InputLabel>
              <OutlinedInput
                required
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
                //Validation
                name="password"
                value={password}
                onChange={onInputChange}
                error={!!passwordValid && formSubmitted}

              />
            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{passwordValid}</FormHelperText>}
            </Grid>
          </Grid>

          {/* Confirmar Contraseña*/}
          <Grid item xs={6} md={6} xl={12} sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius: 1 }} >
              <InputLabel
                required
                sx={{
                  color: 'appDark.text',
                  '&.Mui-focused': {
                    color: 'appDark.text' //change label color
                  }
                }}>Confirmar contraseña</InputLabel>
              <OutlinedInput
                required
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
                label="Confirmar contraseña"
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
                //Validation
                name="confirmation"
                value={confirmation}
                onChange={onInputChange}
                error={!!confirmationValid && formSubmitted}

              />
            </FormControl>
            <Grid item sx={{ bgcolor: 'transparent', ml: 1 }}>
              {formSubmitted && <FormHelperText error>{confirmationValid}</FormHelperText>}
            </Grid>
          </Grid>

          <Grid container direction="row" justifyContent="end" sx={{ mt: 1 }}>
            <Typography sx={{ color: 'appDark.text', mr: 1 }}>¿Ya tienes cuenta? </Typography>
            <Link component={RouterLink} to="/auth/login" sx={{ color: 'appDark.link', textDecoration: 'underline' }}>Ingresar</Link>
          </Grid>

          <Grid item xs={12}
            // la doble negación lo conbierte en un valor bool
            display={!!errorMessage ? '' : 'none'}
          >
            <Alert severity='error'>{errorMessage}</Alert>
          </Grid>

          <Grid container direction="column" alignContent="center" sx={{ mt: 1 }}>
            <Grid item>
              <Button disabled={isCheckingAuthentication} type='submit' variant="contained" sx={{ backgroundColor: 'appDark.button' }}>
                Regístrate
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>

    </AuthLayout>
  )
}