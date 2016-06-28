
var AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';

AWS.config.update({
    accessKeyId: "AKIAI2GZXTJHEM3VFKVA",
    secretAccessKey: "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",
    "region": "us-west-2" 
});

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

/* Crear tabla */
myCreateTable();

/* Obtener descripción de una tabla */
//myDescribeTable();

/* Obtener lista de nombres de todas las tablas */
//myListTables();

/* Escribir un item a la tabla */
//myPut();

/* Escribir múltiples items en un solo paso */
//myBatchWrite();

function myCreateTable(){
	var params = {
	    TableName : "Music",
	    KeySchema: [       
	        { AttributeName: "Artist", KeyType: "HASH" },  //Partition key
	        { AttributeName: "SongTitle", KeyType: "RANGE" }  //Sort key
	    ],
	    AttributeDefinitions: [       
	        { AttributeName: "Artist", AttributeType: "S" },
	        { AttributeName: "SongTitle", AttributeType: "S" }
	    ],
	    ProvisionedThroughput: {       
	        ReadCapacityUnits: 1, 
	        WriteCapacityUnits: 1
	    }
	};

	dynamodb.createTable(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myDescribeTable(){
	var params = {
    	TableName: "Music"
	};

	dynamodb.describeTable(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myListTables(){
	var params = {};

	dynamodb.listTables(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myPut(){
/* En DynamoDB no es necesario haber declarado atributos inicialmente */
/* En DynamoDB es posible anidar atributos */ 
	var params = {
	    TableName: "Music",
	    Item: {
	        "Artist":"No One You Know",
	        "SongTitle":"Call Me Today",
	        "AlbumTitle":"Somewhat Famous",
	        "Year": 2015,
	        "Price": 2.14,
	        "Genre": "Country",
	        "Tags": {
	            "Composers": [
	                  "Smith",
	                  "Jones",
	                  "Davis"
	            ],
	            "LengthInSeconds": 214
	        }
	    },
	    "ConditionExpression": "attribute_not_exists(Artist) and attribute_not_exists(SongTitle)"
	};
/*	
	Con "ConditionExpression" se previene sobreescribir un item ya existente con la misma llave primaria,
	ya que normalmente al escribir un item con una llave primaria ya existente se sobreescribe.
*/

	docClient.put(params, function(err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});
}

function myBatchWrite(){
	var params = {
	    RequestItems: {
	        "Music": [ 
	            {  
	                PutRequest: {
	                    Item: {
	                        "Artist": "No One You Know",
	                        "SongTitle": "My Dog Spot",
	                        "AlbumTitle":"Hey Now",
	                        "Price": 1.98,
	                        "Genre": "Country",
	                        "CriticRating": 8.4
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "No One You Know",
	                        "SongTitle": "Somewhere Down The Road",
	                        "AlbumTitle":"Somewhat Famous",
	                        "Genre": "Country",
	                        "CriticRating": 8.4,
	                        "Year": 1984
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "The Acme Band",
	                        "SongTitle": "Still In Love",
	                        "AlbumTitle":"The Buck Starts Here",
	                        "Price": 2.47,
	                        "Genre": "Rock",
	                        "PromotionInfo": {
	                            "RadioStationsPlaying":[
	                                "KHCR", "KBQX", "WTNR", "WJJH"
	                            ],
	                            "TourDates": {
	                                "Seattle": "20150625",
	                                "Cleveland": "20150630"
	                            },
	                            "Rotation": "Heavy"
	                        }
	                    }
	                }
	            }, 
	            { 
	                PutRequest: {
	                    Item: {
	                        "Artist": "The Acme Band",
	                        "SongTitle": "Look Out, World",
	                        "AlbumTitle":"The Buck Starts Here",
	                        "Price": 0.99,
	                        "Genre": "Rock"
	                    }
	                }
	            }
	        ]
	    }
	};

	docClient.batchWrite(params, function (err, data) {
	    if (err)
	        console.log(JSON.stringify(err, null, 2));
	    else
	        console.log(JSON.stringify(data, null, 2));
	});

	/* ""UnprocessedItems": {}" indica que todos los items fueron escritos */ 
}