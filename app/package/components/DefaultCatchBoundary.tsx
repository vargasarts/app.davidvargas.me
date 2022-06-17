import React from "react";
import DefaultErrorBoundary from "./DefaultErrorBoundary";
import { CatchBoundaryComponent } from "@remix-run/server-runtime/routeModules";
import { useCatch } from "@remix-run/react";

const DefaultCatchBoundary: CatchBoundaryComponent = (): React.ReactElement => {
  const caught = useCatch();
  return (
    <DefaultErrorBoundary
      error={
        new Error(
          typeof caught?.data === "object"
            ? JSON.stringify(caught.data)
            : caught?.data || `No Caught Data: ${caught}`
        )
      }
    />
  );
};

export default DefaultCatchBoundary;
