'use client';

import {useTranslation} from 'react-i18next';
import {Alert, Button, Divider, TextField, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import {TextFieldProps} from '@mui/material';
import {useContactHook} from './useContactHook';
import {useContact} from "@/src/modules/contact/useContact";

const EMAIL = 'puer-expert@puerhexpert.com';
const TELEGRAM = '@puer-expert';
const BUSINESS_NAME = 'NDEV OÜ';

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

export default function ContactPage() {
    const {t} = useTranslation();
    const {fields, errors, loading, alert, handleChange, handleSubmit, handleReset} = useContact();

    return (
        <div className='h-screen bg-(--white-dim)'>
            <section className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4 pt-14 pb-20">

                {/* Header */}
                <div className="flex justify-between items-end">
                    <div>
                        <Typography variant="overline" className="text-gray-400 tracking-widest">
                            {t('contact.badge')}
                        </Typography>
                        <Typography variant="h5">{t('contact.heading')}</Typography>
                        <Typography variant="body2" className="text-gray-500 mt-1">
                            {t('contact.subheading')}
                        </Typography>
                    </div>
                </div>

                <Divider/>

                {/* Contact info */}
                <div className="flex flex-col gap-3">
                    <Typography variant="h6">{t('contact.info_heading')}</Typography>
                    <div className="flex gap-2 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            <Typography sx={{fontWeight: 600}}>{t('contact.email_label')}:</Typography>
                            <Typography
                                component="a"
                                href={`mailto:${EMAIL}`}
                                sx={{'&:hover': {color: '#1a3c2e'}, transition: 'color 0.15s'}}
                            >
                                {EMAIL}
                            </Typography>
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <Typography sx={{fontWeight: 600}}>{t('contact.telegram_label')}:</Typography>
                            <Typography
                                component="a"
                                href={`https://t.me/${TELEGRAM.replace('@', '')}`}
                                sx={{'&:hover': {color: '#1a3c2e'}, transition: 'color 0.15s'}}
                            >
                                {TELEGRAM}
                            </Typography>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white border border-[#e8eeeb] rounded-xl p-6 shadow-sm flex flex-col gap-4">
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

                <Typography variant="caption" className="text-center text-gray-400">
                    © {new Date().getFullYear()} {BUSINESS_NAME}
                </Typography>
            </section>

        </div>

    );
}