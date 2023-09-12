"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import {StreamChat} from  'stream-chat';
import {Channel, ChannelHeader, ChannelList, Chat, LoadingIndicator, MessageInput, MessageList, Streami18n, Thread, Window} from 'stream-chat-react';
import useInitializeChatClient from "./useInitializeChatClient";
import MenuBar from "./MenuBar";
import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";
import { useCallback, useEffect, useState } from "react";
import {Menu, X} from 'lucide-react';
import useWindowSize from "@/hooks/useWindowSize";
import { mdBreakpoint } from "@/utils/tailwind";
import { useTheme } from "../ThemeProvider";
import { registerServiceWorker } from "@/utils/serviceWorker";

const i18instance=new Streami18n({language: "en"});

export default function ChatPage(){
    const chatClient=useInitializeChatClient();
    const {theme}=useTheme();
    const {user}=useUser();
    const windowSize=useWindowSize();
    const [chatSidebarOpen, setChatSidebarOpen]=useState(false);
    const widowSize=useWindowSize();
    const isLargeScreen=widowSize.width>=mdBreakpoint;

    useEffect(()=>{
        if(widowSize.width>=mdBreakpoint) setChatSidebarOpen(false);
    }, [widowSize.width])
    const handleSidebarOnClose=useCallback(()=> {
        setChatSidebarOpen(false);
    }, [])
    useEffect(()=>{
        async function setUpServiceWorker(){
            try {
                await registerServiceWorker();
            } catch (error) {
                console.error(error);
            }
        }
        setUpServiceWorker();
    }, [])

    if(!chatClient || !user){
        return(
            <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-black">
                <LoadingIndicator size={40} />
            </div>
        )
    }
    return(
        <div className="h-screen bg-gray-100 text-black dark:bg-black dark:text-white xl:px-20 xl:py-8">
            <div className="max-w-[1600px] min-w-[350px] h-full shadow-sm m-auto flex flex-col">
            <Chat i18nInstance={i18instance} client={chatClient} theme={theme==="dark"? "str-chat__theme-dark": "str-chat__theme-light"}>
                <div className="flex justify-center border-b border-b-[#DBDDE1] p-3 md:hidden">
                    <button onClick={()=> setChatSidebarOpen(!chatSidebarOpen)}>
                        {!chatSidebarOpen ? (
                            <span className="flex items-center gap-1"><Menu /> Menu</span>
                        ): (
                            <X />
                        )}
                    </button>
                </div>
                <div className="flex flex-row h-full overflow-y-auto">
                    <ChatSidebar show={isLargeScreen || chatSidebarOpen} user={user} onClose={handleSidebarOnClose} />
                    <ChatChannel show={isLargeScreen || !chatSidebarOpen} hideChannelOnThread={!isLargeScreen} />
                </div>
            </Chat>
            </div>
        </div>
    )
}
