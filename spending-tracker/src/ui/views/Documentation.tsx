import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'

import '../styles/Documention.css'

export default function Documentation() {
  return (
    <>
      <h1>Documentation</h1>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardHeader title='Introduction' />
        <CardContent>
          <p>The Spending Tracker is an application for tracking income and expenses over time. Additionally, individual payments are tracked to help visualize how expenses make up your monthly expendetures. Chart filters allow you to visualize spending over different periods of time.</p>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardHeader title='Import Data' />
        <CardContent>
          <p>The Spending Tracker has a useful utility for importing new payment data into the database. New payments are imported from a pre-formatted CSV file. The CSV must contain the following header values in the first row in the order given. Populate all subsequent rows with payment data as described in the table.</p>
          <table className='importDataTable'>
            <tr>
              <th>paymentDate</th>
              <th>amount</th>
              <th>description</th>
              <th>categoryName</th>
            </tr>
            <tr>
              <td>A ISO 8601 date string formatted as YYYY-MM-DD</td>
              <td>A positive or negative number in dollars. Both integers and floating point numbers are allowed</td>
              <td>The text description of the payment</td>
              <td>The text name of the payment's category</td>
            </tr>
          </table>
          <p>To import new data into the database, go to File &gt; Import Data and the import utility will open. Press the Choose File button to open a file section prompt. Select the CSV file from the file system. Press import.</p>
        </CardContent>
      </Card>
    </>
  )
}
