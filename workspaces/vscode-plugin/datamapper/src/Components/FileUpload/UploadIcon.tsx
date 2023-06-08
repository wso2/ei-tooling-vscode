import { Button } from "@mui/material";
import React from "react";
import UploadModal from "./UploadModal";
import { uploadStyles } from "./styles";
import { AddCircleRounded } from "@mui/icons-material";

const UploadIcon = () => {
  const classes = uploadStyles();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");

  const handleClose = (value: boolean) => {
    setOpen(value);
  };

  const NodeTitle = ["Input", "Output"];

  return (
    <>
      <div className={classes.header}>
        {NodeTitle.map((node, index) => {
          return (
            <Button
              key={index}
              sx={{ color: "#c0c0c0", fontFamily: "monospace" }}
              onClick={() => {
                setTitle(node);
                setOpen(true);
              }}
              startIcon={<AddCircleRounded fontSize="small" />}
            >
              Load {node}
            </Button>
          );
        })}
      </div>
      <UploadModal title={title} modalOpen={open} modalClose={handleClose} />
    </>
  );
};

export default UploadIcon;

