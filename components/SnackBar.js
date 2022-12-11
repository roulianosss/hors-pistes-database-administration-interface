import React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(props) {

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        open={props.snackBarSettings.open}
        autoHideDuration={6000}
        onClose={props.closeModal}
      >
        <Alert
          onClose={props.closeModal}
          severity={props.snackBarSettings.severity}
          sx={{ width: "100%" }}
        >
          {props.snackBarSettings.message}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
