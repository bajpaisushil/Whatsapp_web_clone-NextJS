import { UserButton } from '@clerk/nextjs';
import { BellOff, BellRing, Moon, Sun, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useTheme } from '../ThemeProvider';
import { dark } from '@clerk/themes';
import { getCurrentPushSubscription, registerPushNotifications, unregisterPushNotification } from '@/notifications/pushService';

interface MenuBarProps{
  onUserMenuClick: ()=> void;
}
export default function MenuBar({onUserMenuClick}: MenuBarProps){
  const {theme}=useTheme();
  return (
    <div className='flex items-center justify-between gap-3 border-e border-e-[#DBDDE1] bg-white p-3 dark:bg-[#17191c] dark:border-e-gray-800'>
        <UserButton afterSignOutUrl='/' appearance={{baseTheme: theme==="dark"? dark: undefined}} />
        <div className='flex gap-6'>
          <PushSubscriptionToggleButton />
            <span title='Show Users'>
                <Users className='cursor-pointer' onClick={onUserMenuClick} />
            </span>
            <ThemeToggleButton />
        </div>
    </div>
  )
}

function ThemeToggleButton(){
  const {theme, setTheme}=useTheme();
  if(theme==="dark"){
    return(
      <span title='Enable light theme'>
        <Moon className='cursor-pointer' onClick={()=> setTheme("light")} />
      </span>
    )
  }
  return(
    <span title='Enable dark theme'>
      <Sun className='cursor-pointer' onClick={()=> setTheme("dark")} />
    </span>
  )
}

function PushSubscriptionToggleButton(){
  const [hasActivePushSubscription, setHasActivePushSubscription]=useState<boolean>();
  useEffect(()=>{
    async function getActivePushSubscription(){
      const subscription=await getCurrentPushSubscription();
      setHasActivePushSubscription(!!subscription);
    }
    getActivePushSubscription();
  }, [])
  async function setPushNotificationsEnabled(enabled: boolean){
    try {
      if(enabled){
        await registerPushNotifications();
      } else{
        await unregisterPushNotification();
      }
      setHasActivePushSubscription(enabled);
    } catch (error) {
      console.error(error);
      if(enabled && Notification.permission==='denied'){
        alert("Please enable push notification in your browser settings");
      } else{
        alert("Something went wrong. Please try again");
      }
    }
  }

  if(hasActivePushSubscription===undefined) return null;

  return(
    <div>
      {hasActivePushSubscription? (
        <span title='Disable push notification on this device'>
          <BellOff
          onClick={()=> setPushNotificationsEnabled(false)}
          className='cursor-pointer'
          />
        </span>
      ): (
        <span title='Enable push notification on this device'>
          <BellRing
          onClick={()=> setPushNotificationsEnabled(true)}
          className='cursor-pointer'
          />
        </span>
      )}
    </div>
  )
}