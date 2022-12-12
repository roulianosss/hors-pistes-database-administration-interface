import React, { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

const columns = [
  { field: "name", headerName: "Name", width: 150 },
  { field: "OIDNumber", headerName: "OID Number", width: 120 },
  {
    field: "qualityLabelHostNumber",
    headerName: "quality Label Host Number",
    width: 200
  },
  { field: "zipCode", headerName: "Zip Code", width: 150 },
  { field: "country", headerName: "Country", width: 100 },
  { field: "city", headerName: "City", width: 150 }
];

export default function ListVolunteers(props) {
  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const [allStructures, setAllStructures] = useState([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.BACKEND_URL}/structures`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'authorization': `bearer ${user.token}`
        }
      });
      const allStructuresData = await res.json();
      if (!allStructuresData.result) {
        props.handleSnackBar(
          allStructuresData.severity,
          allStructuresData.message
        );
        return;
      }
      setAllStructures(allStructuresData.data.reverse());
      setLoading(false);
    })();
  }, []);
  const rows = allStructures
    .filter((user) => user.name !== "none")
    .map((el, i) => {
      return {
        id: el._id,
        name: el.name,
        OIDNumber: el.OIDNumber,
        qualityLabelHostNumber: el.qualityLabelHostNumber,
        zipCode: el.adress.zipCode,
        country: el.adress.country,
        city: el.adress.city
      };
    });

  const handleRowClick = (e) => {
    props.changeTabWithId(2, e.id);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "70vh",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div
      style={{
        height: "80vh",
        width: "96vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <DataGrid
        style={{
          cursor: "pointer",
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          borderRadius: 15,
          padding: 5,
          userSelect: "none"
        }}
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
