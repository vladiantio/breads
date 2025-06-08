import { Controller, useForm } from 'react-hook-form';
import { AtpCredentials } from '@/lib/atp/store';
import { useAuth } from '@/lib/atp/hooks/use-auth';
import { Button } from '@/ui/button';
import { Input, InputGroup, InputGroupText } from '@/ui/input';
import { AtSignIcon, LockKeyholeIcon } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { Trans } from '@lingui/react/macro';
import { t } from '@lingui/core/macro';

const otpPasteTransformer = (pasted: string) => pasted.replaceAll('-', '');

export function Login() {
  const { login, isLoading, error } = useAuth();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AtpCredentials>();

  const onSubmit = (data: AtpCredentials) => {
    const { authFactorToken: token } = data;
    login({
      ...data,
      authFactorToken: token ? token.slice(0, 5) + '-' + token.slice(5) : undefined
    });
  };

  return (
    <div className="max-w-[45ch] min-h-dvh mx-auto p-4 place-content-center">
      <p className="font-bold text-center mb-4"><Trans>Sign in with your Bluesky account</Trans></p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="grid gap-3">
          <div>
            <InputGroup>
              <InputGroupText>
                <AtSignIcon size={16} aria-hidden="true" />
              </InputGroupText>
              <Input
                className="h-14"
                placeholder={t`Username or email address`}
                autoFocus
                spellCheck="false"
                {...register('handle', { required: t`Username or email address is required` })}
              />
            </InputGroup>
            {errors.handle && <p className="mt-1 text-sm text-destructive">{errors.handle.message}</p>}
          </div>

          <div>
            <InputGroup>
              <InputGroupText>
                <LockKeyholeIcon size={16} aria-hidden="true" />
              </InputGroupText>
              <Input
                className="h-14"
                placeholder={t`Password`}
                type="password"
                {...register('password', { required: t`Password is required` })}
              />
            </InputGroup>
            {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
          </div>

          {error &&
            (error?.message === t`A sign in code has been sent to your email address` ||
            error?.message === t`Token is invalid` ? (
              <div>
                <label className="mb-1 font-semibold block" htmlFor="authFactorToken"><Trans>Two-factor confirmation</Trans></label>
                <Controller
                  name="authFactorToken"
                  control={control}
                  rules={{ required: t`Two-factor token is required` }}
                  render={({ field }) => (
                    <InputOTP
                      maxLength={10}
                      inputMode="text"
                      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                      pasteTransformer={otpPasteTransformer}
                      {...field}
                    >
                      <InputOTPGroup className="basis-full [&>*]:h-14 [&>*]:w-auto [&>*]:basis-full">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup className="basis-full [&>*]:h-14 [&>*]:w-auto [&>*]:basis-full">
                        <InputOTPSlot index={5} />
                        <InputOTPSlot index={6} />
                        <InputOTPSlot index={7} />
                        <InputOTPSlot index={8} />
                        <InputOTPSlot index={9} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
                <p className="mt-1 text-sm text-muted-foreground"><Trans>Check your email for a sign in code and enter it here.</Trans></p>
                {errors.authFactorToken && <p className="mt-1 text-sm text-destructive">{errors.authFactorToken?.message}</p>}
              </div>
            ) : (
              <p className="text-destructive text-sm">{error.message}</p>
            ))}

          <Button type="submit" size="lg" className="w-full h-14 mt-3">
            <Trans>Next</Trans>
          </Button>
        </fieldset>
      </form>
    </div>
  )
}
