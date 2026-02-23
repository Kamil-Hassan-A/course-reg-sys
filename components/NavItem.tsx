import Link from "next/link";

type Props = {
  href: string;
  text: string;
};

export default function NavItem({ href, text }: Props) {
  return <Link href={href}>{text}</Link>;
}
