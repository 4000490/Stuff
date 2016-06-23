var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

AWS.config.update({
    accessKeyId: "AKIAI2GZXTJHEM3VFKVA",
    secretAccessKey: "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",
    "region": "us-west-2" 
});

var db = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

db.listTables(function(err, data) {
  console.log(data.TableNames);
});

// var params = {
//     TableName : "Music",
//     KeySchema: [       
//         { AttributeName: "Artist", KeyType: "HASH" },  //Partition key
//         { AttributeName: "SongTitle", KeyType: "RANGE" }  //Sort key
//     ],
//     AttributeDefinitions: [       
//         { AttributeName: "Artist", AttributeType: "S" },
//         { AttributeName: "SongTitle", AttributeType: "S" }
//     ],
//     ProvisionedThroughput: {       
//         ReadCapacityUnits: 1, 
//         WriteCapacityUnits: 1
//     }
// };

// db.createTable(params, function(err, data) {
//     if (err)
//         console.log(JSON.stringify(err, null, 2));
//     else
//         console.log(JSON.stringify(data, null, 2));
// });

// var params = {
//     TableName: "Music",
//     Item: {
//         "Artist":"Pink Floyd",
//         "SongTitle":"Time",
//         "AlbumTitle":"Dark side of the moon",
//         "Year": 1973,
//         "Price": 9.99,
//         "Genre": "Rock",
//         "Tags": {
//             "Composers": [
//                   "Floyd",
//                   "Pink"
//             ],
//             "LengthInSeconds": 97
//         }
//     }
// };

// docClient.put(params, function(err, data) {
//     if (err)
//         console.log(JSON.stringify(err, null, 2));
//     else
//         console.log(JSON.stringify(data, null, 2));
// });

var params = { 
    TableName: "Music"//,
    ///Key: {
    //    "Artist": "Pink Floyd",//"No One You Know",
    //    "SongTitle": "Time"//"Call Me Today"
    //}
};

docClient.scan(params, function(err, data) {
    if (err)
        console.log(JSON.stringify(err, null, 2));
    else
        console.log(JSON.stringify(data, null, 2));
});