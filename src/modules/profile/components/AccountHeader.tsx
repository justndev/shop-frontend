import {useTranslation} from "react-i18next";
import {Typography} from "@mui/material";
import {User} from "@/src/types";


export default function AccountHeader({user}: {user: User}) {
    const {t} = useTranslation();

    function displayName() {
        if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
        if (user.firstName) return `${user.firstName}`;
        if (user.lastName) return `${user.lastName}`;
        return t('account.user');
    }

    return (
        <header className="flex justify-between items-end h-[32]">
            <div className="flex w-full gap-1 text-nowrap">
                <Typography variant="subtitle1" color="textSecondary">Welcome, </Typography>
                <Typography variant="subtitle1" fontWeight={600}>{displayName()}</Typography>
            </div>
        </header>
    );
}
