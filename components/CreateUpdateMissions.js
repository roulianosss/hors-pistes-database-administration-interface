import React, { useState, useEffect } from "react";
import styles from "../styles/CreateUpdateMissions.module.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import Input from "@mui/material/Input";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useSelector } from "react-redux";

export default function CreateMissions(props) {
  const user = useSelector(state => state.user.value)
  const [loading, setLoading] = useState(true);
  const [structures, setStructures] = useState([]);
  const [referants, setReferants] = useState([]);
  const [users, setUsers] = useState([]);

  const [missionInfo, setMissionInfo] = useState({
    volunteer: "639496d556430998cd5eabf5",
    projectName: "",
    missionType: "",
    hostStructure: "6395b7f87cb7eb1185a1ee4e",
    coordinationStructure: "6395b7f87cb7eb1185a1ee4e",
    supportStructure: "6395b7f87cb7eb1185a1ee4e",
    startDate: "",
    endDate: "",
    subventionNumber: "",
    projectReferant: "63937c406cc11d3f27c32d31",
    financialInformations: {
      travel: "",
      greenTravel: "false",
      pocketMoney: "",
      hostingStructure: "",
      sendingStructure: "",
      visa: "",
      wifi: ""
    },
    missionReferant: {
      name: "",
      surname: "",
      email: "",
      phone: ""
    }
  });

  useEffect(() => {
    (async () => {
      const res = await fetch(`${process.env.BACKEND_URL}/structures`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const fetchStructures = await res.json();
      setStructures(fetchStructures.data);
      const res2 = await fetch(`${process.env.BACKEND_URL}/referants/`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const fetchReferants = await res2.json();
      setReferants(fetchReferants.data);
      const res3 = await fetch(`${process.env.BACKEND_URL}/users/`,{
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        }
      });
      const fetchUsers = await res3.json();
      setUsers(
        fetchUsers.data.filter(
          (user) =>
            user.mission._id === "639494b656430998cd5eabb1" ||
            user.mission._id === props.missionId
        )
      );
      if (props.missionId) {
        const res4 = await fetch(
          `${process.env.BACKEND_URL}/missions/${props.missionId}`, {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
              'authorization': `bearer ${user.token}`
            }
          }
        );
        const missionInfoData = await res4.json();
        setMissionInfo(missionInfoData.data);
      }
      setLoading(false);
    })();
  }, []);

  console.log(user)

  const handleSendData = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/missions/${props.missionId ? "update" : "create"}`,
      {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `bearer ${user.token}`
        },
        body: JSON.stringify({ ...missionInfo, missionId: props.missionId, connectedId: user._id })
      }
    );
    const data = await res.json();
    if (data.result) {
      props.changeTabUpdate && props.changeTabUpdate(1);
      props.changeTabCreate && props.changeTabCreate(1);
    }
    props.handleSnackBar(data.severity, data.message);
  };

  const handleDeleteMission = async () => {
    const res = await fetch(
      `${process.env.BACKEND_URL}/missions/${props.missionId}/${missionInfo.volunteer._id}`,
      {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
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

  if (props.changeTabUpdate && !props.missionId) {
    return <p>Choose a mission in mission list tab.</p>;
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
        <div className={styles.missionInformationsContainer}>
          <p>Mission Informations:</p>
          <TextField
            required
            label="Project Name"
            variant="outlined"
            onChange={(e) =>
              setMissionInfo({ ...missionInfo, projectName: e.target.value })
            }
            value={missionInfo.projectName}
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel id="demo-simple-select-standard-label">
              Volunteer
            </InputLabel>
            <Select
              value={
                missionInfo.volunteer
                  ? missionInfo.volunteer._id
                  : "639496d556430998cd5eabf5"
              }
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  volunteer: { _id: e.target.value }
                })
              }
              label="Host Structure"
            >
              {users.length &&
                users.map((el, i) => (
                  <MenuItem
                    key={i}
                    sx={{ m: 1, minWidth: "20vw" }}
                    value={`${el._id}`}
                  >
                    {el.name} {el.surname}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            label="Mission Type"
            variant="outlined"
            value={missionInfo.missionType}
            onChange={(e) =>
              setMissionInfo({ ...missionInfo, missionType: e.target.value })
            }
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />

          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel>Host Structure</InputLabel>
            <Select
              labelId="Host Structure"
              id="Host Structure"
              value={missionInfo.hostStructure._id}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  hostStructure: { _id: e.target.value }
                })
              }
              label="Host Structure"
            >
              {structures.length &&
                structures.map((el, i) => (
                  <MenuItem
                    key={i}
                    sx={{ m: 1, minWidth: "20vw" }}
                    value={`${el._id}`}
                  >
                    {el.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel>Coordination Structure</InputLabel>
            <Select
              labelId="Coordination Structure"
              id="Coordination Structure"
              value={
                missionInfo.coordinationStructure
                  ? missionInfo.coordinationStructure._id
                  : "63937b966cc11d3f27c32d2e"
              }
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  coordinationStructure: { _id: e.target.value }
                })
              }
              label="Coordination Structure"
            >
              {structures.length &&
                structures.map((el, i) => (
                  <MenuItem key={i} value={`${el._id}`}>
                    {el.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel id="demo-simple-select-standard-label">
              Support Structure
            </InputLabel>
            <Select
              labelId="Support Structure"
              id="Support Structure"
              value={
                missionInfo.supportStructure
                  ? missionInfo.supportStructure._id
                  : "63937b966cc11d3f27c32d2e"
              }
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  supportStructure: { _id: e.target.value }
                })
              }
              label="Support Structure"
            >
              {structures.length &&
                structures.map((el, i) => (
                  <MenuItem key={i} value={`${el._id}`}>
                    {el.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="Start Date"
              value={missionInfo.startDate}
              onChange={(value) =>
                setMissionInfo({
                  ...missionInfo,
                  startDate: new Date(value).toUTCString()
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
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              label="End Date"
              value={missionInfo.endDate}
              onChange={(value) =>
                setMissionInfo({
                  ...missionInfo,
                  endDate: new Date(value).toUTCString()
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
            value={missionInfo.subventionNumber}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                subventionNumber: e.target.value
              })
            }
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />

          <FormControl
            variant="outlined"
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          >
            <InputLabel>Project Referant</InputLabel>
            <Select
              value={
                missionInfo.projectReferant
                  ? missionInfo.projectReferant._id
                  : "63937c406cc11d3f27c32d31"
              }
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  projectReferant: { _id: e.target.value }
                })
              }
              label="Project Referant"
            >
              {referants.length &&
                referants.map((el, i) => (
                  <MenuItem key={i} value={`${el._id}`}>
                    {el.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <TextField
            multiline
            minRows={3}
            label="Mission Task"
            variant="outlined"
            type="text"
            value={missionInfo.missionTask}
            onChange={(e) =>
              setMissionInfo({ ...missionInfo, missionTask: e.target.value })
            }
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
          <TextField
            multiline
            minRows={4}
            label="Practical Informations"
            variant="outlined"
            type="text"
            value={missionInfo.practicalInformation}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                practicalInformation: e.target.value
              })
            }
            sx={{ m: 1, minWidth: "20vw" }}
            size="small"
          />
        </div>
      </div>
      <div className={styles.globalCenter}>
        <div className={styles.financialInformationsContainer}>
          <p>Fiancial Informations:</p>

          <FormControl
            variant="standard"
            sx={{ minWidth: "16vw" }}
            size="small"
          >
            <InputLabel>Green Travel</InputLabel>
            <Select
              value={
                missionInfo.financialInformations.greenTravel
                  ? missionInfo.financialInformations.greenTravel
                  : "false"
              }
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    greenTravel: e.target.value
                  }
                })
              }
              label="Green Travel"
            >
              <MenuItem key={0} value={`false`}>
                No
              </MenuItem>
              <MenuItem key={1} value={`true`}>
                Yes
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">Travel</InputLabel>
            <Input
              value={missionInfo.financialInformations.travel}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    travel: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">
              Pocket Money
            </InputLabel>
            <Input
              value={missionInfo.financialInformations.pocketMoney}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    pocketMoney: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>

          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">
              Hosting Structure
            </InputLabel>
            <Input
              value={missionInfo.financialInformations.hostingStructure}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    hostingStructure: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">
              Sending Structure
            </InputLabel>
            <Input
              value={missionInfo.financialInformations.sendingStructure}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    sendingStructure: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">Visa</InputLabel>
            <Input
              value={missionInfo.financialInformations.visa}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    visa: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }} variant="standard" size="small">
            <InputLabel htmlFor="standard-adornment-amount">Wifi</InputLabel>
            <Input
              value={missionInfo.financialInformations.wifi}
              onChange={(e) =>
                setMissionInfo({
                  ...missionInfo,
                  financialInformations: {
                    ...missionInfo.financialInformations,
                    wifi: e.target.value
                  }
                })
              }
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              type="number"
            />
          </FormControl>
        </div>
      </div>
      <div className={styles.globalRight}>
        <div className={styles.missionReferantInformationsContainer}>
          <p>Mission Referant Informations:</p>
          <TextField
            label="Name"
            variant="outlined"
            type="text"
            value={missionInfo.missionReferant.name}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                missionReferant: {
                  ...missionInfo.missionReferant,
                  name: e.target.value
                }
              })
            }
            size="small"
          />
          <TextField
            label="Surname"
            variant="outlined"
            type="text"
            value={missionInfo.missionReferant.surname}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                missionReferant: {
                  ...missionInfo.missionReferant,
                  surname: e.target.value
                }
              })
            }
            size="small"
          />
          <TextField
            label="Email"
            variant="outlined"
            type="text"
            value={missionInfo.missionReferant.email}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                missionReferant: {
                  ...missionInfo.missionReferant,
                  email: e.target.value
                }
              })
            }
            size="small"
          />
          <TextField
            label="Phone"
            variant="outlined"
            type="text"
            value={missionInfo.missionReferant.phone}
            onChange={(e) =>
              setMissionInfo({
                ...missionInfo,
                missionReferant: {
                  ...missionInfo.missionReferant,
                  phone: e.target.value
                }
              })
            }
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
          {props.missionId ? "Update Mission" : "Create Mission"}
        </Button>
        {props.missionId && (
          <Button
            className={styles.button}
            variant="contained"
            onClick={handleDeleteMission}
            color="error"
          >
            Delete Mission
          </Button>
        )}
      </div>
    </div>
  );
}
