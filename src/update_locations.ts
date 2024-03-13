import {connect} from "mssql";
import {dbConfig} from "./db";
import moment from "moment";

let updateLocations = async () => {
    const db = await connect(dbConfig);

    const SiteID = 152;

    const date = moment().subtract(10, "days");

    const {recordset: scanData} = await db.query`SELECT *
                                                 FROM [dbo].[rfidscandatas]
                                                 WHERE SiteID = ${SiteID}
                                                   AND Count = 1000
                                                   AND Latitude != 0
                                                   AND Longitude != 0
                                                   AND ScanTime
                                                     > ${date.toISOString()}
                                                   AND IsProcessed = false
    `;

    await Promise.all(scanData.map(async data => {
        const {recordset: [location]} = await db.query`
            DECLARE
                @GEO1 GEOGRAPHY,
                @LAT VARCHAR(10),
                @LONG VARCHAR(10)

            SET @LAT = ${data.Latitude}
            SET @LONG = ${data.Longitude}

            SET @geo1 = geography::Point(@LAT, @LONG, 4326)

            SELECT TOP 1 ID, Name, (@geo1.STDistance(geography::Point(ISNULL(Latitude1, 0), ISNULL(Longitude1, 0), 4326))) as Distance
            FROM [dbo].[Locations]
            WHERE SiteId = ${SiteID}
              AND Deleted = 0
              AND Type != 2
            ORDER BY Distance`

        if (data.Tag) {
            const {recordset: [tag]} = await db.query`SELECT TOP 1 *
                                                      FROM [dbo].[RFIDTags]
                                                      WHERE TagNumber = ${data.Tag}`;

            const {recordset: trailers} = await db.query`SELECT TOP 1 *
                                                         FROM [dbo].[Trailers]
                                                         WHERE RFIDTagID = ${tag.ID}`;
            console.log(trailers);

            await db.query`UPDATE [dbo].[Trailers]
                           SET LocationID = ${location.ID}
                           WHERE RFIDTagID = ${tag.ID}`;

        }

        await db.query`UPDATE [dbo].[rfidscandatas]
                       SET IsProcessed = true
                       WHERE ID = ${data.ID}`;

    }));


    process.exit();
};


setInterval(updateLocations, 5000)
