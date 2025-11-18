import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/logo'
import { ThemeToggle } from '@/components/theme-toggle'
import LoginForm from '@/components/shadcn-studio/blocks/login-page-01/login-form'

const Login = () => {
  return (
    <div className='min-h-screen bg-background grid lg:grid-cols-2'>
      {/* Theme Toggle */}
      <div className='fixed right-6 top-6 z-50'>
        <ThemeToggle />
      </div>

      {/* Left Column - Login Form */}
      <div className='flex items-center justify-center p-8 lg:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* Logo */}
          <Logo size='xs' showText={true} href='/' />
          
          {/* Welcome Text */}
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold tracking-tight'>Welcome Back</h1>
            <p className='text-muted-foreground'>Welcome back! Select method to login:</p>
          </div>

          {/* Social Login Buttons */}
          <div className='flex gap-4'>
            <Button variant='outline' className='flex-1 h-12' type='button'>
              Login with Google
            </Button>
            <Button variant='outline' className='flex-1 h-12' type='button'>
              Login with Facebook
            </Button>
          </div>

          {/* Separator */}
          <div className='flex items-center gap-4'>
            <Separator className='flex-1' />
            <span className='text-sm text-muted-foreground'>Or continue with Email</span>
            <Separator className='flex-1' />
          </div>

          {/* Login Form */}
          <LoginForm />

          {/* Sign up link */}
          <p className='text-center text-sm text-muted-foreground'>
            New on our platform?{' '}
            <a href='/onboarding' className='text-foreground hover:underline font-medium'>
              Create an account
            </a>
          </p>
        </div>
      </div>

      {/* Right Column - Notification Cards */}
      <div className='hidden lg:flex items-center justify-center p-12 bg-muted/30 relative overflow-hidden'>
        <div className='w-full max-w-2xl relative z-10'>
          {/* Pink Card Container with White Card Inside */}
          <div className='rounded-3xl bg-primary p-12 shadow-lg space-y-8'>
            <div>
              <h2 className='text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight'>
                Welcome back! Please sign in to your BookMe account
              </h2>
              <p className='mt-6 text-lg text-primary-foreground/90'>
                Thank you for registering! Please check your inbox and click the verification link to activate your account.
              </p>
            </div>

            {/* White Card Inside Pink Card */}
            <div className='rounded-3xl bg-card border shadow-lg p-8 sm:p-12 relative'>
              {/* Logo Badge - positioned at top right, floating outside */}
              <div className='absolute -top-4 -right-4 bg-background rounded-2xl p-3 shadow-lg border-4 border-primary'>
                <Logo size='xs' showText={false} />
              </div>
              
              <div className='pr-12'>
                <h3 className='text-2xl sm:text-3xl font-bold mb-4'>
                  Please enter your login details
                </h3>
                <p className='text-muted-foreground text-base sm:text-lg mb-8'>
                  Stay connected with BookMe. Subscribe now for the latest updates and news.
                </p>
                
                {/* Social Proof */}
                <div className='flex items-center gap-2'>
                  <div className='flex -space-x-2'>
                    <div className='w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-semibold'>
                      👤
                    </div>
                    <div className='w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-semibold'>
                      👤
                    </div>
                    <div className='w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-semibold'>
                      👤
                    </div>
                  </div>
                  <span className='text-sm text-muted-foreground font-medium'>+3695</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

