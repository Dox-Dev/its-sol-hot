import {
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarBrand,
	NavbarItem,
} from "@nextui-org/navbar";
import { Link } from "@nextui-org/link";

import { siteConfig } from "@/config/site";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import {
	GithubIcon,
	DiscordIcon,
} from "@/components/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';

export const Navbar = () => {
	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand as="li" className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/">
						<FontAwesomeIcon icon={faFireFlameCurved} className="mr-2" />
						<p className="font-bold text-inherit">IT'S SOL HOT!</p>
					</NextLink>
				</NavbarBrand>
			</NavbarContent>

			<NavbarContent
				className="flex basis-1/5 basis-full"
				justify="end"
			>
				<NavbarItem className="flex gap-2">
					<Link isExternal href={siteConfig.links.discord} aria-label="Discord">
						<DiscordIcon className="text-default-500" />
					</Link>
					<Link isExternal href={siteConfig.links.github} aria-label="Github">
						<GithubIcon className="text-default-500" />
					</Link>
					<ThemeSwitch />
				</NavbarItem>
			</NavbarContent>
		</NextUINavbar>
	);
};
