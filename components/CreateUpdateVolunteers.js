import React, { useState, useEffect } from "react";
import styles from "../styles/CreateUpdateVolunteers.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";
import "dayjs/locale/fr";

 
export default function CreateUpdateVolunteers(props) {
  const user = useSelector(state => state.user.value)
  const [loading, setLoading] = useState(true);
  const [missions, setMissions] = useState([]);
  const [volunteerInfo, setVolunteerInfo] = useState({
    mission: { _id: "639494b656430998cd5eabb1" },
    name: "",
    surname: "",
    gender: "",
    email: "",
    password: "",
    photo: "",
    birthDate: "",
    birthCity: "",
    phone: "",
    degrees: "",
    occupation: "",
    IBAN: "",
    CESNumber: "",
    ICNumber: "",
    adress: {
      zipCode: "",
      city: "",
      country: ""
    },
    emergencyContact: {
      name: "",
      relation: "",
      phone: ""
    },
    ICExpirationDate: ""
  });

  useEffect(() => {
    (async () => {
      if (props.userId) {
        const res = await fetch(`${process.env.BACKEND_URL}/users/${props.userId}`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            'authorization': `bearer ${user.token}`
          },
        });
        const volunteerInfoData = await res.json();
        if(!volunteerInfoData.result){
          props.handleSnackBar(fetchMissions.severity, fetchMissions.message)
          return
        }
        setVolunteerInfo(volunteerInfoData.data);
      }
      const res = await fetch(`${process.env.BACKEND_URL}/missions/`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const fetchMissions = await res.json();
      if(!fetchMissions.result){
        props.handleSnackBar(fetchMissions.severity, fetchMissions.message)
        
        return
      }
      setMissions(
        fetchMissions.data.filter(
          (mission) =>
            mission.volunteer._id === "639496d556430998cd5eabf5" ||
            mission.volunteer._id === props.userId
        )
      );
      setLoading(false);
    })();
  }, []);

  const handleSendData = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/users/${props.userId ? "update" : "create"}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'authorization': `bearer ${user.token}`
        },
        body: JSON.stringify({ ...volunteerInfo, userId: props.userId, connectedId: user._id })
      }
    );
    const data = await res.json();
    if (data.result) {
      props.changeTabUpdate && props.changeTabUpdate(1);
      props.changeTabCreate && props.changeTabCreate(1);
    }
    props.handleSnackBar(data.severity, data.message);
  };
  const handleDeleteUser = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/users/${props.userId}/${volunteerInfo.mission._id}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'authorization': `bearer ${user.token}`
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

  if (props.changeTabUpdate && !props.userId) {
    return <p>Choose a volunteer in volunteer list tab.</p>;
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
        <div className={styles.financialInformationsContainer}>
          <p>Volunteers Informations:</p>
          <TextField
            required
            label="Email"
            variant="outlined"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, email: e.target.value })
            }
            value={volunteerInfo.email}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            required
            label="Surname"
            variant="outlined"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, surname: e.target.value })
            }
            value={volunteerInfo.surname}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            required
            label="Name"
            variant="outlined"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, name: e.target.value })
            }
            value={volunteerInfo.name}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel id="demo-simple-select-standard-label">
              Gender
            </InputLabel>
            <Select
              value={volunteerInfo.gender}
              onChange={(e) =>
                setVolunteerInfo({ ...volunteerInfo, gender: e.target.value })
              }
              label="Gender"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem sx={{ m: 1, minWidth: "20vw" }} value={`Male`}>
                Male
              </MenuItem>
              <MenuItem sx={{ m: 1, minWidth: "20vw" }} value={`Female`}>
                Female
              </MenuItem>
              <MenuItem sx={{ m: 1, minWidth: "20vw" }} value={`Non-binary`}>
                Non-binary
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel>Mission</InputLabel>
            <Select
              label="Mission"
              value={
                volunteerInfo.mission
                  ? volunteerInfo.mission._id
                  : "639494b656430998cd5eabb1"
              }
              onChange={(e) =>
                setVolunteerInfo({
                  ...volunteerInfo,
                  mission: { _id: e.target.value }
                })
              }
            >
              {missions.length &&
                missions.map((el, i) => (
                  <MenuItem key={i} value={`${el._id}`}>
                    {el.projectName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <DatePicker
              label="Birth Date"
              type="date"
              value={volunteerInfo.birthDate}
              onChange={(value) =>
                setVolunteerInfo({
                  ...volunteerInfo,
                  birthDate: new Date(value).toUTCString()
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    m: 1,
                    minWidth: "20vw"
                  }}
                  size="small"
                />
              )}
            />
          </LocalizationProvider>
          <TextField
            label="Subvention Number"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, photo: e.target.value })
            }
            value={volunteerInfo.photo}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Birth City"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, birthCity: e.target.value })
            }
            value={volunteerInfo.birthCity}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Phone"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, phone: e.target.value })
            }
            value={volunteerInfo.phone}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Degrees"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, degrees: e.target.value })
            }
            value={volunteerInfo.degrees}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Occupation"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, occupation: e.target.value })
            }
            value={volunteerInfo.occupation}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="IBAN"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, IBAN: e.target.value })
            }
            value={volunteerInfo.IBAN}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="CES Number"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, CESNumber: e.target.value })
            }
            value={volunteerInfo.CESNumber}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="IC Number"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({ ...volunteerInfo, ICNumber: e.target.value })
            }
            value={volunteerInfo.ICNumber}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="IC Expiration"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                ICExpirationDate: e.target.value
              })
            }
            value={volunteerInfo.ICExpirationDate}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>
      <div className={styles.globalCenter}>
        <div className={styles.missionReferantInformations}>
          <p>Adresse Informations:</p>
          <TextField
            label="Zip Code"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                adress: { ...volunteerInfo.adress, zipCode: e.target.value }
              })
            }
            value={volunteerInfo.adress.zipCode}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="City"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                adress: { ...volunteerInfo.adress, city: e.target.value }
              })
            }
            value={volunteerInfo.adress.city}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            label="Country"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                adress: { ...volunteerInfo.adress, country: e.target.value }
              })
            }
            value={volunteerInfo.adress.country}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>
      <div className={styles.globalRight}>
        <div className={styles.missionReferantInformations}>
          <p>Emergency Contact Informations:</p>
          <TextField
            label="Name"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                emergencyContact: {
                  ...volunteerInfo.emergencyContact,
                  name: e.target.value
                }
              })
            }
            value={volunteerInfo.emergencyContact.name}
            size="small"
          />
          <TextField
            label="Relation"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                emergencyContact: {
                  ...volunteerInfo.emergencyContact,
                  relation: e.target.value
                }
              })
            }
            value={volunteerInfo.emergencyContact.relation}
            size="small"
          />
          <TextField
            label="Phone"
            variant="outlined"
            type="text"
            onChange={(e) =>
              setVolunteerInfo({
                ...volunteerInfo,
                emergencyContact: {
                  ...volunteerInfo.emergencyContact,
                  phone: e.target.value
                }
              })
            }
            value={volunteerInfo.emergencyContact.phone}
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
          {props.userId ? "Update Volunteer" : "Create Volunteer"}
        </Button>
        {props.userId && (
          <Button
            className={styles.button}
            variant="contained"
            onClick={handleDeleteUser}
            color="error"
          >
            Delete Volunteer
          </Button>
        )}
      </div>
    </div>
  );
}
