// src/modules/contanct/useContactForm.ts
'use client';

import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import contactApi, {ContactMessageData} from "@/src/modules/contact/contactApi";
import axios, {AxiosError} from "axios";
import {ContactErrors, hasErrors, validateContactMessage} from "@/src/utils/validations";

export interface ContactAlert {
    type: 'success' | 'error';
    message: string;
}

const EMPTY_FIELDS: ContactMessageData = {name: '', email: '', subject: '', message: ''};
const EMPTY_ERRORS: ContactErrors = {name: null, email: null, subject: null, message: null};

export function useContactForm() {
    const {t} = useTranslation();

    const [fields, setFields] = useState<ContactMessageData>(EMPTY_FIELDS);
    const [errors, setErrors] = useState<ContactErrors>(EMPTY_ERRORS);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<ContactAlert | null>(null);

    /**
     * @important
     */
    async function handleSubmit() {
        setAlert(null);
        const errs = validateContactMessage(fields, t);
        setErrors(errs);
        if (hasErrors(errs)) return;

        setLoading(true);
        try {
            const responseData = await contactApi.sendContactMessage(fields);
            console.log(responseData);
            setFields(EMPTY_FIELDS);
            setAlert({type: 'success', message: t(`backend.${responseData.details}`)});
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const axiosError = err as AxiosError<any>;
                const backendMessage = axiosError.response?.data?.details;

                if (backendMessage) {
                    setAlert({type: 'error', message: t(`backend.${backendMessage}`)});
                    return;
                }
            }

            setAlert({type: 'error', message: t('general.something_went_wrong')});
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setFields(EMPTY_FIELDS);
        setErrors(EMPTY_ERRORS);
        setAlert(null);
    }

    function handleChange(field: keyof ContactMessageData, value: string) {
        setErrors(prev => ({...prev, [field]: null}));
        setFields(prev => ({...prev, [field]: value}));
    }

    return {fields, errors, loading, alert, handleChange, handleSubmit, handleReset};
}