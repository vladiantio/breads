import { useForm } from "react-hook-form"
import { useAuth } from "@/lib/atp/hooks/use-auth"
import { Button } from "@/ui/button"
import { Input } from "@/ui/input"
import { InputAddOns, InputAddOnLabel } from "@/ui/input-add-ons"
import { AtSignIcon } from "lucide-react"
import { useTranslation } from "react-i18next"

type LoginFormValues = {
  identifier: string
}

export function Login() {
  const { login, isLoading, error } = useAuth()
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>()

  const onSubmit = (data: LoginFormValues) => {
    login(data.identifier)
  }

  return (
    <div className="max-w-[45ch] min-h-dvh mx-auto p-4 place-content-center">
      <p className="font-bold text-center mb-4">{t("auth.signInTitle")}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="grid gap-3">
          <div>
            <InputAddOns>
              <InputAddOnLabel>
                <AtSignIcon size={16} aria-hidden="true" />
              </InputAddOnLabel>
              <Input
                className="h-14"
                placeholder={t("auth.usernameLabel")}
                autoFocus
                spellCheck="false"
                {...register("identifier", { required: t("auth.usernameRequired") })}
              />
            </InputAddOns>
            {errors.identifier && <p className="mt-1 text-sm text-destructive">{errors.identifier.message}</p>}
          </div>

          {error && <p className="text-destructive text-sm">{error.message}</p>}

          <Button type="submit" size="lg" className="w-full h-14 mt-3">
            {t("auth.next")}
          </Button>
        </fieldset>
      </form>
    </div>
  )
}
