import { NavLink } from 'react-router-dom'

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <NavLink to={'/budget'}>Budget</NavLink>
    </>
  )
}
