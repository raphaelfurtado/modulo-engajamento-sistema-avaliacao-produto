"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { signOutRequest } from "@/features/auth/sign-in/api";
import type { SessionUser } from "@/server/auth/session";
import { UserAvatar } from "./user-avatar";

type AccountMenuProps = {
  user: Pick<SessionUser, "firstName" | "lastName" | "email" | "avatarUrl">;
};

/**
 * Conta no cabeçalho. No mobile só o avatar aparece e o menu mostra nome e
 * e-mail; do `sm` para cima, nome e e-mail ficam ao lado do avatar.
 */
export function AccountMenu({ user }: AccountMenuProps) {
  const router = useRouter();
  const [isSigningOut, startSignOut] = useTransition();
  const fullName = `${user.firstName} ${user.lastName}`;

  function signOut() {
    startSignOut(async () => {
      try {
        await signOutRequest();
      } catch (error) {
        console.error(error);
        return;
      }
      // Refaz os Server Components: o cabeçalho volta para "Entrar".
      router.refresh();
    });
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={`Conta de ${fullName}`}
        className="-mr-1 flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-lg px-1 transition-colors hover:bg-muted data-popup-open:bg-muted sm:-mr-2 sm:pl-3 sm:pr-2"
      >
        <span className="hidden min-w-0 text-right leading-tight sm:block">
          <span className="block max-w-56 truncate text-[0.9375rem] font-medium">
            {fullName}
          </span>
          <span className="block max-w-56 truncate text-sm text-muted-foreground">
            {user.email}
          </span>
        </span>
        <UserAvatar src={user.avatarUrl} />
      </MenuTrigger>

      <MenuContent>
        <div className="px-3 pt-2 pb-2.5 sm:hidden">
          <p className="truncate font-medium">{fullName}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <MenuSeparator className="sm:hidden" />
        <MenuItem
          onClick={signOut}
          disabled={isSigningOut}
          closeOnClick={false}
        >
          <LogOutIcon className="text-muted-foreground" />
          {isSigningOut ? "Saindo…" : "Sair"}
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}
