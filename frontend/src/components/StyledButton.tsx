import { Button, ButtonProps } from "@mui/material";

const StyledButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      disableRipple
      {...props}
      variant="contained"
      sx={{
        outline: "1px solid white",
        textTransform: "none",
        backgroundColor: "gold",
        color: "black",
        fontSize: "20px",
        padding: "5px 10px",
        "&:hover": {
          backgroundColor: "gold",
          color: "black",
        },
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
};

export default StyledButton;
