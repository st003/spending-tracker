import { NavLink } from 'react-router-dom'

export default function Budget() {
  return (
    <>
      <h1>Budget</h1>
      <NavLink to={'/dashboard'}>Dashboard</NavLink>
    </>
  )
}
