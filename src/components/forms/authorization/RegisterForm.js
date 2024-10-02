import FormDefault from "./FormDefault";
import {useEffect, useRef} from "react";
import {FormTextInput, NewFormTextInput} from "../../inputs/FormTextInput/FormTextInput";
import {Button} from "../../controls/Button/Button";
import {Link, OnestNormalSmall} from "../../styled/TextComponents";
import CheckBoxMain from "../../controls/check-boxes/CheckBoxMain";
import {ButtonDefault} from "../../controls/Button/ButtonDefault";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { color_red_default, color_white } from "../../../constants/colors";
import axios from "axios";
import Config from "../../../Config";
import {useNavigate} from "react-router-dom";
import {FormPhoneInput} from "../../inputs/FormTextInput/FormPhoneInput";



export const FormCheckBox = ({name, control}) => {

    const {watch} = useFormContext();

    return (
        <Controller
                    name={name}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => 
                        <>
                            <label htmlFor="test" style={{
                                boxShadow: "1px 0 4px 0 rgba(178, 178, 178, 0.29)",
                                borderRadius: 5,
                                width: 25,
                                height: 25,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                {watch(name)?
                                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5 0.75L3.625 7.625L0.5 4.5" stroke="#E12F2F" strokeLinecap="round"
                                            strokeLinejoin="round"/>
                                    </svg> 
                                    : null
                                }
                            </label>
                            <input style={{
                                position: "absolute",
                                zIndex: -1,
                                opacity: 0,
                            }} id="test" type="checkbox" {...field}/>
                        </>
                    }
        />
    )
}


const RegisterForm = () => {
    const formRef = useRef(null);
    const navigate = useNavigate();
    const phonePattern = "(\\s*)?(\\+)?([- _():=+]?\\d[- _():=+]?){10,14}(\\s*)?";

    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: {errors}
    } = useForm()

    const loginSubmit = (data) => {
        let email = data["email"]
        let full_name = data["name"]
        let phone_number = data["phone"]
        let password = data["password"]
        let passwordRepeat = data["passwordRepeat"]
        let acceptForRules = data["acceptForRules"]

        let backendAddr = window.location.origin + "/api/auth/user"

        if([null, false, undefined].includes(acceptForRules)){
            alert("Необходимо согласие на обработку персональных данных")
            return
        }

        if(password !== passwordRepeat){
            alert("Пароли не совпадают")
            return
        }
        axios.put(backendAddr, {email, full_name, phone_number, password}, {withCredentials: true})
            .then(response=>{
                console.debug("register response", response.data)
                console.debug("register response data", response.data)
                if(response.status === 201){
                    navigate("/service/personal")
                } else {
                    alert("Непредвиденный ответ от сервера")
                }
            }).catch(err=>{
                if(err.status === 409){
                    alert("Пользователь с таким email уже зарегистрирован")
                } else {
                    alert("Непредвиденная ошибка при получении данных от сервера")
                    console.error(err)
                }
        })
    }

    

    return(
        <FormProvider {...{watch}}>
            <FormDefault
            onSubmit={handleSubmit(data=>loginSubmit(data))}
            title={"Регистрация"}
            formWidth={410}
            >
                <NewFormTextInput placeholder={"example@mail.ru"} type={"email"} title={"Email"}  register={register("email")} required={true}/>
                <NewFormTextInput placeholder={"Иван Петров"} type={"text"} title={"Имя и фамилия"} register={register("name")} required={true}/>
                <FormPhoneInput placeholder={"+7 (888) 888 88 88"} type={"tel"} title={"Номер телефона"} register={register("phone")} required={true}/>
                <NewFormTextInput placeholder={"Введите пароль"} type={"password"} title={"Пароль"} register={register("password")} required={true}/>
                <NewFormTextInput placeholder={"Введите пароль"} type={"password"} title={"Повторите пароль"} register={register("passwordRepeat")} required={true}/>

                <Button backgroundColor={color_red_default} color={color_white} outline={false} width={350} height={63} active={true} type={"submit"} >Зарегистрироваться</Button>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    gap: 5,
                    justifyContent: "flex-end",
                    marginTop: -20
                }}>
                    <FormCheckBox name={"acceptForRules"} control={control}/>
                    <OnestNormalSmall>
                        Я даю согласие
                        <Link href={"/"}>на обработку персональных данных</Link>
                    </OnestNormalSmall>
                </div>

        </FormDefault>
        </FormProvider>
    )
}

export default RegisterForm