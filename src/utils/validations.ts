import {PasswordErrors, PasswordFields, ProfileInfo, ProfileInfoErrors} from "@/src/modules/profile/useProfileHook"
import {RegisterErrors, RegisterFields} from "@/src/modules/auth/useRegisterHook"
import {LoginErrors, LoginFields} from "@/src/modules/auth/useLoginHook";

type T = (key: string) => string;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    name: {max: 50},
    email: {max: 254},
    password: {min: 8, max: 128}
};

function validateName(value: string | undefined, t: T): string | null {
    if (value && value.length > LIMITS.name.max) return t("validation.name_too_long");
    return null;
}

export function validateEmail(value: string | undefined, t: T): string | null {
    if (!value) return t("validation.email_required");
    if (!EMAIL_REGEX.test(value)) return t("validation.email_invalid");
    if (value.length > LIMITS.email.max) return t("validation.email_too_long");
    return null;
}

export function validateNewPassword(value: string | undefined, t: T): string | null {
    if (!value) return t("validation.password_required");
    if (value.length < LIMITS.password.min) return t("validation.password_too_short");
    if (value.length > LIMITS.password.max) return t("validation.password_too_long");
    return null;
}

function validateRepeatPassword(password: string, repeat: string | undefined, t: T): string | null {
    if (!repeat) return t("validation.repeat_password_required");
    if (password !== repeat) return t("validation.passwords_do_not_match");
    return null;
}


export function validateProfileInfo(info: ProfileInfo, t: T): ProfileInfoErrors {
    return {
        firstName: validateName(info.firstName, t),
        lastName: validateName(info.lastName, t)
    };
}

export function validatePassword(fields: PasswordFields, t: T): PasswordErrors {
    return {
        currentPassword: !fields.currentPassword ? t("validation.current_password_required") : null,
        newPassword: validateNewPassword(fields.newPassword, t),
        repeatPassword: validateRepeatPassword(fields.newPassword, fields.repeatPassword, t)
    };
}

export function validateRegister(fields: RegisterFields, t: T): RegisterErrors {
    return {
        firstName: validateName(fields.firstName, t),
        lastName: validateName(fields.lastName, t),
        email: validateEmail(fields.email, t),
        password: validateNewPassword(fields.password, t)
    };
}

export function validateLogin(fields: LoginFields, t: (key: string) => string): LoginErrors {
    return {
        email: validateEmail(fields.email, t),
        password: validateNewPassword(fields.password, t)
    };
}
