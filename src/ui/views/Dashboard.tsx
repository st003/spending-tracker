import { Grid } from "@mui/material";

export default function Dashboard() {
  return (
    <>
      <h1>Dashboard</h1>
      <Grid container>
        <h2>Net Income (Month to Month)</h2>
      </Grid>
      <hr />
      <Grid container>
        <Grid size={{ sm: 12, lg: 6 }}>
          <h2>Budget (Previous Month)</h2>
        </Grid>
        <Grid size={{ sm: 12, lg: 6 }}>
          <h2>Net Income (Year to Year)</h2>
        </Grid>
      </Grid>
    </>
  )
}
