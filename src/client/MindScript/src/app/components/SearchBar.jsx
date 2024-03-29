import { PersonSearch, Search } from '@mui/icons-material'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React from 'react'

export const SearchBar = ({setSearchQuery, name}) => {
  return (
    <FormControl size='small' fullWidth sx={{ backgroundColor: 'appDark.bgBox', borderRadius:5 }}>
        <InputLabel sx={{
        color: 'appDark.text',
        '&.Mui-focused': {
            color: 'appDark.text' //change label color
        }
        }}>{name}</InputLabel>
        <OutlinedInput
        type="text"
        endAdornment={
            <InputAdornment position="end">
                <IconButton
                // onClick={handleClickShowPassword}
                // onMouseDown={handleMouseDownPassword}
                edge="end"
                sx={{ color: 'appDark.icon' }}
                >
                {name == 'Nombre' ? <PersonSearch /> : <Search />}
                
                </IconButton>
            </InputAdornment>
            }
        label="Nombre"
        placeholder="A00000000@tec.mx"
        sx={{
            color: 'appDark.text',
            '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'appDark.box', //change border color on hover
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'appDark.box', //change border color when focused
            },
            borderRadius: 5,
            border: 1
        }}

        />
    </FormControl>
  )
}
