export default function NavBar({ children }) {
  // children prop will contain all the elements that are passed between the opening and closing tags of the NavBar component
  return <nav className='nav-bar'>{children}</nav>
}
