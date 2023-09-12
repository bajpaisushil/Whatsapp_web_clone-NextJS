import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center">
        <SignIn appearance={{variables: {colorPrimary: "#3b82f6"}}} />
    </div>
  )
}
