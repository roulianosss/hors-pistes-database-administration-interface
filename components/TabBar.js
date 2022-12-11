import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CreateUpdateMissions from "../components/CreateUpdateMissions";
import CreateUpdateVolunteers from "../components/CreateUpdateVolunteers";
import CreateUpdateStructures from "../components/CreateUpdateStructures";
import ListMission from "../components/ListMissions.js";
import ListVolunteers from "../components/ListVolunteers.js";
import ListStructures from "../components/ListStructures.js";
import SnackBar from "../components/SnackBar";

import { useRouter } from "next/router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`
  };
}

export default function TabBar(props) {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [updateId, setUpdateId] = useState("");
  const [snackBarSettings, setSnackBarSettings] = useState({
    severity: "info",
    message: "",
    open: false
  });

  useEffect(()=> {
    setValue(1)
  },[])




  const handleSnackBar = (severity, message) => {
    setSnackBarSettings({ severity, message, open: true });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const changeValue = (page, id) => {
    setUpdateId(id);
    setValue(page);
  };

  const propsPageWithNoS = props.page.substring(0, props.page.length - 1);

  return (
    <>
      <SnackBar
        closeModal={() =>
          setSnackBarSettings({ ...snackBarSettings, open: false })
        }
        snackBarSettings={snackBarSettings}
      />
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{ borderBottom: 1, borderColor: "divider", userSelect: "none" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={`HOME ${propsPageWithNoS}`} {...a11yProps(0)} />
            <Tab label={`${props.page} List`} {...a11yProps(1)} />
            <Tab label={`Update ${propsPageWithNoS}`} {...a11yProps(2)} />
            <Tab label={`Create ${propsPageWithNoS}`} {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          Welcome to the {props.page} tab. <br />
          Here you can modify or add {props.page}. <br />
          For update a {propsPageWithNoS} click it in {props.page} list.
        </TabPanel>
        {router.pathname === "/missions" && (
          <>
            <TabPanel value={value} index={1}>
              <ListMission
                changeTabWithId={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CreateUpdateMissions
                missionId={updateId}
                changeTabUpdate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CreateUpdateMissions
                changeTabCreate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
          </>
        )}
        {router.pathname === "/volunteers" && (
          <>
            <TabPanel value={value} index={1}>
              <ListVolunteers
                changeTabWithId={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CreateUpdateVolunteers
                userId={updateId}
                changeTabUpdate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CreateUpdateVolunteers
                changeTabCreate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
          </>
        )}
        {router.pathname === "/structures" && (
          <>
            <TabPanel value={value} index={1}>
              <ListStructures
                changeTabWithId={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <CreateUpdateStructures
                structureId={updateId}
                changeTabUpdate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <CreateUpdateStructures
                changeTabCreate={changeValue}
                handleSnackBar={handleSnackBar}
              />
            </TabPanel>
          </>
        )}
      </Box>
    </>
  );
}
