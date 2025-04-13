import { Button } from "@/components/ui/button"
import { Input, InputGroup, InputGroupText } from "@/components/ui/input"
import { AtSignIcon, LockKeyholeIcon } from "lucide-react"

export function Login() {
  return (
    <div className="max-w-[40ch] min-h-dvh mx-auto p-4 place-content-center">
      <p className="font-bold text-center mb-4">Sign in with your Bluesky account</p>
      <form>
        <fieldset className="grid gap-3">
          <InputGroup>
            <InputGroupText>
              <AtSignIcon size={16} aria-hidden="true" />
            </InputGroupText>
            <Input
              className="h-14"
              placeholder="Username or email address"
              autoFocus
            />
          </InputGroup>
          <InputGroup>
            <InputGroupText>
              <LockKeyholeIcon size={16} aria-hidden="true" />
            </InputGroupText>
            <Input
              className="h-14"
              placeholder="Password"
              type="password"
            />
          </InputGroup>
          <Button type="submit" size="lg" className="w-full h-14">
            Next
          </Button>
        </fieldset>
      </form>
    </div>
  )
}
