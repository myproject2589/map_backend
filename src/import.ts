import {utils, writeFile} from "xlsx";
import {connect} from "mssql";
import {dbConfig} from "./db";

const fuelLevelMapping = {
    2: '1/4',
    3: '1/2',
    4: '3/4',
    5: '7/8'
}

const query = `SELECT 'MAINGATE'                   AS 'gate'
                    , 'Arrival'                    AS 'gateLane'
                    , t.number                     AS 'equipmentNo'
                    , s.code                       AS 'scac'
                    , (SELECT NAME
                       FROM [dbo].[enumeratorvaluemap]
                       WHERE field = 'TrailerType'
                         AND value = t.type)       AS 'equipmentType'
                    , (SELECT NAME
                       FROM [dbo].[enumeratorvaluemap]
                       WHERE field = 'TrailerStatusType'
                         AND value = t.statustype) AS 'equipmentStatus'
                    , (SELECT NAME
                       FROM [dbo].[enumeratorvaluemap]
                       WHERE field = 'TrailerIntent'
                         AND value = t.intent)     AS 'loadType'
                    , t.shipmentnumber
                    , 'Missing-Need to check'      AS 'shipmentType'
                    , (SELECT NAME
                       FROM [dbo].[enumeratorvaluemap]
                       WHERE field = 'Freight'
                         AND value = t.freightid)  AS 'freight'
                    , '2023-02-24T01:52:03Z'       AS 'arrivalTime'
                    , '26.0'                       AS 'actTemperature'
                    , t.settemperature
                    , t.reeferfuellevel            AS 'fuelLevel'
                    , t.sealnumber                 AS 'sealNo'
                    , t.rfidtagid                  AS 'RFID'
                    , l.NAME                       AS 'location'
               FROM [dbo].[trailers] t
                        INNER JOIN scacs s
                                   ON t.scacid = s.id
                        INNER JOIN locations l ON t.locationid = l.id`;


(async () => {
    const db = await connect(dbConfig)

    const result = await db.request().query(query);

    const start = 1;

    const worksheet = utils.aoa_to_sheet(result.recordset.map((record, index) => [
        JSON.stringify({
            "Header": {
                "sender": "4SIGHT",
                "receiver": "ROC",
                "organization": "Smithfield",
                "site": "Tarheel",
                "transTime": new Date().toISOString(),
                "transactionID": index + start
            },
            "TrailerArrival": Object.entries(record).reduce((obj, [key, value]: [string, any]) => {
                if (value !== null) {
                    if (key === 'fuelLevel')
                        obj[key] = fuelLevelMapping[value] ?? "";
                    else
                        obj[key] = (value || value === 0) ? value instanceof Date ? value.toISOString() : String(value) : value;
                }
                return obj;
            }, {})
        })
    ]));

    const workbook = utils.book_new();

    utils.book_append_sheet(workbook, worksheet, "sheet1");

    writeFile(workbook, __dirname + "/export.xlsx");
})()
