// src/modules/contact/ContactForm.tsx  #smart_component
'use client'

import {useContactForm} from "@/src/modules/contact/useContactForm";

import {Alert, Button, TextField, TextFieldProps, Typography} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import {useTranslation} from "react-i18next";

export default function ContactForm() {
    const {t} = useTranslation();
    const {fields, errors, loading, alert, handleChange, handleSubmit, handleReset} = useContactForm();

    return (
        <div className="bg-white border border-[#e8eeeb] rounded-xl p-6 shadow-sm flex flex-col gap-4 mt-2">
            <Typography variant="h6">{t('contact.form_heading')}</Typography>

            <div className="flex gap-2 flex-wrap">
                <Field
                    label={t('contact.field_name')}
                    value={fields.name}
                    onChange={e => handleChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name ?? undefined}
                />
                <Field
                    label={t('contact.field_email')}
                    value={fields.email}
                    onChange={e => handleChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email ?? undefined}
                />
            </div>

            <Field
                label={t('contact.field_subject')}
                value={fields.subject}
                onChange={e => handleChange('subject', e.target.value)}
                error={!!errors.subject}
                helperText={errors.subject ?? undefined}
            />

            <Field
                label={t('contact.field_message')}
                multiline
                rows={5}
                value={fields.message}
                onChange={e => handleChange('message', e.target.value)}
                error={!!errors.message}
                helperText={errors.message ?? undefined}
            />

            {alert && (
                <Alert
                    icon={alert.type === 'error' ? <ErrorIcon fontSize="inherit"/> :
                        <CheckIcon fontSize="inherit"/>}
                    severity={alert.type}
                    className="my-1"
                    onClose={alert.type === 'success' ? handleReset : undefined}
                >
                    {alert.message}
                </Alert>
            )}

            <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center">
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                        minWidth: 200,
                        backgroundColor: '#1a3c2e',
                        borderRadius: '8px',
                        px: 3, py: 1,
                        boxShadow: 'none',
                        '&:hover': {backgroundColor: '#14302f', boxShadow: 'none'},
                        '&:disabled': {backgroundColor: '#1a3c2e80'},
                    }}
                >
                    {loading ? '…' : t('contact.submit')}
                </Button>
            </div>
        </div>

    )
}

function Field(props: TextFieldProps) {
    return (
        <TextField
            {...props}
            FormHelperTextProps={{
                ...props.FormHelperTextProps,
                sx: {margin: 0, paddingTop: '4px', ...props.FormHelperTextProps?.sx},
            }}
            sx={{flex: 1, minWidth: 200, ...props.sx}}
        />
    );
}
