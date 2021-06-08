import React from "react";
import TooltipCustom from "../shared/TooltipCustom";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";

function Status() {
  return (
    <div>
      <TooltipCustom
        name="Status"
        icon={<DonutLargeIcon style={{ color: "#de5751" }} />}
      />
    </div>
  );
}

export default Status;
