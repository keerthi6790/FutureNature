import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { isAdminUser } from "@/utils/authUtils";
import toast from "react-hot-toast";

interface AdminGuardProps {
    children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = () => {
            const token = Cookies.get("token");
            if (!token || !isAdminUser(token)) {
                toast.error("Unauthorized access. Admin only.");
                router.push("/");
            } else {
                setAuthorized(true);
            }
        };

        checkAuth();
    }, [router]);

    if (!authorized) {
        return null; // Or a smaller sub-loader if preferred
    }

    return <>{children}</>;
}
