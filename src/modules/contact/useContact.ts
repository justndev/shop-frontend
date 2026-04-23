'use client';

import {useState} from 'react';
import {useTranslation} from 'react-i18next';

export interface ContactFields {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactErrors {
    name: string | null;
    email: string | null;
    subject: string | null;
    message: string | null;
}

export interface ContactAlert {
    type: 'success' | 'error';
    message: string;
}

function validateContact(fields: ContactFields, t: (k: string) => string): ContactErrors {
    const errs: ContactErrors = {name: null, email: null, subject: null, message: null};
    if (!fields.name.trim()) errs.name = t('contact.required');
    if (!fields.email.trim()) errs.email = t('contact.required');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) errs.email = t('contact.invalid_email');
    if (!fields.subject.trim()) errs.subject = t('contact.required');
    if (!fields.message.trim()) errs.message = t('contact.required');
    return errs;
}

function hasErrors(e: ContactErrors) {
    return Object.values(e).some(v => v !== null);
}

const EMPTY_FIELDS: ContactFields = {name: '', email: '', subject: '', message: ''};
const EMPTY_ERRORS: ContactErrors = {name: null, email: null, subject: null, message: null};

export function useContact() {
    const {t} = useTranslation();

    const [fields, setFields] = useState<ContactFields>(EMPTY_FIELDS);
    const [errors, setErrors] = useState<ContactErrors>(EMPTY_ERRORS);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<ContactAlert | null>(null);

    function handleChange(field: keyof ContactFields, value: string) {
        setErrors(prev => ({...prev, [field]: null}));
        setFields(prev => ({...prev, [field]: value}));
    }

    async function handleSubmit() {
        setAlert(null);
        const errs = validateContact(fields, t);
        setErrors(errs);
        if (hasErrors(errs)) return;

        setLoading(true);
        try {
            // Replace with real API call, e.g. await contactApi.send(fields);
            await new Promise(res => setTimeout(res, 1200));
            setFields(EMPTY_FIELDS);
            setAlert({type: 'success', message: t('contact.success_body')});
        } catch {
            setAlert({type: 'error', message: t('contact.error_body')});
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setFields(EMPTY_FIELDS);
        setErrors(EMPTY_ERRORS);
        setAlert(null);
    }

    return {fields, errors, loading, alert, handleChange, handleSubmit, handleReset};
}