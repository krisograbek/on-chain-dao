import React, { useState } from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

type FormData = {
  func: string,
  value: number,
  description: string
}

const ProposalForm = () => {
  const [formData, setFormData] = useState<FormData>({ func: "store", value: 0, description: "" })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitting", formData)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <Paper className='paper form'>
      <form autoComplete='off' noValidate onSubmit={handleSubmit}>

        <Typography variant="h5">Create a new Proposal</Typography>
        <TextField sx={{ m: 1 }} name='value' type='number' variant='outlined' label='Store Value' fullWidth value={formData.value} onChange={handleOnChange} />

        <TextField
          sx={{ m: 1 }}
          name='description'
          multiline
          variant='outlined'
          label='Proposal Description'
          fullWidth
          rows={5}
          value={formData.description}
          onChange={handleOnChange}
        />
        <Button variant='contained' color='primary' fullWidth type='submit' size='large'>Create Proposal</Button>
      </form>
    </Paper>
  )
}

export default ProposalForm