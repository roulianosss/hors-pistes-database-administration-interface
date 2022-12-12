import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from "react-redux";


const columns = [
  { field: "surname", headerName: "Surname", width: 150 },
  { field: "name", headerName: "Name", width: 120 },
  { field: "mission", headerName: "Mission", width: 120 },
  { field: "gender", headerName: "Gender", width: 100 },
  { field: "email", headerName: "Email", width: 150 },
  { field: "birthDate", headerName: "Birth Date", width: 100 },
  { field: "birthCity", headerName: "Birth City", width: 150 },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "degrees", headerName: "Degrees", width: 150 },
  { field: "emergencyContact", headerName: "Emergency Phone", width: 150 },
]

export default function ListVolunteers(props) {
  const user = useSelector(state => state.user.value)
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState([]);
  
  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await fetch(`${process.env.BACKEND_URL}/users`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const allUsersData = await res.json();
      if(!allUsersData.result){
        props.handleSnackBar(allUsersData.severity, allUsersData.message)
        
        return
      }
      setAllUsers(allUsersData.data.reverse());
      setLoading(false)
    }
    fetchAllUsers()
  }, [])
  const rows = allUsers.filter(user => user.name !== 'none').map((el, i) => {
    return {
      id: el._id,
      mission: el.mission ? el.mission.projectName : '',
      name: el.name,
      surname: el.surname,
      gender: el.gender,
      email: el.email,
      birthDate: el.birthDate ? new Date(el.birthDate).toLocaleString().split(' ')[0]: '',
      birthCity: el.birthCity,
      phone: el.phone,
      degrees: el.degrees,
      emergencyContact: el.emergencyContact.phone
    }
  })

  const handleRowClick = (e) => {
    props.changeTabWithId(2, e.id);
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', height:'70vh', justifyContent:'center', alignItems: 'center'}}>
      <CircularProgress />
    </Box>
    )
  }

  return (
    <div style={{ height: '80vh', width: "96vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <DataGrid
        style={{ cursor: "pointer", boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', borderRadius: 15, padding:5, userSelect: 'none' }}
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onRowClick={handleRowClick}
        components={{ Toolbar: GridToolbar }}
      />
    </div>
  );
}
