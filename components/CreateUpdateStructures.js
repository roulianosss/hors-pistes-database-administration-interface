import React, { useState, useEffect } from "react";
import styles from "../styles/CreateUpdateStructures.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";

export default function CreateUpdateStructures(props) {
  const user = useSelector((state) => state.user.value);
  const [loading, setLoading] = useState(true);
  const [structureInfo, setStructureInfo] = useState({
    name: "",
    OIDNumber: "",
    qualityLabelHostNumber: "",
    adress: {
      zipCode: "",
      city: "",
      country: ""
    },
    projectReferent: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: ""
    },
    legalReferent: {
      name: "",
      surname: "",
      email: "",
      phoneNumber: ""
    }
  });

  useEffect(() => {
    (async () => {
      if (props.structureId) {
        const res = await fetch(
          `${process.env.BACKEND_URL}/structures/${props.structureId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${user.token}`
            }
          }
        );
        const structureInfoData = await res.json();
        if (!structureInfoData.result) {
          props.handleSnackBar(fetchMissions.severity, fetchMissions.message);
          return;
        }
        setStructureInfo(structureInfoData.data);
      }
      setLoading(false);
    })();
  }, []);

  const handleSendData = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/structures/${
        props.structureId ? "update" : "create"
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${user.token}`
        },
        body: JSON.stringify({
          ...structureInfo,
          structureId: props.structureId,
          connectedId: user.id
        })
      }
    );
    const data = await res.json();
    if (data.result) {
      props.changeTabUpdate && props.changeTabUpdate(1);
      props.changeTabCreate && props.changeTabCreate(1);
    }
    props.handleSnackBar(data.severity, data.message);
  };

  const handleDeleteStructure = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/structures/${props.structureId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "authorization": `bearer ${user.token}`
        }
      }
    );
    const data = await res.json();
    if (data.result) {
      props.changeTabUpdate && props.changeTabUpdate(1);
      props.changeTabCreate && props.changeTabCreate(1);
    }
    props.handleSnackBar(data.severity, data.message);
  };

  if (props.changeTabUpdate && !props.structureId) {
    return <p>Choose a structure in structure list tab.</p>;
  }

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
    <div className={styles.globalContainer}>
      <div className={styles.globalLeft}>
        <div className={styles.structureInformationsContainer}>
          <p>Structure Informations:</p>
          <TextField
            required
            label="Structure Name"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({ ...structureInfo, name: e.target.value })
            }
            value={structureInfo.name}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="OID Number"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({ ...structureInfo, OIDNumber: e.target.value })
            }
            value={structureInfo.OIDNumber}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Quality Label Host Number"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                qualityLabelHostNumber: e.target.value
              })
            }
            value={structureInfo.qualityLabelHostNumber}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <p>Adress:</p>
          <TextField
            label="Zip Code"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                adress: { ...structureInfo.adress, zipCode: e.target.value }
              })
            }
            value={structureInfo.adress.zipCode}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="City"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                adress: { ...structureInfo.adress, city: e.target.value }
              })
            }
            value={structureInfo.adress.city}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Country"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                adress: { ...structureInfo.adress, country: e.target.value }
              })
            }
            value={structureInfo.adress.country}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>
      <div className={styles.globalCenter}>
        <div className={styles.projectReferantInformationsContainer}>
          <p>Project Referant Informations:</p>
          <TextField
            label="Name"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                projectReferent: {
                  ...structureInfo.projectReferent,
                  name: e.target.value
                }
              })
            }
            value={structureInfo.projectReferent.name}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Surname"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                projectReferent: {
                  ...structureInfo.projectReferent,
                  surname: e.target.value
                }
              })
            }
            value={structureInfo.projectReferent.surname}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Email"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                projectReferent: {
                  ...structureInfo.projectReferent,
                  email: e.target.value
                }
              })
            }
            value={structureInfo.projectReferent.email}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Phone"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                projectReferent: {
                  ...structureInfo.projectReferent,
                  phone: e.target.value
                }
              })
            }
            value={structureInfo.projectReferent.phone}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>
      <div className={styles.globalRight}>
        <div className={styles.legalReferantInformationsContainer}>
          <p>Legal Referant Informations:</p>
          <TextField
            label="Name"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                legalReferent: {
                  ...structureInfo.projectReferent,
                  name: e.target.value
                }
              })
            }
            value={structureInfo.legalReferent.name}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Surname"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                legalReferent: {
                  ...structureInfo.projectReferent,
                  surname: e.target.value
                }
              })
            }
            value={structureInfo.legalReferent.surname}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Email"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                legalReferent: {
                  ...structureInfo.projectReferent,
                  email: e.target.value
                }
              })
            }
            value={structureInfo.legalReferent.email}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Phone"
            variant="outlined"
            onChange={(e) =>
              setStructureInfo({
                ...structureInfo,
                legalReferent: {
                  ...structureInfo.projectReferent,
                  phone: e.target.value
                }
              })
            }
            value={structureInfo.legalReferent.phone}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          className={styles.button}
          variant="contained"
          onClick={handleSendData}
        >
          {props.structureId ? "Update Structure" : "Create Structure"}
        </Button>
        {/* {props.structureId && (
          <Button
            className={styles.button}
            variant="contained"
            onClick={handleDeleteStructure}
            color="error"
          >
            Delete Structure
          </Button>
        )} */}
      </div>
    </div>
  );
}
