import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const columns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "OIDNumber", headerName: "OID Number", width: 120 },
  { field: "qualityLabelHostNumber", headerName: "quality Label Host Number", width: 200 },
  { field: "zipCode", headerName: "Zip Code", width: 150 },
  { field: "country", headerName: "Country", width: 100 },
  { field: "city", headerName: "City", width: 150 },
]

export default function ListVolunteers(props) {
  const [loading, setLoading] = useState(true)
  const [allUsers, setAllUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      const res = await fetch("http://localhost:3000/structures");
      const allStructuresData = await res.json();
      setAllUsers(allStructuresData.reverse());
      setLoading(false)
    }
    fetchAllUsers()
  }, [])
  const rows = allUsers.filter(user => user.name !== 'none').map((el, i) => {
    return {
      id: el._id,
      name: el.name,
      OIDNumber: el.OIDNumber,
      qualityLabelHostNumber: el.qualityLabelHostNumber,
      zipCode: el.adress.zipCode,
      country: el.adress.country,
      city: el.adress.city,
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
