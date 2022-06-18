import DefaultCatchBoundary from "~/package/components/DefaultCatchBoundary";
import DefaultErrorBoundary from "~/package/components/DefaultErrorBoundary";
import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import remixAppLoader from "~/package/backend/remixAppLoader.server";
import getRevenue from "~/data/getRevenue.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import remixAppAction from "~/package/backend/remixAppAction.server";
import deleteRevenueRecord from "~/data/deleteRevenueRecord.server";
import Button from "~/package/components/Button";

const RevenueRecord = () => {
  const data = useLoaderData<Awaited<ReturnType<typeof getRevenue>>>();
  return (
    <div>
      <h1 className="font-bold text-xl mb-2">{data.product}</h1>
      <p className="text-md italic font-normal mb-4">{data.date}</p>
      <h2 className="font-semibold text-lg">
        {data.source} - {data.source_id}
      </h2>
      <Form method="delete">
        <Button>Delete</Button>
      </Form>
      <Link to={"/user/revenue"}>
        <span className="absolute right-4 top-4 px-4 py-2 bg-orange-400 rounded-md cursor-pointer">
          {"<- Back"}
        </span>
      </Link>
    </div>
  );
};

export const loader: LoaderFunction = (args) => {
  return remixAppLoader(args, ({ params }) => getRevenue(params["uuid"] || ""));
};

export const action: ActionFunction = (args) => {
  return remixAppAction(args, {
    DELETE: ({ params, searchParams }) =>
      deleteRevenueRecord(params["uuid"] || "").then(() => {
        return redirect(
          `/user/revenue${
            Object.keys(searchParams).length
              ? ""
              : `?${new URLSearchParams(searchParams).toString()}`
          }`
        );
      }),
  });
};

export const ErrorBoundary = DefaultErrorBoundary;
export const CatchBoundary = DefaultCatchBoundary;

export default RevenueRecord;
