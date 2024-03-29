import { useState, useEffect, useMemo } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {

    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidations] = useState({});
    //Disclaimer: formValidationS con s viene de Register page y es un objeto, la que no 
    //tiene s es el estado, tiene todas las propiedades del objeto 
    

    //Cada vez que cambie el valor de alguna de las variables se dispara esta función
    //para validar el nuevo valor
    useEffect(() => {
        createValidators();
    },  [formState])

    //Validar todo el objeto
    const isFormValid = useMemo(() => {
        //Todas deben de regresar null en el objeto para que el form sea válido
        for(const formValue of Object.keys( formValidation)){
            if(formValidation[formValue] !== null) return false;
        }

        return true;
    }, [formValidation])

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    //función que se dispara con useEffect
    const createValidators = () => {
        const formCheckedValues  = {};

        for(const formField of Object.keys(formValidations)){
            const [fn, errorMessage = 'Este campo es requerido'] = formValidations[formField];
            // console.log(formField)
            // console.log(errorMessage)
            formCheckedValues[`${formField}Valid`] = fn( formState[formField]) ? null : errorMessage;
            // if(`${formField}Valid` == 'campusValid') console.log(formField.valueOf)

            // si  pasa la val le ponemos un null si no mandamos un mensaje de error
            
        }

        setFormValidations(formCheckedValues);
        console.log(formCheckedValues);
    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid
    }
}