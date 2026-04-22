import {useState} from "react";
import {useTranslation} from "react-i18next";

import {useProfileHook} from "../useProfileHook";

import {Alert, Button, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from "@mui/icons-material/Error";


import {TextFieldProps} from "@mui/material";

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

export default function ProfileSection() {
    const {t} = useTranslation();

    const {
        profile,
        profileErrors,
        profileLoading,
        handleChangeProfile,
        handleSaveProfile,
        profileAlert,

        passwordFields,
        passwordErrors,
        passwordLoading,
        handleChangePassword,
        handleSavePassword,
        passwordAlert
    } = useProfileHook();

    const [showNew, setShowNew] = useState(false);
    const [showRepeat, setShowRepeat] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);

    return (
        <section className='flex flex-col gap-4'>
            <div className="flex justify-between items-end h-[32]">
                <Typography variant="h5">Personal Information</Typography>
            </div>

            {/* My information */}
            <div className="bg-white border border-[#e8eeeb] rounded-xl p-6 shadow-sm flex flex-col gap-4">
                <Typography variant="h6">My information</Typography>

                <div className="flex gap-2 flex-wrap ">
                    <Field
                        label={t("account.profile.first_name")}
                        value={profile.firstName}
                        onChange={e => handleChangeProfile('firstName', e.target.value)}
                        error={!!profileErrors.firstName}
                        helperText={profileErrors.firstName}   // no fallback — undefined = no helper = no space
                    />
                    <Field
                        label={t("account.profile.last_name")}
                        value={profile.lastName}
                        onChange={e => handleChangeProfile('lastName', e.target.value)}
                        error={!!profileErrors.lastName}
                        helperText={profileErrors.lastName}
                    />
                </div>
                <div>
                    <Typography sx={{fontWeight: 600}}>Email:</Typography>
                    <Typography>{profile.email}</Typography>
                </div>


                {profileAlert && (
                    <Alert
                        icon={profileAlert.type === 'error' ? <ErrorIcon fontSize="inherit"/> :
                            <CheckIcon fontSize="inherit"/>}
                        severity={profileAlert.type}
                        className="my-3"
                    >
                        {profileAlert.message}
                    </Alert>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center">
                    <Button
                        variant="contained"
                        onClick={handleSaveProfile}
                        disabled={profileLoading}
                        sx={{
                            minWidth: 200,
                            backgroundColor: '#1a3c2e',
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3, py: 1,
                            '&:hover': {backgroundColor: '#14302f'},
                        }}
                    >
                        {t("account.profile.save_details")}
                    </Button>
                </div>
            </div>

            {/* Change password */}
            <div className="bg-white border border-[#e8eeeb] rounded-xl p-6 shadow-sm flex flex-col gap-4">
                <Typography variant="h6">
                    {t("account.profile.change_password")}
                </Typography>

                <div className="flex gap-y-4 gap-x-2 flex-wrap">
                    <Field
                        label={t("account.profile.current_password")}
                        type={showCurrent ? 'text' : 'password'}
                        value={passwordFields.currentPassword}
                        onChange={e => handleChangePassword('currentPassword', e.target.value)}
                        error={!!passwordErrors.currentPassword}
                        helperText={passwordErrors.currentPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowCurrent(p => !p)} edge="end">
                                        {showCurrent ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Field
                        label={t("account.profile.new_password")}
                        type={showNew ? 'text' : 'password'}
                        value={passwordFields.newPassword}
                        onChange={e => handleChangePassword('newPassword', e.target.value)}
                        error={!!passwordErrors.newPassword}
                        helperText={passwordErrors.newPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowNew(p => !p)} edge="end">
                                        {showNew ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Field
                        label={t("account.profile.repeat_password")}
                        type={showRepeat ? 'text' : 'password'}
                        value={passwordFields.repeatPassword}
                        onChange={e => handleChangePassword('repeatPassword', e.target.value)}
                        error={!!passwordErrors.repeatPassword}
                        helperText={passwordErrors.repeatPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowRepeat(p => !p)} edge="end">
                                        {showRepeat ? <VisibilityOff/> : <Visibility/>}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </div>
                {passwordAlert && (
                    <Alert
                        icon={passwordAlert.type === 'error' ? <ErrorIcon fontSize="inherit"/> :
                            <CheckIcon fontSize="inherit"/>}
                        severity={passwordAlert.type}
                        className="my-3"
                    >
                        {passwordAlert.message}
                    </Alert>
                )}
                {/* Responsive row: side-by-side on sm+, stacked on mobile */}
                <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-3">
                    <Button
                        variant="contained"
                        onClick={handleSavePassword}
                        disabled={passwordLoading}
                        sx={{
                            minWidth: 200,
                            backgroundColor: '#1a3c2e',
                            borderRadius: '8px',
                            textTransform: 'none',
                            px: 3, py: 1,
                            '&:hover': {backgroundColor: '#14302f'}
                        }}
                    >
                        {t("account.profile.save_password")}
                    </Button>
                </div>
            </div>
        </section>
    );
}
