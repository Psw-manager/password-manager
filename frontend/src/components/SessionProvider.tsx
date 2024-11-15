"use client";
import React, { ReactNode } from "react";
import { SessionProvider as NextSessionProvider} from "next-auth/react" ;

interface Props {
    children: ReactNode;
}

export function SessionProvider(props: Props){
    return (
        <NextSessionProvider>
            {props.children}
        </NextSessionProvider>
    );
}