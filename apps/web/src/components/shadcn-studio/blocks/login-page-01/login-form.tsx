'use client'

import { useState } from 'react'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form className='space-y-4' onSubmit={e => e.preventDefault()}>
      {/* Email */}
      <div className='space-y-2'>
        <Label htmlFor='userEmail' className='text-sm font-normal'>
          Email address*
        </Label>
        <Input 
          type='email' 
          id='userEmail' 
          placeholder='Enter your email address'
          className='h-12'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {/* Password */}
      <div className='w-full space-y-2'>
        <Label htmlFor='password' className='text-sm font-normal'>
          Password*
        </Label>
        <div className='relative'>
          <Input 
            id='password' 
            type={isVisible ? 'text' : 'password'} 
            placeholder='••••••••••••••••' 
            className='h-12 pr-10'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type='button'
            variant='ghost'
            size='icon'
            onClick={() => setIsVisible(prevState => !prevState)}
            className='text-muted-foreground absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent'
          >
            {isVisible ? <EyeOffIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
            <span className='sr-only'>{isVisible ? 'Hide password' : 'Show password'}</span>
          </Button>
        </div>
      </div>
      {/* Remember Me and Forgot Password */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Checkbox id='rememberMe' />
          <Label htmlFor='rememberMe' className='text-sm font-normal cursor-pointer'>
            Remember Me
          </Label>
        </div>
        <a href='/forgot-password' className='text-sm hover:underline'>
          Forgot Password?
        </a>
      </div>
      <Button className='w-full h-12 text-base font-medium' type='submit'>
        Sign in to BookMe
      </Button>
    </form>
  )
}

export default LoginForm

