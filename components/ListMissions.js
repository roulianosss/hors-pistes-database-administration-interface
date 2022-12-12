import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSelector } from "react-redux";

const columns = [
  { field: "projectName", headerName: "Project name", width: 150 },
  { field: "volunteer", headerName: "Volunteer", width: 150 },
  { field: "missionType", headerName: "Mission Type", width: 150 },
  { field: "hostStructure", headerName: "Host Structure", width: 150 },
  { field: "supportStructure", headerName: "Support Structure", width: 150 },
  { field: "coordinationStructure", headerName: "Coordination Structure", width: 150 },
  { field: "startDate", headerName: "Start Date", width: 150 },
  { field: "endDate", headerName: "End Date", width: 150 },
]

export default function ListMissions(props) {
  const user = useSelector(state => state.user.value)
  const [loading, setLoading] = useState(true)
  const [allMissions, setAllMissions] = useState([]);
  useEffect(() => {
    const fetchAllMissions = async () => {
      const res = await fetch(`${process.env.BACKEND_URL}/missions`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const allMissionsData = await res.json();
      if(!allMissionsData.result){
        props.handleSnackBar(allMissionsData.severity, allMissionsData.message)
        return
      }
      setAllMissions(allMissionsData.data.filter(mission => mission.projectName !== 'none').reverse());
      setLoading(false)
    };
    fetchAllMissions();
  }, []);
  const rows = allMissions.map((el, i) => {
    return {
      id: el._id,
      projectName: el.projectName,
      volunteer: `${el.volunteer.name} ${el.volunteer.surname}`,
      missionType: el.missionType,
      hostStructure: el.hostStructure.name,
      coordinationStructure: el.coordinationStructure.name,
      supportStructure: el.supportStructure.name,
      startDate: el.startDate ? new Date(el.startDate).toLocaleString().split(' ')[0]: '',
      endDate: el.endDate ? new Date(el.endDate).toLocaleString().split(' ')[0]: '',
    };
  });
  const handleRowClick = (e) => {
    props.changeTabWithId(2, e.id);
  };
  if (loading) {
    return (
      <Box sx={{ display: 'flex', height:'70vh', justifyContent:'center', alignItems: 'flex-start'}}>
      <CircularProgress />
    </Box>
    )
  }

  return (
    <div style={{ height: '80vh', width: "96vw", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <DataGrid
        style={{ width: '100%', cursor: "pointer", boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', borderRadius: 15, padding: 5, userSelect: 'none' }}
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
