"use client";

import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { InitialsAvatar, initialsOf } from "@/components/prova/initials-avatar";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { signOutRequest } from "@/features/auth/sign-in/api";
import type { SessionUser } from "@/server/auth/session";

type AccountMenuProps = {
  user: Pick<SessionUser, "firstName" | "lastName" | "email">;
};

/** Conta no cabeçalho: um círculo com as iniciais; nome e e-mail ficam no menu. */
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
        className="rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <InitialsAvatar
          initials={initialsOf(user.firstName, user.lastName)}
          tone="solid"
          className="size-11 text-[0.8125rem]"
        />
      </MenuTrigger>

      <MenuContent>
        <div className="px-3 pt-2 pb-2.5">
          <p className="truncate font-medium">{fullName}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
        <MenuSeparator />
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
