import NavItem from "./NavItem";

export default function NavBar() {
  return (
    <nav className="bg-[#333] p-4 text-white flex gap-5">
      <NavItem href="/" text="Home"></NavItem>
      <NavItem href="/courses" text="Browse Courses"></NavItem>
      <NavItem href="/enrolled" text="My Courses"></NavItem>
      <NavItem href="/admin/dashboard" text="Admin"></NavItem>
    </nav>
  );
}
