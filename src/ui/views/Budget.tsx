import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

export default function Budget() {

  return (
    <>
      <h1>Budget</h1>
      <Card variant='outlined' sx={{ mb: 2 }}>
        <CardHeader title='Categories' />
        <CardContent></CardContent>
      </Card>
      <Card variant='outlined'>
        <CardHeader title='Transactions' />
        <CardContent></CardContent>
      </Card>
    </>
  )
}
