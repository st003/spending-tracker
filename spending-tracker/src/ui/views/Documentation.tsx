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
          <p>The Spending Tracker is an application for tracking income and expenses over time. Payments are tracked individually to aid in visualizing how expenses make up monthly expenditures. Chart filters allow for visualization of spending over user-defined ranges of time.</p>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardHeader title='Dashboard' />
        <CardContent>
          <p>The Dashboard page displays top-level information about net income and the previous month's expenses. The page is divided into 3 charts.</p>
          <h2>Net Income By Month</h2>
          <p>Displays a stacked bar chart with the previous 12 months of net income. The green portion indicates the sum of that month's income. The red portion indicates the sum of that month's expenses. And finally, the blue line indicates that month's total net income. Open the filter settings by pressing the icon in the upper right corner. From here you can select the start and end months for which to display net income data.</p>
          <h2>Expenses</h2>
          <p>Displays a donut chart of the given month's expenses. By default, the chart shows data for the previous month. Hovering your mouse over each of the chart slices will display the name of the expense category as well as the sum of expenses in that category for the given month. Open the filter settings by pressing the icon in the upper right corner. From here you can select the month for which to display expense data.</p>
          <h2>Net Income By Year</h2>
          <p>Displays a stacked bar chart with the previous 5 years of net income. The green portion indicates the sum of that year's income. The red portion indicates the sum of that year's expenses. And finally, the blue line indicates that year's total net income. Open the filter settings by pressing the icon in the upper right corner. From here you can select the start and end years for which to display net income data.</p>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardHeader title='Budget' />
        <CardContent>
          <p>The Budget page displays detailed information about the expenses of a given month. By default, the page shows data for the previous month. The page is divided into 2 sections.</p>
          <h2>Categories</h2>
          <p>Displays a donut chart of the given month's expenses. Hovering your mouse over each of the chart slices will display the name of the expense category as well as the sum of expenses in that category for the given month. Open the filter settings by pressing the icon in the upper right corner. From here you can select the month for which to display expense data.</p>
          <h2>Expenses</h2>
          <p>Displays a table of expenses for the given month. Press on the table heading labels to sort expense data. By default, expenses are sorted from most newest to oldest.</p>
        </CardContent>
      </Card>
      <Card sx={{ marginBottom: '1rem' }}>
        <CardHeader title='Import Data' />
        <CardContent>
          <p>The Spending Tracker has a utility for importing new payment data into the database. New payments are imported from a pre-formatted CSV file. The CSV must contain the following header names in the first row and in the order given. Populate all subsequent rows with payment data as described in the table.</p>
          <table className='importDataTable'>
            <tr>
              <th>paymentDate</th>
              <th>amount</th>
              <th>description</th>
              <th>categoryName</th>
            </tr>
            <tr>
              <td>A date string formatted as YYYY-MM-DD, MM/DD/YYYY, or MM/DD/YY</td>
              <td>A positive or negative number in dollars. Both integers and floating point numbers are allowed</td>
              <td>The text description of the payment</td>
              <td>The text name of the payment's category</td>
            </tr>
          </table>
          <p>To import new data into the database, go to File &gt; Import Data and the import utility will open. Press the Choose File button to open a file section prompt. Select the CSV file from the file system. Press import. If there are any problems during import, an error message will be displayed in the import utility</p>
        </CardContent>
      </Card>
    </>
  )
}
