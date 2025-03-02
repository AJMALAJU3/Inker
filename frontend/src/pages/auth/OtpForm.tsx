import { InputOTPForm } from "@/components/user/auth/components/InputOTPForm";
import { SideLayout } from "@/components/user/auth/components/SideLayout";

const OtpForm = () => {
    return (
        <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
            <SideLayout />
            <InputOTPForm />
        </div>
    )
}

export default OtpForm
