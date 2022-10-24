import getMysqlConnection from "fuegojs/utils/mysql";

const searchSources = ({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) =>
  getMysqlConnection()
    .then((con) => {
      const keys = Object.keys(searchParams).filter(
        (p) => searchParams[p] && !["size", "index"].includes(p)
      );
      const size = searchParams["size"] || "10";
      const index = searchParams["index"] || "1";
      return Promise.all([
        con.execute(
          `SELECT label, uuid, snapshot_url, feed_url
          FROM rules 
          ${!keys.length ? "" : "WHERE "}${keys
            .map((k) => `${k} = ?`)
            .join(" AND ")}
          ORDER BY label LIMIT ?, ?`,
          keys
            .map((k) => searchParams[k])
            .concat(
              [
                Math.max((Number(index) || 1) - 1, 0) *
                  Math.max(Number(size), 0),
                size,
              ].map((n) => n.toString())
            )
        ),
        con.execute(`SELECT COUNT(uuid) as count FROM sources`),
      ]).then((a) => {
        con.destroy();
        return a;
      });
    })
    .then(([[a], [l]]) => {
      const values = a as {
        label: string;
        uuid: string;
        snapshot_url: string;
        feed_url: string;
      }[];
      const [{ count }] = l as { count: number }[];
      return {
        data: values,
        columns: [{ Header: "Label", accessor: "label" }],
        count,
      };
    });

export default searchSources;