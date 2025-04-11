import { FC, useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useProfile } from '@/contexts/ProfileContext'

const EmailInput:FC= () => {
   const { profile } = useProfile()
    const [ email, setEmail] = useState('')
    useEffect(() => {
      setEmail(profile.email)
    },[profile])
  return (
    <div className="grid w-full items-center gap-1.5 my-10 relative">
      <Label className='absolute right-3 top-0 font-medium'>change</Label>

      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" value={email} />
    </div>
  )
}

export default EmailInput